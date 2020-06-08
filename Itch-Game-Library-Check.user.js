/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */
function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

function _createForOfIteratorHelper (o, allowArrayLike) { var it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') { if (it) o = it; var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e2) { throw _e2 }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e3) { didErr = true; err = _e3 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

// ==UserScript==
// @name           游戏库检测-itch
// @name:en        Itch Game Library Check
// @namespace      itch-game-library-check
// @version        1.0.2
// @description    检测itch.io游戏是否已拥有
// @description:en Check if the game of itch.io is already owned
// @author         HCLonely
// @license        MIT
// @iconURL        https://itch.io/favicon.ico
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/blob/master/Game-Library-Check.user.js
// @include        *
// @exclude        *://itch.io/login
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
// @run-at         document-end
// ==/UserScript==

/* global $,Swal,GM_getValue,GM_setValue,GM_openInTab,GM_xmlhttpRequest,GM_addStyle,GM_registerMenuCommand,regeneratorRuntime */
(function () {
  var whiteList = GM_getValue('whiteList') || []
  var blackList = GM_getValue('blackList') || []
  var url = window.location.href
  var enable = true

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

  if (getItchGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到itch游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(function (_ref) {
      var value = _ref.value
      if (value) updateItchGameLibrary()
    })
  } else {
    checkItchGame()
  }

  function checkItchGame () {
    return _checkItchGame.apply(this, arguments)
  }

  function _checkItchGame () {
    _checkItchGame = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 () {
      var first
      var itchGames
      var itchLink
      var _args2 = arguments
      return regeneratorRuntime.wrap(function _callee2$ (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              first = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true
              itchGames = getItchGameLibrary()
              itchLink = $('a[href*=".itch.io/"]')

              if (!(itchLink.length === 0)) {
                _context2.next = 5
                break
              }

              return _context2.abrupt('return')

            case 5:
              if (first) updateItchGameLibrary(false)
              itchLink.map(function (i, e) {
                var _href$match

                var _this = $(e)

                var href = _this.attr('href')

                if (!/\/$/.test(href)) href += '/'
                var itchGameLink = (_href$match = href.match(/https?:\/\/(.*?\/.*?)\//i)) === null || _href$match === void 0 ? void 0 : _href$match[1]

                if (itchGameLink && itchGames.includes(itchGameLink)) {
                  _this.addClass('itch-io-game-link-owned')
                }
              })

            case 7:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    }))
    return _checkItchGame.apply(this, arguments)
  }

  function getItchGameLibrary () {
    return GM_getValue('itchGames') || []
  }

  function updateItchGameLibrary () {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : []

    if (!loop && i !== 1) {
      GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))))
      checkItchGame(false)
      return
    }

    return new Promise(function (resolve, reject) {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新itch游戏库数据...',
          text: '\u7B2C '.concat(i, ' \u9875'),
          icon: 'info'
        })
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://itch.io/my-purchases?page='.concat(i, '&format=json'),
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
      var _ref2 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee (response) {
        var _response$response

        return regeneratorRuntime.wrap(function _callee$ (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                  _context.next = 5
                  break
                }

                Swal.fire({
                  title: '获取itch游戏库数据失败！',
                  text: '请先登录',
                  icon: 'error',
                  showCancelButton: true,
                  confirmButtonText: '登录',
                  cancelButtonText: '取消'
                }).then(function (_ref3) {
                  var value = _ref3.value
                  if (value) {
                    GM_openInTab('https://itch.io/login', {
                      active: true,
                      insert: true,
                      setParent: true
                    })
                  }
                })
                return _context.abrupt('return', false)

              case 5:
                if (!((_response$response = response.response) === null || _response$response === void 0 ? void 0 : _response$response.num_items)) {
                  _context.next = 23
                  break
                }

                games = [].concat(_toConsumableArray(games), _toConsumableArray($.makeArray($('<div>'.concat(response.response.content, '</div>')).find('a.thumb_link.game_link')).map(function (e, i) {
                  var _$$attr$match

                  return (_$$attr$match = $(e).attr('href').match(/https?:\/\/(.*?\/.*?)\//i)) === null || _$$attr$match === void 0 ? void 0 : _$$attr$match[1]
                })))

                if (!(response.response.num_items === 50)) {
                  _context.next = 13
                  break
                }

                _context.next = 10
                return updateItchGameLibrary(loop, ++i, games)

              case 10:
                return _context.abrupt('return', _context.sent)

              case 13:
                if (!loop) {
                  _context.next = 18
                  break
                }

                GM_setValue('itchGames', _toConsumableArray(new Set(games)))
                return _context.abrupt('return', Swal.update({
                  icon: 'success',
                  title: 'itch游戏库数据更新完成',
                  text: ''
                }))

              case 18:
                GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))))
                checkItchGame(false)
                return _context.abrupt('return', true)

              case 21:
                _context.next = 25
                break

              case 23:
                console.error(response)
                return _context.abrupt('return', Swal.update({
                  icon: 'error',
                  title: 'itch游戏库数据更新失败',
                  text: '详情请查看控制台'
                }))

              case 25:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      }))

      return function (_x) {
        return _ref2.apply(this, arguments)
      }
    }()).catch(function (error) {
      console.error(error)
      return Swal.update({
        icon: 'error',
        title: 'itch游戏库数据更新失败',
        text: '详情请查看控制台'
      })
    })
  }

  function addWhiteList () {
    Swal.fire({
      title: '添加白名单',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref4) {
      var value = _ref4.value
      value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', [])
    })
  }

  function addBlackList () {
    Swal.fire({
      title: '添加黑名单',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref5) {
      var value = _ref5.value
      value ? GM_setValue('blackList', value.split('\n')) : GM_setValue('blackList', [])
    })
  }

  GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary)
  GM_registerMenuCommand('白名单', addWhiteList)
  GM_registerMenuCommand('黑名单', addBlackList)
  GM_addStyle('.itch-io-game-link-owned{background:#008000 !important}')
})()
