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
 * 创建 CubeJoy 游戏库模块，用于标记已拥有的商店链接并更新缓存的游戏 ID。
 *
 * @param context - 共享运行时服务、设置、UI 反馈和更新状态常量。
 * @returns 包含启动和更新操作的 CubeJoy 游戏库模块。
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
       * 标记游戏 ID 存在于持久化游戏库缓存中的未处理 CubeJoy 商店链接。
       *
       * 首次扫描时还会启动后台缓存刷新并报告认证过期。
       *
       * @param first - 是否为可能触发更新的首次扫描。
       * @param again - 由变更触发的扫描是否只跳过已扫描的链接。
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
       * 从用户脚本存储中读取缓存的 CubeJoy 游戏 ID。
       *
       * @returns 缓存的 ID；不存在缓存时返回空数组。
       */
      function getCubeGameLibrary(): number[] {
        return GM_getValue<number[]>('cubeGames') || [];
      }
      /**
       * 获取分页的 CubeJoy 购买记录并更新持久化游戏 ID 缓存。
       *
       * 交互式运行会显示进度和结果消息；后台运行会合并新 ID，账户端点拒绝会话时可能返回
       * 认证过期哨兵值。
       *
       * @param loop - 是否获取每一页并显示交互式进度。
       * @param i - 当前从 1 开始的页码。
       * @param games - 从先前页面收集的 ID。
       * @returns 更新成功、失败或认证过期结果。
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
