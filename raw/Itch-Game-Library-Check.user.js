// ==UserScript==
// @name           游戏库检测-itch
// @name:en        Itch Game Library Check
// @namespace      itch-game-library-check
// @version        1.1.3
// @description    检测itch.io游戏是否已拥有。
// @description:en Check if the game of itch.io is already owned.
// @author         HCLonely
// @license        MIT
// @iconURL        https://itch.io/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Itch-Game-Library-Check.user.js
// @include        *
// @exclude        *://itch.io/login
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @require        https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @require        https://greasyfork.org/scripts/426803-gistsync/code/gistSync.js?version=957824
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @grant          unsafeWindow
// @connect        itch.io
// @connect        api.github.com
// @run-at         document-end
// ==/UserScript==

(function () {
  const whiteList = GM_getValue('whiteList') || []
  const blackList = GM_getValue('blackList') || []
  const url = window.location.href
  let enable = true

  async function checkItchGame (first = true, again = false) {
    const itchGames = getItchGameLibrary()
    const itchLink = again ? $('a[href*=".itch.io/"]:not("itch-io-game-checked")') : $('a[href*=".itch.io/"]:not("itch-io-game-link-owned")')
    if (itchLink.length === 0) return
    if (first) updateItchGameLibrary(false)
    itchLink.map((i, e) => {
      const _this = $(e)
      _this.addClass('itch-io-game-checked')
      let href = _this.attr('href')
      if (!/\/$/.test(href)) href += '/'
      const itchGameLink = href.match(/https?:\/\/(.*?\/.*?)\//i)?.[1]
      if (itchGameLink && itchGames.includes(itchGameLink)) {
        _this.addClass('itch-io-game-link-owned')
      }
    })
  }
  function getItchGameLibrary () {
    return GM_getValue('itchGames') || []
  }
  function updateItchGameLibrary (loop = true, i = 1, games = []) {
    if (!loop && i !== 1) {
      GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])])
      checkItchGame(false)
      return
    }
    return new Promise((resolve, reject) => {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新itch游戏库数据...',
          text: `第 ${i} 页`,
          icon: 'info'
        })
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://itch.io/my-purchases?page=${i}&format=json`,
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: response => {
          response.status === 200 ? resolve(response) : reject(response)
        }
      })
    }).then(async response => {
      if (/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
        if (loop) {
          Swal.fire({
            title: '获取itch游戏库数据失败！',
            text: '请先登录',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: '登录',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            if (value) GM_openInTab('https://itch.io/login', { active: true, insert: true, setParent: true })
          })
        } else {
          $('body').overhang({
            type: 'error',
            message: 'itch.io登录凭证已过期，请重新登录<a href="https://itch.io/login" target="_blank">https://itch.io/login</a>',
            html: true,
            closeConfirm: true
          })
        }
        return false
      } else if (response.response?.num_items) { // eslint-disable-line camelcase
        games = [...games, ...$.makeArray($(`<div>${response.response.content}</div>`).find('a.thumb_link.game_link')).map((e, i) => {
          return $(e).attr('href').match(/https?:\/\/(.*?\/.*?)\//i)?.[1]
        })]

        if (response.response.num_items === 50) {
          return await updateItchGameLibrary(loop, ++i, games)
        } else if (loop) {
          GM_setValue('itchGames', [...new Set(games)])
          return Swal.update({
            icon: 'success',
            title: 'itch游戏库数据更新完成',
            text: ''
          })
        } else {
          GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])])
          checkItchGame(false)
          return true
        }
      } else if (response.response?.num_items === 0) { // eslint-disable-line camelcase
        GM_setValue('itchGames', [...new Set(games)])
        return Swal.update({
          icon: 'success',
          title: 'itch游戏库数据更新完成',
          text: ''
        })
      } else {
        console.error(response)
        return Swal.update({
          icon: 'error',
          title: 'itch游戏库数据更新失败',
          text: '详情请查看控制台'
        })
      }
    }).catch(error => {
      console.error(error)
      return Swal.update({
        icon: 'error',
        title: 'itch游戏库数据更新失败',
        text: '详情请查看控制台'
      })
    })
  }
  function addWhiteList () {
    const whiteList = GM_getValue('whiteList') || []
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', [])
    })
  }
  function addBlackList () {
    const blackList = GM_getValue('blackList') || []
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) value ? GM_setValue('blackList', value.split('\n')) : GM_setValue('blackList', [])
    })
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
        addWhiteList()
      } else if (isDenied) {
        addBlackList()
      }
    })
  }
  GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary)
  GM_registerMenuCommand('设置', setting)

  if (whiteList.length > 0) {
    enable = false
    for (const e of whiteList) {
      if (url.includes(e)) {
        enable = true
        break
      }
    }
  } else if (blackList.length > 0) {
    enable = true
    for (const e of blackList) {
      if (url.includes(e)) {
        enable = false
        break
      }
    }
  }

  if (!enable) return

  if (getItchGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到itch游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value) updateItchGameLibrary()
    })
  } else {
    checkItchGame()
  }

  const observer = new MutationObserver(() => { checkItchGame(false, true) })
  observer.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  })

  GM_addStyle('.itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}')
  GM_addStyle(GM_getResourceText('overhang'))
  unsafeWindow.checkItchGame = checkItchGame
})()
