import type { LibraryModule, ModuleContext, UpdateResult } from '../shared/types';

interface CubeGame {
  S_Id: number;
}

interface CubeLibraryResponse {
  resultCode?: number;
  result?: {
    list?: CubeGame[];
    total?: number;
  };
}

/**
 * Creates the CubeJoy library module that marks owned store links and updates the cached game IDs.
 *
 * @param context - Shared runtime services, settings, UI feedback, and update-status constants.
 * @returns A CubeJoy library module with startup and update actions.
 */
function createCubeModule(context: ModuleContext): LibraryModule {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    showUpdateStep,
    showUpdateResult,
    showLoginExpiredDialog,
    showToast,
    UPDATE_STATUS
  } = context;

  let updateLibrary: (() => Promise<UpdateResult> | void) | undefined;
  let started = false;
  const moduleApi = {
    key: 'cube',
    enabled: () => settings.platformEnabled.cube,
    isCacheEmpty: () => (GM_getValue<number[]>('cubeGames') || []).length === 0,
    updateLibrary: () => {
      if (!updateLibrary) moduleApi.start();
      return updateLibrary!();
    },
    start: () => {
      if (started) return;
      started = true;
      let loadTimes = 0;

      checkCubeGame();

      const observer = new MutationObserver(() => { checkCubeGame(false, true); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });

      /**
       * Marks unprocessed CubeJoy store links whose game IDs exist in the persistent library cache.
       *
       * On its first pass, this also starts a background cache refresh and reports expired authentication.
       *
       * @param first - Whether this is the initial scan that may trigger an update.
       * @param again - Whether a mutation-triggered scan should only skip already scanned links.
       */
      function checkCubeGame(first = true, again = false): void {
        loadTimes++;
        if (loadTimes > 1000) {
          observer.disconnect();
          return;
        }
        const cubeGames = getCubeGameLibrary();
        const excludedClass = again ? 'cube-game-checked' : 'cube-game-link-owned';
        const cubeLink = queryLinks('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]')
          .filter((el) => !el.classList.contains(excludedClass));
        if (cubeLink.length === 0) return;
        if (first) {
          Promise.resolve(updateCubeGameLibrary(false)).then((result) => {
            if (typeof result === 'object' && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
              showToast('方块 登录状态已过期，请先登录', 'error', { duration: 0, closable: true, link: { href: result.loginUrl, text: '去登录' } });
            }
          });
        }
        cubeLink.forEach((el) => {
          addClass(el, 'cube-game-checked');
          let href = getHref(el);
          if (!/\/$/.test(href)) href += '/';
          const cubeGameId = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)?.[1];
          if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
            addClass(el, 'cube-game-link-owned');
          }
        });
      }
      /**
       * Reads the cached CubeJoy game IDs from userscript storage.
       *
       * @returns Cached IDs, or an empty array when no cache exists.
       */
      function getCubeGameLibrary(): number[] {
        return GM_getValue<number[]>('cubeGames') || [];
      }
      /**
       * Fetches paginated CubeJoy purchases and updates the persistent game-ID cache.
       *
       * Interactive runs show progress and a result message; background runs merge new IDs and may return the
       * authentication-expired sentinel when the account endpoint rejects the session.
       *
       * @param loop - Whether to fetch every page and show interactive progress.
       * @param i - Current one-based page number.
       * @param games - IDs collected from earlier pages.
       * @returns Update success, failure, or an authentication-expired result.
       */
      function updateCubeGameLibrary(
        loop = true,
        i = 1,
        games: number[] = []
      ): Promise<UpdateResult> | void {
        if (!loop && i !== 1) {
          GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])]);
          checkCubeGame(false);
          return;
        }
        return new Promise<GMXmlHttpRequestResponse<CubeLibraryResponse>>((resolve, reject) => {
          if (loop) {
            showUpdateStep('cube', `第 ${i} 页`);
          }
          GM_xmlhttpRequest<CubeLibraryResponse>({
            method: 'POST',
            url: `https://account.cubejoy.com/Comment/MyGameReq?pageIndex=${i}&pageSize=24`,
            timeout: 15000,
            nocache: true,
            responseType: 'json',
            headers: {
              Accept: 'application/json, text/plain, */*',
              Host: 'account.cubejoy.com',
              Origin: 'https://account.cubejoy.com',
              Referer: 'https://account.cubejoy.com/Comment/MyGame'
            },
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => {
          if (response.response?.resultCode === 0) {
            return {
              status: UPDATE_STATUS.AUTH_EXPIRED,
              platformName: '方块',
              loginUrl: 'https://account.cubejoy.com/html/login.html'
            };
          } else if (response.response?.result?.list?.length) {
            games = [...games, ...response.response.result.list.map((e) => e.S_Id)];

            if ((response.response?.result.total || 0) > i * 24) {
              return await updateCubeGameLibrary(loop, ++i, games);
            } else if (loop) {
              GM_setValue('cubeGames', [...new Set(games)].filter((e) => e));
              await showUpdateResult('cube游戏库数据更新完成', 'success');
              return true;
            }
            GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])].filter((e) => e));
            checkCubeGame(false);
            return true;
          } else if (response.response?.result?.list?.length !== 0) {
            console.error(response);
            await showUpdateResult('方块游戏库数据更新失败', 'error');
            return false;
          }
          return false;
        })
          .catch(async (error) => {
            console.error(error);
            await showUpdateResult('方块游戏库数据更新失败', 'error');
            return false;
          });
      }

      updateLibrary = updateCubeGameLibrary;

      GM_addStyle('.cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
    }
  };
  return moduleApi;
}

module.exports = {
  createCubeModule
};
