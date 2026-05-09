function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
// ==UserScript==
// @name           游戏库检测-合集
// @name:en        Game Library Check
// @namespace      game-library-check
// @version        1.0.0
// @description    检测Epic/GOG/itch/Cube游戏是否已拥有。
// @description:en Check if Epic/GOG/itch/Cube games are already owned.
// @author         HCLonely
// @license        MIT
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Game-Library-Check.user.js
// @include        *
// @exclude        *://*.epicgames.com/*
// @exclude        *://www.gog.com/*
// @exclude        *://itch.io/login
// @exclude        *://account.cubejoy.com/html/login.html
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.js
// @require        https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @require        https://greasyfork.org/scripts/426803-gistsync/code/gistSync.js?version=957824
// @resource       overhang https://cdn.jsdelivr.net/npm/overhang@1.0.8/dist/overhang.min.css
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @grant          GM_openInTab
// @grant          unsafeWindow
// @connect        store.epicgames.com
// @connect        www.epicgames.com
// @connect        www.gog.com
// @connect        itch.io
// @connect        account.cubejoy.com
// @connect        api.github.com
// @connect        cdn.jsdelivr.net
// @run-at         document-end
// @noframes
// ==/UserScript==

(function () {
  var SETTINGS_KEY = 'globalSettings';
  function getGlobalSettings() {
    var defaults = {
      whiteList: GM_getValue('whiteList') || [],
      blackList: GM_getValue('blackList') || [],
      platformEnabled: {
        epic: true,
        gog: true,
        itch: true,
        cube: true
      }
    };
    var saved = GM_getValue(SETTINGS_KEY) || {};
    return {
      whiteList: Array.isArray(saved.whiteList) ? saved.whiteList : defaults.whiteList,
      blackList: Array.isArray(saved.blackList) ? saved.blackList : defaults.blackList,
      platformEnabled: _objectSpread(_objectSpread({}, defaults.platformEnabled), saved.platformEnabled || {})
    };
  }
  function setGlobalSettings(settings) {
    GM_setValue(SETTINGS_KEY, settings);
  }
  function isUrlEnabledByList(url, settings) {
    var whiteList = settings.whiteList,
      blackList = settings.blackList;
    if (whiteList.length > 0) return whiteList.some(function (item) {
      return url.includes(item);
    });
    if (blackList.length > 0) return !blackList.some(function (item) {
      return url.includes(item);
    });
    return true;
  }
  function openPlatformSwitchDialog() {
    var settings = getGlobalSettings();
    var current = settings.platformEnabled;
    Swal.fire({
      title: '平台开关',
      html: "\n        <label><input type=\"checkbox\" id=\"glc-epic\" ".concat(current.epic ? 'checked' : '', "/> Epic</label><br/>\n        <label><input type=\"checkbox\" id=\"glc-gog\" ").concat(current.gog ? 'checked' : '', "/> GOG</label><br/>\n        <label><input type=\"checkbox\" id=\"glc-itch\" ").concat(current.itch ? 'checked' : '', "/> Itch</label><br/>\n        <label><input type=\"checkbox\" id=\"glc-cube\" ").concat(current.cube ? 'checked' : '', "/> Cube</label>\n      "),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      preConfirm: function preConfirm() {
        return {
          epic: document.getElementById('glc-epic').checked,
          gog: document.getElementById('glc-gog').checked,
          itch: document.getElementById('glc-itch').checked,
          cube: document.getElementById('glc-cube').checked
        };
      }
    }).then(function (_ref) {
      var value = _ref.value;
      if (!value) return;
      settings.platformEnabled = value;
      setGlobalSettings(settings);
    });
  }
  function createEpicModule() {
    return {
      key: 'epic',
      enabled: function enabled() {
        return settings.platformEnabled.epic;
      },
      start: function () {
        var _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
          var loadTimes, catalogOfferSha256Hash, locale, observer, checkEpicGame, _checkEpicGame, getEpicOwnedGames, getSha256Hash, _getSha256Hash, getPagePlug, _getPagePlug, updateEpicAuth, _updateEpicAuth, updateEpicOwnedGames;
          return _regeneratorRuntime().wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  updateEpicOwnedGames = function _updateEpicOwnedGames() {
                    var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                    var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GM_getValue('ownedGames') || [];
                    var nextPageToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
                    console.log('[EGLC] updateEpicOwnedGames...');
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
                        url: "https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=".concat(locale).concat(nextPageToken ? "&nextPageToken=".concat(encodeURIComponent(nextPageToken)) : ''),
                        timeout: 30000,
                        nocache: true,
                        responseType: 'json',
                        onerror: reject,
                        ontimeout: reject,
                        onload: function onload(response) {
                          response.status === 200 ? resolve(response) : reject(response);
                        }
                      });
                    }).then(/*#__PURE__*/function () {
                      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(response) {
                        var _response$response, _response$response$or, _response$response2, _response$response2$p;
                        var ordersLength, orderedGames, _nextPageToken;
                        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                if (!/login/i.test(response.finalUrl)) {
                                  _context2.next = 3;
                                  break;
                                }
                                /*
                                const result = await updateEpicAuth(loop);
                                console.log('[EGLC] updateEpicAuthResult:', result);
                                if (result) {
                                  return updateEpicOwnedGames(loop, i, games, lastCreatedAt);
                                }
                                */
                                if (loop) {
                                  Swal.fire({
                                    title: '更新Epic凭证失败！',
                                    text: '请先登录',
                                    icon: 'error',
                                    showCancelButton: true,
                                    confirmButtonText: '登录',
                                    cancelButtonText: '取消'
                                  }).then(function (_ref4) {
                                    var value = _ref4.value;
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
                                  _context2.next = 27;
                                  break;
                                }
                                orderedGames = response.response.orders.map(function (e) {
                                  var _e$items;
                                  return (e === null || e === void 0 ? void 0 : (_e$items = e.items) === null || _e$items === void 0 ? void 0 : _e$items[0]) || null;
                                }).filter(function (e) {
                                  return e;
                                });
                                _context2.next = 8;
                                return Promise.all(orderedGames.map(/*#__PURE__*/function () {
                                  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(item) {
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
                                            console.log("[EGLC] pageSlug: ".concat(pageSlug));
                                            if (pageSlug) {
                                              games.push({
                                                namespace: item.namespace,
                                                offerId: item.offerId,
                                                pageSlug: pageSlug
                                              });
                                              GM_setValue('ownedGames', games);
                                            }
                                          case 7:
                                          case "end":
                                            return _context.stop();
                                        }
                                      }
                                    }, _callee);
                                  }));
                                  return function (_x5) {
                                    return _ref5.apply(this, arguments);
                                  };
                                }()));
                              case 8:
                                // const lastCreatedAt = new Date(response.response.orders[ordersLength - 1]?.createdAtMillis || null).toISOString();
                                _nextPageToken = response.response.nextPageToken;
                                if (!_nextPageToken) {
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
                                return updateEpicOwnedGames(loop, ++i, games, _nextPageToken);
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
                                console.log('[EGLC] updateEpicOwnedGames: Finish!');
                                return _context2.abrupt("return", true);
                              case 27:
                                if (!(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : (_response$response2$p = _response$response2.products) === null || _response$response2$p === void 0 ? void 0 : _response$response2$p.length) !== 0)) {
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
                      return function (_x4) {
                        return _ref3.apply(this, arguments);
                      };
                    }())["catch"](function (error) {
                      console.error(error);
                      return Swal.update({
                        icon: 'error',
                        title: 'Epic已拥有游戏数据更新失败',
                        text: '详情请查看控制台'
                      });
                    });
                  };
                  _updateEpicAuth = function _updateEpicAuth3() {
                    _updateEpicAuth = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(loop) {
                      var reputationResult, authenticateResult, refreshCsrfResult;
                      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
                        while (1) {
                          switch (_context11.prev = _context11.next) {
                            case 0:
                              console.log('[EGLC] updateEpicAuth...');
                              if (loop) {
                                Swal.fire({
                                  title: '正在更新Epic凭证...',
                                  icon: 'info'
                                });
                              }
                              _context11.next = 4;
                              return new Promise(function (resolve, reject) {
                                GM_xmlhttpRequest({
                                  method: 'GET',
                                  url: 'https://www.epicgames.com/id/api/reputation',
                                  headers: {
                                    accept: 'application/json, text/plain, */*',
                                    referer: 'https://www.epicgames.com/id/login',
                                    'sec-fetch-site': 'same-origin'
                                  },
                                  timeout: 30000,
                                  nocache: true,
                                  responseType: 'json',
                                  onerror: reject,
                                  ontimeout: reject,
                                  onload: function onload(response) {
                                    response.status === 200 ? resolve(response) : reject(response);
                                  }
                                });
                              }).then(/*#__PURE__*/function () {
                                var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(response) {
                                  return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                                    while (1) {
                                      switch (_context8.prev = _context8.next) {
                                        case 0:
                                          return _context8.abrupt("return", response.status === 200);
                                        case 1:
                                        case "end":
                                          return _context8.stop();
                                      }
                                    }
                                  }, _callee8);
                                }));
                                return function (_x9) {
                                  return _ref12.apply(this, arguments);
                                };
                              }())["catch"](function (error) {
                                console.error(error);
                                return false;
                              });
                            case 4:
                              reputationResult = _context11.sent;
                              if (reputationResult) {
                                _context11.next = 7;
                                break;
                              }
                              return _context11.abrupt("return", false);
                            case 7:
                              _context11.next = 9;
                              return new Promise(function (resolve, reject) {
                                GM_xmlhttpRequest({
                                  method: 'GET',
                                  url: 'https://www.epicgames.com/id/api/authenticate',
                                  headers: {
                                    accept: 'application/json, text/plain, */*',
                                    referer: 'https://www.epicgames.com/id/login',
                                    'x-epic-client-id': 'undefined',
                                    'x-epic-display-mode': 'web',
                                    'x-epic-duration': '700',
                                    'x-epic-event-action': 'null',
                                    'x-epic-event-category': 'null',
                                    'x-epic-platform': 'WEB',
                                    'x-epic-strategy-flags': '',
                                    'x-requested-with': 'XMLHttpRequest'
                                  },
                                  timeout: 30000,
                                  nocache: true,
                                  responseType: 'json',
                                  onerror: reject,
                                  ontimeout: reject,
                                  onload: function onload(response) {
                                    response.status === 200 ? resolve(response) : reject(response);
                                  }
                                });
                              }).then(/*#__PURE__*/function () {
                                var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(response) {
                                  return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                                    while (1) {
                                      switch (_context9.prev = _context9.next) {
                                        case 0:
                                          return _context9.abrupt("return", response.status === 200);
                                        case 1:
                                        case "end":
                                          return _context9.stop();
                                      }
                                    }
                                  }, _callee9);
                                }));
                                return function (_x10) {
                                  return _ref13.apply(this, arguments);
                                };
                              }())["catch"](function (error) {
                                console.error(error);
                                return false;
                              });
                            case 9:
                              authenticateResult = _context11.sent;
                              if (authenticateResult) {
                                _context11.next = 12;
                                break;
                              }
                              return _context11.abrupt("return", false);
                            case 12:
                              _context11.next = 14;
                              return new Promise(function (resolve, reject) {
                                GM_xmlhttpRequest({
                                  method: 'POST',
                                  url: 'https://www.epicgames.com/account/v2/refresh-csrf',
                                  headers: {
                                    accept: 'application/json, text/plain, */*',
                                    origin: 'https://www.epicgames.com',
                                    referer: 'https://www.epicgames.com/account/personal'
                                  },
                                  timeout: 30000,
                                  nocache: true,
                                  responseType: 'json',
                                  onerror: reject,
                                  ontimeout: reject,
                                  onload: function onload(response) {
                                    response.status === 200 ? resolve(response) : reject(response);
                                  }
                                });
                              }).then(/*#__PURE__*/function () {
                                var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(response) {
                                  var _response$response4;
                                  return _regeneratorRuntime().wrap(function _callee10$(_context10) {
                                    while (1) {
                                      switch (_context10.prev = _context10.next) {
                                        case 0:
                                          return _context10.abrupt("return", ((_response$response4 = response.response) === null || _response$response4 === void 0 ? void 0 : _response$response4.success) === true);
                                        case 1:
                                        case "end":
                                          return _context10.stop();
                                      }
                                    }
                                  }, _callee10);
                                }));
                                return function (_x11) {
                                  return _ref14.apply(this, arguments);
                                };
                              }())["catch"](function (error) {
                                console.error(error);
                                return false;
                              });
                            case 14:
                              refreshCsrfResult = _context11.sent;
                              if (refreshCsrfResult) {
                                _context11.next = 17;
                                break;
                              }
                              return _context11.abrupt("return", false);
                            case 17:
                              return _context11.abrupt("return", true);
                            case 18:
                            case "end":
                              return _context11.stop();
                          }
                        }
                      }, _callee11);
                    }));
                    return _updateEpicAuth.apply(this, arguments);
                  };
                  updateEpicAuth = function _updateEpicAuth2(_x3) {
                    return _updateEpicAuth.apply(this, arguments);
                  };
                  _getPagePlug = function _getPagePlug3() {
                    _getPagePlug = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(namespace, offerId) {
                      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              console.log('[EGLC] getPagePlug...');
                              if (!(catalogOfferSha256Hash === false)) {
                                _context7.next = 4;
                                break;
                              }
                              _context7.next = 4;
                              return getSha256Hash();
                            case 4:
                              if (catalogOfferSha256Hash) {
                                _context7.next = 7;
                                break;
                              }
                              console.log('[EGLC] No catalogOfferSha256Hash');
                              return _context7.abrupt("return", false);
                            case 7:
                              return _context7.abrupt("return", new Promise(function (resolve, reject) {
                                GM_xmlhttpRequest({
                                  method: 'GET',
                                  // eslint-disable-next-line max-len
                                  url: "https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22".concat(offerId, "%22,%22sandboxId%22:%22").concat(namespace, "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(catalogOfferSha256Hash, "%22%7D%7D"),
                                  timeout: 30000,
                                  fetch: true,
                                  headers: {
                                    accept: 'application/json, text/plain, */*'
                                  },
                                  responseType: 'json',
                                  onerror: reject,
                                  ontimeout: reject,
                                  onload: function onload(response) {
                                    response.status === 200 ? resolve(response) : reject(response);
                                  }
                                });
                              }).then(/*#__PURE__*/function () {
                                var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(response) {
                                  var _response$response3, _response$response3$d, _response$response3$d2;
                                  var _offerMappings$, _customAttributes$fin, _customAttributes$fin2, _response$response$da, offerMappings, urlSlug, customAttributes;
                                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                                    while (1) {
                                      switch (_context6.prev = _context6.next) {
                                        case 0:
                                          if (!((_response$response3 = response.response) !== null && _response$response3 !== void 0 && (_response$response3$d = _response$response3.data) !== null && _response$response3$d !== void 0 && (_response$response3$d2 = _response$response3$d.Catalog) !== null && _response$response3$d2 !== void 0 && _response$response3$d2.catalogOffer)) {
                                            _context6.next = 3;
                                            break;
                                          }
                                          _response$response$da = response.response.data.Catalog.catalogOffer, offerMappings = _response$response$da.offerMappings, urlSlug = _response$response$da.urlSlug, customAttributes = _response$response$da.customAttributes;
                                          return _context6.abrupt("return", _toConsumableArray(new Set([offerMappings === null || offerMappings === void 0 ? void 0 : (_offerMappings$ = offerMappings[0]) === null || _offerMappings$ === void 0 ? void 0 : _offerMappings$.pageSlug, urlSlug, customAttributes === null || customAttributes === void 0 ? void 0 : (_customAttributes$fin = customAttributes.find(function (e) {
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
                                return function (_x8) {
                                  return _ref11.apply(this, arguments);
                                };
                              }())["catch"](function (error) {
                                console.error(error);
                                return false;
                              }));
                            case 8:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      }, _callee7);
                    }));
                    return _getPagePlug.apply(this, arguments);
                  };
                  getPagePlug = function _getPagePlug2(_x, _x2) {
                    return _getPagePlug.apply(this, arguments);
                  };
                  _getSha256Hash = function _getSha256Hash3() {
                    _getSha256Hash = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
                      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              console.log('[EGLC] getSha256Hash...');
                              return _context5.abrupt("return", new Promise(function (resolve, reject) {
                                GM_xmlhttpRequest({
                                  method: 'GET',
                                  url: 'https://store.epicgames.com/zh-CN/p/grand-theft-auto-v',
                                  timeout: 30000,
                                  fetch: true,
                                  headers: {
                                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
                                  },
                                  onerror: reject,
                                  ontimeout: reject,
                                  onload: function onload(response) {
                                    response.status === 200 ? resolve(response) : reject(response);
                                  }
                                });
                              }).then(function (response) {
                                // [, accountId, wishlistSha256Hash] = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i) || [];
                                var _ref7 = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
                                var _ref8 = _slicedToArray(_ref7, 2);
                                catalogOfferSha256Hash = _ref8[1];
                                var _ref9 = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ['en-US'];
                                var _ref10 = _slicedToArray(_ref9, 2);
                                locale = _ref10[1];
                                console.log('[EGLC] ', JSON.stringify({
                                  /* accountId, wishlistSha256Hash, */catalogOfferSha256Hash: catalogOfferSha256Hash,
                                  locale: locale
                                }));
                              })["catch"](function (error) {
                                console.error(error);
                              }));
                            case 2:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      }, _callee5);
                    }));
                    return _getSha256Hash.apply(this, arguments);
                  };
                  getSha256Hash = function _getSha256Hash2() {
                    return _getSha256Hash.apply(this, arguments);
                  };
                  getEpicOwnedGames = function _getEpicOwnedGames() {
                    return GM_getValue('ownedGames') || [];
                  };
                  _checkEpicGame = function _checkEpicGame3() {
                    _checkEpicGame = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
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
                              epicLink.map(/*#__PURE__*/function () {
                                var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(i, e) {
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
                                return function (_x6, _x7) {
                                  return _ref6.apply(this, arguments);
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
                  };
                  checkEpicGame = function _checkEpicGame2() {
                    return _checkEpicGame.apply(this, arguments);
                  };
                  if (!GM_getValue('version')) {
                    GM_deleteValue('epicGamesLibrary');
                    GM_deleteValue('ownedGames');
                    GM_deleteValue('wishlist');
                    GM_setValue('version', '1.1');
                  }
                  loadTimes = 0;
                  catalogOfferSha256Hash = false; // let wishlistSha256Hash = false;
                  // let accountId = 0;
                  locale = 'en-US';
                  _context12.next = 16;
                  return getSha256Hash();
                case 16:
                  if (getEpicOwnedGames().length === 0) {
                    Swal.fire({
                      title: '游戏库检测脚本提醒',
                      icon: 'warning',
                      text: '没有检测到Epic已拥有游戏数据，是否立即获取？',
                      showCancelButton: true,
                      confirmButtonText: '获取',
                      cancelButtonText: '取消'
                    }).then(function (_ref2) {
                      var value = _ref2.value;
                      if (value) updateEpicOwnedGames();
                    });
                  } else {
                    checkEpicGame();
                  }
                  observer = new MutationObserver(function () {
                    checkEpicGame(false, true);
                  });
                  observer.observe(document.documentElement, {
                    attributes: false,
                    characterData: false,
                    childList: true,
                    subtree: true
                  });

                  /*
                  async function getSha256Hash() {
                    console.log('[EGLC] getSha256Hash...');
                    return new Promise((resolve, reject) => {
                      GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://store.epicgames.com/zh-CN/wishlist',
                        timeout: 30000,
                        nocache: true,
                        onerror: reject,
                        ontimeout: reject,
                        onload: (response) => {
                          response.status === 200 ? resolve(response) : reject(response);
                        }
                      });
                    }).then((response) => {
                      [, accountId, wishlistSha256Hash] = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i) || [];
                      [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
                      [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || [];
                      console.log('[EGLC] ', JSON.stringify({ accountId, wishlistSha256Hash, catalogOfferSha256Hash, locale }));
                    })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                  */

                  // eslint-disable-next-line no-unused-vars

                  /*
                  async function updateEpicWishlist() {
                    console.log('[EGLC] updateEpicWishlist...');
                    if (wishlistSha256Hash === false) {
                      await getSha256Hash();
                    }
                    if (accountId && wishlistSha256Hash) {
                      GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://store.epicgames.com/graphql?operationName=getWishlist&variables=%7B%22accountId%22:%22${accountId}%22%7D&
                        extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${wishlistSha256Hash}%22%7D%7D`, // eslint-disable-line
                        timeout: 30000,
                        nocache: true,
                        responseType: 'json',
                        onload: async (response) => {
                          if (response.status === 200 && response.response?.data?.Wishlist?.wishlistItems?.elements?.length) {
                            const wishlistGames = response.response.data.Wishlist.wishlistItems.elements;
                            const savedwishlistGames = GM_getValue('epicWishist') || [];
                            const wishlist = (await Promise.all(wishlistGames.map(async (item) => {
                              const gameCache = savedwishlistGames.find((game) => game.namespace === item.namespace && game.offerId === item.offerId);
                              if (gameCache) {
                                return gameCache;
                              }
                              const pageSlug = await getPagePlug(item.namespace, item.offerId);
                              if (pageSlug) {
                                return {
                                  namespace: item.namespace,
                                  offerId: item.offerId,
                                  pageSlug
                                };
                              }
                              return null;
                            }))).filter((e) => e);
                            GM_setValue('epicWishist', wishlist);
                          }
                        }
                      });
                    }
                  }
                  */

                  GM_registerMenuCommand('更新Epic已拥有游戏数据', updateEpicOwnedGames);
                  GM_addStyle("\n.epic-game-link-owned {\n  color:#ffffff !important;\n  background:#5c8a00 !important\n}\n.epic-game-link-wishlist {\n  color:#ffffff !important;\n  background:#007399 !important\n}");
                case 21:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12);
        }));
        function start() {
          return _start.apply(this, arguments);
        }
        return start;
      }()
    };
  }
  function createGogModule() {
    return {
      key: 'gog',
      enabled: function enabled() {
        return settings.platformEnabled.gog;
      },
      start: function start() {
        var loadTimes = 0;
        if (getGogGameLibrary().length === 0) {
          Swal.fire({
            title: '游戏库检测脚本提醒',
            icon: 'warning',
            text: '没有检测到gog游戏库数据，是否立即获取？',
            showCancelButton: true,
            confirmButtonText: '获取',
            cancelButtonText: '取消'
          }).then(function (_ref15) {
            var value = _ref15.value;
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
          var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var again = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          var gogGames = getGogGameLibrary();
          var gogLink = again ? $('a[href*="www.gog.com/"]:not(".gog-game-checked")') : $('a[href*="www.gog.com/"]:not(".gog-game-link-owned")');
          if (gogLink.length === 0) return;
          if (first) updateGogGameLibrary(false);
          gogLink.map(function (i, e) {
            var _href$match3, _href$match3$;
            var $this = $(e);
            $this.addClass('gog-game-checked');
            var href = $this.attr('href');
            if (!/\/$/.test(href)) href += '/';
            var gogGameLink = (_href$match3 = href.match(/https?:\/\/www\.gog\.com\/(?:[\w-]+\/)?game\/([^/?#]+)/i)) === null || _href$match3 === void 0 ? void 0 : (_href$match3$ = _href$match3[1]) === null || _href$match3$ === void 0 ? void 0 : _href$match3$.toLowerCase();
            if (gogGameLink && gogGames.some(function (game) {
              return game.toLowerCase() === gogGameLink;
            })) {
              $this.addClass('gog-game-link-owned');
            }
            return e;
          });
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
          }).then(/*#__PURE__*/function () {
            var _ref16 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(response) {
              var _response$response5, _response$response5$p, _response$response7, _response$response7$p;
              var _response$response6;
              return _regeneratorRuntime().wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      if (!/openlogin/i.test(response.finalUrl)) {
                        _context13.next = 5;
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
                        }).then(function (_ref17) {
                          var value = _ref17.value;
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
                      return _context13.abrupt("return", false);
                    case 5:
                      if (!((_response$response5 = response.response) !== null && _response$response5 !== void 0 && (_response$response5$p = _response$response5.products) !== null && _response$response5$p !== void 0 && _response$response5$p.length)) {
                        _context13.next = 21;
                        break;
                      }
                      games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.products.map(function (e) {
                        var _e$url, _e$url$split, _e$url2;
                        return (e === null || e === void 0 ? void 0 : e.slug) || (e === null || e === void 0 ? void 0 : (_e$url = e.url) === null || _e$url === void 0 ? void 0 : (_e$url$split = _e$url.split('/')) === null || _e$url$split === void 0 ? void 0 : _e$url$split[(e === null || e === void 0 ? void 0 : (_e$url2 = e.url) === null || _e$url2 === void 0 ? void 0 : _e$url2.split('/').length) - 1]);
                      }))); // eslint-disable-line
                      if (!(((_response$response6 = response.response) === null || _response$response6 === void 0 ? void 0 : _response$response6.totalPages) > i)) {
                        _context13.next = 13;
                        break;
                      }
                      _context13.next = 10;
                      return updateGogGameLibrary(loop, ++i, games);
                    case 10:
                      return _context13.abrupt("return", _context13.sent);
                    case 13:
                      if (!loop) {
                        _context13.next = 16;
                        break;
                      }
                      GM_setValue('gogGames', _toConsumableArray(new Set(games)).filter(function (e) {
                        return e;
                      }));
                      return _context13.abrupt("return", Swal.update({
                        icon: 'success',
                        title: 'gog游戏库数据更新完成',
                        text: ''
                      }));
                    case 16:
                      GM_setValue('gogGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))).filter(function (e) {
                        return e;
                      }));
                      checkGogGame(false);
                      return _context13.abrupt("return", true);
                    case 21:
                      if (!(((_response$response7 = response.response) === null || _response$response7 === void 0 ? void 0 : (_response$response7$p = _response$response7.products) === null || _response$response7$p === void 0 ? void 0 : _response$response7$p.length) !== 0)) {
                        _context13.next = 24;
                        break;
                      }
                      console.error(response);
                      return _context13.abrupt("return", Swal.update({
                        icon: 'error',
                        title: 'gog游戏库数据更新失败',
                        text: '详情请查看控制台'
                      }));
                    case 24:
                    case "end":
                      return _context13.stop();
                  }
                }
              }, _callee13);
            }));
            return function (_x12) {
              return _ref16.apply(this, arguments);
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
        GM_registerMenuCommand('更新gog游戏库', updateGogGameLibrary);
        GM_addStyle('.gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
      }
    };
  }
  function createItchModule() {
    return {
      key: 'itch',
      enabled: function enabled() {
        return settings.platformEnabled.itch;
      },
      start: function start() {
        var loadTimes = 0;
        if (getItchGameLibrary().length === 0) {
          Swal.fire({
            title: '游戏库检测脚本提醒',
            icon: 'warning',
            text: '没有检测到itch游戏库数据，是否立即获取？',
            showCancelButton: true,
            confirmButtonText: '获取',
            cancelButtonText: '取消'
          }).then(function (_ref18) {
            var value = _ref18.value;
            if (value) updateItchGameLibrary();
          });
        } else {
          checkItchGame();
        }
        var observer = new MutationObserver(function () {
          checkItchGame(false, true);
        });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });
        function checkItchGame() {
          var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var again = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          var itchGames = getItchGameLibrary();
          var itchLink = again ? $('a[href*=".itch.io/"]:not(".itch-io-game-checked")') : $('a[href*=".itch.io/"]:not(".itch-io-game-link-owned")');
          if (itchLink.length === 0) return;
          if (first) updateItchGameLibrary(false);
          itchLink.map(function (i, e) {
            var _href$match4;
            var $this = $(e);
            $this.addClass('itch-io-game-checked');
            var href = $this.attr('href');
            if (!/\/$/.test(href)) href += '/';
            var itchGameLink = (_href$match4 = href.match(/https?:\/\/(.*?\/.*?)\//i)) === null || _href$match4 === void 0 ? void 0 : _href$match4[1];
            if (itchGameLink && itchGames.includes(itchGameLink)) {
              $this.addClass('itch-io-game-link-owned');
            }
            return e;
          });
        }
        function getItchGameLibrary() {
          return GM_getValue('itchGames') || [];
        }
        function updateItchGameLibrary() {
          var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
          if (!loop && i !== 1) {
            GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
            checkItchGame(false);
            return;
          }
          return new Promise(function (resolve, reject) {
            if (loop) {
              Swal[i === 1 ? 'fire' : 'update']({
                title: '正在更新itch游戏库数据...',
                text: "\u7B2C ".concat(i, " \u9875"),
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'GET',
              url: "https://itch.io/my-purchases?page=".concat(i, "&format=json"),
              timeout: 15000,
              nocache: true,
              responseType: 'json',
              onerror: reject,
              ontimeout: reject,
              onload: function onload(response) {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(/*#__PURE__*/function () {
            var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(response) {
              var _response$response8, _response$response9;
              return _regeneratorRuntime().wrap(function _callee14$(_context14) {
                while (1) {
                  switch (_context14.prev = _context14.next) {
                    case 0:
                      if (!/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                        _context14.next = 5;
                        break;
                      }
                      if (loop) {
                        Swal.fire({
                          title: '获取itch游戏库数据失败！',
                          text: '请先登录',
                          icon: 'error',
                          showCancelButton: true,
                          confirmButtonText: '登录',
                          cancelButtonText: '取消'
                        }).then(function (_ref20) {
                          var value = _ref20.value;
                          if (value) GM_openInTab('https://itch.io/login', {
                            active: true,
                            insert: true,
                            setParent: true
                          });
                        });
                      } else {
                        $('body').overhang({
                          type: 'error',
                          message: 'itch.io登录凭证已过期，请重新登录<a href="https://itch.io/login" target="_blank">https://itch.io/login</a>',
                          html: true,
                          closeConfirm: true
                        });
                      }
                      return _context14.abrupt("return", false);
                    case 5:
                      if (!((_response$response8 = response.response) !== null && _response$response8 !== void 0 && _response$response8.num_items)) {
                        _context14.next = 21;
                        break;
                      }
                      // eslint-disable-line camelcase
                      games = [].concat(_toConsumableArray(games), _toConsumableArray($.makeArray($("<div>".concat(response.response.content, "</div>")).find('a.thumb_link.game_link')).map(function (e) {
                        var _$$attr$match;
                        return (_$$attr$match = $(e).attr('href') // eslint-disable-line
                        .match(/https?:\/\/(.*?\/.*?)\//i)) === null || _$$attr$match === void 0 ? void 0 : _$$attr$match[1];
                      })));
                      if (!(response.response.num_items === 50)) {
                        _context14.next = 13;
                        break;
                      }
                      _context14.next = 10;
                      return updateItchGameLibrary(loop, ++i, games);
                    case 10:
                      return _context14.abrupt("return", _context14.sent);
                    case 13:
                      if (!loop) {
                        _context14.next = 16;
                        break;
                      }
                      GM_setValue('itchGames', _toConsumableArray(new Set(games)));
                      return _context14.abrupt("return", Swal.update({
                        icon: 'success',
                        title: 'itch游戏库数据更新完成',
                        text: ''
                      }));
                    case 16:
                      GM_setValue('itchGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
                      checkItchGame(false);
                      return _context14.abrupt("return", true);
                    case 21:
                      if (!(((_response$response9 = response.response) === null || _response$response9 === void 0 ? void 0 : _response$response9.num_items) === 0)) {
                        _context14.next = 24;
                        break;
                      }
                      // eslint-disable-line camelcase
                      GM_setValue('itchGames', _toConsumableArray(new Set(games)));
                      return _context14.abrupt("return", Swal.update({
                        icon: 'success',
                        title: 'itch游戏库数据更新完成',
                        text: ''
                      }));
                    case 24:
                      console.error(response);
                      return _context14.abrupt("return", Swal.update({
                        icon: 'error',
                        title: 'itch游戏库数据更新失败',
                        text: '详情请查看控制台'
                      }));
                    case 26:
                    case "end":
                      return _context14.stop();
                  }
                }
              }, _callee14);
            }));
            return function (_x13) {
              return _ref19.apply(this, arguments);
            };
          }())["catch"](function (error) {
            console.error(error);
            return Swal.update({
              icon: 'error',
              title: 'itch游戏库数据更新失败',
              text: '详情请查看控制台'
            });
          });
        }
        GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary);
        GM_addStyle('.itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
        unsafeWindow.checkItchGame = checkItchGame;
      }
    };
  }
  function createCubeModule() {
    return {
      key: 'cube',
      enabled: function enabled() {
        return settings.platformEnabled.cube;
      },
      start: function start() {
        var loadTimes = 0;
        if (getCubeGameLibrary().length === 0) {
          Swal.fire({
            title: '游戏库检测脚本提醒',
            icon: 'warning',
            text: '没有检测到方块游戏库数据，是否立即获取？',
            showCancelButton: true,
            confirmButtonText: '获取',
            cancelButtonText: '取消'
          }).then(function (_ref21) {
            var value = _ref21.value;
            if (value) updateCubeGameLibrary();
          });
        } else {
          checkCubeGame();
        }
        var observer = new MutationObserver(function () {
          checkCubeGame(false, true);
        });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });
        function checkCubeGame() {
          var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var again = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          var cubeGames = getCubeGameLibrary();
          var cubeLink = again ? $('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]:not(".cube-game-checked")') : $('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]:not(".cube-game-link-owned")');
          if (cubeLink.length === 0) return;
          if (first) updateCubeGameLibrary(false);
          cubeLink.map(function (i, e) {
            var _href$match5;
            var $this = $(e);
            $this.addClass('cube-game-checked');
            var href = $this.attr('href');
            if (!/\/$/.test(href)) href += '/';
            var cubeGameId = (_href$match5 = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)) === null || _href$match5 === void 0 ? void 0 : _href$match5[1];
            if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
              $this.addClass('cube-game-link-owned');
            }
            return e;
          });
        }
        function getCubeGameLibrary() {
          return GM_getValue('cubeGames') || [];
        }
        function updateCubeGameLibrary() {
          var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
          if (!loop && i !== 1) {
            GM_setValue('cubeGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getCubeGameLibrary()), _toConsumableArray(games)))));
            checkCubeGame(false);
            return;
          }
          return new Promise(function (resolve, reject) {
            if (loop) {
              Swal[i === 1 ? 'fire' : 'update']({
                title: '正在更新方块游戏库数据...',
                text: "\u7B2C ".concat(i, " \u9875"),
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'POST',
              url: "https://account.cubejoy.com/Comment/MyGameReq?pageIndex=".concat(i, "&pageSize=24"),
              timeout: 15000,
              nocache: true,
              responseType: 'json',
              headers: {
                Accept: 'application/json, text/plain, */*',
                Host: 'account.cubejoy.com',
                Origin: 'https://account.cubejoy.com',
                Referer: 'https://account.cubejoy.com/Comment/MyGame'
              },
              onerror: reject,
              ontimeout: reject,
              onload: function onload(response) {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(/*#__PURE__*/function () {
            var _ref22 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(response) {
              var _response$response10, _response$response11, _response$response11$, _response$response11$2, _response$response13, _response$response13$, _response$response13$2;
              var _response$response12;
              return _regeneratorRuntime().wrap(function _callee15$(_context15) {
                while (1) {
                  switch (_context15.prev = _context15.next) {
                    case 0:
                      if (!(((_response$response10 = response.response) === null || _response$response10 === void 0 ? void 0 : _response$response10.resultCode) === 0)) {
                        _context15.next = 5;
                        break;
                      }
                      if (loop) {
                        Swal.fire({
                          title: '获取方块游戏库数据失败！',
                          text: '请先登录',
                          icon: 'error',
                          showCancelButton: true,
                          confirmButtonText: '登录',
                          cancelButtonText: '取消'
                        }).then(function (_ref23) {
                          var value = _ref23.value;
                          if (value) GM_openInTab('https://account.cubejoy.com/html/login.html', {
                            active: true,
                            insert: true,
                            setParent: true
                          });
                        });
                      } else {
                        $('body').overhang({
                          type: 'error',
                          message: '方块登录凭证已过期，请重新登录<a href="https://account.cubejoy.com/html/login.html" target="_blank">https://account.cubejoy.com/html/login.html</a>',
                          html: true,
                          closeConfirm: true
                        });
                      }
                      return _context15.abrupt("return", false);
                    case 5:
                      if (!((_response$response11 = response.response) !== null && _response$response11 !== void 0 && (_response$response11$ = _response$response11.result) !== null && _response$response11$ !== void 0 && (_response$response11$2 = _response$response11$.list) !== null && _response$response11$2 !== void 0 && _response$response11$2.length)) {
                        _context15.next = 21;
                        break;
                      }
                      games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.result.list.map(function (e) {
                        return e.S_Id;
                      }))); // eslint-disable-line
                      if (!(((_response$response12 = response.response) === null || _response$response12 === void 0 ? void 0 : _response$response12.result.total) > i * 24)) {
                        _context15.next = 13;
                        break;
                      }
                      _context15.next = 10;
                      return updateCubeGameLibrary(loop, ++i, games);
                    case 10:
                      return _context15.abrupt("return", _context15.sent);
                    case 13:
                      if (!loop) {
                        _context15.next = 16;
                        break;
                      }
                      GM_setValue('cubeGames', _toConsumableArray(new Set(games)).filter(function (e) {
                        return e;
                      }));
                      return _context15.abrupt("return", Swal.update({
                        icon: 'success',
                        title: 'cube游戏库数据更新完成',
                        text: ''
                      }));
                    case 16:
                      GM_setValue('cubeGames', _toConsumableArray(new Set([].concat(_toConsumableArray(getCubeGameLibrary()), _toConsumableArray(games)))).filter(function (e) {
                        return e;
                      }));
                      checkCubeGame(false);
                      return _context15.abrupt("return", true);
                    case 21:
                      if (!(((_response$response13 = response.response) === null || _response$response13 === void 0 ? void 0 : (_response$response13$ = _response$response13.result) === null || _response$response13$ === void 0 ? void 0 : (_response$response13$2 = _response$response13$.list) === null || _response$response13$2 === void 0 ? void 0 : _response$response13$2.length) !== 0)) {
                        _context15.next = 24;
                        break;
                      }
                      console.error(response);
                      return _context15.abrupt("return", Swal.update({
                        icon: 'error',
                        title: '方块游戏库数据更新失败',
                        text: '详情请查看控制台'
                      }));
                    case 24:
                    case "end":
                      return _context15.stop();
                  }
                }
              }, _callee15);
            }));
            return function (_x14) {
              return _ref22.apply(this, arguments);
            };
          }())["catch"](function (error) {
            console.error(error);
            return Swal.update({
              icon: 'error',
              title: '方块游戏库数据更新失败',
              text: '详情请查看控制台'
            });
          });
        }
        GM_registerMenuCommand('更新cube游戏库', updateCubeGameLibrary);
        GM_addStyle('.cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
      }
    };
  }
  function addWhiteList() {
    var whiteList = settings.whiteList || [];
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref24) {
      var value = _ref24.value;
      if (value !== undefined) {
        settings.whiteList = value ? value.split('\n') : [];
        settings.blackList = settings.blackList || [];
        setGlobalSettings(settings);
      }
    });
  }
  function addBlackList() {
    var blackList = settings.blackList || [];
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(function (_ref25) {
      var value = _ref25.value;
      if (value !== undefined) {
        settings.blackList = value ? value.split('\n') : [];
        settings.whiteList = settings.whiteList || [];
        setGlobalSettings(settings);
      }
    });
  }
  function setting() {
    Swal.fire({
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '白名单网站',
      denyButtonText: '黑名单网站',
      cancelButtonText: '关闭'
    }).then(function (_ref26) {
      var isConfirmed = _ref26.isConfirmed,
        isDenied = _ref26.isDenied;
      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }
  var settings = getGlobalSettings();
  GM_registerMenuCommand('设置', setting);
  GM_registerMenuCommand('平台开关', openPlatformSwitchDialog);
  GM_addStyle(GM_getResourceText('overhang'));
  if (!isUrlEnabledByList(window.location.href, settings)) return;
  var modules = [createEpicModule(), createGogModule(), createItchModule(), createCubeModule()];
  modules.forEach(function (module) {
    if (module.enabled()) module.start();
  });
})();