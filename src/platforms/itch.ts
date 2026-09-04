import type { Awaitable, LibraryModule, ModuleContext, ShowToast, UpdateResult } from '../shared/types';

interface ItchPurchasesResponse {
  content?: string;
  num_items?: number;
}

interface ItchModule extends LibraryModule {
  /** 生成用于将 itch.io 游戏库与另一安装实例关联的代码。 */
  generateLinkageCode: () => Promise<string>;
}

interface ItchLinkageOptions {
  /** 读取缓存的 itch.io 游戏标识符。 */
  getGames: () => string[];
  /** 将游戏标识符添加到缓存的 itch.io 游戏库。 */
  addGames: (games: string[]) => string[];
  /** 使用指定的分页状态更新 itch.io 游戏库。 */
  updateLibrary: (loop: boolean, page: number) => Awaitable<UpdateResult>;
  /** 向用户显示关联流程反馈。 */
  showToast: ShowToast;
}

const { createItchLinkage } = require('../core/itch-linkage.ts') as {
  /** 根据平台依赖创建 itch.io 关联服务。 */
  createItchLinkage: (options: ItchLinkageOptions) => {
    /** 生成用于关联 itch.io 游戏库的代码。 */
    generateLinkageCode: () => Promise<string>;
  };
};

/**
 * 创建 itch.io 游戏库模块，包括所有权标记、缓存更新和关联代码支持。
 *
 * @param context - 共享运行时服务、设置、UI 反馈和更新状态常量。
 * @returns 包含标准游戏库操作和关联代码生成的 itch.io 模块。
 */
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
  /**
   * 从用户脚本存储中读取缓存的 itch.io 游戏标识符。
   *
   * @returns 缓存的游戏标识符；不存在缓存时返回空数组。
   */
  function getItchGameLibrary(): string[] {
    return GM_getValue<string[]>('itchGames') || [];
  }
  /**
   * 将提供的 itch.io 游戏标识符合并到持久化游戏库缓存中。
   *
   * @param games - 要添加的标识符，通常通过关联导入获得。
   * @returns 合并后的去重缓存；输入无效时返回现有缓存。
   */
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

      /**
       * 标记出现在缓存所有权游戏库中的未处理 itch.io 商店链接。
       *
       * 首次扫描会启动受速率限制的后台刷新，并在需要时显示登录过期提示。
       *
       * @param first - 是否为可能触发更新的首次扫描。
       * @param again - 由变更触发的扫描是否只跳过已扫描的链接。
       */
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
          /** 在不显示交互式状态 UI 的情况下刷新 itch.io 所有权缓存。 */
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
      /**
       * 获取分页的 itch.io 购买记录并更新持久化所有权缓存。
       *
       * 交互式运行会显示进度和完成状态；登录重定向会返回认证过期哨兵值，
       * 以便调用方呈现。
       *
       * @param loop - 是否获取所有页面并显示交互式进度。
       * @param i - 当前从 1 开始的页码。
       * @param games - 从先前页面收集的标识符。
       * @returns 更新成功、失败或认证过期结果。
       */
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
