function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

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
// @name           游戏库检测-gog
// @name:en        Gog Game Library Check
// @namespace      gog-game-library-check
// @version        1.0.8
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
// @connect        www.gog.com
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

  if (getGogGameLibrary().length === 0) {
    Swal.fire({
      title: '游戏库检测脚本提醒',
      icon: 'warning',
      text: '没有检测到gog游戏库数据，是否立即获取？',
      showCancelButton: true,
      confirmButtonText: '获取',
      cancelButtonText: '取消'
    }).then(function (_ref) {
      var value = _ref.value;
      if (value) updateGogGameLibrary();
    });
  } else {
    checkGogGame();
  }

  var observer = new MutationObserver(function () {
    checkGogGame(false, true);
  });
  observer.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  });

  function checkGogGame() {
    return _checkGogGame.apply(this, arguments);
  }

  function _checkGogGame() {
    _checkGogGame = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var first,
          again,
          gogGames,
          gogLink,
          _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              first = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true;
              again = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
              loadTimes++;

              if (!(loadTimes > 1000)) {
                _context2.next = 6;
                break;
              }

              observer.disconnect();
              return _context2.abrupt("return");

            case 6:
              gogGames = getGogGameLibrary();
              gogLink = again ? $('a[href*="www.gog.com/"]:not(".gog-game-checked")') : $('a[href*="www.gog.com/"]:not(".gog-game-link-owned")');

              if (!(gogLink.length === 0)) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return");

            case 10:
              if (first) updateGogGameLibrary(false);
              gogLink.map(function (i, e) {
                var _href$match;

                var $this = $(e);
                $this.addClass('gog-game-checked');
                var href = $this.attr('href');
                if (!/\/$/.test(href)) href += '/';
                var gogGameLink = (_href$match = href.match(/https?:\/\/www.gog.com\/([\w]+?\/)game\/([\d\w_]+)/i)) === null || _href$match === void 0 ? void 0 : _href$match[2];

                if (gogGameLink && gogGames.includes(gogGameLink.toLowerCase())) {
                  $this.addClass('gog-game-link-owned');
                }

                return e;
              });

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _checkGogGame.apply(this, arguments);
  }

  function getGogGameLibrary() {
    return GM_getValue('gogGames') || [];
  }

  function updateGogGameLibrary() {
    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (!loop && i !== 1) {
      GM_setValue('gogGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))));
      checkGogGame(false);
      return;
    }

    return new Promise(function (resolve, reject) {
      if (loop) {
        Swal[i === 1 ? 'fire' : 'update']({
          title: '正在更新gog游戏库数据...',
          text: "\u7B2C ".concat(i, " \u9875"),
          icon: 'info'
        });
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: "https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=".concat(i, "&sortBy=date_purchased"),
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(response) {
        var _response$response, _response$response$pr, _response$response3, _response$response3$p;

        var _response$response2;

        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!/openlogin/i.test(response.finalUrl)) {
                  _context.next = 5;
                  break;
                }

                if (loop) {
                  Swal.fire({
                    title: '获取gog游戏库数据失败！',
                    text: '请先登录',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: '登录',
                    cancelButtonText: '取消'
                  }).then(function (_ref3) {
                    var value = _ref3.value;
                    if (value) GM_openInTab('https://www.gog.com/#openlogin', {
                      active: true,
                      insert: true,
                      setParent: true
                    });
                  });
                } else {
                  $('body').overhang({
                    type: 'error',
                    message: 'GOG登录凭证已过期，请重新登录<a href="https://www.gog.com/#openlogin" target="_blank">https://www.gog.com/#openlogin</a>',
                    html: true,
                    closeConfirm: true
                  });
                }

                return _context.abrupt("return", false);

              case 5:
                if (!((_response$response = response.response) !== null && _response$response !== void 0 && (_response$response$pr = _response$response.products) !== null && _response$response$pr !== void 0 && _response$response$pr.length)) {
                  _context.next = 21;
                  break;
                }

                games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.products.map(function (e) {
                  var _e$url, _e$url$split, _e$url2;

                  return (e === null || e === void 0 ? void 0 : e.slug) || (e === null || e === void 0 ? void 0 : (_e$url = e.url) === null || _e$url === void 0 ? void 0 : (_e$url$split = _e$url.split('/')) === null || _e$url$split === void 0 ? void 0 : _e$url$split[(e === null || e === void 0 ? void 0 : (_e$url2 = e.url) === null || _e$url2 === void 0 ? void 0 : _e$url2.split('/').length) - 1]);
                }))); // eslint-disable-line

                if (!(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.totalPages) > i)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 10;
                return updateGogGameLibrary(loop, ++i, games);

              case 10:
                return _context.abrupt("return", _context.sent);

              case 13:
                if (!loop) {
                  _context.next = 16;
                  break;
                }

                GM_setValue('gogGames', _toConsumableArray(new Set(games)).filter(function (e) {
                  return e;
                }));
                return _context.abrupt("return", Swal.update({
                  icon: 'success',
                  title: 'gog游戏库数据更新完成',
                  text: ''
                }));

              case 16:
                GM_setValue('gogGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))).filter(function (e) {
                  return e;
                }));
                checkGogGame(false);
                return _context.abrupt("return", true);

              case 21:
                if (!(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : (_response$response3$p = _response$response3.products) === null || _response$response3$p === void 0 ? void 0 : _response$response3$p.length) !== 0)) {
                  _context.next = 24;
                  break;
                }

                console.error(response);
                return _context.abrupt("return", Swal.update({
                  icon: 'error',
                  title: 'gog游戏库数据更新失败',
                  text: '详情请查看控制台'
                }));

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (error) {
      console.error(error);
      return Swal.update({
        icon: 'error',
        title: 'gog游戏库数据更新失败',
        text: '详情请查看控制台'
      });
    });
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

  GM_registerMenuCommand('更新gog游戏库', updateGogGameLibrary);
  GM_registerMenuCommand('设置', setting);
  GM_addStyle('.gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
  GM_addStyle(GM_getResourceText('overhang'));
})();