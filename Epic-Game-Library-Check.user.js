/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ==UserScript==
// @name           游戏库检测-Epic
// @name:en        Epic Game Library Check
// @namespace      epic-game-library-check
// @version        1.0.6
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
  var whiteList = GM_getValue('whiteList') || [];
  var blackList = GM_getValue('blackList') || [];
  var url = window.location.href;
  var enable = true;
  var loadTimes = 0;

  if (whiteList.length > 0) {
    enable = false;

    var _iterator = _createForOfIteratorHelper(whiteList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var e = _step.value;

        if (url.includes(e)) {
          enable = true;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (blackList.length > 0) {
    enable = true;

    var _iterator2 = _createForOfIteratorHelper(blackList),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _e = _step2.value;

        if (url.includes(_e)) {
          enable = false;
          break;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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
    }).then(function (_ref) {
      var value = _ref.value;
      if (value) updateEpicOwnedGames();
    });
  } else {
    checkEpicGame();
  }

  var observer = new MutationObserver(function () {
    checkEpicGame(false, true);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  });

  function checkEpicGame() {
    return _checkEpicGame.apply(this, arguments);
  }

  function _checkEpicGame() {
    _checkEpicGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var first,
          again,
          epicGames,
          ownedGames,
          wishlistGames,
          epicLink,
          _args3 = arguments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              first = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : true;
              again = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
              loadTimes++;

              if (!(loadTimes > 1000)) {
                _context3.next = 6;
                break;
              }

              observer.disconnect();
              return _context3.abrupt("return");

            case 6:
              if (!(loadTimes % 100 !== 0)) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return");

            case 8:
              epicGames = getEpicGamesLibrary();
              ownedGames = getEpicOwnedGames();
              wishlistGames = GM_getValue('epicWishist') || [];
              epicLink = again ? $('a[href*="www.epicgames.com/store/"]:not(".epic-game-checked"),a[href*="store.epicgames.com/"]:not(".epic-game-checked")') : $('a[href*="www.epicgames.com/store/"]:not(".epic-game-link-owned"),a[href*="store.epicgames.com/"]:not(".epic-game-link-owned")');

              if (!(epicLink.length === 0)) {
                _context3.next = 14;
                break;
              }

              return _context3.abrupt("return");

            case 14:
              if (first) updateEpicOwnedGames(false);
              epicLink.map( /*#__PURE__*/function () {
                var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(i, e) {
                  var _href$match, _href$match$, _href$match2, _href$match2$;

                  var $this, href, epicGameName, released, comingsoon, free, gameData;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          $this = $(e);
                          $this.addClass('epic-game-checked');
                          href = $this.attr('href');
                          if (!/\/$/.test(href)) href += '/';
                          epicGameName = ((_href$match = href.match(/https?:\/\/www\.epicgames\.com\/store\/.*?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match === void 0 ? void 0 : (_href$match$ = _href$match[2]) === null || _href$match$ === void 0 ? void 0 : _href$match$.toLowerCase()) || ((_href$match2 = href.match(/https?:\/\/store\.epicgames\.com\/.*?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match2 === void 0 ? void 0 : (_href$match2$ = _href$match2[2]) === null || _href$match2$ === void 0 ? void 0 : _href$match2$.toLowerCase());

                          if (!epicGameName) {
                            _context2.next = 27;
                            break;
                          }

                          released = epicGames.releasedGames.find(function (e) {
                            return e.pageSlug.includes(epicGameName);
                          });
                          comingsoon = epicGames.comingsoonGames.find(function (e) {
                            return e.pageSlug.includes(epicGameName);
                          });
                          free = epicGames.freeGames.find(function (e) {
                            return e.pageSlug.includes(epicGameName) && e.promotions;
                          }) || epicGames.freeGames.find(function (e) {
                            return e.pageSlug.includes(epicGameName);
                          });
                          gameData = released || comingsoon || free;

                          if (gameData) {
                            _context2.next = 12;
                            break;
                          }

                          return _context2.abrupt("return");

                        case 12:
                          if (ownedGames.includes(gameData === null || gameData === void 0 ? void 0 : gameData.offerId)) {
                            $this.addClass('epic-game-link-owned');
                          } else if (wishlistGames.includes(gameData === null || gameData === void 0 ? void 0 : gameData.offerId)) {
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

                          _context2.t0 = gameData.type;
                          _context2.next = _context2.t0 === 'bundles' ? 18 : _context2.t0 === 'bundles/games' ? 18 : _context2.t0 === 'editors' ? 20 : _context2.t0 === 'addons' ? 22 : _context2.t0 === 'software' ? 24 : 26;
                          break;

                        case 18:
                          if ($this.find('font.icon-kabao').length === 0) $this.append('<font class="iconfont icon-kabao"></font>');
                          return _context2.abrupt("break", 27);

                        case 20:
                          if ($this.find('font.icon-3302bianji2').length === 0) $this.append('<font class="iconfont icon-3302bianji2"></font>');
                          return _context2.abrupt("break", 27);

                        case 22:
                          if ($this.find('font.icon-add-one').length === 0) $this.append('<font class="iconfont icon-add-one"></font>');
                          return _context2.abrupt("break", 27);

                        case 24:
                          if ($this.find('font.icon-ruanjian').length === 0) $this.append('<font class="iconfont icon-ruanjian"></font>');
                          return _context2.abrupt("break", 27);

                        case 26:
                          return _context2.abrupt("break", 27);

                        case 27:
                          return _context2.abrupt("return", e);

                        case 28:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x4, _x5) {
                  return _ref7.apply(this, arguments);
                };
              }());

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _checkEpicGame.apply(this, arguments);
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

  function updateEpicGamesLibrary(_x, _x2) {
    return _updateEpicGamesLibrary.apply(this, arguments);
  }

  function _updateEpicGamesLibrary() {
    _updateEpicGamesLibrary = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(type, status) {
      var epicgamesData, localDataLength, _loop, i;

      return regeneratorRuntime.wrap(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              epicgamesData = getEpicGamesLibrary();

              if (!(type === 'released')) {
                _context5.next = 14;
                break;
              }

              localDataLength = epicgamesData.releasedGames.length || 0;

              if (!(localDataLength < status.archived)) {
                _context5.next = 11;
                break;
              }

              _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                return regeneratorRuntime.wrap(function _loop$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return new Promise(function (resolve, reject) {
                          GM_xmlhttpRequest({
                            method: 'GET',
                            url: "https://epic-status.hclonely.com/releasedGames-archived-".concat(i, ".json"),
                            timeout: 15000,
                            responseType: 'json',
                            onerror: reject,
                            ontimeout: reject,
                            onload: function onload(response) {
                              response.status === 200 ? resolve(response) : reject(response);
                            }
                          });
                        }).then(function (response) {
                          var _response$response4;

                          if (((_response$response4 = response.response) === null || _response$response4 === void 0 ? void 0 : _response$response4.length) > 0) {
                            epicgamesData.releasedGames = [].concat(_toConsumableArray(epicgamesData.releasedGames), _toConsumableArray(response.response));
                            GM_setValue('epicGamesLibrary', epicgamesData);
                          }
                        })["catch"](function (error) {
                          console.error(error);
                          Swal.fire({
                            icon: 'error',
                            title: '更新Epic游戏库数据失败',
                            text: '详情请查看控制台'
                          });
                        });

                      case 2:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _loop);
              });
              i = localDataLength % 100 === 0 ? localDataLength + 100 : 100;

            case 6:
              if (!(i <= status.archived)) {
                _context5.next = 11;
                break;
              }

              return _context5.delegateYield(_loop(i), "t0", 8);

            case 8:
              i += 100;
              _context5.next = 6;
              break;

            case 11:
              _context5.next = 13;
              return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: "https://epic-status.hclonely.com/releasedGames-".concat(status.updateTime, ".json"),
                  timeout: 15000,
                  nocache: true,
                  responseType: 'json',
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(function (response) {
                var _response$response5;

                if (((_response$response5 = response.response) === null || _response$response5 === void 0 ? void 0 : _response$response5.length) > 0) {
                  epicgamesData.releasedGames = [].concat(_toConsumableArray(epicgamesData.releasedGames), _toConsumableArray(response.response));
                  epicgamesData.updateTime.releasedGames = dayjs().format('YYYY-MM-DD');
                  GM_setValue('epicGamesLibrary', epicgamesData);
                }
              })["catch"](function (error) {
                console.error(error);
                Swal.fire({
                  icon: 'error',
                  title: '更新Epic游戏库数据失败',
                  text: '详情请查看控制台'
                });
              });

            case 13:
              return _context5.abrupt("return");

            case 14:
              _context5.next = 16;
              return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: "https://epic-status.hclonely.com/".concat(type, "Games-").concat(status.updateTime, ".json"),
                  timeout: 15000,
                  nocache: true,
                  responseType: 'json',
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(function (response) {
                var _response$response6;

                if (((_response$response6 = response.response) === null || _response$response6 === void 0 ? void 0 : _response$response6.length) > 0) {
                  epicgamesData["".concat(type, "Games")] = response.response;
                  epicgamesData.updateTime["".concat(type, "Games")] = dayjs().format('YYYY-MM-DD');
                  GM_setValue('epicGamesLibrary', epicgamesData);
                }
              })["catch"](function (error) {
                console.error(error);
                Swal.fire({
                  icon: 'error',
                  title: '更新Epic游戏库数据失败',
                  text: '详情请查看控制台'
                });
              });

            case 16:
              return _context5.abrupt("return");

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee4);
    }));
    return _updateEpicGamesLibrary.apply(this, arguments);
  }

  function checkEpicGamesLibrary() {
    return _checkEpicGamesLibrary.apply(this, arguments);
  }

  function _checkEpicGamesLibrary() {
    _checkEpicGamesLibrary = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var epicGamesLibrary, dataStatus;
      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              epicGamesLibrary = getEpicGamesLibrary();
              _context6.next = 3;
              return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: "https://epic-status.hclonely.com/status.json?t=".concat(new Date().getTime()),
                  timeout: 15000,
                  nocache: true,
                  responseType: 'json',
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(function (response) {
                return response.response;
              })["catch"](function (error) {
                console.error(error);
              });

            case 3:
              dataStatus = _context6.sent;

              if (dataStatus) {
                _context6.next = 6;
                break;
              }

              return _context6.abrupt("return", Swal.fire({
                icon: 'error',
                title: '获取Epic游戏库数据失败',
                text: '详情请查看控制台'
              }));

            case 6:
              if (!(new Date(epicGamesLibrary.updateTime.releasedGames).getTime() < new Date(dataStatus.releasedGames.updateTime).getTime())) {
                _context6.next = 9;
                break;
              }

              _context6.next = 9;
              return updateEpicGamesLibrary('released', dataStatus.releasedGames);

            case 9:
              if (!(new Date(epicGamesLibrary.updateTime.comingsoonGames).getTime() < new Date(dataStatus.comingsoonGames.updateTime).getTime())) {
                _context6.next = 12;
                break;
              }

              _context6.next = 12;
              return updateEpicGamesLibrary('comingsoon', dataStatus.comingsoonGames);

            case 12:
              if (!(new Date(epicGamesLibrary.updateTime.freeGames).getTime() < new Date(dataStatus.freeGames.updateTime).getTime())) {
                _context6.next = 15;
                break;
              }

              _context6.next = 15;
              return updateEpicGamesLibrary('free', dataStatus.freeGames);

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    }));
    return _checkEpicGamesLibrary.apply(this, arguments);
  }

  function getEpicOwnedGames() {
    return GM_getValue('ownedGames') || [];
  }

  function updateEpicOwnedGames() {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (!loop && i !== 0) {
      GM_setValue('ownedGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getEpicOwnedGames()), _toConsumableArray(games)))));
      checkEpicGame(false);
      return;
    }

    return new Promise(function (resolve, reject) {
      if (loop) {
        Swal[i === 0 ? 'fire' : 'update']({
          title: '正在更新Epic已拥有游戏数据...',
          text: "\u7B2C ".concat(i + 1, " \u9875"),
          icon: 'info'
        });
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: "https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?page=".concat(i),
        timeout: 15000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: function onload(response) {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
        var _response$response, _response$response$or, _response$response3, _response$response3$p;

        var _response$response2;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!/login/i.test(response.finalUrl)) {
                  _context.next = 3;
                  break;
                }

                if (loop) {
                  Swal.fire({
                    title: '获取Epic已拥有游戏数据失败！',
                    text: '请先登录',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: '登录',
                    cancelButtonText: '取消'
                  }).then(function (_ref3) {
                    var value = _ref3.value;
                    if (value) GM_openInTab('https://www.epicgames.com/id/login', {
                      active: true,
                      insert: true,
                      setParent: true
                    });
                  });
                } else {
                  $('body').overhang({
                    type: 'error',
                    message: 'Epic登录凭证已过期，请重新登录<a href="https://www.epicgames.com/id/login" target="_blank">https://www.epicgames.com/id/login</a>',
                    html: true,
                    closeConfirm: true
                  });
                }

                return _context.abrupt("return", false);

              case 3:
                if (!(((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$or = _response$response.orders) === null || _response$response$or === void 0 ? void 0 : _response$response$or.length) >= 0)) {
                  _context.next = 19;
                  break;
                }

                games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.orders.map(function (e) {
                  var _e$items, _e$items$;

                  return (e === null || e === void 0 ? void 0 : e.orderStatus) === 'COMPLETED' ? e === null || e === void 0 ? void 0 : (_e$items = e.items) === null || _e$items === void 0 ? void 0 : (_e$items$ = _e$items[0]) === null || _e$items$ === void 0 ? void 0 : _e$items$.offerId : null;
                }).filter(function (e) {
                  return e;
                }))); // eslint-disable-line

                if (!(parseInt(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.total) / 10, 10) > i)) {
                  _context.next = 11;
                  break;
                }

                _context.next = 8;
                return updateEpicOwnedGames(loop, ++i, games);

              case 8:
                return _context.abrupt("return", _context.sent);

              case 11:
                if (!loop) {
                  _context.next = 14;
                  break;
                }

                GM_setValue('ownedGames', _toConsumableArray(new Set(games)));
                return _context.abrupt("return", Swal.update({
                  icon: 'success',
                  title: 'Epic已拥有游戏数据更新完成',
                  text: ''
                }));

              case 14:
                GM_setValue('ownedGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getEpicOwnedGames()), _toConsumableArray(games)))));
                checkEpicGame(false);
                return _context.abrupt("return", true);

              case 19:
                if (!(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : (_response$response3$p = _response$response3.products) === null || _response$response3$p === void 0 ? void 0 : _response$response3$p.length) !== 0)) {
                  _context.next = 22;
                  break;
                }

                console.error(response);
                return _context.abrupt("return", Swal.update({
                  icon: 'error',
                  title: 'Epic已拥有游戏数据更新失败',
                  text: '详情请查看控制台'
                }));

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (error) {
      console.error(error);
      return Swal.update({
        icon: 'error',
        title: 'Epic已拥有游戏数据更新失败',
        text: '详情请查看控制台'
      });
    });
  }

  function updateEpicWishlist() {
    return _updateEpicWishlist.apply(this, arguments);
  }

  function _updateEpicWishlist() {
    _updateEpicWishlist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var queryKey;
      return regeneratorRuntime.wrap(function _callee6$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: 'https://www.epicgames.com/store/zh-CN/wishlist',
                  timeout: 15000,
                  nocache: true,
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(function (response) {
                return response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i);
              })["catch"](function (error) {
                console.error(error);
              });

            case 2:
              queryKey = _context7.sent;

              if ((queryKey === null || queryKey === void 0 ? void 0 : queryKey.length) === 3) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: "https://www.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22".concat(queryKey[1], "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(queryKey[2], "%22%7D%7D"),
                  // eslint-disable-line
                  timeout: 15000,
                  nocache: true,
                  responseType: 'json',
                  onload: function onload(response) {
                    var _response$response7, _response$response7$d, _response$response7$d2, _response$response7$d3, _response$response7$d4;

                    if (response.status === 200 && (_response$response7 = response.response) !== null && _response$response7 !== void 0 && (_response$response7$d = _response$response7.data) !== null && _response$response7$d !== void 0 && (_response$response7$d2 = _response$response7$d.Wishlist) !== null && _response$response7$d2 !== void 0 && (_response$response7$d3 = _response$response7$d2.wishlistItems) !== null && _response$response7$d3 !== void 0 && (_response$response7$d4 = _response$response7$d3.elements) !== null && _response$response7$d4 !== void 0 && _response$response7$d4.length) {
                      GM_setValue('epicWishist', response.response.data.Wishlist.wishlistItems.elements.map(function (e) {
                        return e.offerId;
                      }));
                    }
                  }
                });
              }

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee6);
    }));
    return _updateEpicWishlist.apply(this, arguments);
  }

  function addWhiteList() {
    var whiteList = GM_getValue('whiteList') || [];
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref4) {
      var value = _ref4.value;
      if (value !== undefined) value ? GM_setValue('whiteList', value.split('\n')) : GM_setValue('whiteList', []);
    });
  }

  function addBlackList() {
    var blackList = GM_getValue('blackList') || [];
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref5) {
      var value = _ref5.value;
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
    }).then(function (_ref6) {
      var isConfirmed = _ref6.isConfirmed,
          isDenied = _ref6.isDenied;

      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }

  GM_registerMenuCommand('更新Epic已拥有游戏数据', updateEpicOwnedGames);
  GM_registerMenuCommand('设置', setting);
  GM_addStyle("\n.epic-game-link-owned {\n  color:#ffffff !important;\n  background:#5c8a00 !important\n}\n.epic-game-link-wishlist {\n  color:#ffffff !important;\n  background:#007399 !important\n}\n\n@font-face {\n  font-family: \"iconfont\";\n  src: url('https://cdn.jsdelivr.net/gh/hclonely/Game-library-check@master/raw/iconfont.ttf') format('truetype');\n}\n\n.iconfont {\n  font-family: \"iconfont\" !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.iconfont:after {\n  background-color: #fff;\n  color: red;\n}\n\n.icon-gift:after {\n  content: \"\\e681\";\n}\n\n.icon-gift-clock:after {\n  content: \"\\e681\\e7e9\";\n}\n\n.icon-clock-gift:after {\n  content: \"\\e7e9\\e681\";\n}\n\n.icon-3302bianji2:after {\n  content: \"\\e662\";\n}\n\n.icon-clock:after {\n  content: \"\\e7e9\";\n}\n\n.icon-kabao:after {\n  content: \"\\e8b1\";\n}\n\n.icon-ruanjian:after {\n  content: \"\\e689\";\n}\n\n.icon-add-one:after {\n  content: \"\\e69d\";\n}");
  GM_addStyle(GM_getResourceText('overhang'));
})();