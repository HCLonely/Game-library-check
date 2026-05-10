function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
// @require        https://greasyfork.org/scripts/426803-gistsync/code/gistSync.js?version=957824
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_cookie
// @grant          unsafeWindow
// @connect        store.epicgames.com
// @connect        www.epicgames.com
// @connect        accounts.epicgames.com
// @connect        www.gog.com
// @connect        itch.io
// @connect        account.cubejoy.com
// @connect        indiegala.com
// @connect        api.github.com
// @connect        cdn.jsdelivr.net
// @run-at         document-end
// @noframes
// ==/UserScript==
(function () {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = function __commonJS(cb, mod) {
    return function __require() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
        exports: {}
      }).exports, mod), mod.exports;
    };
  };

  // src/ui/dialog.js
  var require_dialog = __commonJS({
    "src/ui/dialog.js": function srcUiDialogJs(exports, module) {
      function createModalRoot() {
        var root = document.getElementById("glc-modal-root");
        if (root) return root;
        root = document.createElement("div");
        root.id = "glc-modal-root";
        document.body.appendChild(root);
        return root;
      }
      function showDialog(_ref) {
        var title = _ref.title,
          bodyHtml = _ref.bodyHtml,
          _ref$trustedBodyHtml = _ref.trustedBodyHtml,
          trustedBodyHtml = _ref$trustedBodyHtml === void 0 ? false : _ref$trustedBodyHtml,
          _ref$bodyText = _ref.bodyText,
          bodyText = _ref$bodyText === void 0 ? "" : _ref$bodyText,
          bodyNode = _ref.bodyNode,
          _ref$confirmText = _ref.confirmText,
          confirmText = _ref$confirmText === void 0 ? "确定" : _ref$confirmText,
          _ref$cancelText = _ref.cancelText,
          cancelText = _ref$cancelText === void 0 ? "取消" : _ref$cancelText,
          onConfirm = _ref.onConfirm,
          onCancel = _ref.onCancel,
          denyText = _ref.denyText,
          onDeny = _ref.onDeny,
          _ref$hideCancel = _ref.hideCancel,
          hideCancel = _ref$hideCancel === void 0 ? false : _ref$hideCancel;
        var root = createModalRoot();
        root.innerHTML = "\n    <div class=\"glc-mask\">\n      <div class=\"glc-dialog\" role=\"dialog\" aria-modal=\"true\">\n        <h3 class=\"glc-dialog-title\"></h3>\n        <div class=\"glc-dialog-body\"></div>\n        <div class=\"glc-dialog-actions\">\n          <button type=\"button\" data-glc-cancel></button>\n          <button type=\"button\" data-glc-deny></button>\n          <button type=\"button\" data-glc-confirm></button>\n        </div>\n      </div>\n    </div>";
        var titleEl = root.querySelector(".glc-dialog-title");
        var bodyEl = root.querySelector(".glc-dialog-body");
        var cancelBtn = root.querySelector("[data-glc-cancel]");
        var denyBtn = root.querySelector("[data-glc-deny]");
        var confirmBtn = root.querySelector("[data-glc-confirm]");
        if (titleEl) titleEl.textContent = title || "";
        if (bodyEl) {
          bodyEl.textContent = "";
          if (bodyNode instanceof Node) {
            bodyEl.replaceChildren(bodyNode);
          } else if (trustedBodyHtml && typeof bodyHtml === "string") {
            bodyEl.innerHTML = bodyHtml;
          } else {
            bodyEl.textContent = bodyText || "";
          }
        }
        if (cancelBtn) {
          cancelBtn.textContent = cancelText;
          cancelBtn.style.display = hideCancel ? "none" : "";
        }
        if (denyBtn) {
          denyBtn.textContent = denyText || "";
          denyBtn.style.display = denyText ? "" : "none";
        }
        if (confirmBtn) confirmBtn.textContent = confirmText;
        var close = function close() {
          root.innerHTML = "";
        };
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener("click", function () {
          if (typeof onCancel === "function") onCancel(root);
          close();
        });
        denyBtn === null || denyBtn === void 0 ? void 0 : denyBtn.addEventListener("click", function () {
          if (typeof onDeny === "function") onDeny(root);
          close();
        });
        confirmBtn === null || confirmBtn === void 0 ? void 0 : confirmBtn.addEventListener("click", function () {
          if (typeof onConfirm === "function") onConfirm(root);
          close();
        });
      }
      module.exports = {
        createModalRoot: createModalRoot,
        showDialog: showDialog
      };
    }
  });

  // src/ui/toast.js
  var require_toast = __commonJS({
    "src/ui/toast.js": function srcUiToastJs(exports, module) {
      function createToastContainer() {
        var container = document.getElementById("glc-toast-container");
        if (container) return container;
        container = document.createElement("div");
        container.id = "glc-toast-container";
        document.body.appendChild(container);
        return container;
      }
      function showToast(message) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
        var el = document.createElement("div");
        el.className = "glc-toast glc-toast-".concat(type);
        el.textContent = message;
        createToastContainer().appendChild(el);
        window.setTimeout(function () {
          return el.remove();
        }, 4e3);
      }
      module.exports = {
        createToastContainer: createToastContainer,
        showToast: showToast
      };
    }
  });

  // src/ui/progress.js
  var require_progress = __commonJS({
    "src/ui/progress.js": function srcUiProgressJs(exports, module) {
      function createProgressController(createModalRoot) {
        var progressPanelStateMap = {};
        function showProgressPanel(stateMap) {
          var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$replace = _ref2.replace,
            replace = _ref2$replace === void 0 ? false : _ref2$replace;
          if (replace) {
            progressPanelStateMap = _objectSpread({}, stateMap || {});
          } else {
            progressPanelStateMap = _objectSpread(_objectSpread({}, progressPanelStateMap), stateMap || {});
          }
          var root = createModalRoot();
          root.innerHTML = "\n      <div class=\"glc-mask\">\n        <div class=\"glc-dialog glc-progress-dialog\" role=\"dialog\" aria-modal=\"true\">\n          <h3 class=\"glc-dialog-title\"></h3>\n          <ul class=\"glc-progress-list\"></ul>\n        </div>\n      </div>";
          var titleEl = root.querySelector(".glc-dialog-title");
          var listEl = root.querySelector(".glc-progress-list");
          if (titleEl) titleEl.textContent = "正在更新缓存";
          if (listEl) {
            Object.entries(progressPanelStateMap).forEach(function (_ref3) {
              var _ref4 = _slicedToArray(_ref3, 2),
                platform = _ref4[0],
                state = _ref4[1];
              var li = document.createElement("li");
              var platformEl = document.createElement("span");
              platformEl.className = "glc-progress-platform";
              platformEl.textContent = String(platform).toUpperCase();
              var stateEl = document.createElement("span");
              stateEl.className = "glc-progress-state";
              stateEl.textContent = String(state);
              li.appendChild(platformEl);
              li.appendChild(stateEl);
              listEl.appendChild(li);
            });
          }
        }
        function clearProgressPanel() {
          progressPanelStateMap = {};
          var root = createModalRoot();
          if (root.querySelector(".glc-progress-dialog")) root.innerHTML = "";
        }
        return {
          showProgressPanel: showProgressPanel,
          clearProgressPanel: clearProgressPanel
        };
      }
      module.exports = {
        createProgressController: createProgressController
      };
    }
  });

  // src/core/settings.js
  var require_settings = __commonJS({
    "src/core/settings.js": function srcCoreSettingsJs(exports, module) {
      var SETTINGS_KEY = "globalSettings";
      function getGlobalSettings() {
        var defaults = {
          whiteList: GM_getValue("whiteList") || [],
          blackList: GM_getValue("blackList") || [],
          platformEnabled: {
            epic: true,
            gog: true,
            itch: true,
            cube: true,
            ig: true
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
      function createSettingsController(_ref5) {
        var showDialog = _ref5.showDialog;
        var settings = getGlobalSettings();
        function openPlatformSwitchDialog() {
          var current = settings.platformEnabled;
          var bodyNode = document.createElement("div");
          [["glc-epic", "Epic", current.epic], ["glc-gog", "GOG", current.gog], ["glc-itch", "Itch", current.itch], ["glc-cube", "Cube", current.cube], ["glc-ig", "IG", current.ig]].forEach(function (_ref6, index) {
            var _ref7 = _slicedToArray(_ref6, 3),
              id = _ref7[0],
              labelText = _ref7[1],
              checked = _ref7[2];
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.type = "checkbox";
            input.id = id;
            input.checked = Boolean(checked);
            label.appendChild(input);
            label.appendChild(document.createTextNode(" ".concat(labelText)));
            bodyNode.appendChild(label);
            if (index < 4) bodyNode.appendChild(document.createElement("br"));
          });
          showDialog({
            title: "平台开关",
            bodyNode: bodyNode,
            confirmText: "保存",
            cancelText: "取消",
            onConfirm: function onConfirm(root) {
              settings.platformEnabled = {
                epic: root.querySelector("#glc-epic").checked,
                gog: root.querySelector("#glc-gog").checked,
                itch: root.querySelector("#glc-itch").checked,
                cube: root.querySelector("#glc-cube").checked,
                ig: root.querySelector("#glc-ig").checked
              };
              setGlobalSettings(settings);
            }
          });
        }
        function showListEditor(title, initialValue, onSave) {
          var bodyNode = document.createElement("textarea");
          bodyNode.className = "glc-textarea";
          bodyNode.value = initialValue.join("\n");
          showDialog({
            title: title,
            bodyNode: bodyNode,
            confirmText: "保存",
            cancelText: "取消",
            onConfirm: function onConfirm(root) {
              var _root$querySelector;
              var value = ((_root$querySelector = root.querySelector(".glc-textarea")) === null || _root$querySelector === void 0 ? void 0 : _root$querySelector.value) || "";
              onSave(value ? value.split("\n") : []);
            }
          });
        }
        function addWhiteList() {
          showListEditor("添加白名单网站", settings.whiteList || [], function (value) {
            settings.whiteList = value;
            settings.blackList = settings.blackList || [];
            setGlobalSettings(settings);
          });
        }
        function addBlackList() {
          showListEditor("添加黑名单网站", settings.blackList || [], function (value) {
            settings.blackList = value;
            settings.whiteList = settings.whiteList || [];
            setGlobalSettings(settings);
          });
        }
        function setting() {
          var _document$getElementB, _document$getElementB2;
          var bodyNode = document.createElement("div");
          var whiteButton = document.createElement("button");
          var blackButton = document.createElement("button");
          whiteButton.type = "button";
          whiteButton.id = "glc-open-whitelist";
          whiteButton.textContent = "白名单网站";
          blackButton.type = "button";
          blackButton.id = "glc-open-blacklist";
          blackButton.textContent = "黑名单网站";
          bodyNode.appendChild(whiteButton);
          bodyNode.appendChild(blackButton);
          showDialog({
            title: "设置",
            bodyNode: bodyNode,
            confirmText: "关闭",
            hideCancel: true
          });
          (_document$getElementB = document.getElementById("glc-open-whitelist")) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.addEventListener("click", addWhiteList);
          (_document$getElementB2 = document.getElementById("glc-open-blacklist")) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.addEventListener("click", addBlackList);
        }
        return {
          settings: settings,
          setting: setting,
          openPlatformSwitchDialog: openPlatformSwitchDialog,
          isUrlEnabled: function isUrlEnabled(url) {
            return isUrlEnabledByList(url, settings);
          }
        };
      }
      module.exports = {
        getGlobalSettings: getGlobalSettings,
        setGlobalSettings: setGlobalSettings,
        isUrlEnabledByList: isUrlEnabledByList,
        createSettingsController: createSettingsController
      };
    }
  });

  // src/core/startup.js
  var require_startup = __commonJS({
    "src/core/startup.js": function srcCoreStartupJs(exports, module) {
      function createStartupFlow(_ref8) {
        var showDialog = _ref8.showDialog,
          showProgressPanel = _ref8.showProgressPanel,
          clearProgressPanel = _ref8.clearProgressPanel,
          showToast = _ref8.showToast,
          showLoginExpiredDialog = _ref8.showLoginExpiredDialog,
          updateStatus = _ref8.updateStatus;
        var inBatchUpdateFlow = false;
        function collectEmptyCaches(enabledModules) {
          return enabledModules.filter(function (module2) {
            return module2.isCacheEmpty();
          }).map(function (module2) {
            return module2.key;
          });
        }
        function showEmptyCacheAggregationDialog(emptyKeys, _onConfirm, _onCancel) {
          var bodyNode = document.createElement("div");
          emptyKeys.forEach(function (key, index) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.type = "checkbox";
            input.dataset.platform = key;
            input.checked = true;
            label.appendChild(input);
            label.appendChild(document.createTextNode(" ".concat(key.toUpperCase())));
            bodyNode.appendChild(label);
            if (index < emptyKeys.length - 1) bodyNode.appendChild(document.createElement("br"));
          });
          showDialog({
            title: "检测到缓存为空的平台",
            bodyNode: bodyNode,
            confirmText: "立即更新",
            cancelText: "稍后再说",
            onConfirm: function onConfirm(root) {
              var selected = Array.from(root.querySelectorAll("input[data-platform]:checked")).map(function (el) {
                return el.getAttribute("data-platform");
              });
              _onConfirm(selected);
            },
            onCancel: function onCancel() {
              if (typeof _onCancel === "function") _onCancel();
            }
          });
        }
        function batchUpdateSelectedModules(_x, _x2) {
          return _batchUpdateSelectedModules.apply(this, arguments);
        }
        function _batchUpdateSelectedModules() {
          _batchUpdateSelectedModules = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(enabledModules, selectedKeys) {
            var state, interruptedByAuthExpired, _iterator, _step, _loop, _ret;
            return _regeneratorRuntime().wrap(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    state = Object.fromEntries(selectedKeys.map(function (key) {
                      return [key, "waiting"];
                    }));
                    interruptedByAuthExpired = false;
                    inBatchUpdateFlow = true;
                    showProgressPanel(state, {
                      replace: true
                    });
                    _context2.prev = 4;
                    _iterator = _createForOfIteratorHelper(selectedKeys);
                    _context2.prev = 6;
                    _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                      var key, module2, updateResult;
                      return _regeneratorRuntime().wrap(function _loop$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              key = _step.value;
                              module2 = enabledModules.find(function (item) {
                                return item.key === key;
                              });
                              if (module2) {
                                _context.next = 4;
                                break;
                              }
                              return _context.abrupt("return", "continue");
                            case 4:
                              state[key] = "running";
                              showProgressPanel(_defineProperty({}, key, state[key]));
                              _context.prev = 6;
                              _context.next = 9;
                              return module2.updateLibrary();
                            case 9:
                              updateResult = _context.sent;
                              if (!(updateResult === true)) {
                                _context.next = 14;
                                break;
                              }
                              state[key] = "success";
                              _context.next = 24;
                              break;
                            case 14:
                              if (!((updateResult === null || updateResult === void 0 ? void 0 : updateResult.status) === updateStatus.AUTH_EXPIRED)) {
                                _context.next = 22;
                                break;
                              }
                              interruptedByAuthExpired = true;
                              state[key] = updateStatus.AUTH_EXPIRED;
                              clearProgressPanel();
                              showLoginExpiredDialog(updateResult.platformName, updateResult.loginUrl);
                              return _context.abrupt("return", "break");
                            case 22:
                              state[key] = "error";
                              showToast("".concat(key.toUpperCase(), " \u66F4\u65B0\u5931\u8D25"), "error");
                            case 24:
                              _context.next = 31;
                              break;
                            case 26:
                              _context.prev = 26;
                              _context.t0 = _context["catch"](6);
                              console.error(_context.t0);
                              state[key] = "error";
                              showToast("".concat(key.toUpperCase(), " \u66F4\u65B0\u5931\u8D25"), "error");
                            case 31:
                              if (!interruptedByAuthExpired) showProgressPanel(_defineProperty({}, key, state[key]));
                            case 32:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _loop, null, [[6, 26]]);
                    });
                    _iterator.s();
                  case 9:
                    if ((_step = _iterator.n()).done) {
                      _context2.next = 18;
                      break;
                    }
                    return _context2.delegateYield(_loop(), "t0", 11);
                  case 11:
                    _ret = _context2.t0;
                    if (!(_ret === "continue")) {
                      _context2.next = 14;
                      break;
                    }
                    return _context2.abrupt("continue", 16);
                  case 14:
                    if (!(_ret === "break")) {
                      _context2.next = 16;
                      break;
                    }
                    return _context2.abrupt("break", 18);
                  case 16:
                    _context2.next = 9;
                    break;
                  case 18:
                    _context2.next = 23;
                    break;
                  case 20:
                    _context2.prev = 20;
                    _context2.t1 = _context2["catch"](6);
                    _iterator.e(_context2.t1);
                  case 23:
                    _context2.prev = 23;
                    _iterator.f();
                    return _context2.finish(23);
                  case 26:
                    _context2.prev = 26;
                    inBatchUpdateFlow = false;
                    return _context2.finish(26);
                  case 29:
                    if (!interruptedByAuthExpired) clearProgressPanel();
                  case 30:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee, null, [[4,, 26, 29], [6, 20, 23, 26]]);
          }));
          return _batchUpdateSelectedModules.apply(this, arguments);
        }
        function runInitialFlow(_x3) {
          return _runInitialFlow.apply(this, arguments);
        }
        function _runInitialFlow() {
          _runInitialFlow = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(modules) {
            var enabledModules, emptyKeys;
            return _regeneratorRuntime().wrap(function _callee3$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    enabledModules = modules.filter(function (module2) {
                      return module2.enabled();
                    });
                    emptyKeys = collectEmptyCaches(enabledModules);
                    if (!(emptyKeys.length > 0)) {
                      _context4.next = 5;
                      break;
                    }
                    showEmptyCacheAggregationDialog(emptyKeys, /*#__PURE__*/function () {
                      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(selectedKeys) {
                        return _regeneratorRuntime().wrap(function _callee2$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                if (!(selectedKeys.length > 0)) {
                                  _context3.next = 3;
                                  break;
                                }
                                _context3.next = 3;
                                return batchUpdateSelectedModules(enabledModules, selectedKeys);
                              case 3:
                                enabledModules.forEach(function (module2) {
                                  return module2.start();
                                });
                              case 4:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, _callee2);
                      }));
                      return function (_x4) {
                        return _ref9.apply(this, arguments);
                      };
                    }(), function () {
                      enabledModules.forEach(function (module2) {
                        return module2.start();
                      });
                    });
                    return _context4.abrupt("return");
                  case 5:
                    enabledModules.forEach(function (module2) {
                      return module2.start();
                    });
                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee3);
          }));
          return _runInitialFlow.apply(this, arguments);
        }
        function showUpdateStep(platform, text) {
          showProgressPanel(_defineProperty({}, platform, text));
        }
        function showUpdateResult(title, type) {
          if (!inBatchUpdateFlow) clearProgressPanel();
          showToast(title, type);
          return Promise.resolve(true);
        }
        return {
          collectEmptyCaches: collectEmptyCaches,
          showEmptyCacheAggregationDialog: showEmptyCacheAggregationDialog,
          batchUpdateSelectedModules: batchUpdateSelectedModules,
          runInitialFlow: runInitialFlow,
          showUpdateStep: showUpdateStep,
          showUpdateResult: showUpdateResult
        };
      }
      module.exports = {
        createStartupFlow: createStartupFlow
      };
    }
  });

  // src/shared/constants.js
  var require_constants = __commonJS({
    "src/shared/constants.js": function srcSharedConstantsJs(exports, module) {
      var UPDATE_STATUS = {
        SUCCESS: "success",
        ERROR: "error",
        AUTH_EXPIRED: "auth_expired"
      };
      var BASE_STYLE = "\n.glc-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center}\n.glc-dialog{background:#fff;color:#111;padding:16px;border-radius:10px;min-width:340px;max-width:560px;font-size:14px;box-shadow:0 20px 45px rgba(0,0,0,.24)}\n.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.4}\n.glc-dialog-body{line-height:1.6}\n.glc-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}\n.glc-dialog-actions button{border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#111;padding:6px 12px;cursor:pointer}\n.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff}\n.glc-textarea{width:100%;min-height:160px;box-sizing:border-box}\n#glc-toast-container{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none}\n.glc-toast{background:#1f2937;color:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,.2);pointer-events:auto;max-width:420px;word-break:break-word}\n.glc-toast-error{background:#b91c1c}\n.glc-toast-success{background:#15803d}\n.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}\n.glc-progress-list li{display:flex;justify-content:space-between;gap:16px}\n.glc-progress-platform{font-weight:700}\n";
      module.exports = {
        UPDATE_STATUS: UPDATE_STATUS,
        BASE_STYLE: BASE_STYLE
      };
    }
  });

  // src/platforms/epic.js
  var require_epic = __commonJS({
    "src/platforms/epic.js": function srcPlatformsEpicJs(exports, module) {
      function createEpicModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showLoginExpiredDialog = context.showLoginExpiredDialog,
          UPDATE_STATUS = context.UPDATE_STATUS;
        var _updateLibrary;
        var started = false;
        var moduleApi = {
          key: "epic",
          enabled: function enabled() {
            return settings.platformEnabled.epic;
          },
          isCacheEmpty: function isCacheEmpty() {
            return (GM_getValue("ownedGames") || []).length === 0;
          },
          updateLibrary: function () {
            var _updateLibrary2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
              return _regeneratorRuntime().wrap(function _callee4$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      if (_updateLibrary) {
                        _context5.next = 3;
                        break;
                      }
                      _context5.next = 3;
                      return moduleApi.start();
                    case 3:
                      return _context5.abrupt("return", _updateLibrary());
                    case 4:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee4);
            }));
            function updateLibrary() {
              return _updateLibrary2.apply(this, arguments);
            }
            return updateLibrary;
          }(),
          start: function () {
            var _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
              var loadTimes, catalogOfferSha256Hash, locale, observer, checkEpicGame, _checkEpicGame, getEpicOwnedGames, getSha256Hash, _getSha256Hash, getPagePlug, _getPagePlug, updateEpicAuth, _updateEpicAuth, updateEpicOwnedGames;
              return _regeneratorRuntime().wrap(function _callee17$(_context18) {
                while (1) {
                  switch (_context18.prev = _context18.next) {
                    case 0:
                      updateEpicOwnedGames = function _updateEpicOwnedGames() {
                        var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                        var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GM_getValue("ownedGames") || [];
                        var nextPageToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
                        console.log("[EGLC] updateEpicOwnedGames...");
                        if (!loop && i !== 0) {
                          GM_setValue("ownedGames", games);
                          checkEpicGame(false);
                          return;
                        }
                        return new Promise(function (resolve, reject) {
                          if (loop) {
                            showUpdateStep("epic", "\u7B2C ".concat(i + 1, " \u9875"));
                          }
                          GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=".concat(locale).concat(nextPageToken ? "&nextPageToken=".concat(encodeURIComponent(nextPageToken)) : ""),
                            timeout: 3e4,
                            nocache: true,
                            responseType: "json",
                            onerror: reject,
                            ontimeout: reject,
                            onload: function onload(response) {
                              response.status === 200 ? resolve(response) : reject(response);
                            }
                          });
                        }).then(/*#__PURE__*/function () {
                          var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(response) {
                            var _response$response, _response$response$or, _response$response2, _response$response2$p;
                            var ordersLength, orderedGames, nextPageToken2;
                            return _regeneratorRuntime().wrap(function _callee6$(_context7) {
                              while (1) {
                                switch (_context7.prev = _context7.next) {
                                  case 0:
                                    if (!/login/i.test(response.finalUrl)) {
                                      _context7.next = 2;
                                      break;
                                    }
                                    return _context7.abrupt("return", {
                                      status: UPDATE_STATUS.AUTH_EXPIRED,
                                      platformName: "Epic",
                                      loginUrl: "https://www.epicgames.com/id/login"
                                    });
                                  case 2:
                                    ordersLength = ((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$or = _response$response.orders) === null || _response$response$or === void 0 ? void 0 : _response$response$or.length) || 0;
                                    if (!(ordersLength >= 0)) {
                                      _context7.next = 28;
                                      break;
                                    }
                                    orderedGames = response.response.orders.map(function (e) {
                                      var _e$items;
                                      return (e === null || e === void 0 ? void 0 : (_e$items = e.items) === null || _e$items === void 0 ? void 0 : _e$items[0]) || null;
                                    }).filter(function (e) {
                                      return e;
                                    });
                                    _context7.next = 7;
                                    return Promise.all(orderedGames.map(/*#__PURE__*/function () {
                                      var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(item) {
                                        var pageSlug;
                                        return _regeneratorRuntime().wrap(function _callee5$(_context6) {
                                          while (1) {
                                            switch (_context6.prev = _context6.next) {
                                              case 0:
                                                if (!games.find(function (game) {
                                                  return game.namespace === item.namespace && game.offerId === item.offerId;
                                                })) {
                                                  _context6.next = 2;
                                                  break;
                                                }
                                                return _context6.abrupt("return", true);
                                              case 2:
                                                _context6.next = 4;
                                                return getPagePlug(item.namespace, item.offerId);
                                              case 4:
                                                pageSlug = _context6.sent;
                                                console.log("[EGLC] pageSlug: ".concat(pageSlug));
                                                if (pageSlug) {
                                                  games.push({
                                                    namespace: item.namespace,
                                                    offerId: item.offerId,
                                                    pageSlug: pageSlug
                                                  });
                                                  GM_setValue("ownedGames", games);
                                                }
                                                return _context6.abrupt("return", true);
                                              case 8:
                                              case "end":
                                                return _context6.stop();
                                            }
                                          }
                                        }, _callee5);
                                      }));
                                      return function (_x9) {
                                        return _ref11.apply(this, arguments);
                                      };
                                    }()));
                                  case 7:
                                    nextPageToken2 = response.response.nextPageToken;
                                    if (!nextPageToken2) {
                                      _context7.next = 17;
                                      break;
                                    }
                                    if (!loop) {
                                      _context7.next = 12;
                                      break;
                                    }
                                    _context7.next = 12;
                                    return new Promise(function (resolve) {
                                      setTimeout(function () {
                                        resolve(true);
                                      }, 1e3);
                                    });
                                  case 12:
                                    _context7.next = 14;
                                    return updateEpicOwnedGames(loop, ++i, games, nextPageToken2);
                                  case 14:
                                    return _context7.abrupt("return", _context7.sent);
                                  case 17:
                                    if (!loop) {
                                      _context7.next = 22;
                                      break;
                                    }
                                    GM_setValue("ownedGames", games);
                                    _context7.next = 21;
                                    return showUpdateResult("Epic已拥有游戏数据更新完成", "success");
                                  case 21:
                                    return _context7.abrupt("return", true);
                                  case 22:
                                    GM_setValue("ownedGames", games);
                                    checkEpicGame(false);
                                    console.log("[EGLC] updateEpicOwnedGames: Finish!");
                                    return _context7.abrupt("return", true);
                                  case 28:
                                    if (!(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : (_response$response2$p = _response$response2.products) === null || _response$response2$p === void 0 ? void 0 : _response$response2$p.length) !== 0)) {
                                      _context7.next = 33;
                                      break;
                                    }
                                    console.error(response);
                                    _context7.next = 32;
                                    return showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                                  case 32:
                                    return _context7.abrupt("return", false);
                                  case 33:
                                    return _context7.abrupt("return", false);
                                  case 34:
                                  case "end":
                                    return _context7.stop();
                                }
                              }
                            }, _callee6);
                          }));
                          return function (_x8) {
                            return _ref10.apply(this, arguments);
                          };
                        }())["catch"](/*#__PURE__*/function () {
                          var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(error) {
                            return _regeneratorRuntime().wrap(function _callee7$(_context8) {
                              while (1) {
                                switch (_context8.prev = _context8.next) {
                                  case 0:
                                    console.error(error);
                                    _context8.next = 3;
                                    return showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                                  case 3:
                                    return _context8.abrupt("return", false);
                                  case 4:
                                  case "end":
                                    return _context8.stop();
                                }
                              }
                            }, _callee7);
                          }));
                          return function (_x10) {
                            return _ref12.apply(this, arguments);
                          };
                        }());
                      };
                      _updateEpicAuth = function _updateEpicAuth3() {
                        _updateEpicAuth = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(loop) {
                          var reputationResult, authenticateResult, refreshCsrfResult;
                          return _regeneratorRuntime().wrap(function _callee16$(_context17) {
                            while (1) {
                              switch (_context17.prev = _context17.next) {
                                case 0:
                                  console.log("[EGLC] updateEpicAuth...");
                                  if (loop) {
                                    context.showToast("正在更新Epic凭证...", "info");
                                  }
                                  _context17.next = 4;
                                  return new Promise(function (resolve, reject) {
                                    GM_xmlhttpRequest({
                                      method: "GET",
                                      url: "https://www.epicgames.com/id/api/reputation",
                                      headers: {
                                        accept: "application/json, text/plain, */*",
                                        referer: "https://www.epicgames.com/id/login",
                                        "sec-fetch-site": "same-origin"
                                      },
                                      timeout: 3e4,
                                      nocache: true,
                                      responseType: "json",
                                      onerror: reject,
                                      ontimeout: reject,
                                      onload: function onload(response) {
                                        response.status === 200 ? resolve(response) : reject(response);
                                      }
                                    });
                                  }).then(/*#__PURE__*/function () {
                                    var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(response) {
                                      return _regeneratorRuntime().wrap(function _callee13$(_context14) {
                                        while (1) {
                                          switch (_context14.prev = _context14.next) {
                                            case 0:
                                              return _context14.abrupt("return", response.status === 200);
                                            case 1:
                                            case "end":
                                              return _context14.stop();
                                          }
                                        }
                                      }, _callee13);
                                    }));
                                    return function (_x12) {
                                      return _ref19.apply(this, arguments);
                                    };
                                  }())["catch"](function (error) {
                                    console.error(error);
                                    return false;
                                  });
                                case 4:
                                  reputationResult = _context17.sent;
                                  if (reputationResult) {
                                    _context17.next = 7;
                                    break;
                                  }
                                  return _context17.abrupt("return", false);
                                case 7:
                                  _context17.next = 9;
                                  return new Promise(function (resolve, reject) {
                                    GM_xmlhttpRequest({
                                      method: "GET",
                                      url: "https://www.epicgames.com/id/api/authenticate",
                                      headers: {
                                        accept: "application/json, text/plain, */*",
                                        referer: "https://www.epicgames.com/id/login",
                                        "x-epic-client-id": "undefined",
                                        "x-epic-display-mode": "web",
                                        "x-epic-duration": "700",
                                        "x-epic-event-action": "null",
                                        "x-epic-event-category": "null",
                                        "x-epic-platform": "WEB",
                                        "x-epic-strategy-flags": "",
                                        "x-requested-with": "XMLHttpRequest"
                                      },
                                      timeout: 3e4,
                                      nocache: true,
                                      responseType: "json",
                                      onerror: reject,
                                      ontimeout: reject,
                                      onload: function onload(response) {
                                        response.status === 200 ? resolve(response) : reject(response);
                                      }
                                    });
                                  }).then(/*#__PURE__*/function () {
                                    var _ref20 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(response) {
                                      return _regeneratorRuntime().wrap(function _callee14$(_context15) {
                                        while (1) {
                                          switch (_context15.prev = _context15.next) {
                                            case 0:
                                              return _context15.abrupt("return", response.status === 200);
                                            case 1:
                                            case "end":
                                              return _context15.stop();
                                          }
                                        }
                                      }, _callee14);
                                    }));
                                    return function (_x13) {
                                      return _ref20.apply(this, arguments);
                                    };
                                  }())["catch"](function (error) {
                                    console.error(error);
                                    return false;
                                  });
                                case 9:
                                  authenticateResult = _context17.sent;
                                  if (authenticateResult) {
                                    _context17.next = 12;
                                    break;
                                  }
                                  return _context17.abrupt("return", false);
                                case 12:
                                  _context17.next = 14;
                                  return new Promise(function (resolve, reject) {
                                    GM_xmlhttpRequest({
                                      method: "POST",
                                      url: "https://www.epicgames.com/account/v2/refresh-csrf",
                                      headers: {
                                        accept: "application/json, text/plain, */*",
                                        origin: "https://www.epicgames.com",
                                        referer: "https://www.epicgames.com/account/personal"
                                      },
                                      timeout: 3e4,
                                      nocache: true,
                                      responseType: "json",
                                      onerror: reject,
                                      ontimeout: reject,
                                      onload: function onload(response) {
                                        response.status === 200 ? resolve(response) : reject(response);
                                      }
                                    });
                                  }).then(/*#__PURE__*/function () {
                                    var _ref21 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(response) {
                                      var _response$response4;
                                      return _regeneratorRuntime().wrap(function _callee15$(_context16) {
                                        while (1) {
                                          switch (_context16.prev = _context16.next) {
                                            case 0:
                                              return _context16.abrupt("return", ((_response$response4 = response.response) === null || _response$response4 === void 0 ? void 0 : _response$response4.success) === true);
                                            case 1:
                                            case "end":
                                              return _context16.stop();
                                          }
                                        }
                                      }, _callee15);
                                    }));
                                    return function (_x14) {
                                      return _ref21.apply(this, arguments);
                                    };
                                  }())["catch"](function (error) {
                                    console.error(error);
                                    return false;
                                  });
                                case 14:
                                  refreshCsrfResult = _context17.sent;
                                  if (refreshCsrfResult) {
                                    _context17.next = 17;
                                    break;
                                  }
                                  return _context17.abrupt("return", false);
                                case 17:
                                  return _context17.abrupt("return", true);
                                case 18:
                                case "end":
                                  return _context17.stop();
                              }
                            }
                          }, _callee16);
                        }));
                        return _updateEpicAuth.apply(this, arguments);
                      };
                      updateEpicAuth = function _updateEpicAuth2(_x7) {
                        return _updateEpicAuth.apply(this, arguments);
                      };
                      _getPagePlug = function _getPagePlug3() {
                        _getPagePlug = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(namespace, offerId) {
                          return _regeneratorRuntime().wrap(function _callee12$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  console.log("[EGLC] getPagePlug...");
                                  if (!(catalogOfferSha256Hash === false)) {
                                    _context13.next = 4;
                                    break;
                                  }
                                  _context13.next = 4;
                                  return getSha256Hash();
                                case 4:
                                  if (catalogOfferSha256Hash) {
                                    _context13.next = 7;
                                    break;
                                  }
                                  console.log("[EGLC] No catalogOfferSha256Hash");
                                  return _context13.abrupt("return", false);
                                case 7:
                                  return _context13.abrupt("return", new Promise(function (resolve, reject) {
                                    GM_xmlhttpRequest({
                                      method: "GET",
                                      url: "https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22".concat(offerId, "%22,%22sandboxId%22:%22").concat(namespace, "%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22").concat(catalogOfferSha256Hash, "%22%7D%7D"),
                                      timeout: 3e4,
                                      fetch: true,
                                      headers: {
                                        accept: "application/json, text/plain, */*"
                                      },
                                      responseType: "json",
                                      onerror: reject,
                                      ontimeout: reject,
                                      onload: function onload(response) {
                                        response.status === 200 ? resolve(response) : reject(response);
                                      }
                                    });
                                  }).then(/*#__PURE__*/function () {
                                    var _ref18 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(response) {
                                      var _response$response3, _response$response3$d, _response$response3$d2;
                                      var _offerMappings$, _customAttributes$fin, _customAttributes$fin2, _response$response$da, offerMappings, urlSlug, customAttributes;
                                      return _regeneratorRuntime().wrap(function _callee11$(_context12) {
                                        while (1) {
                                          switch (_context12.prev = _context12.next) {
                                            case 0:
                                              if (!((_response$response3 = response.response) !== null && _response$response3 !== void 0 && (_response$response3$d = _response$response3.data) !== null && _response$response3$d !== void 0 && (_response$response3$d2 = _response$response3$d.Catalog) !== null && _response$response3$d2 !== void 0 && _response$response3$d2.catalogOffer)) {
                                                _context12.next = 3;
                                                break;
                                              }
                                              _response$response$da = response.response.data.Catalog.catalogOffer, offerMappings = _response$response$da.offerMappings, urlSlug = _response$response$da.urlSlug, customAttributes = _response$response$da.customAttributes;
                                              return _context12.abrupt("return", _toConsumableArray(new Set([offerMappings === null || offerMappings === void 0 ? void 0 : (_offerMappings$ = offerMappings[0]) === null || _offerMappings$ === void 0 ? void 0 : _offerMappings$.pageSlug, urlSlug, customAttributes === null || customAttributes === void 0 ? void 0 : (_customAttributes$fin = customAttributes.find(function (e) {
                                                return e.key === "com.epicgames.app.productSlug";
                                              })) === null || _customAttributes$fin === void 0 ? void 0 : (_customAttributes$fin2 = _customAttributes$fin.value) === null || _customAttributes$fin2 === void 0 ? void 0 : _customAttributes$fin2.replace(/\/home$/, "")].filter(function (e) {
                                                return e;
                                              }))));
                                            case 3:
                                              return _context12.abrupt("return", false);
                                            case 4:
                                            case "end":
                                              return _context12.stop();
                                          }
                                        }
                                      }, _callee11);
                                    }));
                                    return function (_x11) {
                                      return _ref18.apply(this, arguments);
                                    };
                                  }())["catch"](function (error) {
                                    console.error(error);
                                    return false;
                                  }));
                                case 8:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee12);
                        }));
                        return _getPagePlug.apply(this, arguments);
                      };
                      getPagePlug = function _getPagePlug2(_x5, _x6) {
                        return _getPagePlug.apply(this, arguments);
                      };
                      _getSha256Hash = function _getSha256Hash3() {
                        _getSha256Hash = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
                          return _regeneratorRuntime().wrap(function _callee10$(_context11) {
                            while (1) {
                              switch (_context11.prev = _context11.next) {
                                case 0:
                                  console.log("[EGLC] getSha256Hash...");
                                  return _context11.abrupt("return", new Promise(function (resolve, reject) {
                                    GM_xmlhttpRequest({
                                      method: "GET",
                                      url: "https://store.epicgames.com/zh-CN/p/grand-theft-auto-v",
                                      timeout: 3e4,
                                      fetch: true,
                                      headers: {
                                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
                                      },
                                      onerror: reject,
                                      ontimeout: reject,
                                      onload: function onload(response) {
                                        response.status === 200 ? resolve(response) : reject(response);
                                      }
                                    });
                                  }).then(function (response) {
                                    var _ref14 = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
                                    var _ref15 = _slicedToArray(_ref14, 2);
                                    catalogOfferSha256Hash = _ref15[1];
                                    var _ref16 = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ["en-US"];
                                    var _ref17 = _slicedToArray(_ref16, 2);
                                    locale = _ref17[1];
                                    console.log("[EGLC] ", JSON.stringify({
                                      catalogOfferSha256Hash: catalogOfferSha256Hash,
                                      locale: locale
                                    }));
                                  })["catch"](function (error) {
                                    console.error(error);
                                  }));
                                case 2:
                                case "end":
                                  return _context11.stop();
                              }
                            }
                          }, _callee10);
                        }));
                        return _getSha256Hash.apply(this, arguments);
                      };
                      getSha256Hash = function _getSha256Hash2() {
                        return _getSha256Hash.apply(this, arguments);
                      };
                      getEpicOwnedGames = function _getEpicOwnedGames() {
                        return GM_getValue("ownedGames") || [];
                      };
                      _checkEpicGame = function _checkEpicGame3() {
                        _checkEpicGame = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
                          var first,
                            again,
                            ownedGames,
                            wishlistGames,
                            excludedClass,
                            epicLink,
                            _args10 = arguments;
                          return _regeneratorRuntime().wrap(function _callee9$(_context10) {
                            while (1) {
                              switch (_context10.prev = _context10.next) {
                                case 0:
                                  first = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : true;
                                  again = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : false;
                                  loadTimes++;
                                  if (!(loadTimes > 1e3)) {
                                    _context10.next = 6;
                                    break;
                                  }
                                  observer.disconnect();
                                  return _context10.abrupt("return");
                                case 6:
                                  ownedGames = getEpicOwnedGames();
                                  wishlistGames = GM_getValue("epicWishist") || [];
                                  excludedClass = again ? "epic-game-checked" : "epic-game-link-owned";
                                  epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]').filter(function (el) {
                                    return !el.classList.contains(excludedClass);
                                  });
                                  if (!(epicLink.length === 0)) {
                                    _context10.next = 12;
                                    break;
                                  }
                                  return _context10.abrupt("return");
                                case 12:
                                  if (first) updateEpicOwnedGames(false);
                                  epicLink.forEach(function (el) {
                                    var _href$match, _href$match$, _href$match2, _href$match2$;
                                    addClass(el, "epic-game-checked");
                                    var href = getHref(el);
                                    if (!/\/$/.test(href)) href += "/";
                                    var epicGameName = ((_href$match = href.match(/https?:\/\/www\.epicgames\.com\/store\/.*?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match === void 0 ? void 0 : (_href$match$ = _href$match[2]) === null || _href$match$ === void 0 ? void 0 : _href$match$.toLowerCase()) || ((_href$match2 = href.match(/https?:\/\/store\.epicgames\.com\/.*?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match2 === void 0 ? void 0 : (_href$match2$ = _href$match2[2]) === null || _href$match2$ === void 0 ? void 0 : _href$match2$.toLowerCase());
                                    if (epicGameName) {
                                      if (ownedGames.find(function (game) {
                                        return game.pageSlug.includes(epicGameName);
                                      })) {
                                        addClass(el, "epic-game-link-owned");
                                      } else if (wishlistGames.find(function (game) {
                                        return game.pageSlug.includes(epicGameName);
                                      })) {
                                        addClass(el, "epic-game-link-wishlist");
                                      }
                                    }
                                  });
                                case 14:
                                case "end":
                                  return _context10.stop();
                              }
                            }
                          }, _callee9);
                        }));
                        return _checkEpicGame.apply(this, arguments);
                      };
                      checkEpicGame = function _checkEpicGame2() {
                        return _checkEpicGame.apply(this, arguments);
                      };
                      if (!started) {
                        _context18.next = 12;
                        break;
                      }
                      return _context18.abrupt("return");
                    case 12:
                      started = true;
                      if (!GM_getValue("version")) {
                        GM_deleteValue("epicGamesLibrary");
                        GM_deleteValue("ownedGames");
                        GM_deleteValue("wishlist");
                        GM_setValue("version", "1.1");
                      }
                      loadTimes = 0;
                      catalogOfferSha256Hash = false;
                      locale = "en-US";
                      _context18.next = 19;
                      return getSha256Hash();
                    case 19:
                      checkEpicGame();
                      observer = new MutationObserver(function () {
                        checkEpicGame(false, true);
                      });
                      observer.observe(document.documentElement, {
                        attributes: false,
                        characterData: false,
                        childList: true,
                        subtree: true
                      });
                      _updateLibrary = updateEpicOwnedGames;
                      GM_registerMenuCommand("更新Epic已拥有游戏数据", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
                        var result;
                        return _regeneratorRuntime().wrap(function _callee8$(_context9) {
                          while (1) {
                            switch (_context9.prev = _context9.next) {
                              case 0:
                                _context9.next = 2;
                                return updateEpicOwnedGames();
                              case 2:
                                result = _context9.sent;
                                if ((result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                                  showLoginExpiredDialog(result.platformName, result.loginUrl);
                                }
                              case 4:
                              case "end":
                                return _context9.stop();
                            }
                          }
                        }, _callee8);
                      })));
                      GM_addStyle("\n.epic-game-link-owned {\n  color:#ffffff !important;\n  background:#5c8a00 !important\n}\n.epic-game-link-wishlist {\n  color:#ffffff !important;\n  background:#007399 !important\n}");
                      void updateEpicAuth;
                    case 26:
                    case "end":
                      return _context18.stop();
                  }
                }
              }, _callee17);
            }));
            function start() {
              return _start.apply(this, arguments);
            }
            return start;
          }()
        };
        return moduleApi;
      }
      module.exports = {
        createEpicModule: createEpicModule
      };
    }
  });

  // src/platforms/gog.js
  var require_gog = __commonJS({
    "src/platforms/gog.js": function srcPlatformsGogJs(exports, module) {
      function createGogModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showLoginExpiredDialog = context.showLoginExpiredDialog,
          UPDATE_STATUS = context.UPDATE_STATUS;
        var _updateLibrary3;
        var started = false;
        var moduleApi = {
          key: "gog",
          enabled: function enabled() {
            return settings.platformEnabled.gog;
          },
          isCacheEmpty: function isCacheEmpty() {
            return (GM_getValue("gogGames") || []).length === 0;
          },
          updateLibrary: function updateLibrary() {
            if (!_updateLibrary3) moduleApi.start();
            return _updateLibrary3();
          },
          start: function start() {
            if (started) return;
            started = true;
            var loadTimes = 0;
            checkGogGame();
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
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              var gogGames = getGogGameLibrary();
              var excludedClass = again ? "gog-game-checked" : "gog-game-link-owned";
              var gogLink = queryLinks('a[href*="www.gog.com/"]').filter(function (el) {
                return !el.classList.contains(excludedClass);
              });
              if (gogLink.length === 0) return;
              if (first) updateGogGameLibrary(false);
              gogLink.forEach(function (el) {
                var _href$match3, _href$match3$;
                addClass(el, "gog-game-checked");
                var href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                var gogGameLink = (_href$match3 = href.match(/https?:\/\/www\.gog\.com\/(?:[\w-]+\/)?game\/([^/?#]+)/i)) === null || _href$match3 === void 0 ? void 0 : (_href$match3$ = _href$match3[1]) === null || _href$match3$ === void 0 ? void 0 : _href$match3$.toLowerCase();
                if (gogGameLink && gogGames.some(function (game) {
                  return game.toLowerCase() === gogGameLink;
                })) {
                  addClass(el, "gog-game-link-owned");
                }
              });
            }
            function getGogGameLibrary() {
              return GM_getValue("gogGames") || [];
            }
            function updateGogGameLibrary() {
              var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
              var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
              var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
              if (!loop && i !== 1) {
                GM_setValue("gogGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))));
                checkGogGame(false);
                return;
              }
              return new Promise(function (resolve, reject) {
                if (loop) {
                  showUpdateStep("gog", "\u7B2C ".concat(i, " \u9875"));
                }
                GM_xmlhttpRequest({
                  method: "GET",
                  url: "https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=".concat(i, "&sortBy=date_purchased"),
                  timeout: 15e3,
                  nocache: true,
                  responseType: "json",
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(/*#__PURE__*/function () {
                var _ref22 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(response) {
                  var _response$response5, _response$response5$p, _response$response7, _response$response7$p;
                  var _response$response6;
                  return _regeneratorRuntime().wrap(function _callee18$(_context19) {
                    while (1) {
                      switch (_context19.prev = _context19.next) {
                        case 0:
                          if (!/openlogin/i.test(response.finalUrl)) {
                            _context19.next = 4;
                            break;
                          }
                          return _context19.abrupt("return", {
                            status: UPDATE_STATUS.AUTH_EXPIRED,
                            platformName: "GOG",
                            loginUrl: "https://www.gog.com/#openlogin"
                          });
                        case 4:
                          if (!((_response$response5 = response.response) !== null && _response$response5 !== void 0 && (_response$response5$p = _response$response5.products) !== null && _response$response5$p !== void 0 && _response$response5$p.length)) {
                            _context19.next = 22;
                            break;
                          }
                          games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.products.map(function (e) {
                            var _e$url, _e$url$split, _e$url2;
                            return (e === null || e === void 0 ? void 0 : e.slug) || (e === null || e === void 0 ? void 0 : (_e$url = e.url) === null || _e$url === void 0 ? void 0 : (_e$url$split = _e$url.split("/")) === null || _e$url$split === void 0 ? void 0 : _e$url$split[(e === null || e === void 0 ? void 0 : (_e$url2 = e.url) === null || _e$url2 === void 0 ? void 0 : _e$url2.split("/").length) - 1]);
                          })));
                          if (!(((_response$response6 = response.response) === null || _response$response6 === void 0 ? void 0 : _response$response6.totalPages) > i)) {
                            _context19.next = 12;
                            break;
                          }
                          _context19.next = 9;
                          return updateGogGameLibrary(loop, ++i, games);
                        case 9:
                          return _context19.abrupt("return", _context19.sent);
                        case 12:
                          if (!loop) {
                            _context19.next = 17;
                            break;
                          }
                          GM_setValue("gogGames", _toConsumableArray(new Set(games)).filter(function (e) {
                            return e;
                          }));
                          _context19.next = 16;
                          return showUpdateResult("gog游戏库数据更新完成", "success");
                        case 16:
                          return _context19.abrupt("return", true);
                        case 17:
                          GM_setValue("gogGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))).filter(function (e) {
                            return e;
                          }));
                          checkGogGame(false);
                          return _context19.abrupt("return", true);
                        case 22:
                          if (!(((_response$response7 = response.response) === null || _response$response7 === void 0 ? void 0 : (_response$response7$p = _response$response7.products) === null || _response$response7$p === void 0 ? void 0 : _response$response7$p.length) !== 0)) {
                            _context19.next = 27;
                            break;
                          }
                          console.error(response);
                          _context19.next = 26;
                          return showUpdateResult("gog游戏库数据更新失败", "error");
                        case 26:
                          return _context19.abrupt("return", false);
                        case 27:
                          return _context19.abrupt("return", false);
                        case 28:
                        case "end":
                          return _context19.stop();
                      }
                    }
                  }, _callee18);
                }));
                return function (_x15) {
                  return _ref22.apply(this, arguments);
                };
              }())["catch"](/*#__PURE__*/function () {
                var _ref23 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(error) {
                  return _regeneratorRuntime().wrap(function _callee19$(_context20) {
                    while (1) {
                      switch (_context20.prev = _context20.next) {
                        case 0:
                          console.error(error);
                          _context20.next = 3;
                          return showUpdateResult("gog游戏库数据更新失败", "error");
                        case 3:
                          return _context20.abrupt("return", false);
                        case 4:
                        case "end":
                          return _context20.stop();
                      }
                    }
                  }, _callee19);
                }));
                return function (_x16) {
                  return _ref23.apply(this, arguments);
                };
              }());
            }
            _updateLibrary3 = updateGogGameLibrary;
            GM_registerMenuCommand("更新gog游戏库", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
              var result;
              return _regeneratorRuntime().wrap(function _callee20$(_context21) {
                while (1) {
                  switch (_context21.prev = _context21.next) {
                    case 0:
                      _context21.next = 2;
                      return updateGogGameLibrary();
                    case 2:
                      result = _context21.sent;
                      if ((result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                        showLoginExpiredDialog(result.platformName, result.loginUrl);
                      }
                    case 4:
                    case "end":
                      return _context21.stop();
                  }
                }
              }, _callee20);
            })));
            GM_addStyle(".gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
          }
        };
        return moduleApi;
      }
      module.exports = {
        createGogModule: createGogModule
      };
    }
  });

  // src/platforms/itch.js
  var require_itch = __commonJS({
    "src/platforms/itch.js": function srcPlatformsItchJs(exports, module) {
      function createItchModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          parseHtml = context.parseHtml,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showLoginExpiredDialog = context.showLoginExpiredDialog,
          UPDATE_STATUS = context.UPDATE_STATUS;
        var _updateLibrary4;
        var started = false;
        var moduleApi = {
          key: "itch",
          enabled: function enabled() {
            return settings.platformEnabled.itch;
          },
          isCacheEmpty: function isCacheEmpty() {
            return (GM_getValue("itchGames") || []).length === 0;
          },
          updateLibrary: function updateLibrary() {
            if (!_updateLibrary4) moduleApi.start();
            return _updateLibrary4();
          },
          start: function start() {
            if (started) return;
            started = true;
            var loadTimes = 0;
            checkItchGame();
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
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              var itchGames = getItchGameLibrary();
              var excludedClass = again ? "itch-io-game-checked" : "itch-io-game-link-owned";
              var itchLink = queryLinks('a[href*=".itch.io/"]').filter(function (el) {
                return !el.classList.contains(excludedClass);
              });
              if (itchLink.length === 0) return;
              if (first) updateItchGameLibrary(false);
              itchLink.forEach(function (el) {
                var _href$match4;
                addClass(el, "itch-io-game-checked");
                var href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                var itchGameLink = (_href$match4 = href.match(/https?:\/\/(.*?\/.*?)\//i)) === null || _href$match4 === void 0 ? void 0 : _href$match4[1];
                if (itchGameLink && itchGames.includes(itchGameLink)) {
                  addClass(el, "itch-io-game-link-owned");
                }
              });
            }
            function getItchGameLibrary() {
              return GM_getValue("itchGames") || [];
            }
            function updateItchGameLibrary() {
              var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
              var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
              var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
              if (!loop && i !== 1) {
                GM_setValue("itchGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
                checkItchGame(false);
                return;
              }
              return new Promise(function (resolve, reject) {
                if (loop) {
                  showUpdateStep("itch", "\u7B2C ".concat(i, " \u9875"));
                }
                GM_xmlhttpRequest({
                  method: "GET",
                  url: "https://itch.io/my-purchases?page=".concat(i, "&format=json"),
                  timeout: 15e3,
                  nocache: true,
                  responseType: "json",
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(/*#__PURE__*/function () {
                var _ref25 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21(response) {
                  var _response$response8, _response$response9;
                  var itchDoc, purchaseLinks;
                  return _regeneratorRuntime().wrap(function _callee21$(_context22) {
                    while (1) {
                      switch (_context22.prev = _context22.next) {
                        case 0:
                          if (!/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                            _context22.next = 4;
                            break;
                          }
                          return _context22.abrupt("return", {
                            status: UPDATE_STATUS.AUTH_EXPIRED,
                            platformName: "itch.io",
                            loginUrl: "https://itch.io/login"
                          });
                        case 4:
                          if (!((_response$response8 = response.response) !== null && _response$response8 !== void 0 && _response$response8.num_items)) {
                            _context22.next = 24;
                            break;
                          }
                          itchDoc = parseHtml("<div>".concat(response.response.content, "</div>"));
                          purchaseLinks = Array.from(itchDoc.querySelectorAll("a.thumb_link.game_link"));
                          games = [].concat(_toConsumableArray(games), _toConsumableArray(purchaseLinks.map(function (el) {
                            var _getHref$match;
                            return (_getHref$match = getHref(el).match(/https?:\/\/(.*?\/.*?)\//i)) === null || _getHref$match === void 0 ? void 0 : _getHref$match[1];
                          })));
                          if (!(response.response.num_items === 50)) {
                            _context22.next = 14;
                            break;
                          }
                          _context22.next = 11;
                          return updateItchGameLibrary(loop, ++i, games);
                        case 11:
                          return _context22.abrupt("return", _context22.sent);
                        case 14:
                          if (!loop) {
                            _context22.next = 19;
                            break;
                          }
                          GM_setValue("itchGames", _toConsumableArray(new Set(games)));
                          _context22.next = 18;
                          return showUpdateResult("itch游戏库数据更新完成", "success");
                        case 18:
                          return _context22.abrupt("return", true);
                        case 19:
                          GM_setValue("itchGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
                          checkItchGame(false);
                          return _context22.abrupt("return", true);
                        case 24:
                          if (!(((_response$response9 = response.response) === null || _response$response9 === void 0 ? void 0 : _response$response9.num_items) === 0)) {
                            _context22.next = 29;
                            break;
                          }
                          GM_setValue("itchGames", _toConsumableArray(new Set(games)));
                          _context22.next = 28;
                          return showUpdateResult("itch游戏库数据更新完成", "success");
                        case 28:
                          return _context22.abrupt("return", true);
                        case 29:
                          console.error(response);
                          _context22.next = 32;
                          return showUpdateResult("itch游戏库数据更新失败", "error");
                        case 32:
                          return _context22.abrupt("return", false);
                        case 33:
                        case "end":
                          return _context22.stop();
                      }
                    }
                  }, _callee21);
                }));
                return function (_x17) {
                  return _ref25.apply(this, arguments);
                };
              }())["catch"](/*#__PURE__*/function () {
                var _ref26 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22(error) {
                  return _regeneratorRuntime().wrap(function _callee22$(_context23) {
                    while (1) {
                      switch (_context23.prev = _context23.next) {
                        case 0:
                          console.error(error);
                          _context23.next = 3;
                          return showUpdateResult("itch游戏库数据更新失败", "error");
                        case 3:
                          return _context23.abrupt("return", false);
                        case 4:
                        case "end":
                          return _context23.stop();
                      }
                    }
                  }, _callee22);
                }));
                return function (_x18) {
                  return _ref26.apply(this, arguments);
                };
              }());
            }
            _updateLibrary4 = updateItchGameLibrary;
            GM_registerMenuCommand("更新itch游戏库", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
              var result;
              return _regeneratorRuntime().wrap(function _callee23$(_context24) {
                while (1) {
                  switch (_context24.prev = _context24.next) {
                    case 0:
                      _context24.next = 2;
                      return updateItchGameLibrary();
                    case 2:
                      result = _context24.sent;
                      if ((result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                        showLoginExpiredDialog(result.platformName, result.loginUrl);
                      }
                    case 4:
                    case "end":
                      return _context24.stop();
                  }
                }
              }, _callee23);
            })));
            GM_addStyle(".itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
            unsafeWindow.checkItchGame = checkItchGame;
          }
        };
        return moduleApi;
      }
      module.exports = {
        createItchModule: createItchModule
      };
    }
  });

  // src/platforms/cube.js
  var require_cube = __commonJS({
    "src/platforms/cube.js": function srcPlatformsCubeJs(exports, module) {
      function createCubeModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showLoginExpiredDialog = context.showLoginExpiredDialog,
          UPDATE_STATUS = context.UPDATE_STATUS;
        var _updateLibrary5;
        var started = false;
        var moduleApi = {
          key: "cube",
          enabled: function enabled() {
            return settings.platformEnabled.cube;
          },
          isCacheEmpty: function isCacheEmpty() {
            return (GM_getValue("cubeGames") || []).length === 0;
          },
          updateLibrary: function updateLibrary() {
            if (!_updateLibrary5) moduleApi.start();
            return _updateLibrary5();
          },
          start: function start() {
            if (started) return;
            started = true;
            var loadTimes = 0;
            checkCubeGame();
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
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              var cubeGames = getCubeGameLibrary();
              var excludedClass = again ? "cube-game-checked" : "cube-game-link-owned";
              var cubeLink = queryLinks('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]').filter(function (el) {
                return !el.classList.contains(excludedClass);
              });
              if (cubeLink.length === 0) return;
              if (first) updateCubeGameLibrary(false);
              cubeLink.forEach(function (el) {
                var _href$match5;
                addClass(el, "cube-game-checked");
                var href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                var cubeGameId = (_href$match5 = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)) === null || _href$match5 === void 0 ? void 0 : _href$match5[1];
                if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
                  addClass(el, "cube-game-link-owned");
                }
              });
            }
            function getCubeGameLibrary() {
              return GM_getValue("cubeGames") || [];
            }
            function updateCubeGameLibrary() {
              var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
              var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
              var games = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
              if (!loop && i !== 1) {
                GM_setValue("cubeGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getCubeGameLibrary()), _toConsumableArray(games)))));
                checkCubeGame(false);
                return;
              }
              return new Promise(function (resolve, reject) {
                if (loop) {
                  showUpdateStep("cube", "\u7B2C ".concat(i, " \u9875"));
                }
                GM_xmlhttpRequest({
                  method: "POST",
                  url: "https://account.cubejoy.com/Comment/MyGameReq?pageIndex=".concat(i, "&pageSize=24"),
                  timeout: 15e3,
                  nocache: true,
                  responseType: "json",
                  headers: {
                    Accept: "application/json, text/plain, */*",
                    Host: "account.cubejoy.com",
                    Origin: "https://account.cubejoy.com",
                    Referer: "https://account.cubejoy.com/Comment/MyGame"
                  },
                  onerror: reject,
                  ontimeout: reject,
                  onload: function onload(response) {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(/*#__PURE__*/function () {
                var _ref28 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee24(response) {
                  var _response$response10, _response$response11, _response$response11$, _response$response11$2, _response$response13, _response$response13$, _response$response13$2;
                  var _response$response12;
                  return _regeneratorRuntime().wrap(function _callee24$(_context25) {
                    while (1) {
                      switch (_context25.prev = _context25.next) {
                        case 0:
                          if (!(((_response$response10 = response.response) === null || _response$response10 === void 0 ? void 0 : _response$response10.resultCode) === 0)) {
                            _context25.next = 4;
                            break;
                          }
                          return _context25.abrupt("return", {
                            status: UPDATE_STATUS.AUTH_EXPIRED,
                            platformName: "方块",
                            loginUrl: "https://account.cubejoy.com/html/login.html"
                          });
                        case 4:
                          if (!((_response$response11 = response.response) !== null && _response$response11 !== void 0 && (_response$response11$ = _response$response11.result) !== null && _response$response11$ !== void 0 && (_response$response11$2 = _response$response11$.list) !== null && _response$response11$2 !== void 0 && _response$response11$2.length)) {
                            _context25.next = 22;
                            break;
                          }
                          games = [].concat(_toConsumableArray(games), _toConsumableArray(response.response.result.list.map(function (e) {
                            return e.S_Id;
                          })));
                          if (!(((_response$response12 = response.response) === null || _response$response12 === void 0 ? void 0 : _response$response12.result.total) > i * 24)) {
                            _context25.next = 12;
                            break;
                          }
                          _context25.next = 9;
                          return updateCubeGameLibrary(loop, ++i, games);
                        case 9:
                          return _context25.abrupt("return", _context25.sent);
                        case 12:
                          if (!loop) {
                            _context25.next = 17;
                            break;
                          }
                          GM_setValue("cubeGames", _toConsumableArray(new Set(games)).filter(function (e) {
                            return e;
                          }));
                          _context25.next = 16;
                          return showUpdateResult("cube游戏库数据更新完成", "success");
                        case 16:
                          return _context25.abrupt("return", true);
                        case 17:
                          GM_setValue("cubeGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getCubeGameLibrary()), _toConsumableArray(games)))).filter(function (e) {
                            return e;
                          }));
                          checkCubeGame(false);
                          return _context25.abrupt("return", true);
                        case 22:
                          if (!(((_response$response13 = response.response) === null || _response$response13 === void 0 ? void 0 : (_response$response13$ = _response$response13.result) === null || _response$response13$ === void 0 ? void 0 : (_response$response13$2 = _response$response13$.list) === null || _response$response13$2 === void 0 ? void 0 : _response$response13$2.length) !== 0)) {
                            _context25.next = 27;
                            break;
                          }
                          console.error(response);
                          _context25.next = 26;
                          return showUpdateResult("方块游戏库数据更新失败", "error");
                        case 26:
                          return _context25.abrupt("return", false);
                        case 27:
                          return _context25.abrupt("return", false);
                        case 28:
                        case "end":
                          return _context25.stop();
                      }
                    }
                  }, _callee24);
                }));
                return function (_x19) {
                  return _ref28.apply(this, arguments);
                };
              }())["catch"](/*#__PURE__*/function () {
                var _ref29 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee25(error) {
                  return _regeneratorRuntime().wrap(function _callee25$(_context26) {
                    while (1) {
                      switch (_context26.prev = _context26.next) {
                        case 0:
                          console.error(error);
                          _context26.next = 3;
                          return showUpdateResult("方块游戏库数据更新失败", "error");
                        case 3:
                          return _context26.abrupt("return", false);
                        case 4:
                        case "end":
                          return _context26.stop();
                      }
                    }
                  }, _callee25);
                }));
                return function (_x20) {
                  return _ref29.apply(this, arguments);
                };
              }());
            }
            _updateLibrary5 = updateCubeGameLibrary;
            GM_registerMenuCommand("更新cube游戏库", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {
              var result;
              return _regeneratorRuntime().wrap(function _callee26$(_context27) {
                while (1) {
                  switch (_context27.prev = _context27.next) {
                    case 0:
                      _context27.next = 2;
                      return updateCubeGameLibrary();
                    case 2:
                      result = _context27.sent;
                      if ((result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                        showLoginExpiredDialog(result.platformName, result.loginUrl);
                      }
                    case 4:
                    case "end":
                      return _context27.stop();
                  }
                }
              }, _callee26);
            })));
            GM_addStyle(".cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
          }
        };
        return moduleApi;
      }
      module.exports = {
        createCubeModule: createCubeModule
      };
    }
  });

  // src/platforms/ig.js
  var require_ig = __commonJS({
    "src/platforms/ig.js": function srcPlatformsIgJs(exports, module) {
      function createIgModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          parseHtml = context.parseHtml,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showLoginExpiredDialog = context.showLoginExpiredDialog,
          UPDATE_STATUS = context.UPDATE_STATUS;
        var started = false;
        function getIgOwnedGames() {
          var _GM_getValue;
          return (((_GM_getValue = GM_getValue("IG-Owned")) === null || _GM_getValue === void 0 ? void 0 : _GM_getValue.games) || []).filter(Boolean).map(function (item) {
            return item.toLowerCase();
          });
        }
        function markIgLinks() {
          var owned = getIgOwnedGames();
          var links = queryLinks('a[href*=".indiegala.com"]:not(.ig-checked)');
          links.forEach(function (el) {
            addClass(el, "ig-checked");
            var href = getHref(el);
            if (!href) return;
            try {
              var parsed = new URL(href, window.location.href);
              var pathnameKey = parsed.pathname.replace(/\//g, "").toLowerCase();
              var hostnameKey = parsed.hostname.split(".")[0].toLowerCase();
              if (owned.includes(pathnameKey) || owned.includes(hostnameKey)) addClass(el, "ig-owned");
            } catch (error) {
              console.error(error);
            }
          });
        }
        function getIgCookies() {
          return new Promise(function (resolve, reject) {
            GM_cookie.list({
              url: "https://www.indiegala.com/library/showcase/1"
            }, function (cookies, error) {
              if (error) {
                reject(error);
                return;
              }
              resolve(cookies.map(function (cookie) {
                return "".concat(cookie.name, "=").concat(cookie.value);
              }).join(";"));
            });
          });
        }
        function requestIgShowcasePage(_x21, _x22) {
          return _requestIgShowcasePage.apply(this, arguments);
        }
        function _requestIgShowcasePage() {
          _requestIgShowcasePage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee28(page, cookies) {
            return _regeneratorRuntime().wrap(function _callee28$(_context29) {
              while (1) {
                switch (_context29.prev = _context29.next) {
                  case 0:
                    return _context29.abrupt("return", TM_request({
                      url: "https://www.indiegala.com/library/showcase/".concat(page),
                      method: "GET",
                      timeout: 3e4,
                      retry: 3,
                      headers: {
                        cookie: cookies
                      }
                    }));
                  case 1:
                  case "end":
                    return _context29.stop();
                }
              }
            }, _callee28);
          }));
          return _requestIgShowcasePage.apply(this, arguments);
        }
        function parseIgShowcase(responseText, page) {
          var doc = parseHtml(responseText);
          var pages = 1;
          if (page === 1) {
            var _pageLinks$find;
            var pageLinks = Array.from(doc.querySelectorAll('a.profile-private-page-library-pagination-item[href*="library/showcase"]'));
            var lastPageHref = ((_pageLinks$find = pageLinks.find(function (el) {
              return el.querySelector(".fa-angle-double-right");
            })) === null || _pageLinks$find === void 0 ? void 0 : _pageLinks$find.getAttribute("href")) || "";
            var parsedPage = Number((lastPageHref.match(/\d+/) || [1])[0]);
            pages = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
          }
          var games = Array.from(doc.querySelectorAll("a.library-showcase-title")).map(function (el) {
            var _el$getAttribute, _el$getAttribute$matc, _el$getAttribute$matc2;
            return (_el$getAttribute = el.getAttribute("href")) === null || _el$getAttribute === void 0 ? void 0 : (_el$getAttribute$matc = _el$getAttribute.match(/https?:\/\/.*?\.indiegala\.com\/(.*)/)) === null || _el$getAttribute$matc === void 0 ? void 0 : (_el$getAttribute$matc2 = _el$getAttribute$matc[1]) === null || _el$getAttribute$matc2 === void 0 ? void 0 : _el$getAttribute$matc2.toLowerCase();
          }).filter(Boolean);
          return {
            pages: pages,
            games: games
          };
        }
        function updateIgGameLibrary() {
          return _updateIgGameLibrary.apply(this, arguments);
        }
        function _updateIgGameLibrary() {
          _updateIgGameLibrary = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee29() {
            var cookies, firstPageResponse, firstParsed, allGames, page, response, parsed;
            return _regeneratorRuntime().wrap(function _callee29$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    _context30.prev = 0;
                    showUpdateStep("ig", "第 1 页");
                    _context30.next = 4;
                    return getIgCookies();
                  case 4:
                    cookies = _context30.sent;
                    _context30.next = 7;
                    return requestIgShowcasePage(1, cookies);
                  case 7:
                    firstPageResponse = _context30.sent;
                    if (!(new URL(firstPageResponse.finalUrl).pathname === "/login")) {
                      _context30.next = 10;
                      break;
                    }
                    return _context30.abrupt("return", {
                      status: UPDATE_STATUS.AUTH_EXPIRED,
                      platformName: "IG",
                      loginUrl: "https://www.indiegala.com/login"
                    });
                  case 10:
                    firstParsed = parseIgShowcase(firstPageResponse.responseText, 1);
                    allGames = _toConsumableArray(firstParsed.games);
                    page = 2;
                  case 13:
                    if (!(page <= firstParsed.pages)) {
                      _context30.next = 23;
                      break;
                    }
                    showUpdateStep("ig", "\u7B2C ".concat(page, " \u9875"));
                    _context30.next = 17;
                    return requestIgShowcasePage(page, cookies);
                  case 17:
                    response = _context30.sent;
                    parsed = parseIgShowcase(response.responseText, page);
                    allGames = allGames.concat(parsed.games);
                  case 20:
                    page += 1;
                    _context30.next = 13;
                    break;
                  case 23:
                    allGames = Array.from(new Set(allGames)).filter(Boolean);
                    GM_setValue("IG-Owned", {
                      time: Date.now(),
                      games: allGames
                    });
                    _context30.next = 27;
                    return showUpdateResult("IG游戏库数据更新完成", "success");
                  case 27:
                    markIgLinks();
                    return _context30.abrupt("return", true);
                  case 31:
                    _context30.prev = 31;
                    _context30.t0 = _context30["catch"](0);
                    console.error(_context30.t0);
                    _context30.next = 36;
                    return showUpdateResult("IG游戏库数据更新失败", "error");
                  case 36:
                    return _context30.abrupt("return", false);
                  case 37:
                  case "end":
                    return _context30.stop();
                }
              }
            }, _callee29, null, [[0, 31]]);
          }));
          return _updateIgGameLibrary.apply(this, arguments);
        }
        return {
          key: "ig",
          enabled: function enabled() {
            return settings.platformEnabled.ig;
          },
          isCacheEmpty: function isCacheEmpty() {
            return getIgOwnedGames().length === 0;
          },
          updateLibrary: function updateLibrary() {
            return updateIgGameLibrary();
          },
          start: function start() {
            if (started) return;
            started = true;
            markIgLinks();
            var observer = new MutationObserver(function () {
              markIgLinks();
            });
            observer.observe(document.documentElement, {
              attributes: false,
              characterData: false,
              childList: true,
              subtree: true
            });
            GM_registerMenuCommand("更新IG游戏库", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee27() {
              var result;
              return _regeneratorRuntime().wrap(function _callee27$(_context28) {
                while (1) {
                  switch (_context28.prev = _context28.next) {
                    case 0:
                      _context28.next = 2;
                      return updateIgGameLibrary();
                    case 2:
                      result = _context28.sent;
                      if ((result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                        showLoginExpiredDialog(result.platformName, result.loginUrl);
                      }
                    case 4:
                    case "end":
                      return _context28.stop();
                  }
                }
              }, _callee27);
            })));
            GM_addStyle(".ig-owned{color:#ffffff !important;background:#5c8a00 !important}");
          }
        };
      }
      module.exports = {
        createIgModule: createIgModule
      };
    }
  });

  // src/runtime/bootstrap.js
  var require_bootstrap = __commonJS({
    "src/runtime/bootstrap.js": function srcRuntimeBootstrapJs(exports, module) {
      var _require_dialog = require_dialog(),
        createModalRoot = _require_dialog.createModalRoot,
        showDialog = _require_dialog.showDialog;
      var _require_toast = require_toast(),
        showToast = _require_toast.showToast;
      var _require_progress = require_progress(),
        createProgressController = _require_progress.createProgressController;
      var _require_settings = require_settings(),
        createSettingsController = _require_settings.createSettingsController;
      var _require_startup = require_startup(),
        createStartupFlow = _require_startup.createStartupFlow;
      var _require_constants = require_constants(),
        UPDATE_STATUS = _require_constants.UPDATE_STATUS,
        BASE_STYLE = _require_constants.BASE_STYLE;
      var _require_epic = require_epic(),
        createEpicModule = _require_epic.createEpicModule;
      var _require_gog = require_gog(),
        createGogModule = _require_gog.createGogModule;
      var _require_itch = require_itch(),
        createItchModule = _require_itch.createItchModule;
      var _require_cube = require_cube(),
        createCubeModule = _require_cube.createCubeModule;
      var _require_ig = require_ig(),
        createIgModule = _require_ig.createIgModule;
      function bootstrapMergedRuntime2() {
        var _createProgressContro = createProgressController(createModalRoot),
          showProgressPanel = _createProgressContro.showProgressPanel,
          clearProgressPanel = _createProgressContro.clearProgressPanel;
        var _createSettingsContro = createSettingsController({
            showDialog: showDialog
          }),
          settings = _createSettingsContro.settings,
          setting = _createSettingsContro.setting,
          openPlatformSwitchDialog = _createSettingsContro.openPlatformSwitchDialog,
          isUrlEnabled = _createSettingsContro.isUrlEnabled;
        function queryLinks(selector) {
          return Array.from(document.querySelectorAll(selector));
        }
        function addClass(el, className) {
          if (el && !el.classList.contains(className)) el.classList.add(className);
        }
        function getHref(el) {
          return el && el.getAttribute("href") || "";
        }
        function parseHtml(html) {
          return new DOMParser().parseFromString(html, "text/html");
        }
        function showLoginExpiredDialog(platformName, loginUrl) {
          showDialog({
            title: "登录状态已失效",
            bodyText: "".concat(platformName, " \u767B\u5F55\u51ED\u8BC1\u5DF2\u8FC7\u671F\uFF0C\u9700\u8981\u91CD\u65B0\u767B\u5F55\u3002"),
            confirmText: "去登录",
            cancelText: "稍后",
            onConfirm: function onConfirm() {
              return GM_openInTab(loginUrl, {
                active: true,
                insert: true,
                setParent: true
              });
            }
          });
        }
        var _createStartupFlow = createStartupFlow({
            showDialog: showDialog,
            showProgressPanel: showProgressPanel,
            clearProgressPanel: clearProgressPanel,
            showToast: showToast,
            showLoginExpiredDialog: showLoginExpiredDialog,
            updateStatus: UPDATE_STATUS
          }),
          runInitialFlow = _createStartupFlow.runInitialFlow,
          showUpdateStep = _createStartupFlow.showUpdateStep,
          showUpdateResult = _createStartupFlow.showUpdateResult;
        var moduleContext = {
          settings: settings,
          queryLinks: queryLinks,
          addClass: addClass,
          getHref: getHref,
          parseHtml: parseHtml,
          showToast: showToast,
          showUpdateStep: showUpdateStep,
          showUpdateResult: showUpdateResult,
          showLoginExpiredDialog: showLoginExpiredDialog,
          UPDATE_STATUS: UPDATE_STATUS
        };
        GM_registerMenuCommand("设置", setting);
        GM_registerMenuCommand("平台开关", openPlatformSwitchDialog);
        GM_addStyle(BASE_STYLE);
        if (!isUrlEnabled(window.location.href)) return;
        var modules = [createEpicModule(moduleContext), createGogModule(moduleContext), createItchModule(moduleContext), createCubeModule(moduleContext), createIgModule(moduleContext)];
        runInitialFlow(modules);
      }
      module.exports = {
        bootstrapMergedRuntime: bootstrapMergedRuntime2
      };
    }
  });

  // src/index.js
  var _require_bootstrap = require_bootstrap(),
    bootstrapMergedRuntime = _require_bootstrap.bootstrapMergedRuntime;
  (function main() {
    bootstrapMergedRuntime();
  })();
})();