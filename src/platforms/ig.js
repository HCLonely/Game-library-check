function createIgModule(context) {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    parseHtml,
    showUpdateStep,
    showUpdateResult,
    showLoginExpiredDialog,
    showToast,
    UPDATE_STATUS
  } = context;

  let started = false;

  function getIgOwnedGames() {
    return (GM_getValue('IG-Owned')?.games || []).filter(Boolean).map((item) => item.toLowerCase());
  }

  function markIgLinks() {
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

  function getIgCookies() {
    return new Promise((resolve, reject) => {
      GM_cookie.list({ url: 'https://www.indiegala.com/library/showcase/1' }, (cookies, error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';'));
      });
    });
  }

  async function requestIgShowcasePage(page, cookies) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
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

  function parseIgShowcase(responseText, page) {
    const doc = parseHtml(responseText);
    let pages = 1;
    if (page === 1) {
      const pageLinks = Array.from(doc.querySelectorAll('a.profile-private-page-library-pagination-item[href*="library/showcase"]'));
      const lastPageHref = pageLinks.find((el) => el.querySelector('.fa-angle-double-right'))?.getAttribute('href') || '';
      const parsedPage = Number((lastPageHref.match(/\d+/) || [1])[0]);
      pages = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    }
    const games = Array.from(doc.querySelectorAll('a.library-showcase-title'))
      .map((el) => el.getAttribute('href')?.match(/https?:\/\/.*?\.indiegala\.com\/(.*)/)?.[1]?.toLowerCase())
      .filter(Boolean);
    return { pages, games };
  }

  async function updateIgGameLibrary() {
    try {
      showUpdateStep('ig', '第 1 页');
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
      let allGames = [...firstParsed.games];

      for (let page = 2; page <= firstParsed.pages; page += 1) {
        showUpdateStep('ig', `第 ${page} 页`);
        const response = await requestIgShowcasePage(page, cookies);
        const parsed = parseIgShowcase(response.responseText, page);
        allGames = allGames.concat(parsed.games);
      }

      allGames = Array.from(new Set(allGames)).filter(Boolean);
      GM_setValue('IG-Owned', { time: Date.now(), games: allGames });
      await showUpdateResult('IG游戏库数据更新完成', 'success');
      markIgLinks();
      return true;
    } catch (error) {
      console.error(error);
      await showUpdateResult('IG游戏库数据更新失败', 'error');
      return false;
    }
  }

  return {
    key: 'ig',
    enabled: () => settings.platformEnabled.ig,
    isCacheEmpty: () => getIgOwnedGames().length === 0,
    updateLibrary: () => updateIgGameLibrary(),
    start: () => {
      if (started) return;
      started = true;
      markIgLinks();
      updateIgGameLibrary().then((result) => {
        if (result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
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
}

module.exports = {
  createIgModule
};
