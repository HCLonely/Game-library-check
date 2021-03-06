/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */
function _createForOfIteratorHelper (o, allowArrayLike) { var it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') { if (it) o = it; var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e2) { throw _e2 }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e3) { didErr = true; err = _e3 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

// ==UserScript==
// @name           游戏库检测-gog
// @name:en        Gog Game Library Check
// @namespace      gog-game-library-check
// @version        1.0.2
// @description    检测gog游戏是否已拥有。
// @description:en Check if the game of GOG is already owned.
// @author         HCLonely
// @license        MIT
// @iconURL        https://www.gog.com/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Gog-Game-Library-Check.user.js
// @include        *
// @exclude        *://www.gog.com/*
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
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
// @connect        www.gog.com
// @run-at         document-end
// ==/UserScript==
(function () {
  var whiteList = GM_getValue('whiteList') || []
  var blackList = GM_getValue('blackList') || []
  var url = window.location.href
  var enable = true

  function checkGogGame () {
    return _checkGogGame.apply(this, arguments)
  }

  function _checkGogGame () {
    _checkGogGame = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 () {
      var first
      var again
      var gogGames
      var gogLink
      var _args2 = arguments
      return regeneratorRuntime.wrap(function _callee2$ (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              first = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true
              again = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false
              gogGames = getGogGameLibrary()
              gogLink = again ? $('a[href*="www.gog.com/game/"]:not("gog-game-checked")') : $('a[href*="www.gog.com/game/"]:not("gog-game-link-owned")')

              if (!(gogLink.length === 0)) {
                _context2.next = 6
                break
              }

              return _context2.abrupt('return')

            case 6:
              if (first) updateGogGameLibrary(false)
              gogLink.map(function (i, e) {
                var _href$match

                var _this = $(e)

                _this.addClass('gog-game-checked')

                var href = _this.attr('href')

                if (!/\/$/.test(href)) href += '/'
                var gogGameLink = (_href$match = href.match(/https?:\/\/www.gog.com\/game\/([\d\w_]+)/i)) === null || _href$match === void 0 ? void 0 : _href$match[1]

                if (gogGameLink && gogGames.includes(gogGameLink.toLowerCase())) {
                  _this.addClass('gog-game-link-owned')
                }
              })

            case 8:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    }))
    return _checkGogGame.apply(this, arguments)
  }

  function getGogGameLibrary () {
    return GM_getValue('gogGames') || []
  }

  function updateGogGameLibrary () {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : []

    if (!loop && i !== 1) {
      GM_setValue('gogGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))))
      checkGogGame(false)
      return
    }

    return new Promise(function (resolve, reject) {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新gog游戏库数据...',
          text: '\u7B2C '.concat(i, ' \u9875'),
          icon: 'info'
        })
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page='.concat(i, '&sortBy=date_purchased'),
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: function onload (response) {
          response.status === 200 ? resolve(response) : reject(response)
        }
      })
    }).then(/* #__PURE__ */function () {
      var _ref = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee (response) {
        var _response$response, _response$response$pr, _response$response3, _response$response3$p

        var _response$response2

        return regeneratorRuntime.wrap(function _callee$ (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!/openlogin/i.test(response.finalUrl)) {
                  _context.next = 5
                  break
                }

                if (loop) {
                  Swal.fire({
                    title: '获取gog游戏库数据失败！',
                    text: '请先登录',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: '登录',
                    cancelButtonText: '取消'
                  }).then(function (_ref2) {
                    var value = _ref2.value
                    if (value) {
                      GM_openInTab('https://www.gog.com/#openlogin', {
                        active: true,
                        insert: true,
                        setParent: true
                      })
                    }
                  })
                } else {
                  $('body').overhang({
                    type: 'error',
                    message: 'GOG登录凭证已过期，请重新登录<a href="https://www.gog.com/#openlogin" target="_blank">https://www.gog.com/#openlogin</a>',
                    html: true,
                    closeConfirm: true
                  })
                }

                return _context.abrupt('return', false)

              case 5:
                if (!((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$pr = _response$response.products) === null || _response$response$pr === void 0 ? void 0 : _response$response$pr.length)) {
                  _context.next = 23
                  break
                }

                // eslint-disable-line camelcase
                games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.products.map(function (e) {
                  var _e$url, _e$url$split

                  return e === null || e === void 0 ? void 0 : (_e$url = e.url) === null || _e$url === void 0 ? void 0 : (_e$url$split = _e$url.split('/')) === null || _e$url$split === void 0 ? void 0 : _e$url$split[2]
                })))

                if (!(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.totalPages) < i)) {
                  _context.next = 13
                  break
                }

                _context.next = 10
                return updateGogGameLibrary(loop, ++i, games)

              case 10:
                return _context.abrupt('return', _context.sent)

              case 13:
                if (!loop) {
                  _context.next = 18
                  break
                }

                GM_setValue('gogGames', _toConsumableArray(new Set(games)))
                return _context.abrupt('return', Swal.update({
                  icon: 'success',
                  title: 'gog游戏库数据更新完成',
                  text: ''
                }))

              case 18:
                GM_setValue('gogGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))))
                checkGogGame(false)
                return _context.abrupt('return', true)

              case 21:
                _context.next = 26
                break

              case 23:
                if (!(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : (_response$response3$p = _response$response3.products) === null || _response$response3$p === void 0 ? void 0 : _response$response3$p.length) !== 0)) {
                  _context.next = 26
                  break
                }

                console.error(response)
                return _context.abrupt('return', Swal.update({
                  icon: 'error',
                  title: 'gog游戏库数据更新失败',
                  text: '详情请查看控制台'
                }))

              case 26:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      }))

      return function (_x) {
        return _ref.apply(this, arguments)
      }
    }()).catch(function (error) {
      console.error(error)
      return Swal.update({
        icon: 'error',
        title: 'gog游戏库数据更新失败',
        text: '详情请查看控制台'
      })
    })
  }

  function addWhiteList () {
    var whiteList = GM_getValue('whiteList') || []
    Swal.fire({
      title: '添加白名单',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref3) {
      var value = _ref3.value
      if (value !== undefined) value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', [])
    })
  }

  function addBlackList () {
    var blackList = GM_getValue('blackList') || []
    Swal.fire({
      title: '添加黑名单',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref4) {
      var value = _ref4.value
      if (value !== undefined) value ? GM_setValue('blackList', value.split('\n')) : GM_setValue('blackList', [])
    })
  }

  GM_registerMenuCommand('更新gog游戏库', updateGogGameLibrary)
  GM_registerMenuCommand('白名单', addWhiteList)
  GM_registerMenuCommand('黑名单', addBlackList)

  if (whiteList.length > 0) {
    enable = false

    var _iterator = _createForOfIteratorHelper(whiteList)
    var _step

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var e = _step.value

        if (url.includes(e)) {
          enable = true
          break
        }
      }
    } catch (err) {
      _iterator.e(err)
    } finally {
      _iterator.f()
    }
  } else if (blackList.length > 0) {
    enable = true

    var _iterator2 = _createForOfIteratorHelper(blackList)
    var _step2

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _e = _step2.value

        if (url.includes(_e)) {
          enable = false
          break
        }
      }
    } catch (err) {
      _iterator2.e(err)
    } finally {
      _iterator2.f()
    }
  }

  if (!enable) return

  if (getGogGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到gog游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(function (_ref5) {
      var value = _ref5.value
      if (value) updateGogGameLibrary()
    })
  } else {
    checkGogGame()
  }

  var observer = new MutationObserver(function () {
    checkGogGame(false, true)
  })
  observer.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  })
  GM_addStyle('.gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}')
  GM_addStyle(GM_getResourceText('overhang'))
})()
