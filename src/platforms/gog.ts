import type { LibraryModule, ModuleContext, UpdateResult } from '../shared/types';

interface GogProduct {
  slug?: string;
  url?: string;
}

interface GogLibraryResponse {
  products?: GogProduct[];
  totalPages?: number;
}

/**
 * Creates the GOG library module that marks owned store links and maintains the cached library.
 *
 * @param context - Shared runtime services, settings, UI feedback, and update-status constants.
 * @returns A GOG library module with startup and update actions.
 */
function createGogModule(context: ModuleContext): LibraryModule {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    showUpdateStep,
    showUpdateResult,
    // showLoginExpiredDialog,
    showToast,
    runAutoUpdateWithRateLimit,
    UPDATE_STATUS
  } = context;

  let updateLibrary: (() => Promise<UpdateResult> | void) | undefined;
  let started = false;
  const moduleApi = {
    key: 'gog',
    enabled: () => settings.platformEnabled.gog,
    isCacheEmpty: () => (GM_getValue<string[]>('gogGames') || []).length === 0,
    updateLibrary: () => {
      if (!updateLibrary) moduleApi.start();
      return updateLibrary!();
    },
    start: () => {
      if (started) return;
      started = true;
      let loadTimes = 0;

      checkGogGame();

      const observer = new MutationObserver(() => { checkGogGame(false, true); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });

      /**
       * Marks unprocessed GOG links that are present in the cached game library.
       *
       * The initial scan starts a rate-limited background refresh and displays an authentication-expired notice
       * when applicable.
       *
       * @param first - Whether this is the initial scan that may trigger an update.
       * @param again - Whether a mutation-triggered scan should only skip already scanned links.
       */
      function checkGogGame(first = true, again = false): void {
        loadTimes++;
        if (loadTimes > 1000) {
          observer.disconnect();
          return;
        }
        const gogGames = getGogGameLibrary();
        const excludedClass = again ? 'gog-game-checked' : 'gog-game-link-owned';
        const gogLink = queryLinks('a[href*="www.gog.com/"]')
          .filter((el) => !el.classList.contains(excludedClass));
        if (gogLink.length === 0) return;
        if (first) {
          /** Refreshes the GOG ownership cache without interactive status UI. */
          const autoUpdate = () => updateGogGameLibrary(false);
          let runner = autoUpdate;
          if (typeof runAutoUpdateWithRateLimit === 'function') {
            runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
          }
          Promise.resolve(runner()).then((result) => {
            if (typeof result === 'object' && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
              showToast('GOG 登录状态已过期，请先登录', 'error', { duration: 0, closable: true, link: { href: result.loginUrl, text: '去登录' } });
            }
          });
        }
        gogLink.forEach((el) => {
          addClass(el, 'gog-game-checked');
          let href = getHref(el);
          if (!/\/$/.test(href)) href += '/';
          const gogGameLink = href.match(/https?:\/\/www\.gog\.com\/(?:[\w-]+\/)?game\/([^/?#]+)/i)?.[1]?.toLowerCase();
          if (gogGameLink && gogGames.some((game) => game.toLowerCase() === gogGameLink)) {
            addClass(el, 'gog-game-link-owned');
          }
        });
      }
      /**
       * Reads normalized GOG game slugs from userscript storage.
       *
       * @returns Cached game slugs, or an empty array when no cache exists.
       */
      function getGogGameLibrary(): string[] {
        return GM_getValue<string[]>('gogGames') || [];
      }
      /**
       * Fetches paginated GOG library data and writes the resulting slugs to persistent storage.
       *
       * Interactive runs report progress and completion; a redirected login response returns the
       * authentication-expired sentinel for the caller to handle.
       *
       * @param loop - Whether to fetch all pages with interactive progress.
       * @param i - Current one-based page number.
       * @param games - Slugs collected from earlier pages.
       * @returns Update success, failure, or an authentication-expired result.
       */
      function updateGogGameLibrary(
        loop = true,
        i = 1,
        games: string[] = []
      ): Promise<UpdateResult> | void {
        if (!loop && i !== 1) {
          GM_setValue('gogGames', [...new Set([...getGogGameLibrary(), ...games])]);
          checkGogGame(false);
          return;
        }
        return new Promise<GMXmlHttpRequestResponse<GogLibraryResponse>>((resolve, reject) => {
          if (loop) {
            showUpdateStep('gog', `第 ${i} 页`);
          }
          GM_xmlhttpRequest<GogLibraryResponse>({
            method: 'GET',
            url: `https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=${i}&sortBy=date_purchased`,
            timeout: 15000,
            nocache: true,
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => {
          if (/openlogin/i.test(response.finalUrl)) {
            return {
              status: UPDATE_STATUS.AUTH_EXPIRED,
              platformName: 'GOG',
              loginUrl: 'https://www.gog.com/#openlogin'
            };
          } else if (response.response?.products?.length) {
            const pageGames = response.response.products
              .map((product) => {
                const urlParts = product.url?.split('/');
                return product.slug || urlParts?.[urlParts.length - 1];
              })
              .filter((game): game is string => Boolean(game));
            games = [...games, ...pageGames];

            if ((response.response.totalPages || 0) > i) {
              return await updateGogGameLibrary(loop, ++i, games);
            } else if (loop) {
              GM_setValue('gogGames', [...new Set(games)].filter((e) => e));
              await showUpdateResult('gog游戏库数据更新完成', 'success');
              return true;
            }
            GM_setValue('gogGames', [...new Set([...getGogGameLibrary(), ...games])].filter((e) => e));
            checkGogGame(false);
            return true;
          } else if (response.response?.products?.length !== 0) {
            console.error(response);
            await showUpdateResult('gog游戏库数据更新失败', 'error');
            return false;
          }
          return false;
        })
          .catch(async (error) => {
            console.error(error);
            await showUpdateResult('gog游戏库数据更新失败', 'error');
            return false;
          });
      }

      updateLibrary = updateGogGameLibrary;

      GM_addStyle('.gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
    }
  };
  return moduleApi;
}

module.exports = {
  createGogModule
};
