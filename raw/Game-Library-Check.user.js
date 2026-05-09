// ==UserScript==
// @name           游戏库检测-合集
// @name:en        Game Library Check
// @namespace      game-library-check
// @version        1.0.0
// @description    检测Epic/GOG/itch/Cube游戏是否已拥有。
// @description:en Check if Epic/GOG/itch/Cube games are already owned.
// @author         HCLonely
// @license        MIT
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Game-Library-Check.user.js
// @include        *
// @exclude        *://*.epicgames.com/*
// @exclude        *://www.gog.com/*
// @exclude        *://itch.io/login
// @exclude        *://account.cubejoy.com/html/login.html
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @require        https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @require        https://greasyfork.org/scripts/426803-gistsync/code/gistSync.js?version=957824
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @grant          unsafeWindow
// @connect        store.epicgames.com
// @connect        www.epicgames.com
// @connect        www.gog.com
// @connect        itch.io
// @connect        account.cubejoy.com
// @connect        api.github.com
// @connect        cdn.jsdelivr.net
// @run-at         document-end
// @noframes
// ==/UserScript==

(function () {
  const SETTINGS_KEY = 'globalSettings';

  function getGlobalSettings() {
    const defaults = {
      whiteList: GM_getValue('whiteList') || [],
      blackList: GM_getValue('blackList') || [],
      platformEnabled: { epic: true, gog: true, itch: true, cube: true }
    };
    const saved = GM_getValue(SETTINGS_KEY) || {};
    return {
      whiteList: Array.isArray(saved.whiteList) ? saved.whiteList : defaults.whiteList,
      blackList: Array.isArray(saved.blackList) ? saved.blackList : defaults.blackList,
      platformEnabled: { ...defaults.platformEnabled, ...(saved.platformEnabled || {}) }
    };
  }

  function setGlobalSettings(settings) {
    GM_setValue(SETTINGS_KEY, settings);
  }

  function isUrlEnabledByList(url, settings) {
    const { whiteList, blackList } = settings;
    if (whiteList.length > 0) return whiteList.some((item) => url.includes(item));
    if (blackList.length > 0) return !blackList.some((item) => url.includes(item));
    return true;
  }

  function openPlatformSwitchDialog() {
    const settings = getGlobalSettings();
    const current = settings.platformEnabled;
    Swal.fire({
      title: '平台开关',
      html: `
        <label><input type="checkbox" id="glc-epic" ${current.epic ? 'checked' : ''}/> Epic</label><br/>
        <label><input type="checkbox" id="glc-gog" ${current.gog ? 'checked' : ''}/> GOG</label><br/>
        <label><input type="checkbox" id="glc-itch" ${current.itch ? 'checked' : ''}/> Itch</label><br/>
        <label><input type="checkbox" id="glc-cube" ${current.cube ? 'checked' : ''}/> Cube</label>
      `,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      preConfirm: () => ({
        epic: document.getElementById('glc-epic').checked,
        gog: document.getElementById('glc-gog').checked,
        itch: document.getElementById('glc-itch').checked,
        cube: document.getElementById('glc-cube').checked
      })
    }).then(({ value }) => {
      if (!value) return;
      settings.platformEnabled = value;
      setGlobalSettings(settings);
    });
  }

  function createEpicModule() {
    return {
      key: 'epic',
      enabled: () => settings.platformEnabled.epic,
      start: async () => {
        if (!GM_getValue('version')) {
          GM_deleteValue('epicGamesLibrary');
          GM_deleteValue('ownedGames');
          GM_deleteValue('wishlist');
          GM_setValue('version', '1.1');
        }
        let loadTimes = 0;
        let catalogOfferSha256Hash = false;
        // let wishlistSha256Hash = false;
        // let accountId = 0;
        let locale = 'en-US';

        await getSha256Hash();

        if (getEpicOwnedGames().length === 0) {
          Swal.fire({
            title: '游戏库检测脚本提醒',
            icon: 'warning',
            text: '没有检测到Epic已拥有游戏数据，是否立即获取？',
            showCancelButton: true,
            confirmButtonText: '获取',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            if (value) updateEpicOwnedGames();
          });
        } else {
          checkEpicGame();
        }

        const observer = new MutationObserver(() => { checkEpicGame(false, true); });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });

        async function checkEpicGame(first = true, again = false) {
          // eslint-disable-next-line no-plusplus
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          const ownedGames = getEpicOwnedGames();
          const wishlistGames = GM_getValue('epicWishist') || [];
          // eslint-disable-next-line max-len
          const epicLink = again ? $('a[href*="www.epicgames.com/store/"]:not(".epic-game-checked"),a[href*="store.epicgames.com/"]:not(".epic-game-checked")') :
            $('a[href*="www.epicgames.com/store/"]:not(".epic-game-link-owned"),a[href*="store.epicgames.com/"]:not(".epic-game-link-owned")');
          if (epicLink.length === 0) return;
          if (first) updateEpicOwnedGames(false);
          epicLink.map(async (i, e) => {
            const $this = $(e);
            $this.addClass('epic-game-checked');
            let href = $this.attr('href');
            if (!/\/$/.test(href)) href += '/';
            const epicGameName = href.match(/https?:\/\/www\.epicgames\.com\/store\/.*?\/p(roduct)?\/([^?/]+)/i)?.[2]?.toLowerCase() ||
              href.match(/https?:\/\/store\.epicgames\.com\/.*?\/p(roduct)?\/([^?/]+)/i)?.[2]?.toLowerCase();
            if (epicGameName) {
              if (ownedGames.find((game) => game.pageSlug.includes(epicGameName))) {
                $this.addClass('epic-game-link-owned');
              } else if (wishlistGames.find((game) => game.pageSlug.includes(epicGameName))) {
                $this.addClass('epic-game-link-wishlist');
              }
            }
            return e;
          });
        }
        function getEpicOwnedGames() {
          return GM_getValue('ownedGames') || [];
        }
        /*
        async function getSha256Hash() {
          console.log('[EGLC] getSha256Hash...');
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://store.epicgames.com/zh-CN/wishlist',
              timeout: 30000,
              nocache: true,
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then((response) => {
            [, accountId, wishlistSha256Hash] = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i) || [];
            [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
            [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || [];
            console.log('[EGLC] ', JSON.stringify({ accountId, wishlistSha256Hash, catalogOfferSha256Hash, locale }));
          })
            .catch((error) => {
              console.error(error);
            });
        }
        */
        async function getSha256Hash() {
          console.log('[EGLC] getSha256Hash...');
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://store.epicgames.com/zh-CN/p/grand-theft-auto-v',
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
            // [, accountId, wishlistSha256Hash] = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i) || [];
            [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
            [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ['en-US'];
            console.log('[EGLC] ', JSON.stringify({ /* accountId, wishlistSha256Hash, */ catalogOfferSha256Hash, locale }));
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
              // eslint-disable-next-line max-len
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
                  offerMappings?.[0]?.pageSlug, urlSlug, customAttributes?.find((e) => e.key === 'com.epicgames.app.productSlug')?.value?.replace(/\/home$/, '')
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
        // eslint-disable-next-line no-unused-vars
        async function updateEpicAuth(loop) {
          console.log('[EGLC] updateEpicAuth...');
          if (loop) {
            Swal.fire({
              title: '正在更新Epic凭证...',
              icon: 'info'
            });
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
        function updateEpicOwnedGames(loop = true, i = 0, games = GM_getValue('ownedGames') || [], nextPageToken = '') {
          console.log('[EGLC] updateEpicOwnedGames...');
          if (!loop && i !== 0) {
            GM_setValue('ownedGames', games);
            checkEpicGame(false);
            return;
          }
          return new Promise((resolve, reject) => {
            if (loop) {
              Swal[i === 0 ? 'fire' : 'update']({
                title: '正在更新Epic已拥有游戏数据...',
                text: `第 ${i + 1} 页`,
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ''}`,
              timeout: 30000,
              nocache: true,
              responseType: 'json',
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => {
            if (/login/i.test(response.finalUrl)) {
              /*
              const result = await updateEpicAuth(loop);
              console.log('[EGLC] updateEpicAuthResult:', result);
              if (result) {
                return updateEpicOwnedGames(loop, i, games, lastCreatedAt);
              }
              */
              if (loop) {
                Swal.fire({
                  title: '更新Epic凭证失败！',
                  text: '请先登录',
                  icon: 'error',
                  showCancelButton: true,
                  confirmButtonText: '登录',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  if (value) GM_openInTab('https://www.epicgames.com/id/login', { active: true, insert: true, setParent: true });
                });
              } else {
                $('body').overhang({
                  type: 'error',
                  message: 'Epic登录凭证已过期，请重新登录<a href="https://www.epicgames.com/id/login" target="_blank">https://www.epicgames.com/id/login</a>',
                  html: true,
                  closeConfirm: true
                });
              }
              return false;
            }
            const ordersLength = response.response?.orders?.length || 0;
            if (ordersLength >= 0) {
              const orderedGames = response.response.orders.map((e) => e?.items?.[0] || null).filter((e) => e);
              await Promise.all(orderedGames.map(async (item) => {
                if (games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId)) {
                  return true;
                }
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
              }));
              // const lastCreatedAt = new Date(response.response.orders[ordersLength - 1]?.createdAtMillis || null).toISOString();
              const { nextPageToken } = response.response;

              if (nextPageToken) {
                /*
                if (response.response.total - games.length > 0 && !loop) {
                  return Swal.fire({
                    title: '游戏库检测脚本提醒',
                    icon: 'warning',
                    text: '检测到Epic已拥有游戏数据缺失，是否重新获取？',
                    showCancelButton: true,
                    confirmButtonText: '获取',
                    cancelButtonText: '取消'
                  }).then(({ value }) => {
                    if (value) updateEpicOwnedGames();
                  });
                }
                */
                if (loop) {
                  await new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(true);
                    }, 1000);
                  });
                }
                return await updateEpicOwnedGames(loop, ++i, games, nextPageToken); // eslint-disable-line
              } else if (loop) {
                GM_setValue('ownedGames', games);
                return Swal.update({
                  icon: 'success',
                  title: 'Epic已拥有游戏数据更新完成',
                  text: ''
                });
              }
              GM_setValue('ownedGames', games);
              checkEpicGame(false);
              console.log('[EGLC] updateEpicOwnedGames: Finish!');
              return true;
            } else if (response.response?.products?.length !== 0) {
              console.error(response);
              return Swal.update({
                icon: 'error',
                title: 'Epic已拥有游戏数据更新失败',
                text: '详情请查看控制台'
              });
            }
          })
            .catch((error) => {
              console.error(error);
              return Swal.update({
                icon: 'error',
                title: 'Epic已拥有游戏数据更新失败',
                text: '详情请查看控制台'
              });
            });
        }

        /*
        async function updateEpicWishlist() {
          console.log('[EGLC] updateEpicWishlist...');
          if (wishlistSha256Hash === false) {
            await getSha256Hash();
          }
          if (accountId && wishlistSha256Hash) {
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://store.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22${accountId}%22%7D&
              extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${wishlistSha256Hash}%22%7D%7D`, // eslint-disable-line
              timeout: 30000,
              nocache: true,
              responseType: 'json',
              onload: async (response) => {
                if (response.status === 200 && response.response?.data?.Wishlist?.wishlistItems?.elements?.length) {
                  const wishlistGames = response.response.data.Wishlist.wishlistItems.elements;
                  const savedwishlistGames = GM_getValue('epicWishist') || [];
                  const wishlist = (await Promise.all(wishlistGames.map(async (item) => {
                    const gameCache = savedwishlistGames.find((game) => game.namespace === item.namespace && game.offerId === item.offerId);
                    if (gameCache) {
                      return gameCache;
                    }
                    const pageSlug = await getPagePlug(item.namespace, item.offerId);
                    if (pageSlug) {
                      return {
                        namespace: item.namespace,
                        offerId: item.offerId,
                        pageSlug
                      };
                    }
                    return null;
                  }))).filter((e) => e);
                  GM_setValue('epicWishist', wishlist);
                }
              }
            });
          }
        }
        */

        GM_registerMenuCommand('更新Epic已拥有游戏数据', updateEpicOwnedGames);

        GM_addStyle(`
.epic-game-link-owned {
  color:#ffffff !important;
  background:#5c8a00 !important
}
.epic-game-link-wishlist {
  color:#ffffff !important;
  background:#007399 !important
}`);
      }
    };
  }

  GM_registerMenuCommand('平台开关', openPlatformSwitchDialog);
  GM_addStyle(GM_getResourceText('overhang'));

  const settings = getGlobalSettings();
  if (!isUrlEnabledByList(window.location.href, settings)) return;

  const modules = [];
  modules.push(createEpicModule());
  modules.forEach((module) => {
    if (module.enabled()) module.start();
  });
}());
