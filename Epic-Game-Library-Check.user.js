/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

  var whiteList = GM_getValue('whiteList') || [];
  var blackList = GM_getValue('blackList') || [];
  var url = window.location.href;
  var enable = true;
  var loadTimes = 0;
  var catalogOfferSha256Hash = false;
  var wishlistSha256Hash = false;
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
    _checkEpicGame = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var first,
          again,
          ownedGames,
          wishlistGames,
          epicLink,
          _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
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
                var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(i, e) {
                  var _href$match, _href$match$, _href$match2, _href$match2$;

                  var $this, href, epicGameName;
                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
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
                  return _ref8.apply(this, arguments);
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
    _getSha256Hash = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: 'https://store.epicgames.com/zh-CN/wishlist',
                  timeout: 30000,
                  nocache: true,
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(function (response) {
                var _ref9 = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i) || [];

                var _ref10 = _slicedToArray(_ref9, 3);

                accountId = _ref10[1];
                wishlistSha256Hash = _ref10[2];

                var _ref11 = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];

                var _ref12 = _slicedToArray(_ref11, 2);

                catalogOfferSha256Hash = _ref12[1];

                var _ref13 = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || [];

                var _ref14 = _slicedToArray(_ref13, 2);

                locale = _ref14[1];
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
    _getPagePlug = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(namespace, offerId) {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(catalogOfferSha256Hash === false)) {
                _context7.next = 3;
                break;
              }

              _context7.next = 3;
              return getSha256Hash();

            case 3:
              if (catalogOfferSha256Hash) {
                _context7.next = 5;
                break;
              }

              return _context7.abrupt("return", false);

            case 5:
              return _context7.abrupt("return", new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  // eslint-disable-next-line max-len
                  url: "https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22".concat(offerId, "%22,%22sandboxId%22:%22").concat(namespace, "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(catalogOfferSha256Hash, "%22%7D%7D"),
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
                var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(response) {
                  var _response$response4, _response$response4$d, _response$response4$d2;

                  var _offerMappings$, _customAttributes$fin, _customAttributes$fin2, _response$response$da, offerMappings, urlSlug, customAttributes;

                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          if (!((_response$response4 = response.response) !== null && _response$response4 !== void 0 && (_response$response4$d = _response$response4.data) !== null && _response$response4$d !== void 0 && (_response$response4$d2 = _response$response4$d.Catalog) !== null && _response$response4$d2 !== void 0 && _response$response4$d2.catalogOffer)) {
                            _context6.next = 3;
                            break;
                          }

                          _response$response$da = response.response.data.Catalog.catalogOffer, offerMappings = _response$response$da.offerMappings, urlSlug = _response$response$da.urlSlug, customAttributes = _response$response$da.customAttributes;
                          return _context6.abrupt("return", _toConsumableArray(new Set([offerMappings === null || offerMappings === void 0 ? void 0 : (_offerMappings$ = offerMappings[0]) === null || _offerMappings$ === void 0 ? void 0 : _offerMappings$.pageSlug, urlSlug, customAttributes === null || customAttributes === void 0 ? void 0 : (_customAttributes$fin = customAttributes.find(function (e) {
                            return e.key === 'com.epicgames.app.productSlug';
                          })) === null || _customAttributes$fin === void 0 ? void 0 : (_customAttributes$fin2 = _customAttributes$fin.value) === null || _customAttributes$fin2 === void 0 ? void 0 : _customAttributes$fin2.replace(/\/home$/, '')].filter(function (e) {
                            return e;
                          })) || []));

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
                  return _ref15.apply(this, arguments);
                };
              }())["catch"](function (error) {
                console.error(error);
                return false;
              }));

            case 6:
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
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GM_getValue('ownedGames') || [];
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(response) {
        var _response$response, _response$response$or, _response$response3, _response$response3$p;

        var ordersLength, _response$response$or2, _response$response2, orderedGames, _lastCreatedAt;

        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
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
                ordersLength = ((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$or = _response$response.orders) === null || _response$response$or === void 0 ? void 0 : _response$response$or.length) || 0;

                if (!(ordersLength >= 0)) {
                  _context2.next = 26;
                  break;
                }

                orderedGames = response.response.orders.map(function (e) {
                  var _e$items;

                  return (e === null || e === void 0 ? void 0 : e.orderStatus) === 'COMPLETED' ? e === null || e === void 0 ? void 0 : (_e$items = e.items) === null || _e$items === void 0 ? void 0 : _e$items[0] : null;
                }).filter(function (e) {
                  return e;
                });
                _context2.next = 8;
                return Promise.all(orderedGames.map( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(item) {
                    var pageSlug;
                    return _regeneratorRuntime().wrap(function _callee$(_context) {
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

              case 8:
                _lastCreatedAt = new Date(((_response$response$or2 = response.response.orders[ordersLength - 1]) === null || _response$response$or2 === void 0 ? void 0 : _response$response$or2.createdAtMillis) || null).toISOString();

                if (!(parseInt(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.total) / 10, 10) > i)) {
                  _context2.next = 18;
                  break;
                }

                if (!loop) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 13;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    resolve(true);
                  }, 1000);
                });

              case 13:
                _context2.next = 15;
                return updateEpicOwnedGames(loop, ++i, games, _lastCreatedAt);

              case 15:
                return _context2.abrupt("return", _context2.sent);

              case 18:
                if (!loop) {
                  _context2.next = 21;
                  break;
                }

                GM_setValue('ownedGames', games);
                return _context2.abrupt("return", Swal.update({
                  icon: 'success',
                  title: 'Epic已拥有游戏数据更新完成',
                  text: ''
                }));

              case 21:
                GM_setValue('ownedGames', games);
                checkEpicGame(false);
                return _context2.abrupt("return", true);

              case 26:
                if (!(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : (_response$response3$p = _response$response3.products) === null || _response$response3$p === void 0 ? void 0 : _response$response3$p.length) !== 0)) {
                  _context2.next = 29;
                  break;
                }

                console.error(response);
                return _context2.abrupt("return", Swal.update({
                  icon: 'error',
                  title: 'Epic已拥有游戏数据更新失败',
                  text: '详情请查看控制台'
                }));

              case 29:
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
    _updateEpicWishlist = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              if (!(wishlistSha256Hash === false)) {
                _context10.next = 3;
                break;
              }

              _context10.next = 3;
              return getSha256Hash();

            case 3:
              if (accountId && wishlistSha256Hash) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: "https://store.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22".concat(accountId, "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(wishlistSha256Hash, "%22%7D%7D"),
                  // eslint-disable-line
                  timeout: 30000,
                  nocache: true,
                  responseType: 'json',
                  onload: function () {
                    var _onload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(response) {
                      var _response$response5, _response$response5$d, _response$response5$d2, _response$response5$d3, _response$response5$d4;

                      var wishlistGames, savedwishlistGames, wishlist;
                      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
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
                                var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(item) {
                                  var gameCache, pageSlug;
                                  return _regeneratorRuntime().wrap(function _callee8$(_context8) {
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
                                  return _ref16.apply(this, arguments);
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
    }).then(function (_ref5) {
      var value = _ref5.value;
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
    }).then(function (_ref6) {
      var value = _ref6.value;
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
    }).then(function (_ref7) {
      var isConfirmed = _ref7.isConfirmed,
          isDenied = _ref7.isDenied;

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