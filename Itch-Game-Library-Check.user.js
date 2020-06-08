function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

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
      var itchGames, itchLink
      return regeneratorRuntime.wrap(function _callee2$ (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              itchGames = getItchGameLibrary()
              itchLink = $('a[href*=".itch.io/"]')

              if (!(itchLink.length === 0)) {
                _context2.next = 4
                break
              }

              return _context2.abrupt('return')

            case 4:
              _context2.next = 6
              return updateItchGameLibrary(false)

            case 6:
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
    if (!loop && i !== 1) return GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))))
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

                Swal.update({
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
                  _context.next = 21
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
                return _context.abrupt('return', GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games))))))

              case 19:
                _context.next = 23
                break

              case 21:
                console.error(response)
                return _context.abrupt('return', Swal.update({
                  icon: 'error',
                  title: 'itch游戏库数据更新失败',
                  text: '详情请查看控制台'
                }))

              case 23:
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

  GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary)
  GM_addStyle('.itch-io-game-link-owned{background:#16c60c !important}')
})()
