function createEpicModule(context) {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    showUpdateStep,
    showUpdateResult,
    showLoginExpiredDialog,
    showToast,
    runAutoUpdateWithRateLimit,
    UPDATE_STATUS
  } = context;

  let updateLibrary;
  let started = false;
  const moduleApi = {
    key: 'epic',
    enabled: () => settings.platformEnabled.epic,
    isCacheEmpty: () => (GM_getValue('ownedGames') || []).length === 0,
    updateLibrary: async () => {
      if (!updateLibrary) await moduleApi.start();
      return updateLibrary();
    },
    start: async () => {
      if (started) return;
      started = true;
      if (!GM_getValue('version')) {
        GM_deleteValue('epicGamesLibrary');
        GM_deleteValue('ownedGames');
        GM_deleteValue('wishlist');
        GM_setValue('version', '1.1');
      }
      let loadTimes = 0;
      let catalogOfferSha256Hash = false;
      let locale = 'en-US';

      await getSha256Hash();

      checkEpicGame();

      const observer = new MutationObserver(() => { checkEpicGame(false, true); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });

      async function checkEpicGame(first = true, again = false) {
        loadTimes++;
        if (loadTimes > 1000) {
          observer.disconnect();
          return;
        }
        const ownedGames = getEpicOwnedGames();
        const wishlistGames = GM_getValue('epicWishist') || [];
        const excludedClass = again ? 'epic-game-checked' : 'epic-game-link-owned';
        const epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]')
          .filter((el) => !el.classList.contains(excludedClass));
        if (epicLink.length === 0) return;
        if (first) {
          const autoUpdate = () => updateEpicOwnedGames(false);
          let runner = autoUpdate;
          if (typeof runAutoUpdateWithRateLimit === 'function') {
            runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
          }
          runner().then((result) => {
            if (result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
              showToast('Epic 登录状态已过期，请先登录', 'error', { duration: 0, closable: true, link: { href: result.loginUrl, text: '去登录' } });
            }
          });
        }
        epicLink.forEach((el) => {
          addClass(el, 'epic-game-checked');
          let href = getHref(el);
          if (!/\/$/.test(href)) href += '/';
          const epicGameName = href.match(/https?:\/\/(www|store)\.epicgames\.com(\/.*?)?\/p(roduct)?\/([^?/]+)/i)?.[4]?.toLowerCase();
          if (epicGameName) {
            if (ownedGames.find((game) => game.pageSlug.includes(epicGameName))) {
              addClass(el, 'epic-game-link-owned');
            } else if (wishlistGames.find((game) => game.pageSlug.includes(epicGameName))) {
              addClass(el, 'epic-game-link-wishlist');
            }
            return;
          }
          const epicGameOfferId = href.match(/https?:\/\/(store|www)\.epicgames\.com\/purchase\?offers=([\w-]+)/i)?.[2]?.toLowerCase();
          if (epicGameOfferId) {
            if (ownedGames.find((game) => epicGameOfferId.includes(game.offerId))) {
              addClass(el, 'epic-game-link-owned');
            } else if (wishlistGames.find((game) => epicGameOfferId.includes(game.offerId))) {
              addClass(el, 'epic-game-link-wishlist');
            }
          }
        });
      }

      function getEpicOwnedGames() {
        return GM_getValue('ownedGames') || [];
      }

      async function getSha256Hash() {
        console.log('[EGLC] getSha256Hash...');
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://store.epicgames.com/p/grand-theft-auto-v?lang=zh-CN',
            timeout: 30000,
            fetch: true,
            headers: {
              accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
            },
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then((response) => {
          [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
          [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ['en-US'];
          console.log('[EGLC] ', JSON.stringify({ catalogOfferSha256Hash, locale }));
        })
          .catch((error) => {
            console.error(error);
          });
      }

      async function getPagePlug(namespace, offerId) {
        console.log('[EGLC] getPagePlug...');
        if (catalogOfferSha256Hash === false) {
          await getSha256Hash();
        }
        if (!catalogOfferSha256Hash) {
          console.log('[EGLC] No catalogOfferSha256Hash');
          return false;
        }
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22${offerId}%22,%22sandboxId%22:%22${namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${catalogOfferSha256Hash}%22%7D%7D`,
            timeout: 30000,
            fetch: true,
            headers: {
              accept: 'application/json, text/plain, */*'
            },
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => {
          if (response.response?.data?.Catalog?.catalogOffer) {
            const { offerMappings, urlSlug, customAttributes } = response.response.data.Catalog.catalogOffer;
            return [
              ...new Set([
                offerMappings?.[0]?.pageSlug,
                urlSlug,
                customAttributes?.find((e) => e.key === 'com.epicgames.app.productSlug')?.value?.replace(/\/home$/, '')
              ].filter((e) => e))
            ];
          }
          return false;
        })
          .catch((error) => {
            console.error(error);
            return false;
          });
      }

      async function updateEpicAuth(loop) {
        console.log('[EGLC] updateEpicAuth...');
        if (loop) {
          context.showToast('正在更新Epic凭证...', 'info');
        }
        const reputationResult = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.epicgames.com/id/api/reputation',
            headers: {
              accept: 'application/json, text/plain, */*',
              referer: 'https://www.epicgames.com/id/login',
              'sec-fetch-site': 'same-origin'
            },
            timeout: 30000,
            nocache: true,
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => response.status === 200)
          .catch((error) => {
            console.error(error);
            return false;
          });
        if (!reputationResult) {
          return false;
        }
        const authenticateResult = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.epicgames.com/id/api/authenticate',
            headers: {
              accept: 'application/json, text/plain, */*',
              referer: 'https://www.epicgames.com/id/login',
              'x-epic-client-id': 'undefined',
              'x-epic-display-mode': 'web',
              'x-epic-duration': '700',
              'x-epic-event-action': 'null',
              'x-epic-event-category': 'null',
              'x-epic-platform': 'WEB',
              'x-epic-strategy-flags': '',
              'x-requested-with': 'XMLHttpRequest'
            },
            timeout: 30000,
            nocache: true,
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => response.status === 200)
          .catch((error) => {
            console.error(error);
            return false;
          });
        if (!authenticateResult) {
          return false;
        }
        const refreshCsrfResult = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://www.epicgames.com/account/v2/refresh-csrf',
            headers: {
              accept: 'application/json, text/plain, */*',
              origin: 'https://www.epicgames.com',
              referer: 'https://www.epicgames.com/account/personal'
            },
            timeout: 30000,
            nocache: true,
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => response.response?.success === true)
          .catch((error) => {
            console.error(error);
            return false;
          });
        if (!refreshCsrfResult) {
          return false;
        }
        return true;
      }

      function getEpicCookies(name) {
        return new Promise((resolve, reject) => {
          GM_cookie.list({ url: 'https://accounts.epicgames.com/', name }, (cookies, error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(cookies[0]?.value || 'null');
          });
        });
      }

      function getAllEpicCookies() {
        return new Promise((resolve, reject) => {
          GM_cookie.list({ url: 'https://accounts.epicgames.com/' }, (cookies, error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';'));
          });
        });
      }

      async function updateEpicOwnedGames(loop = true, i = 0, games = GM_getValue('ownedGames') || [], nextPageToken = '') {
        console.log('[EGLC] updateEpicOwnedGames...');
        if (!loop && i !== 0) {
          GM_setValue('ownedGames', games);
          checkEpicGame(false);
          return;
        }
        const xsrfToken = await getEpicCookies('XSRF-AM-TOKEN');
        const allCookies = await getAllEpicCookies();
        return new Promise((resolve, reject) => {
          if (loop) {
            showUpdateStep('epic', `第 ${i + 1} 页`);
          }
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?count=10&sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ''}`,
            timeout: 30000,
            nocache: true,
            responseType: 'json',
            headers: {
              referer: 'https://accounts.epicgames.com/',
              dnt: 1,
              pragma: 'no-cache',
              priority: 'u=1, i',
              'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"Windows"',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'sec-gpc': '1',
              'x-csrf-token': 'null',
              'x-xsrf-token': xsrfToken,
              cookie: allCookies
            },
            redirect: 'follow',
            fetch: true,
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => {
          if (/login/i.test(response.finalUrl)) {
            return {
              status: UPDATE_STATUS.AUTH_EXPIRED,
              platformName: 'Epic',
              loginUrl: 'https://www.epicgames.com/id/login'
            };
          }
          const ordersLength = response.response?.orders?.length || 0;
          if (ordersLength >= 0) {
            const orderedGames = response.response.orders.map((e) => e?.items?.[0] || null).filter((e) => e);
            // console.info(orderedGames);
            await Promise.all(orderedGames.map(async (item) => {
              // console.info(item);
              // const ttt = games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId);
              if (games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId)) {
                // console.info(item.namespace, ttt);
                return true;
              }
              console.info('pageSlug');
              const pageSlug = await getPagePlug(item.namespace, item.offerId);
              console.log(`[EGLC] pageSlug: ${pageSlug}`);
              if (pageSlug) {
                games.push({
                  namespace: item.namespace,
                  offerId: item.offerId,
                  pageSlug
                });
                GM_setValue('ownedGames', games);
              }
              return true;
            }));
            const { nextPageToken } = response.response;

            if (nextPageToken) {
              if (loop) {
                await new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(true);
                  }, 1000);
                });
              }
              return await updateEpicOwnedGames(loop, ++i, games, nextPageToken);
            } else if (loop) {
              GM_setValue('ownedGames', games);
              await showUpdateResult('Epic已拥有游戏数据更新完成', 'success');
              return true;
            }
            GM_setValue('ownedGames', games);
            checkEpicGame(false);
            console.log('[EGLC] updateEpicOwnedGames: Finish!');
            return true;
          } else if (response.response?.products?.length !== 0) {
            console.error(response);
            await showUpdateResult('Epic已拥有游戏数据更新失败', 'error');
            return false;
          }
          return false;
        })
          .catch(async (error) => {
            console.error(error);
            await showUpdateResult('Epic已拥有游戏数据更新失败', 'error');
            return false;
          });
      }

      updateLibrary = updateEpicOwnedGames;

      GM_addStyle(`
.epic-game-link-owned {
  color:#ffffff !important;
  background:#5c8a00 !important
}
.epic-game-link-wishlist {
  color:#ffffff !important;
  background:#007399 !important
}`);

      // void updateEpicAuth;
    }
  };
  return moduleApi;
}

module.exports = {
  createEpicModule
};
