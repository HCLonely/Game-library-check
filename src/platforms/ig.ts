const { setSyncValue } = require('../core/sync-data.ts') as typeof import('../core/sync-data');
import type { LibraryModule, ModuleContext, UpdateResult } from '../shared/types';

interface IgOwnedCache {
  time?: number;
  games?: string[];
}

interface IgParsedShowcase {
  pages: number;
  games: string[];
}

/**
 * 创建 IndieGala 游戏库模块，用于标记已拥有的链接并同步展示页缓存。
 *
 * @param context - 共享运行时服务、设置、用户界面反馈和更新状态常量。
 * @returns 包含启动和更新操作的 IndieGala 游戏库模块。
 */
function createIgModule(context: ModuleContext): LibraryModule {
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

  let started = false;

  /**
   * 从持久化缓存中读取并规范化已拥有的 IndieGala 路径。
   *
   * @returns 小写的游戏路径键；不存在缓存时返回空数组。
   */
  function getIgOwnedGames(): string[] {
    return (GM_getValue<IgOwnedCache>('IG-Owned')?.games || [])
      .filter(Boolean)
      .map((item) => item.toLowerCase());
  }

  /**
   * 标记路径或主机键存在于已拥有游戏缓存中的未处理 IndieGala 链接。
   */
  function markIgLinks(): void {
    if (!settings.platformEnabled.ig) return;
    const owned = getIgOwnedGames();
    const links = queryLinks('a[href*=".indiegala.com"]:not(.ig-checked)');
    links.forEach((el) => {
      addClass(el, 'ig-checked');
      const href = getHref(el);
      if (!href) return;
      try {
        const parsed = new URL(href, window.location.href);
        const pathnameKey = parsed.pathname.replace(/\//g, '').toLowerCase();
        const hostnameKey = parsed.hostname.split('.')[0].toLowerCase();
        if (owned.includes(pathnameKey) || owned.includes(hostnameKey)) addClass(el, 'ig-owned');
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * 读取 IndieGala cookie 并将其序列化，以供已认证的展示页请求使用。
   *
   * @returns 以分号分隔的 Cookie 请求头值。
   */
  function getIgCookies(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      GM_cookie.list({ url: 'https://www.indiegala.com/library/showcase/1' }, (cookies, error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';'));
      });
    });
  }

  /**
   * 请求一个已认证的 IndieGala 游戏库展示页。
   *
   * @param page - 从 1 开始的展示页页码。
   * @param cookies - 序列化的认证 cookie。
   * @returns 成功的 HTTP 响应；请求失败时拒绝。
   */
  async function requestIgShowcasePage(
    page: number,
    cookies: string
  ): Promise<GMXmlHttpRequestResponse<string>> {
    return new Promise<GMXmlHttpRequestResponse<string>>((resolve, reject) => {
      GM_xmlhttpRequest<string>({
        url: `https://www.indiegala.com/library/showcase/${page}`,
        method: 'GET',
        timeout: 30000,
        headers: { cookie: cookies },
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    });
  }

  /**
   * 将展示页 HTML 解析为已拥有游戏路径；在第一页还会解析总页数。
   *
   * @param responseText - 展示页 HTML 响应正文。
   * @param page - 响应所表示的页面。
   * @returns 解析出的页数和规范化游戏路径。
   */
  function parseIgShowcase(responseText: string, page: number): IgParsedShowcase {
    const doc = parseHtml(responseText);
    let pages = 1;
    if (page === 1) {
      const pageLinks = Array.from(doc.querySelectorAll('a.profile-private-page-library-pagination-item[href*="library/showcase"]'));
      const lastPageHref = pageLinks.find((el) => el.querySelector('.fa-angle-double-right'))?.getAttribute('href') || '';
      const parsedPage = Number((lastPageHref.match(/\d+/) || [1])[0]);
      pages = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    }
    const games = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a.library-showcase-title'))
      .map((el) => el.getAttribute('href')?.match(/https?:\/\/.*?\.indiegala\.com\/(.*)/)?.[1]?.toLowerCase())
      .filter((game): game is string => Boolean(game));
    return { pages, games };
  }

  /**
   * 获取 IndieGala 展示页并持久化去重后的已拥有游戏缓存。
   *
   * 后台更新会将第一页合并到现有缓存；交互式更新会获取每一页并显示进度。登录重定向会返回
   * 认证过期哨兵值。
   *
   * @param loop - 是否执行完整的交互式同步。
   * @returns 更新成功、失败或认证过期结果。
   */
  async function updateIgGameLibrary(loop = true): Promise<UpdateResult> {
    try {
      const owned = getIgOwnedGames();
      if (loop) {
        showUpdateStep('ig', '第 1 页');
      }
      const cookies = await getIgCookies();
      const firstPageResponse = await requestIgShowcasePage(1, cookies);
      if (new URL(firstPageResponse.finalUrl).pathname === '/login') {
        return {
          status: UPDATE_STATUS.AUTH_EXPIRED,
          platformName: 'IG',
          loginUrl: 'https://www.indiegala.com/login'
        };
      }

      const firstParsed = parseIgShowcase(firstPageResponse.responseText, 1);
      let allGames = [...owned, ...firstParsed.games];

      if (!loop) {
        allGames = Array.from(new Set(allGames)).filter(Boolean);
        setSyncValue('IG-Owned', { time: Date.now(), games: allGames });
        markIgLinks();
        return true;
      }

      for (let page = 2; page <= firstParsed.pages; page += 1) {
        showUpdateStep('ig', `第 ${page} 页`);
        const response = await requestIgShowcasePage(page, cookies);
        const parsed = parseIgShowcase(response.responseText, page);
        allGames = allGames.concat(parsed.games);
      }

      allGames = Array.from(new Set(allGames)).filter(Boolean);
      setSyncValue('IG-Owned', { time: Date.now(), games: allGames });
      await showUpdateResult('IG游戏库数据更新完成', 'success');
      markIgLinks();
      return true;
    } catch (error) {
      console.error(error);
      if (loop) {
        await showUpdateResult('IG游戏库数据更新失败', 'error');
      }
      return false;
    }
  }

  const moduleApi = {
    key: 'ig',
    enabled: () => settings.platformEnabled.ig,
    isCacheEmpty: () => getIgOwnedGames().length === 0,
    updateLibrary: () => updateIgGameLibrary(),
    start: () => {
      if (started) return;
      started = true;
      markIgLinks();
      window.addEventListener?.('glc-library-synced', () => { if (settings.platformEnabled.ig) markIgLinks(); });
      /** 在不显示交互式状态界面的情况下刷新 IndieGala 所有权缓存。 */
      const autoUpdate = () => updateIgGameLibrary(false);
      let runner = autoUpdate;
      if (typeof runAutoUpdateWithRateLimit === 'function') {
        runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
      }
      Promise.resolve(runner()).then((result) => {
        if (typeof result === 'object' && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
          showToast('IG 登录状态已过期，请先登录', 'error', { duration: 0, closable: true, link: { href: result.loginUrl, text: '去登录' } });
        }
      });
      const observer = new MutationObserver(() => { markIgLinks(); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });
      GM_addStyle('.ig-owned{color:#ffffff !important;background:#5c8a00 !important}');
    }
  };
  return moduleApi;
}

module.exports = {
  createIgModule
};
