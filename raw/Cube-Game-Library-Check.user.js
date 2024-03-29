// ==UserScript==
// @name           游戏库检测-方块
// @name:en        Cube Game Library Check
// @namespace      cube-game-library-check
// @version        1.0.0
// @description    检测方块游戏是否已拥有。
// @description:en Check if the game of Cube is already owned.
// @author         HCLonely
// @license        MIT
// @iconURL        https://www.cube.com/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Cube-Game-Library-Check.user.js
// @include        *
// @exclude        *://account.cubejoy.com/html/login.html
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @connect        account.cubejoy.com
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

  if (getCubeGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到方块游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value) updateCubeGameLibrary();
    });
  } else {
    checkCubeGame();
  }

  const observer = new MutationObserver(() => { checkCubeGame(false, true); });
  observer.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  });

  async function checkCubeGame(first = true, again = false) {
    loadTimes++;
    if (loadTimes > 1000) {
      observer.disconnect();
      return;
    }
    const cubeGames = getCubeGameLibrary();
    const cubeLink = again ?
      $('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]:not(".cube-game-checked")') :
      $('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]:not(".cube-game-link-owned")');
    if (cubeLink.length === 0) return;
    if (first) updateCubeGameLibrary(false);
    cubeLink.map((i, e) => {
      const $this = $(e);
      $this.addClass('cube-game-checked');
      let href = $this.attr('href');
      if (!/\/$/.test(href)) href += '/';
      const cubeGameId = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)?.[1];
      if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
        $this.addClass('cube-game-link-owned');
      }
      return e;
    });
  }
  function getCubeGameLibrary() {
    return GM_getValue('cubeGames') || [];
  }
  function updateCubeGameLibrary(loop = true, i = 1, games = []) {
    if (!loop && i !== 1) {
      GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])]);
      checkCubeGame(false);
      return;
    }
    return new Promise((resolve, reject) => {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新方块游戏库数据...',
          text: `第 ${i} 页`,
          icon: 'info'
        });
      }
      GM_xmlhttpRequest({
        method: 'POST',
        url: `https://account.cubejoy.com/Comment/MyGameReq?pageIndex=${i}&pageSize=24`,
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Host': 'account.cubejoy.com',
          'Origin': 'https://account.cubejoy.com',
          'Referer': 'https://account.cubejoy.com/Comment/MyGame'
        },
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then(async (response) => {
      if (response.response?.resultCode === 0) {
        if (loop) {
          Swal.fire({
            title: '获取方块游戏库数据失败！',
            text: '请先登录',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: '登录',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            if (value) GM_openInTab('https://account.cubejoy.com/html/login.html', { active: true, insert: true, setParent: true });
          });
        } else {
          $('body').overhang({
            type: 'error',
            message: '方块登录凭证已过期，请重新登录<a href="https://account.cubejoy.com/html/login.html" target="_blank">https://account.cubejoy.com/html/login.html</a>',
            html: true,
            closeConfirm: true
          });
        }
        return false;
      } else if (response.response?.result?.list?.length) {
        games = [...games, ...response.response.result.list.map((e) => e.S_Id)]; // eslint-disable-line

        if (response.response?.result.total > i * 24) {
          return await updateCubeGameLibrary(loop, ++i, games); // eslint-disable-line
        } else if (loop) {
          GM_setValue('cubeGames', [...new Set(games)].filter((e) => e));
          return Swal.update({
            icon: 'success',
            title: 'cube游戏库数据更新完成',
            text: ''
          });
        }
        GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])].filter((e) => e));
        checkCubeGame(false);
        return true;
      } else if (response.response?.result?.list?.length !== 0) {
        console.error(response);
        return Swal.update({
          icon: 'error',
          title: '方块游戏库数据更新失败',
          text: '详情请查看控制台'
        });
      }
    })
      .catch((error) => {
        console.error(error);
        return Swal.update({
          icon: 'error',
          title: '方块游戏库数据更新失败',
          text: '详情请查看控制台'
        });
      });
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
  GM_registerMenuCommand('更新cube游戏库', updateCubeGameLibrary);
  GM_registerMenuCommand('设置', setting);

  GM_addStyle('.cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
  GM_addStyle(GM_getResourceText('overhang'));
}());
