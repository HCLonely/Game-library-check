// ==UserScript==
// @name           游戏库检测-Epic
// @name:en        Epic Game Library Check
// @namespace      epic-game-library-check
// @version        1.0.8
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
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @require        https://cdn.jsdelivr.net/npm/dayjs@1.10.8/dayjs.min.js
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @connect        store.epicgames.com
// @connect        www.epicgames.com
// @connect        cdn.jsdelivr.net
// @connect        epic-status.hclonely.com
// @run-at         document-end
// @noframes
// ==/UserScript==

(function () {
  const whiteList = GM_getValue('whiteList') || [];
  const blackList = GM_getValue('blackList') || [];
  const url = window.location.href;
  let enable = true;
  let loadTimes = 0;

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

  checkEpicGamesLibrary();
  updateEpicWishlist();

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
    const epicGames = getEpicGamesLibrary();
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
        const released = epicGames.releasedGames.find((e) => e.pageSlug.includes(epicGameName));
        const comingsoon = epicGames.comingsoonGames.find((e) => e.pageSlug.includes(epicGameName));
        const free = epicGames.freeGames.find((e) => e.pageSlug.includes(epicGameName) && e.promotions) ||
          epicGames.freeGames.find((e) => e.pageSlug.includes(epicGameName));
        const gameData = released || comingsoon || free;
        if (!gameData) return;
        if (ownedGames.includes(gameData?.offerId)) {
          $this.addClass('epic-game-link-owned');
        } else if (wishlistGames.includes(gameData?.offerId)) {
          $this.addClass('epic-game-link-wishlist');
        }
        if (free) {
          if (free.promotions) {
            if (new Date().getTime() > free.promotions.startDate && new Date().getTime() < free.promotions.endDate) {
              if ($this.find('font.icon-gift-clock').length === 0) $this.append('<font class="iconfont icon-gift-clock"></font>');
            }
            if (new Date().getTime() < free.promotions.startDate) {
              if ($this.find('font.icon-clock-gift').length === 0) $this.append('<font class="iconfont icon-clock-gift"></font>');
            }
          } else {
            if ($this.find('font.icon-gift').length === 0) $this.append('<font class="iconfont icon-gift"></font>');
          }
        }
        if (comingsoon) {
          if ($this.find('font.icon-clock').length === 0) $this.append('<font class="iconfont icon-clock"></font>');
        }
        switch (gameData.type) {
        case 'bundles':
        case 'bundles/games':
          if ($this.find('font.icon-kabao').length === 0) $this.append('<font class="iconfont icon-kabao"></font>');
          break;
        case 'editors':
          if ($this.find('font.icon-3302bianji2').length === 0) $this.append('<font class="iconfont icon-3302bianji2"></font>');
          break;
        case 'addons':
          if ($this.find('font.icon-add-one').length === 0) $this.append('<font class="iconfont icon-add-one"></font>');
          break;
        case 'software':
          if ($this.find('font.icon-ruanjian').length === 0) $this.append('<font class="iconfont icon-ruanjian"></font>');
          break;
        default:
          break;
        }
      }
      return e;
    });
  }
  function getEpicGamesLibrary() {
    return GM_getValue('epicGamesLibrary') || {
      releasedGames: [],
      comingsoonGames: [],
      freeGames: [],
      updateTime: {
        releasedGames: 0,
        comingsoonGames: 0,
        freeGames: 0
      }
    };
  }
  async function updateEpicGamesLibrary(type, status) {
    const epicgamesData = getEpicGamesLibrary();
    if (type === 'released') {
      const localDataLength = epicgamesData.releasedGames.length || 0;
      if (localDataLength < status.archived) {
        for (let i = localDataLength % 100 === 0 ? (localDataLength + 100) : 100; i <= status.archived; i += 100) {
          await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://epic-status.hclonely.com/releasedGames-archived-${i}.json`,
              timeout: 15000,
              responseType: 'json',
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then((response) => {
            if (response.response?.length > 0) {
              epicgamesData.releasedGames = [...epicgamesData.releasedGames, ...response.response];
              GM_setValue('epicGamesLibrary', epicgamesData);
            }
          })
            .catch((error) => {
              console.error(error);
              /*
              Swal.fire({
                icon: 'error',
                title: '更新Epic游戏库数据失败',
                text: '详情请查看控制台'
              });
              */
            });
        }
      }
      await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://epic-status.hclonely.com/releasedGames-${status.updateTime}.json`,
          timeout: 15000,
          nocache: true,
          responseType: 'json',
          onerror: reject,
          ontimeout: reject,
          onload: (response) => {
            response.status === 200 ? resolve(response) : reject(response);
          }
        });
      }).then((response) => {
        if (response.response?.length > 0) {
          epicgamesData.releasedGames = [...epicgamesData.releasedGames, ...response.response];
          epicgamesData.updateTime.releasedGames = dayjs().format('YYYY-MM-DD');
          GM_setValue('epicGamesLibrary', epicgamesData);
        }
      })
        .catch((error) => {
          console.error(error);
          /*
          Swal.fire({
            icon: 'error',
            title: '更新Epic游戏库数据失败',
            text: '详情请查看控制台'
          });
          */
        });
      return;
    }
    await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://epic-status.hclonely.com/${type}Games-${status.updateTime}.json`,
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then((response) => {
      if (response.response?.length > 0) {
        epicgamesData[`${type}Games`] = response.response;
        epicgamesData.updateTime[`${type}Games`] = dayjs().format('YYYY-MM-DD');
        GM_setValue('epicGamesLibrary', epicgamesData);
      }
    })
      .catch((error) => {
        console.error(error);
        /*
        Swal.fire({
          icon: 'error',
          title: '更新Epic游戏库数据失败',
          text: '详情请查看控制台'
        });
        */
      });
    return;
  }
  async function checkEpicGamesLibrary() {
    const epicGamesLibrary = getEpicGamesLibrary();
    const dataStatus = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://epic-status.hclonely.com/status.json?t=${new Date().getTime()}`,
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then((response) => response.response)
      .catch((error) => {
        console.error(error);
      });
    if (!dataStatus) {
      return;
      /*
      Swal.fire({
        icon: 'error',
        title: '获取Epic游戏库数据失败',
        text: '详情请查看控制台'
      });
      */
    }
    if (new Date(epicGamesLibrary.updateTime.releasedGames).getTime() < new Date(dataStatus.releasedGames.updateTime).getTime()) {
      await updateEpicGamesLibrary('released', dataStatus.releasedGames);
    }
    if (new Date(epicGamesLibrary.updateTime.comingsoonGames).getTime() < new Date(dataStatus.comingsoonGames.updateTime).getTime()) {
      await updateEpicGamesLibrary('comingsoon', dataStatus.comingsoonGames);
    }
    if (new Date(epicGamesLibrary.updateTime.freeGames).getTime() < new Date(dataStatus.freeGames.updateTime).getTime()) {
      await updateEpicGamesLibrary('free', dataStatus.freeGames);
    }
  }
  function getEpicOwnedGames() {
    return GM_getValue('ownedGames') || [];
  }
  function updateEpicOwnedGames(loop = true, i = 0, games = []) {
    if (!loop && i !== 0) {
      GM_setValue('ownedGames', [...new Set([...getEpicOwnedGames(), ...games])]);
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
        url: `https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?page=${i}`,
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
      if (response.response?.orders?.length >= 0) {
        games = [...games, ...response.response.orders.map((e) => e?.orderStatus === 'COMPLETED' ? e?.items?.[0]?.offerId : null).filter(e => e)]; // eslint-disable-line

        if (parseInt(response.response?.total / 10, 10) > i) {
          return await updateEpicOwnedGames(loop, ++i, games); // eslint-disable-line
        } else if (loop) {
          GM_setValue('ownedGames', [...new Set(games)]);
          return Swal.update({
            icon: 'success',
            title: 'Epic已拥有游戏数据更新完成',
            text: ''
          });
        }
        GM_setValue('ownedGames', [...new Set([...getEpicOwnedGames(), ...games])]);
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
    const queryKey = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.epicgames.com/store/zh-CN/wishlist',
        timeout: 15000,
        nocache: true,
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then((response) => response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i))
      .catch((error) => {
        console.error(error);
      });
    if (queryKey?.length === 3) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22${queryKey[1]}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${queryKey[2]}%22%7D%7D`, // eslint-disable-line
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onload: (response) => {
          if (response.status === 200 && response.response?.data?.Wishlist?.wishlistItems?.elements?.length) {
            GM_setValue('epicWishist', response.response.data.Wishlist.wishlistItems.elements.map((e) => e.offerId));
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
}

@font-face {
  font-family: "iconfont";
  src: url('https://cdn.jsdelivr.net/gh/hclonely/Game-library-check@master/raw/iconfont.ttf') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconfont:after {
  background-color: #fff;
  color: red;
}

.icon-gift:after {
  content: "\\e681";
}

.icon-gift-clock:after {
  content: "\\e681\\e7e9";
}

.icon-clock-gift:after {
  content: "\\e7e9\\e681";
}

.icon-3302bianji2:after {
  content: "\\e662";
}

.icon-clock:after {
  content: "\\e7e9";
}

.icon-kabao:after {
  content: "\\e8b1";
}

.icon-ruanjian:after {
  content: "\\e689";
}

.icon-add-one:after {
  content: "\\e69d";
}`);
  GM_addStyle(GM_getResourceText('overhang'));
}());
