/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ==UserScript==
// @name           游戏库检测-Epic
// @name:en        Epic Game Library Check
// @namespace      epic-game-library-check
// @version        1.1.1
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

  var whiteList = GM_getValue('whiteList') || [];
  var blackList = GM_getValue('blackList') || [];
  var url = window.location.href;
  var enable = true;
  var loadTimes = 0;
  var getCatalogOfferSha256Hash = false;
  var getWishlistSha256Hash = false;
  var accountId = 0;
  var locale = 'en-US';

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
  updateEpicWishlist(false);

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
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  });

  function checkEpicGame() {
    return _checkEpicGame.apply(this, arguments);
  }

  function _checkEpicGame() {
    _checkEpicGame = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var first,
          again,
          ownedGames,
          wishlistGames,
          epicLink,
          _args4 = arguments;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              first = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : true;
              again = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : false;
              // eslint-disable-next-line no-plusplus
              loadTimes++;

              if (!(loadTimes > 1000)) {
                _context4.next = 6;
                break;
              }

              observer.disconnect();
              return _context4.abrupt("return");

            case 6:
              ownedGames = getEpicOwnedGames();
              wishlistGames = GM_getValue('epicWishist') || []; // eslint-disable-next-line max-len

              epicLink = again ? $('a[href*="www.epicgames.com/store/"]:not(".epic-game-checked"),a[href*="store.epicgames.com/"]:not(".epic-game-checked")') : $('a[href*="www.epicgames.com/store/"]:not(".epic-game-link-owned"),a[href*="store.epicgames.com/"]:not(".epic-game-link-owned")');

              if (!(epicLink.length === 0)) {
                _context4.next = 11;
                break;
              }

              return _context4.abrupt("return");

            case 11:
              if (first) updateEpicOwnedGames(false);
              epicLink.map( /*#__PURE__*/function () {
                var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(i, e) {
                  var _href$match, _href$match$, _href$match2, _href$match2$;

                  var $this, href, epicGameName;
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          $this = $(e);
                          $this.addClass('epic-game-checked');
                          href = $this.attr('href');
                          if (!/\/$/.test(href)) href += '/';
                          epicGameName = ((_href$match = href.match(/https?:\/\/www\.epicgames\.com\/store\/.*?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match === void 0 ? void 0 : (_href$match$ = _href$match[2]) === null || _href$match$ === void 0 ? void 0 : _href$match$.toLowerCase()) || ((_href$match2 = href.match(/https?:\/\/store\.epicgames\.com\/.*?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match2 === void 0 ? void 0 : (_href$match2$ = _href$match2[2]) === null || _href$match2$ === void 0 ? void 0 : _href$match2$.toLowerCase());

                          if (epicGameName) {
                            if (ownedGames.find(function (game) {
                              return game.pageSlug.includes(epicGameName);
                            })) {
                              $this.addClass('epic-game-link-owned');
                            } else if (wishlistGames.find(function (game) {
                              return game.pageSlug.includes(epicGameName);
                            })) {
                              $this.addClass('epic-game-link-wishlist');
                            }
                          }

                          return _context3.abrupt("return", e);

                        case 7:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x5, _x6) {
                  return _ref9.apply(this, arguments);
                };
              }());

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _checkEpicGame.apply(this, arguments);
  }

  function getEpicOwnedGames() {
    return GM_getValue('ownedGames') || [];
  }

  function getSha256Hash() {
    return _getSha256Hash.apply(this, arguments);
  }

  function _getSha256Hash() {
    _getSha256Hash = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: 'https://store.epicgames.com/store/zh-CN/wishlist',
                  timeout: 30000,
                  nocache: true,
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(function (response) {
                var _response$responseTex = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i);

                var _response$responseTex2 = _slicedToArray(_response$responseTex, 3);

                accountId = _response$responseTex2[1];
                getWishlistSha256Hash = _response$responseTex2[2];

                var _response$responseTex3 = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i);

                var _response$responseTex4 = _slicedToArray(_response$responseTex3, 2);

                getCatalogOfferSha256Hash = _response$responseTex4[1];

                var _response$responseTex5 = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i);

                var _response$responseTex6 = _slicedToArray(_response$responseTex5, 2);

                locale = _response$responseTex6[1];
              })["catch"](function (error) {
                console.error(error);
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _getSha256Hash.apply(this, arguments);
  }

  function getPagePlug(_x, _x2) {
    return _getPagePlug.apply(this, arguments);
  }

  function _getPagePlug() {
    _getPagePlug = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(namespace, offerId) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(getCatalogOfferSha256Hash === false)) {
                _context7.next = 4;
                break;
              }

              _context7.next = 3;
              return getSha256Hash();

            case 3:
              getCatalogOfferSha256Hash = _context7.sent;

            case 4:
              if (getCatalogOfferSha256Hash) {
                _context7.next = 6;
                break;
              }

              return _context7.abrupt("return", false);

            case 6:
              return _context7.abrupt("return", new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  // eslint-disable-next-line max-len
                  url: "https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22".concat(offerId, "%22,%22sandboxId%22:%22").concat(namespace, "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(getCatalogOfferSha256Hash, "%22%7D%7D"),
                  timeout: 30000,
                  nocache: true,
                  responseType: 'json',
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then( /*#__PURE__*/function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(response) {
                  var _response$response4, _response$response4$d, _response$response4$d2;

                  var _offerMappings$, _customAttributes$fin, _customAttributes$fin2, _response$response$da, offerMappings, urlSlug, customAttributes;

                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          if (!((_response$response4 = response.response) !== null && _response$response4 !== void 0 && (_response$response4$d = _response$response4.data) !== null && _response$response4$d !== void 0 && (_response$response4$d2 = _response$response4$d.Catalog) !== null && _response$response4$d2 !== void 0 && _response$response4$d2.catalogOffer)) {
                            _context6.next = 3;
                            break;
                          }

                          _response$response$da = response.response.data.Catalog.catalogOffer, offerMappings = _response$response$da.offerMappings, urlSlug = _response$response$da.urlSlug, customAttributes = _response$response$da.customAttributes; // eslint-disable-next-line max-len

                          return _context6.abrupt("return", _toConsumableArray(new Set([offerMappings === null || offerMappings === void 0 ? void 0 : (_offerMappings$ = offerMappings[0]) === null || _offerMappings$ === void 0 ? void 0 : _offerMappings$.pageSlug, urlSlug, (_customAttributes$fin = customAttributes.find(function (e) {
                            return e.key === 'com.epicgames.app.productSlug';
                          })) === null || _customAttributes$fin === void 0 ? void 0 : (_customAttributes$fin2 = _customAttributes$fin.value) === null || _customAttributes$fin2 === void 0 ? void 0 : _customAttributes$fin2.replace(/\/home$/, '')].filter(function (e) {
                            return e;
                          }))));

                        case 3:
                          return _context6.abrupt("return", false);

                        case 4:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6);
                }));

                return function (_x7) {
                  return _ref10.apply(this, arguments);
                };
              }())["catch"](function (error) {
                console.error(error);
                return false;
              }));

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _getPagePlug.apply(this, arguments);
  }

  function updateEpicOwnedGames() {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GM_getValue('ownedGames');
    var lastCreatedAt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    if (!loop && i !== 0) {
      GM_setValue('ownedGames', games);
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
        url: "https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?page=".concat(i, "&locale=").concat(locale).concat(lastCreatedAt ? "&lastCreatedAt=".concat(encodeURIComponent(lastCreatedAt)) : ''),
        timeout: 30000,
        nocache: true,
        responseType: 'json',
        onerror: reject,
        ontimeout: reject,
        onload: function onload(response) {
          response.status === 200 ? resolve(response) : reject(response);
        }
      });
    }).then( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(response) {
        var _response$response, _response$response$or, _response$response3, _response$response3$p;

        var _response$response2, orderedGames, _lastCreatedAt;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!/login/i.test(response.finalUrl)) {
                  _context2.next = 3;
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

                return _context2.abrupt("return", false);

              case 3:
                if (!(((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$or = _response$response.orders) === null || _response$response$or === void 0 ? void 0 : _response$response$or.length) >= 0)) {
                  _context2.next = 27;
                  break;
                }

                orderedGames = response.response.orders.map(function (e) {
                  var _e$items;

                  return (e === null || e === void 0 ? void 0 : e.orderStatus) === 'COMPLETED' ? e === null || e === void 0 ? void 0 : (_e$items = e.items) === null || _e$items === void 0 ? void 0 : _e$items[0] : null;
                }).filter(function (e) {
                  return e;
                });
                _context2.next = 7;
                return Promise.all(orderedGames.map( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item) {
                    var pageSlug;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!games.find(function (game) {
                              return game.namespace === item.namespace && game.offerId === item.offerId;
                            })) {
                              _context.next = 2;
                              break;
                            }

                            return _context.abrupt("return", true);

                          case 2:
                            _context.next = 4;
                            return getPagePlug(item.namespace, item.offerId);

                          case 4:
                            pageSlug = _context.sent;

                            if (pageSlug) {
                              games.push({
                                namespace: item.namespace,
                                offerId: item.offerId,
                                pageSlug: pageSlug
                              });
                              GM_setValue('ownedGames', games);
                            }

                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x4) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 7:
                _lastCreatedAt = new Date(response.response.orders.at(-1).createdAtMillis).toISOString();

                if (!(parseInt(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.total) / 10, 10) > i)) {
                  _context2.next = 19;
                  break;
                }

                if (!(response.response.total - games.length > 0 && !loop)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", Swal.fire({
                  title: '游戏库检测脚本提醒',
                  icon: 'warning',
                  text: '检测到Epic已拥有游戏数据缺失，是否重新获取？',
                  showCancelButton: true,
                  confirmButtonText: '获取',
                  cancelButtonText: '取消'
                }).then(function (_ref5) {
                  var value = _ref5.value;
                  if (value) updateEpicOwnedGames();
                }));

              case 11:
                if (!loop) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 14;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, 1000);
                });

              case 14:
                _context2.next = 16;
                return updateEpicOwnedGames(loop, ++i, games, _lastCreatedAt);

              case 16:
                return _context2.abrupt("return", _context2.sent);

              case 19:
                if (!loop) {
                  _context2.next = 22;
                  break;
                }

                GM_setValue('ownedGames', games);
                return _context2.abrupt("return", Swal.update({
                  icon: 'success',
                  title: 'Epic已拥有游戏数据更新完成',
                  text: ''
                }));

              case 22:
                GM_setValue('ownedGames', games);
                checkEpicGame(false);
                return _context2.abrupt("return", true);

              case 27:
                if (!(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : (_response$response3$p = _response$response3.products) === null || _response$response3$p === void 0 ? void 0 : _response$response3$p.length) !== 0)) {
                  _context2.next = 30;
                  break;
                }

                console.error(response);
                return _context2.abrupt("return", Swal.update({
                  icon: 'error',
                  title: 'Epic已拥有游戏数据更新失败',
                  text: '详情请查看控制台'
                }));

              case 30:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
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
    _updateEpicWishlist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              if (!(getWishlistSha256Hash === false)) {
                _context10.next = 3;
                break;
              }

              _context10.next = 3;
              return getSha256Hash();

            case 3:
              if (accountId && getWishlistSha256Hash) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: "https://store.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22".concat(accountId, "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(getWishlistSha256Hash, "%22%7D%7D"),
                  // eslint-disable-line
                  timeout: 30000,
                  nocache: true,
                  responseType: 'json',
                  onload: function () {
                    var _onload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(response) {
                      var _response$response5, _response$response5$d, _response$response5$d2, _response$response5$d3, _response$response5$d4;

                      var wishlistGames, savedwishlistGames, wishlist;
                      return regeneratorRuntime.wrap(function _callee9$(_context9) {
                        while (1) {
                          switch (_context9.prev = _context9.next) {
                            case 0:
                              if (!(response.status === 200 && (_response$response5 = response.response) !== null && _response$response5 !== void 0 && (_response$response5$d = _response$response5.data) !== null && _response$response5$d !== void 0 && (_response$response5$d2 = _response$response5$d.Wishlist) !== null && _response$response5$d2 !== void 0 && (_response$response5$d3 = _response$response5$d2.wishlistItems) !== null && _response$response5$d3 !== void 0 && (_response$response5$d4 = _response$response5$d3.elements) !== null && _response$response5$d4 !== void 0 && _response$response5$d4.length)) {
                                _context9.next = 7;
                                break;
                              }

                              wishlistGames = response.response.data.Wishlist.wishlistItems.elements;
                              savedwishlistGames = GM_getValue('epicWishist') || [];
                              _context9.next = 5;
                              return Promise.all(wishlistGames.map( /*#__PURE__*/function () {
                                var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(item) {
                                  var gameCache, pageSlug;
                                  return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                    while (1) {
                                      switch (_context8.prev = _context8.next) {
                                        case 0:
                                          gameCache = savedwishlistGames.find(function (game) {
                                            return game.namespace === item.namespace && game.offerId === item.offerId;
                                          });

                                          if (!gameCache) {
                                            _context8.next = 3;
                                            break;
                                          }

                                          return _context8.abrupt("return", gameCache);

                                        case 3:
                                          _context8.next = 5;
                                          return getPagePlug(item.namespace, item.offerId);

                                        case 5:
                                          pageSlug = _context8.sent;

                                          if (!pageSlug) {
                                            _context8.next = 8;
                                            break;
                                          }

                                          return _context8.abrupt("return", {
                                            namespace: item.namespace,
                                            offerId: item.offerId,
                                            pageSlug: pageSlug
                                          });

                                        case 8:
                                          return _context8.abrupt("return", null);

                                        case 9:
                                        case "end":
                                          return _context8.stop();
                                      }
                                    }
                                  }, _callee8);
                                }));

                                return function (_x9) {
                                  return _ref11.apply(this, arguments);
                                };
                              }()));

                            case 5:
                              wishlist = _context9.sent.filter(function (e) {
                                return e;
                              });
                              GM_setValue('epicWishist', wishlist);

                            case 7:
                            case "end":
                              return _context9.stop();
                          }
                        }
                      }, _callee9);
                    }));

                    function onload(_x8) {
                      return _onload.apply(this, arguments);
                    }

                    return onload;
                  }()
                });
              }

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
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
    }).then(function (_ref6) {
      var value = _ref6.value;
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
    }).then(function (_ref7) {
      var value = _ref7.value;
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
    }).then(function (_ref8) {
      var isConfirmed = _ref8.isConfirmed,
          isDenied = _ref8.isDenied;

      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }

  GM_registerMenuCommand('更新Epic已拥有游戏数据', updateEpicOwnedGames);
  GM_registerMenuCommand('设置', setting);
  GM_addStyle("\n.epic-game-link-owned {\n  color:#ffffff !important;\n  background:#5c8a00 !important\n}\n.epic-game-link-wishlist {\n  color:#ffffff !important;\n  background:#007399 !important\n}");
  GM_addStyle(GM_getResourceText('overhang'));
})();