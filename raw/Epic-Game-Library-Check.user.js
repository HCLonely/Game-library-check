// ==UserScript==
// @name           游戏库检测-Epic
// @name:en        Epic Game Library Check
// @namespace      epic-game-library-check
// @version        1.1.7
// @description    检测Epic游戏是否已拥有。
// @description:en Check if the game of Epic is already owned.
// @author         HCLonely
// @license        MIT
// @iconURL        https://static-assets-prod.epicgames.com/epic-store/static/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Epic-Game-Library-Check.user.js
// @include        *
// @exclude        *://*.epicgames.com/*
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @connect        store.epicgames.com
// @connect        www.epicgames.com
// @connect        cdn.jsdelivr.net
// @run-at         document-end
// @noframes
// ==/UserScript==

(function () {
  if (!GM_getValue('version')) {
    GM_deleteValue('epicGamesLibrary');
    GM_deleteValue('ownedGames');
    GM_deleteValue('wishlist');
    GM_setValue('version', '1.1');
  }
  const whiteList = GM_getValue('whiteList') || [];
  const blackList = GM_getValue('blackList') || [];
  const url = window.location.href;
  let enable = true;
  let loadTimes = 0;
  let catalogOfferSha256Hash = false;
  let wishlistSha256Hash = false;
  let accountId = 0;
  let locale = 'en-US';

  if (whiteList.length > 0) {
    enable = false;
    for (const e of whiteList) {
      if (url.includes(e)) {
        enable = true;
        break;
      }
    }
  } else if (blackList.length > 0) {
    enable = true;
    for (const e of blackList) {
      if (url.includes(e)) {
        enable = false;
        break;
      }
    }
  }

  if (!enable) return;

  updateEpicWishlist(false);

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
  async function getSha256Hash() {
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
    })
      .catch((error) => {
        console.error(error);
      });
  }
  async function getPagePlug(namespace, offerId) {
    if (catalogOfferSha256Hash === false) {
      await getSha256Hash();
    }
    if (!catalogOfferSha256Hash) {
      return false;
    }
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        // eslint-disable-next-line max-len
        url: `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22${offerId}%22,%22sandboxId%22:%22${namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${catalogOfferSha256Hash}%22%7D%7D`,
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
      if (response.response?.data?.Catalog?.catalogOffer) {
        const { offerMappings, urlSlug, customAttributes } = response.response.data.Catalog.catalogOffer;
        return [
          ...new Set([
            offerMappings?.[0]?.pageSlug, urlSlug, customAttributes?.find((e) => e.key === 'com.epicgames.app.productSlug')?.value?.replace(/\/home$/, '')
          ].filter((e) => e)) || []
        ];
      }
      return false;
    })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  function updateEpicOwnedGames(loop = true, i = 0, games = GM_getValue('ownedGames') || [], lastCreatedAt = '') {
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
        url: `https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?page=${i}&locale=${locale}${lastCreatedAt ? `&lastCreatedAt=${encodeURIComponent(lastCreatedAt)}` : ''}`,
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
        if (loop) {
          Swal.fire({
            title: '获取Epic已拥有游戏数据失败！',
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
        const orderedGames = response.response.orders.map((e) => (e?.orderStatus === 'COMPLETED' ? e?.items?.[0] : null)).filter((e) => e);
        await Promise.all(orderedGames.map(async (item) => {
          if (games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId)) {
            return true;
          }
          const pageSlug = await getPagePlug(item.namespace, item.offerId);
          if (pageSlug) {
            games.push({
              namespace: item.namespace,
              offerId: item.offerId,
              pageSlug
            });
            GM_setValue('ownedGames', games);
          }
        }));
        const lastCreatedAt = new Date(response.response.orders[ordersLength - 1]?.createdAtMillis || null).toISOString();

        if (parseInt(response.response?.total / 10, 10) > i) {
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
          return await updateEpicOwnedGames(loop, ++i, games, lastCreatedAt); // eslint-disable-line
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

  async function updateEpicWishlist() {
    if (wishlistSha256Hash === false) {
      await getSha256Hash();
    }
    if (accountId && wishlistSha256Hash) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://store.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22${accountId}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${wishlistSha256Hash}%22%7D%7D`, // eslint-disable-line
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

  function addWhiteList() {
    const whiteList = GM_getValue('whiteList') || [];
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', []);
    });
  }
  function addBlackList() {
    const blackList = GM_getValue('blackList') || [];
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) value ? GM_setValue('blackList', value.split('\n')) : GM_setValue('blackList', []);
    });
  }
  function setting() {
    Swal.fire({
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '白名单网站',
      denyButtonText: '黑名单网站',
      cancelButtonText: '关闭'
    }).then(({ isConfirmed, isDenied }) => {
      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }
  GM_registerMenuCommand('更新Epic已拥有游戏数据', updateEpicOwnedGames);
  GM_registerMenuCommand('设置', setting);

  GM_addStyle(`
.epic-game-link-owned {
  color:#ffffff !important;
  background:#5c8a00 !important
}
.epic-game-link-wishlist {
  color:#ffffff !important;
  background:#007399 !important
}`);
  GM_addStyle(GM_getResourceText('overhang'));
}());
