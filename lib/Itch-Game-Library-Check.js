// ==UserScript==
// @name           游戏库检测-itch
// @name:en        Itch Game Library Check
// @namespace      itch-game-library-check
// @version        1.0.0
// @description    检测itch.io游戏是否已拥有
// @description:en Check if the game of itch.io is already owned
// @author         HCLonely
// @license        MIT
// @iconURL        https://itch.io/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/blob/master/Game-Library-Check.user.js
// @include        *
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @connect        itch.io
// @connect        *
// @run-at         document-end
// ==/UserScript==

/* global $,Swal,GM_getValue,GM_setValue,GM_openInTab,GM_xmlhttpRequest,GM_addStyle,GM_registerMenuCommand,regeneratorRuntime */
/* eslint-disable no-void,no-func-assign,no-fallthrough */

(function () {
  if (getItchGameLibrary().length===0){
    Swal.fire({
      title:'游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到itch游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(({value})=>{
      if (value) updateItchGameLibrary()
    })
  } else {
    checkItchGame()
  }
  async function checkItchGame () {
    const itchGames = getItchGameLibrary()
    const itchLink = $('a[href*=".itch.io/"]')
    if (itchLink.length === 0) return
    await updateItchGameLibrary(false)
    itchLink.map((i,e)=>{
      const _this = $(e)
      let href = _this.attr('href')
      if (!/\/$/.test(href)) href+='/'
      const itchGameLink = href.match(/https?:\/\/(.*?\/.*?)\//i)?.[1]
      if (itchGameLink && itchGames.includes(itchGameLink)){
        _this.addClass('itch-io-game-link-owned')
      }
    })
  }
  function getItchGameLibrary () {
    return GM_getValue('itchGames') || []
  }
  function updateItchGameLibrary(loop = true, i = 1, games = []) {
    if (!loop && i !== 1) return GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])])
    return new Promise((resolve, reject) => {
      if(loop) Swal[i===1?'fire':'update']({
        title: '正在更新itch游戏库数据...',
        text: `第 ${i} 页`,
        icon: 'info'
      })
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
        Swal.update({
          title: '获取itch游戏库数据失败！',
          text: '请先登录',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: '登录',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value) GM_openInTab('https://itch.io/login', { active: true, insert: true, setParent: true })
        })
        return false
      } else if (response.response?.num_items) {
        games=[...games,...$.makeArray($(`<div>${response.response.content}</div>`).find('a.thumb_link.game_link')).map((e,i)=>{
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
          return GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])])
        }
      } else {
        console.error(response)
        return Swal.update({
          icon: 'error',
          title: 'itch游戏库数据更新失败',
          text: '详情请查看控制台'
        })
      }
    }).catch(error=>{
      console.error(error)
      return Swal.update({
        icon: 'error',
        title: 'itch游戏库数据更新失败',
        text: '详情请查看控制台'
      })
    })
  }
  GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary)
  GM_addStyle(`.itch-io-game-link-owned{background:#16c60c !important}`)
})()