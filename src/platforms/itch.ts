import type { Awaitable, LibraryModule, ModuleContext, ShowToast, UpdateResult } from '../shared/types';

interface ItchPurchasesResponse {
  content?: string;
  num_items?: number;
}

interface ItchModule extends LibraryModule {
  generateLinkageCode: () => Promise<string>;
}

interface ItchLinkageOptions {
  getGames: () => string[];
  addGames: (games: string[]) => string[];
  updateLibrary: (loop: boolean, page: number) => Awaitable<UpdateResult>;
  showToast: ShowToast;
}

const { createItchLinkage } = require('../core/itch-linkage.ts') as {
  createItchLinkage: (options: ItchLinkageOptions) => {
    generateLinkageCode: () => Promise<string>;
  };
};

function createItchModule(context: ModuleContext): ItchModule {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    parseHtml,
    showUpdateStep,
    showUpdateResult,
    // showLoginExpiredDialog,
    showToast,
    runAutoUpdateWithRateLimit,
    UPDATE_STATUS
  } = context;

  let updateLibrary: ((loop?: boolean, page?: number, games?: string[]) => Promise<UpdateResult> | void) | undefined;
  let started = false;
  function getItchGameLibrary(): string[] {
    return GM_getValue<string[]>('itchGames') || [];
  }
  function addItchGames(games: string[]): string[] {
    if (!Array.isArray(games)) return getItchGameLibrary();
    const library = [...new Set([...getItchGameLibrary(), ...games])];
    GM_setValue('itchGames', library);
    return library;
  }
  const moduleApi: LibraryModule & Partial<Pick<ItchModule, 'generateLinkageCode'>> = {
    key: 'itch',
    enabled: () => settings.platformEnabled.itch,
    isCacheEmpty: () => getItchGameLibrary().length === 0,
    updateLibrary: () => {
      if (!updateLibrary) moduleApi.start();
      return updateLibrary!();
    },
    start: () => {
      if (started) return;
      started = true;
      let loadTimes = 0;

      checkItchGame();

      const observer = new MutationObserver(() => { checkItchGame(false, true); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });

      function checkItchGame(first = true, again = false): void {
        loadTimes++;
        if (loadTimes > 1000) {
          observer.disconnect();
          return;
        }
        const itchGames = getItchGameLibrary();
        const excludedClass = again ? 'itch-io-game-checked' : 'itch-io-game-link-owned';
        const itchLink = queryLinks('a[href*=".itch.io/"]')
          .filter((el) => !el.classList.contains(excludedClass));
        if (itchLink.length === 0) return;
        if (first) {
          const autoUpdate = () => updateItchGameLibrary(false);
          let runner = autoUpdate;
          if (typeof runAutoUpdateWithRateLimit === 'function') {
            runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
          }
          Promise.resolve(runner()).then((result) => {
            if (typeof result === 'object' && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
              showToast('itch.io 登录状态已过期，请先登录', 'error', { duration: 0, closable: true, link: { href: result.loginUrl, text: '去登录' } });
            }
          });
        }
        itchLink.forEach((el) => {
          addClass(el, 'itch-io-game-checked');
          let href = getHref(el);
          if (!/\/$/.test(href)) href += '/';
          const itchGameLink = href.match(/https?:\/\/(.*?\/.*?)\//i)?.[1];
          if (itchGameLink && itchGames.includes(itchGameLink)) {
            addClass(el, 'itch-io-game-link-owned');
          }
        });
      }
      function updateItchGameLibrary(
        loop = true,
        i = 1,
        games: string[] = []
      ): Promise<UpdateResult> | void {
        if (!loop && i !== 1) {
          GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])]);
          checkItchGame(false);
          return;
        }
        return new Promise<GMXmlHttpRequestResponse<ItchPurchasesResponse>>((resolve, reject) => {
          if (loop) {
            showUpdateStep('itch', `第 ${i} 页`);
          }
          GM_xmlhttpRequest<ItchPurchasesResponse>({
            method: 'GET',
            url: `https://itch.io/my-purchases?page=${i}&format=json`,
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
          if (/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
            return {
              status: UPDATE_STATUS.AUTH_EXPIRED,
              platformName: 'itch.io',
              loginUrl: 'https://itch.io/login'
            };
          } else if (response.response?.num_items) {
            const itchDoc = parseHtml(`<div>${response.response.content || ''}</div>`);
            const purchaseLinks = Array.from(itchDoc.querySelectorAll('a.thumb_link.game_link'));
            const pageGames = purchaseLinks.map((el) => getHref(el)
              .match(/https?:\/\/(.*?\/.*?)\//i)?.[1])
              .filter((game): game is string => Boolean(game));
            games = [...games, ...pageGames];

            if (response.response.num_items === 50) {
              return await updateItchGameLibrary(loop, ++i, games);
            } else if (loop) {
              GM_setValue('itchGames', [...new Set(games)]);
              await showUpdateResult('itch游戏库数据更新完成', 'success');
              return true;
            }
            GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])]);
            checkItchGame(false);
            return true;
          } else if (response.response?.num_items === 0) {
            GM_setValue('itchGames', [...new Set(games)]);
            await showUpdateResult('itch游戏库数据更新完成', 'success');
            return true;
          }
          console.error(response);
          await showUpdateResult('itch游戏库数据更新失败', 'error');
          return false;
        })
          .catch(async (error) => {
            console.error(error);
            await showUpdateResult('itch游戏库数据更新失败', 'error');
            return false;
          });
      }

      updateLibrary = updateItchGameLibrary;

      GM_addStyle('.itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
      unsafeWindow.checkItchGame = checkItchGame;
    }
  };
  const itchLinkage = createItchLinkage({
    getGames: getItchGameLibrary,
    addGames: addItchGames,
    updateLibrary: (loop = false, i = 1) => {
      if (!started) moduleApi.start();
      return updateLibrary!(loop, i);
    },
    showToast
  });
  moduleApi.generateLinkageCode = itchLinkage.generateLinkageCode;
  return moduleApi as ItchModule;
}

module.exports = {
  createItchModule
};
