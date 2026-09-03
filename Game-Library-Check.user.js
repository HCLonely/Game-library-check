// ==UserScript==
// @name           游戏库检测-合集
// @name:en        Game Library Check
// @namespace      game-library-check
// @version        2.0.1
// @description    检测Epic/GOG/itch/Cube游戏是否已拥有。
// @description:en Check if Epic/GOG/itch/Cube games are already owned.
// @author         HCLonely
// @license        MIT
// @homepage       https://github.com/HCLonely/Game-library-check
// @supportURL     https://github.com/HCLonely/Game-library-check/issues
// @updateURL      https://github.com/HCLonely/Game-library-check/raw/master/Game-Library-Check.user.js
// @downloadURL    https://github.com/HCLonely/Game-library-check/raw/master/Game-Library-Check.user.js
// @icon           https://github.com/HCLonely/Game-library-check/blob/master/icon.ico?raw=true
// @tag            games

// @include        *
// @include        *://accounts.epicgames.com/*
// @exclude        *://www.epicgames.com/*
// @exclude        *://store.epicgames.com/*
// @exclude        *://www.gog.com/*
// @exclude        *://itch.io/login
// @exclude        *://account.cubejoy.com/html/login.html

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
// @connect        epicgames.com
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
"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _toArray(r) { return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest(); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { "throw": 1, "return": 2, "break": 3, "continue": 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, "catch": function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) { r.unshift(t); } return function e() { for (; r.length;) { if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; } return e.done = !0, e; }; }
function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) { n[e] = r[e]; } return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) { ; } } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = function __commonJS(cb, mod) {
    return function __require() {
      try {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
          exports: {}
        }).exports, mod), mod.exports;
      } catch (e) {
        throw mod = 0, e;
      }
    };
  };

  // src/ui/dialog.ts
  var require_dialog = __commonJS({
    "src/ui/dialog.ts": function srcUiDialogTs(exports, module) {
      "use strict";

      var activeDialogClose = null;
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
        if (typeof activeDialogClose === "function") {
          activeDialogClose();
        }
        var root = createModalRoot();
        root.innerHTML = "\n    <div class=\"glc-mask\">\n      <div class=\"glc-dialog glc-dialog-shell\" role=\"dialog\" aria-modal=\"true\">\n        <h3 class=\"glc-dialog-title glc-dialog-header\"></h3>\n        <div class=\"glc-dialog-body glc-dialog-content\"></div>\n        <div class=\"glc-dialog-actions\">\n          <button type=\"button\" data-glc-cancel></button>\n          <button type=\"button\" data-glc-deny></button>\n          <button type=\"button\" data-glc-confirm></button>\n        </div>\n      </div>\n    </div>";
        var maskEl = root.querySelector(".glc-mask");
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
        var closed = false;
        var close = function close() {
          if (closed) return;
          closed = true;
          document.removeEventListener("keydown", onKeydown);
          maskEl === null || maskEl === void 0 ? void 0 : maskEl.removeEventListener("click", onMaskClick);
          if (activeDialogClose === close) {
            activeDialogClose = null;
          }
          root.innerHTML = "";
        };
        var runAndClose = function runAndClose(callback) {
          try {
            if (typeof callback === "function") callback(root);
          } finally {
            close();
          }
        };
        var onKeydown = function onKeydown(event) {
          if (closed) return;
          if (event.key === "Escape") runAndClose(onCancel);
        };
        var onMaskClick = function onMaskClick(event) {
          if (closed) return;
          if (event.target !== maskEl) return;
          runAndClose(onCancel);
        };
        activeDialogClose = close;
        document.addEventListener("keydown", onKeydown);
        maskEl === null || maskEl === void 0 ? void 0 : maskEl.addEventListener("click", onMaskClick);
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener("click", function () {
          if (closed) return;
          runAndClose(onCancel);
        });
        denyBtn === null || denyBtn === void 0 ? void 0 : denyBtn.addEventListener("click", function () {
          if (closed) return;
          runAndClose(onDeny);
        });
        confirmBtn === null || confirmBtn === void 0 ? void 0 : confirmBtn.addEventListener("click", function () {
          if (closed) return;
          runAndClose(onConfirm);
        });
      }
      module.exports = {
        createModalRoot: createModalRoot,
        showDialog: showDialog
      };
    }
  });

  // src/ui/toast.ts
  var require_toast = __commonJS({
    "src/ui/toast.ts": function srcUiToastTs(exports, module) {
      "use strict";

      function createToastContainer() {
        var container = document.getElementById("glc-toast-container");
        if (container) return container;
        container = document.createElement("div");
        container.id = "glc-toast-container";
        document.body.appendChild(container);
        return container;
      }
      function showToast(message) {
        var _options$link;
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var el = document.createElement("div");
        el.className = "glc-toast glc-toast-content glc-toast-".concat(type);
        el.textContent = message;
        if (options !== null && options !== void 0 && (_options$link = options.link) !== null && _options$link !== void 0 && _options$link.href) {
          var link = document.createElement("a");
          link.href = options.link.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = options.link.text || options.link.href;
          link.className = "glc-toast-link";
          el.appendChild(document.createTextNode(" "));
          el.appendChild(link);
        }
        if (options !== null && options !== void 0 && options.closable) {
          var closeButton = document.createElement("button");
          closeButton.type = "button";
          closeButton.className = "glc-toast-close";
          closeButton.textContent = "×";
          closeButton.addEventListener("click", function () {
            return el.remove();
          });
          el.appendChild(document.createTextNode(" "));
          el.appendChild(closeButton);
        }
        el.classList.add("glc-toast-enter");
        createToastContainer().appendChild(el);
        var duration = typeof options.duration === "number" ? options.duration : 6e3;
        if (duration <= 0) return;
        window.setTimeout(function () {
          el.classList.remove("glc-toast-enter");
          el.classList.add("glc-toast-leave");
          window.setTimeout(function () {
            return el.remove();
          }, 140);
        }, duration);
      }
      module.exports = {
        createToastContainer: createToastContainer,
        showToast: showToast
      };
    }
  });

  // src/ui/progress.ts
  var require_progress = __commonJS({
    "src/ui/progress.ts": function srcUiProgressTs(exports, module) {
      "use strict";

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
              li.className = "glc-progress-row";
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

  // src/core/settings.ts
  var require_settings = __commonJS({
    "src/core/settings.ts": function srcCoreSettingsTs(exports, module) {
      "use strict";

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
          var platformRows = [["glc-epic", "Epic", current.epic], ["glc-gog", "GOG", current.gog], ["glc-itch", "Itch", current.itch],
          // ['glc-cube', 'Cube', current.cube],
          ["glc-ig", "IG", current.ig]];
          platformRows.forEach(function (_ref6, index) {
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
              var _root$querySelector$c, _root$querySelector, _root$querySelector$c2, _root$querySelector2, _root$querySelector$c3, _root$querySelector3, _root$querySelector$c4, _root$querySelector4;
              settings.platformEnabled = _objectSpread(_objectSpread({}, current), {}, {
                epic: (_root$querySelector$c = (_root$querySelector = root.querySelector("#glc-epic")) === null || _root$querySelector === void 0 ? void 0 : _root$querySelector.checked) !== null && _root$querySelector$c !== void 0 ? _root$querySelector$c : false,
                gog: (_root$querySelector$c2 = (_root$querySelector2 = root.querySelector("#glc-gog")) === null || _root$querySelector2 === void 0 ? void 0 : _root$querySelector2.checked) !== null && _root$querySelector$c2 !== void 0 ? _root$querySelector$c2 : false,
                itch: (_root$querySelector$c3 = (_root$querySelector3 = root.querySelector("#glc-itch")) === null || _root$querySelector3 === void 0 ? void 0 : _root$querySelector3.checked) !== null && _root$querySelector$c3 !== void 0 ? _root$querySelector$c3 : false,
                // cube: root.querySelector('#glc-cube').checked,
                ig: (_root$querySelector$c4 = (_root$querySelector4 = root.querySelector("#glc-ig")) === null || _root$querySelector4 === void 0 ? void 0 : _root$querySelector4.checked) !== null && _root$querySelector$c4 !== void 0 ? _root$querySelector$c4 : false
              });
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
              var _root$querySelector5;
              var value = ((_root$querySelector5 = root.querySelector(".glc-textarea")) === null || _root$querySelector5 === void 0 ? void 0 : _root$querySelector5.value) || "";
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

  // src/core/startup.ts
  var require_startup = __commonJS({
    "src/core/startup.ts": function srcCoreStartupTs(exports, module) {
      "use strict";

      function createStartupFlow(_ref8) {
        var showDialog = _ref8.showDialog,
          showProgressPanel = _ref8.showProgressPanel,
          clearProgressPanel = _ref8.clearProgressPanel,
          showToast = _ref8.showToast,
          showLoginExpiredDialog = _ref8.showLoginExpiredDialog,
          updateStatus = _ref8.updateStatus;
        var inBatchUpdateFlow = false;
        var PLATFORM_UPDATE_RATE_KEY = "platformUpdateRate";
        var PLATFORM_LAST_UPDATE_AT_KEY = "platformLastUpdateAt";
        var TEN_MINUTES_MS = 10 * 60 * 1e3;
        var ONE_HOUR_MS = 60 * 60 * 1e3;
        function sanitizePlatformRateMap(raw) {
          var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
          if (!raw || _typeof(raw) !== "object") return {};
          var oneHourAgo = now - ONE_HOUR_MS;
          var source = raw;
          var result = {};
          Object.keys(source).forEach(function (key) {
            var list = Array.isArray(source[key]) ? source[key] : [];
            result[key] = list.filter(function (ts) {
              return typeof ts === "number" && Number.isFinite(ts) && ts >= oneHourAgo && ts <= now;
            });
          });
          return result;
        }
        function canRunAutoUpdate(platformKey) {
          var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
          var rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY), now);
          var history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
          var tenMinutesAgo = now - TEN_MINUTES_MS;
          var oneHourAgo = now - ONE_HOUR_MS;
          var countIn10Minutes = history.filter(function (ts) {
            return ts >= tenMinutesAgo;
          }).length;
          var countIn1Hour = history.filter(function (ts) {
            return ts >= oneHourAgo;
          }).length;
          GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
          return countIn10Minutes < 5 && countIn1Hour < 30;
        }
        function recordAutoUpdateSuccess(platformKey) {
          var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
          var rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY), now);
          var history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
          rateMap[platformKey] = history.concat(now).filter(function (ts) {
            return ts >= now - ONE_HOUR_MS;
          });
          GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
          var lastUpdateMap = GM_getValue(PLATFORM_LAST_UPDATE_AT_KEY) || {};
          lastUpdateMap[platformKey] = now;
          GM_setValue(PLATFORM_LAST_UPDATE_AT_KEY, lastUpdateMap);
        }
        function runAutoUpdateWithRateLimit(_x, _x2) {
          return _runAutoUpdateWithRateLimit.apply(this, arguments);
        }
        function _runAutoUpdateWithRateLimit() {
          _runAutoUpdateWithRateLimit = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(libraryModule, autoUpdateRunner) {
            var result;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(!(libraryModule !== null && libraryModule !== void 0 && libraryModule.key) || typeof autoUpdateRunner !== "function")) {
                      _context2.next = 2;
                      break;
                    }
                    return _context2.abrupt("return", false);
                  case 2:
                    if (canRunAutoUpdate(libraryModule.key)) {
                      _context2.next = 4;
                      break;
                    }
                    return _context2.abrupt("return", false);
                  case 4:
                    _context2.next = 6;
                    return autoUpdateRunner();
                  case 6:
                    result = _context2.sent;
                    if (result === true) recordAutoUpdateSuccess(libraryModule.key);
                    return _context2.abrupt("return", result);
                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));
          return _runAutoUpdateWithRateLimit.apply(this, arguments);
        }
        function collectEmptyCaches(enabledModules) {
          return enabledModules.filter(function (libraryModule) {
            return libraryModule.isCacheEmpty();
          }).map(function (libraryModule) {
            return libraryModule.key;
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
                return el.dataset.platform;
              }).filter(function (key) {
                return Boolean(key);
              });
              _onConfirm(selected);
            },
            onCancel: function onCancel() {
              if (typeof _onCancel === "function") _onCancel();
            }
          });
        }
        function getSelectedPlatformKeys(root) {
          return Array.from(root.querySelectorAll("input[data-platform]:checked:not(:disabled)")).map(function (el) {
            return el.dataset.platform;
          }).filter(function (key) {
            return Boolean(key);
          });
        }
        function updateManualUpdateConfirmState(root) {
          if (!root) return;
          var confirmButton = root.querySelector("[data-glc-confirm]");
          if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
        }
        function buildPlatformCheckboxBody(modules, onSelectionChange) {
          var bodyNode = document.createElement("div");
          modules.forEach(function (libraryModule, index) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            var enabled = libraryModule.enabled();
            input.type = "checkbox";
            input.dataset.platform = libraryModule.key;
            input.checked = enabled;
            input.disabled = !enabled;
            label.appendChild(input);
            label.appendChild(document.createTextNode(" ".concat(libraryModule.key.toUpperCase())));
            bodyNode.appendChild(label);
            if (index < modules.length - 1) bodyNode.appendChild(document.createElement("br"));
          });
          bodyNode.addEventListener("change", function () {
            if (typeof onSelectionChange === "function") onSelectionChange(document.getElementById("glc-modal-root"));
          });
          return bodyNode;
        }
        function openManualUpdateDialogAndRun(modules) {
          var enabledModules = modules.filter(function (libraryModule) {
            return libraryModule.enabled();
          });
          var bodyNode = buildPlatformCheckboxBody(modules, updateManualUpdateConfirmState);
          showDialog({
            title: "更新游戏库",
            bodyNode: bodyNode,
            confirmText: "开始更新",
            cancelText: "取消",
            onConfirm: function () {
              var _onConfirm2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(root) {
                var selectedKeys;
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        selectedKeys = getSelectedPlatformKeys(root);
                        if (!(selectedKeys.length === 0)) {
                          _context.next = 4;
                          break;
                        }
                        showToast("请至少选择一个平台", "warning");
                        return _context.abrupt("return");
                      case 4:
                        _context.next = 6;
                        return batchUpdateSelectedModules(enabledModules, selectedKeys);
                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              function onConfirm(_x3) {
                return _onConfirm2.apply(this, arguments);
              }
              return onConfirm;
            }()
          });
          updateManualUpdateConfirmState(document.getElementById("glc-modal-root"));
        }
        function extractFailureReason(failure) {
          if (!failure) return "未知错误";
          if (typeof failure === "string") return failure;
          if (failure instanceof Error && failure.message) return failure.message;
          if (_typeof(failure) === "object") {
            var details = failure;
            if (typeof details.message === "string" && details.message.trim()) return details.message;
            if (typeof details.reason === "string" && details.reason.trim()) return details.reason;
            if (typeof details.error === "string" && details.error.trim()) return details.error;
          }
          return "未知错误";
        }
        function showUpdateFailureDialog(key, failure) {
          var platform = key.toUpperCase();
          var reason = extractFailureReason(failure);
          showDialog({
            title: "平台更新失败",
            bodyText: "".concat(platform, " \u66F4\u65B0\u5931\u8D25\uFF1A").concat(reason),
            confirmText: "确认",
            hideCancel: true
          });
        }
        function isAuthExpiredResult(result) {
          return _typeof(result) === "object" && result !== null && result.status === updateStatus.AUTH_EXPIRED;
        }
        function batchUpdateSelectedModules(_x4, _x5) {
          return _batchUpdateSelectedModules.apply(this, arguments);
        }
        function _batchUpdateSelectedModules() {
          _batchUpdateSelectedModules = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(enabledModules, selectedKeys) {
            var state, interruptedByAuthExpired, _iterator, _step, _loop, _ret;
            return _regeneratorRuntime().wrap(function _callee3$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    state = Object.fromEntries(selectedKeys.map(function (key) {
                      return [key, "waiting"];
                    }));
                    interruptedByAuthExpired = false;
                    inBatchUpdateFlow = true;
                    showProgressPanel(state, {
                      replace: true
                    });
                    _context4.prev = 4;
                    _iterator = _createForOfIteratorHelper(selectedKeys);
                    _context4.prev = 6;
                    _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                      var key, libraryModule, updateResult;
                      return _regeneratorRuntime().wrap(function _loop$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              key = _step.value;
                              libraryModule = enabledModules.find(function (item) {
                                return item.key === key;
                              });
                              if (libraryModule) {
                                _context3.next = 4;
                                break;
                              }
                              return _context3.abrupt("return", "continue");
                            case 4:
                              state[key] = "running";
                              showProgressPanel(_defineProperty({}, key, state[key]));
                              _context3.prev = 6;
                              _context3.next = 9;
                              return libraryModule.updateLibrary();
                            case 9:
                              updateResult = _context3.sent;
                              if (!(updateResult === true)) {
                                _context3.next = 14;
                                break;
                              }
                              state[key] = "success";
                              _context3.next = 24;
                              break;
                            case 14:
                              if (!isAuthExpiredResult(updateResult)) {
                                _context3.next = 22;
                                break;
                              }
                              interruptedByAuthExpired = true;
                              state[key] = updateStatus.AUTH_EXPIRED;
                              clearProgressPanel();
                              showLoginExpiredDialog(updateResult.platformName, updateResult.loginUrl);
                              return _context3.abrupt("return", "break");
                            case 22:
                              state[key] = "error";
                              showUpdateFailureDialog(key, updateResult);
                            case 24:
                              _context3.next = 31;
                              break;
                            case 26:
                              _context3.prev = 26;
                              _context3.t0 = _context3["catch"](6);
                              console.error(_context3.t0);
                              state[key] = "error";
                              showUpdateFailureDialog(key, _context3.t0);
                            case 31:
                              if (!interruptedByAuthExpired) showProgressPanel(_defineProperty({}, key, state[key]));
                            case 32:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _loop, null, [[6, 26]]);
                    });
                    _iterator.s();
                  case 9:
                    if ((_step = _iterator.n()).done) {
                      _context4.next = 18;
                      break;
                    }
                    return _context4.delegateYield(_loop(), "t0", 11);
                  case 11:
                    _ret = _context4.t0;
                    if (!(_ret === "continue")) {
                      _context4.next = 14;
                      break;
                    }
                    return _context4.abrupt("continue", 16);
                  case 14:
                    if (!(_ret === "break")) {
                      _context4.next = 16;
                      break;
                    }
                    return _context4.abrupt("break", 18);
                  case 16:
                    _context4.next = 9;
                    break;
                  case 18:
                    _context4.next = 23;
                    break;
                  case 20:
                    _context4.prev = 20;
                    _context4.t1 = _context4["catch"](6);
                    _iterator.e(_context4.t1);
                  case 23:
                    _context4.prev = 23;
                    _iterator.f();
                    return _context4.finish(23);
                  case 26:
                    _context4.prev = 26;
                    inBatchUpdateFlow = false;
                    return _context4.finish(26);
                  case 29:
                    if (!interruptedByAuthExpired) clearProgressPanel();
                  case 30:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee3, null, [[4,, 26, 29], [6, 20, 23, 26]]);
          }));
          return _batchUpdateSelectedModules.apply(this, arguments);
        }
        function runInitialFlow(_x6) {
          return _runInitialFlow.apply(this, arguments);
        }
        function _runInitialFlow() {
          _runInitialFlow = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(modules) {
            var enabledModules, emptyKeys;
            return _regeneratorRuntime().wrap(function _callee5$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    enabledModules = modules.filter(function (libraryModule) {
                      return libraryModule.enabled();
                    });
                    emptyKeys = collectEmptyCaches(enabledModules);
                    if (!(emptyKeys.length > 0)) {
                      _context6.next = 5;
                      break;
                    }
                    showEmptyCacheAggregationDialog(emptyKeys, /*#__PURE__*/function () {
                      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(selectedKeys) {
                        return _regeneratorRuntime().wrap(function _callee4$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                if (!(selectedKeys.length > 0)) {
                                  _context5.next = 3;
                                  break;
                                }
                                _context5.next = 3;
                                return batchUpdateSelectedModules(enabledModules, selectedKeys);
                              case 3:
                                enabledModules.forEach(function (libraryModule) {
                                  return libraryModule.start();
                                });
                              case 4:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        }, _callee4);
                      }));
                      return function (_x7) {
                        return _ref9.apply(this, arguments);
                      };
                    }(), function () {
                      enabledModules.forEach(function (libraryModule) {
                        return libraryModule.start();
                      });
                    });
                    return _context6.abrupt("return");
                  case 5:
                    enabledModules.forEach(function (libraryModule) {
                      return libraryModule.start();
                    });
                  case 6:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee5);
          }));
          return _runInitialFlow.apply(this, arguments);
        }
        function showUpdateStep(platform, text) {
          showProgressPanel(_defineProperty({}, platform, text));
        }
        function showUpdateResult(title, type) {
          if (!inBatchUpdateFlow) clearProgressPanel();
          if (type === "error") {
            if (inBatchUpdateFlow) {
              showDialog({
                title: "平台更新失败",
                bodyText: title,
                confirmText: "确认",
                hideCancel: true
              });
              return Promise.resolve(true);
            }
            showToast(title, type);
            return Promise.resolve(true);
          }
          showToast(title, type);
          return Promise.resolve(true);
        }
        return {
          collectEmptyCaches: collectEmptyCaches,
          showEmptyCacheAggregationDialog: showEmptyCacheAggregationDialog,
          batchUpdateSelectedModules: batchUpdateSelectedModules,
          openManualUpdateDialogAndRun: openManualUpdateDialogAndRun,
          runInitialFlow: runInitialFlow,
          showUpdateStep: showUpdateStep,
          showUpdateResult: showUpdateResult,
          runAutoUpdateWithRateLimit: runAutoUpdateWithRateLimit
        };
      }
      module.exports = {
        createStartupFlow: createStartupFlow
      };
    }
  });

  // src/core/gist-sync.ts
  var require_gist_sync = __commonJS({
    "src/core/gist-sync.ts": function srcCoreGistSyncTs(exports, module) {
      "use strict";

      var GIST_CONF_KEY = "gistConf";
      function getGistConf() {
        var conf = GM_getValue(GIST_CONF_KEY) || {};
        return {
          TOKEN: conf.TOKEN || "",
          GIST_ID: conf.GIST_ID || "",
          FILE_NAME: conf.FILE_NAME || ""
        };
      }
      function setGistConf(conf) {
        GM_setValue(GIST_CONF_KEY, conf);
      }
      function requestWithRetry(options) {
        var retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        return new Promise(function (resolve, reject) {
          GM_xmlhttpRequest(_objectSpread(_objectSpread({}, options), {}, {
            onerror: reject,
            ontimeout: reject,
            onload: function onload(response) {
              response.status >= 200 && response.status < 400 ? resolve(response) : reject(response);
            }
          }));
        })["catch"](function (error) {
          if (retry <= 0) throw error;
          return requestWithRetry(options, retry - 1);
        });
      }
      function setGistData(token, gistId, fileName, content) {
        var data = JSON.stringify({
          files: _defineProperty({}, fileName, {
            content: JSON.stringify(content)
          })
        });
        return requestWithRetry({
          url: "https://api.github.com/gists/".concat(gistId),
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "token ".concat(token)
          },
          data: data,
          responseType: "json",
          method: "PATCH",
          timeout: 3e4
        }, 3).then(function (response) {
          var _body$files, _body$files$fileName;
          var body = response.response;
          var remoteContent = body === null || body === void 0 ? void 0 : (_body$files = body.files) === null || _body$files === void 0 ? void 0 : (_body$files$fileName = _body$files[fileName]) === null || _body$files$fileName === void 0 ? void 0 : _body$files$fileName.content;
          return response.status === 200 && remoteContent === JSON.stringify(content);
        })["catch"](function (error) {
          console.error(error);
          return false;
        });
      }
      function getGistData(token, gistId, fileName) {
        return requestWithRetry({
          url: "https://api.github.com/gists/".concat(gistId),
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "token ".concat(token)
          },
          responseType: "json",
          method: "GET",
          timeout: 3e4
        }, 3).then(function (response) {
          var _body$files2, _body$files2$fileName;
          if (response.status !== 200) return false;
          var body = response.response;
          var content = body === null || body === void 0 ? void 0 : (_body$files2 = body.files) === null || _body$files2 === void 0 ? void 0 : (_body$files2$fileName = _body$files2[fileName]) === null || _body$files2$fileName === void 0 ? void 0 : _body$files2$fileName.content;
          if (!content) return false;
          return JSON.parse(content);
        })["catch"](function (error) {
          console.error(error);
          return false;
        });
      }
      function createLabeledInput(labelText, value, placeholder) {
        var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "text";
        var wrapper = document.createElement("label");
        wrapper.className = "glc-form-field";
        var text = document.createElement("div");
        text.className = "glc-input-label";
        text.textContent = labelText;
        var input = document.createElement("input");
        input.className = "glc-input";
        input.type = type;
        input.placeholder = placeholder;
        input.value = value;
        wrapper.appendChild(text);
        wrapper.appendChild(input);
        return {
          wrapper: wrapper,
          input: input
        };
      }
      function createGistSyncController(_ref0) {
        var showDialog = _ref0.showDialog,
          showToast = _ref0.showToast;
        function validateConf(conf) {
          return Boolean(conf.TOKEN && conf.GIST_ID && conf.FILE_NAME);
        }
        function buildUploadPayload() {
          var payload = {};
          var keys = GM_listValues();
          keys.forEach(function (key) {
            if (key === GIST_CONF_KEY) return;
            payload[key] = GM_getValue(key);
          });
          return payload;
        }
        function uploadData(_x8) {
          return _uploadData.apply(this, arguments);
        }
        function _uploadData() {
          _uploadData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(conf) {
            var payload, ok;
            return _regeneratorRuntime().wrap(function _callee7$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (validateConf(conf)) {
                      _context8.next = 3;
                      break;
                    }
                    showToast("请先保存配置并测试", "error");
                    return _context8.abrupt("return");
                  case 3:
                    payload = buildUploadPayload();
                    _context8.next = 6;
                    return setGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME, payload);
                  case 6:
                    ok = _context8.sent;
                    if (!ok) {
                      _context8.next = 10;
                      break;
                    }
                    showToast("同步到 Gist 成功", "success");
                    return _context8.abrupt("return");
                  case 10:
                    showToast("同步到 Gist 失败，请查看控制台错误", "error");
                  case 11:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee7);
          }));
          return _uploadData.apply(this, arguments);
        }
        function downloadData(_x9) {
          return _downloadData.apply(this, arguments);
        }
        function _downloadData() {
          _downloadData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(conf) {
            var remoteData;
            return _regeneratorRuntime().wrap(function _callee8$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    if (validateConf(conf)) {
                      _context9.next = 3;
                      break;
                    }
                    showToast("请先保存配置并测试", "error");
                    return _context9.abrupt("return");
                  case 3:
                    _context9.next = 5;
                    return getGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME);
                  case 5:
                    remoteData = _context9.sent;
                    if (!(!remoteData || _typeof(remoteData) !== "object")) {
                      _context9.next = 9;
                      break;
                    }
                    showToast("未检测到远程数据，请检查配置", "error");
                    return _context9.abrupt("return");
                  case 9:
                    Object.entries(remoteData).forEach(function (_ref1) {
                      var _ref10 = _slicedToArray(_ref1, 2),
                        key = _ref10[0],
                        value = _ref10[1];
                      if (key === GIST_CONF_KEY) return;
                      GM_setValue(key, value);
                    });
                    showToast("从 Gist 同步成功", "success");
                  case 11:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee8);
          }));
          return _downloadData.apply(this, arguments);
        }
        function openGistSyncDialog() {
          var conf = getGistConf();
          var bodyNode = document.createElement("div");
          var tokenField = createLabeledInput("Github Token", conf.TOKEN, "Github Token");
          var gistIdField = createLabeledInput("Gist ID", conf.GIST_ID, "Gist ID");
          var fileNameField = createLabeledInput("文件名", conf.FILE_NAME, "文件名");
          bodyNode.appendChild(tokenField.wrapper);
          bodyNode.appendChild(gistIdField.wrapper);
          bodyNode.appendChild(fileNameField.wrapper);
          var actionRow = document.createElement("div");
          actionRow.className = "glc-inline-actions";
          var uploadButton = document.createElement("button");
          uploadButton.type = "button";
          uploadButton.className = "glc-inline-button";
          uploadButton.textContent = "同步到Gist";
          var downloadButton = document.createElement("button");
          downloadButton.type = "button";
          downloadButton.className = "glc-inline-button";
          downloadButton.textContent = "从Gist同步";
          actionRow.appendChild(uploadButton);
          actionRow.appendChild(downloadButton);
          bodyNode.appendChild(actionRow);
          var readConfFromInputs = function readConfFromInputs() {
            return {
              TOKEN: tokenField.input.value.trim(),
              GIST_ID: gistIdField.input.value.trim(),
              FILE_NAME: fileNameField.input.value.trim()
            };
          };
          uploadButton.addEventListener("click", function () {
            uploadData(readConfFromInputs());
          });
          downloadButton.addEventListener("click", function () {
            downloadData(readConfFromInputs());
          });
          showDialog({
            title: "Gist 设置",
            bodyNode: bodyNode,
            confirmText: "保存配置并测试",
            cancelText: "关闭",
            onConfirm: function () {
              var _onConfirm3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
                var nextConf, ok;
                return _regeneratorRuntime().wrap(function _callee6$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        nextConf = readConfFromInputs();
                        setGistConf(nextConf);
                        if (validateConf(nextConf)) {
                          _context7.next = 5;
                          break;
                        }
                        showToast("配置不完整，请填写 Token、Gist ID 和文件名", "error");
                        return _context7.abrupt("return");
                      case 5:
                        _context7.next = 7;
                        return getGistData(nextConf.TOKEN, nextConf.GIST_ID, nextConf.FILE_NAME);
                      case 7:
                        ok = _context7.sent;
                        if (!(ok !== false)) {
                          _context7.next = 11;
                          break;
                        }
                        showToast("测试成功", "success");
                        return _context7.abrupt("return");
                      case 11:
                        showToast("测试失败，请检查配置", "error");
                      case 12:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee6);
              }));
              function onConfirm() {
                return _onConfirm3.apply(this, arguments);
              }
              return onConfirm;
            }()
          });
        }
        return {
          openGistSyncDialog: openGistSyncDialog
        };
      }
      module.exports = {
        createGistSyncController: createGistSyncController,
        getGistConf: getGistConf,
        setGistConf: setGistConf,
        getGistData: getGistData,
        setGistData: setGistData
      };
    }
  });

  // src/shared/constants.ts
  var require_constants = __commonJS({
    "src/shared/constants.ts": function srcSharedConstantsTs(exports, module) {
      "use strict";

      var UPDATE_STATUS = {
        SUCCESS: "success",
        ERROR: "error",
        AUTH_EXPIRED: "auth_expired"
      };
      var BASE_STYLE = "\n.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}\n.glc-dialog{background:#fff;color:#0f172a;border:1px solid #e2e8f0;padding:20px;border-radius:12px;min-width:360px;max-width:580px;font-size:14px;box-shadow:0 14px 36px rgba(15,23,42,.16),0 4px 14px rgba(15,23,42,.08)}\n.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700}\n.glc-dialog-body{line-height:1.6;color:#334155}\n.glc-dialog-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9}\n.glc-dialog-actions button{border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease,box-shadow .14s ease}\n.glc-dialog-actions button:hover{background:#f8fbff;border-color:#c6d4e8}\n.glc-dialog-actions button:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}\n.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff;box-shadow:0 6px 16px rgba(37,99,235,.24)}\n.glc-dialog-actions [data-glc-confirm]:hover{border-color:#1d4ed8;background:#1d4ed8}\n.glc-textarea{width:100%;min-height:160px;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:10px;padding:10px 12px;color:#0f172a;background:#fff}\n.glc-form-field{display:block;margin-bottom:10px}\n.glc-input-label{margin-bottom:6px;color:#334155}\n.glc-input{width:100%;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:8px;padding:8px 10px;color:#0f172a;background:#fff}\n.glc-inline-actions{display:flex;gap:10px;margin-top:8px}\n.glc-inline-button{border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease}\n.glc-inline-button:hover{background:#f8fbff;border-color:#c6d4e8}\n#glc-toast-container{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none}\n.glc-toast{background:#f8fafc;color:#0f172a;padding:11px 15px;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 12px 30px rgba(15,23,42,.12);pointer-events:auto;max-width:420px;word-break:break-word;opacity:1}\n.glc-toast-success{background:#f0fdf4;color:#166534;border-color:#86efac}\n.glc-toast-error{background:#fef2f2;color:#991b1b;border-color:#fecaca}\n.glc-toast-link{color:#1d4ed8;text-decoration:underline;font-weight:600}\n.glc-toast-error .glc-toast-link{color:#b91c1c}\n.glc-toast-close{margin-left:8px;border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;line-height:1}\n.glc-toast-enter{animation:glc-toast-fade-in .16s ease}\n.glc-toast-leave{animation:glc-toast-fade-out .16s ease forwards}\n@keyframes glc-toast-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}\n@keyframes glc-toast-fade-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}\n.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}\n.glc-progress-list li{display:flex;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}\n.glc-progress-platform{font-weight:700;color:#0f172a}\n.glc-progress-state{color:#334155}\n";
      module.exports = {
        UPDATE_STATUS: UPDATE_STATUS,
        BASE_STYLE: BASE_STYLE
      };
    }
  });

  // src/platforms/epic.ts
  var require_epic = __commonJS({
    "src/platforms/epic.ts": function srcPlatformsEpicTs(exports, module) {
      "use strict";

      function createEpicModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showToast = context.showToast,
          runAutoUpdateWithRateLimit = context.runAutoUpdateWithRateLimit,
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
            var _updateLibrary2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
              return _regeneratorRuntime().wrap(function _callee9$(_context0) {
                while (1) {
                  switch (_context0.prev = _context0.next) {
                    case 0:
                      if (_updateLibrary) {
                        _context0.next = 3;
                        break;
                      }
                      _context0.next = 3;
                      return moduleApi.start();
                    case 3:
                      return _context0.abrupt("return", _updateLibrary());
                    case 4:
                    case "end":
                      return _context0.stop();
                  }
                }
              }, _callee9);
            }));
            function updateLibrary() {
              return _updateLibrary2.apply(this, arguments);
            }
            return updateLibrary;
          }(),
          start: function () {
            var _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
              var loadTimes, catalogOfferSha256Hash, locale, observer, checkEpicGame, _checkEpicGame, getEpicOwnedGames, getSha256Hash, _getSha256Hash, getPagePlug, _getPagePlug, getEpicCookies, getAllEpicCookies, parseSetCookieHeader, extractAndSetCookies, getLocationHeader, requestWithRedirect, _requestWithRedirect, updateEpicOwnedGames, _updateEpicOwnedGames;
              return _regeneratorRuntime().wrap(function _callee17$(_context18) {
                while (1) {
                  switch (_context18.prev = _context18.next) {
                    case 0:
                      _updateEpicOwnedGames = function _updateEpicOwnedGames3() {
                        _updateEpicOwnedGames = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
                          var loop,
                            i,
                            games,
                            nextPageToken,
                            xsrfToken,
                            allCookies,
                            _args17 = arguments;
                          return _regeneratorRuntime().wrap(function _callee16$(_context17) {
                            while (1) {
                              switch (_context17.prev = _context17.next) {
                                case 0:
                                  loop = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : true;
                                  i = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : 0;
                                  games = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : GM_getValue("ownedGames") || [];
                                  nextPageToken = _args17.length > 3 && _args17[3] !== undefined ? _args17[3] : "";
                                  console.log("[EGLC] updateEpicOwnedGames...");
                                  if (!(!loop && i !== 0)) {
                                    _context17.next = 9;
                                    break;
                                  }
                                  GM_setValue("ownedGames", games);
                                  checkEpicGame(false);
                                  return _context17.abrupt("return");
                                case 9:
                                  _context17.next = 11;
                                  return getEpicCookies("XSRF-AM-TOKEN");
                                case 11:
                                  xsrfToken = _context17.sent;
                                  _context17.next = 14;
                                  return getAllEpicCookies();
                                case 14:
                                  allCookies = _context17.sent;
                                  if (loop) {
                                    showUpdateStep("epic", "\u7B2C ".concat(i + 1, " \u9875"));
                                  }
                                  return _context17.abrupt("return", requestWithRedirect("https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?count=10&sortDir=DESC&sortBy=DATE&locale=".concat(locale).concat(nextPageToken ? "&nextPageToken=".concat(encodeURIComponent(nextPageToken)) : ""), {
                                    method: "GET",
                                    timeout: 3e4,
                                    nocache: true,
                                    responseType: "json",
                                    fetch: true,
                                    headers: {
                                      referer: "https://accounts.epicgames.com/",
                                      dnt: "1",
                                      pragma: "no-cache",
                                      priority: "u=1, i",
                                      "sec-ch-ua": '"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"',
                                      "sec-ch-ua-mobile": "?0",
                                      "sec-ch-ua-platform": '"Windows"',
                                      "sec-fetch-dest": "empty",
                                      "sec-fetch-mode": "cors",
                                      "sec-fetch-site": "same-origin",
                                      "sec-gpc": "1",
                                      "x-csrf-token": "null",
                                      "x-xsrf-token": xsrfToken,
                                      cookie: allCookies
                                    }
                                  }).then(/*#__PURE__*/function () {
                                    var _ref16 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(response) {
                                      var _response$response2, _response$response2$o, _response$response3, _response$response3$p;
                                      var ordersLength, orderedGames, nextPageToken2;
                                      return _regeneratorRuntime().wrap(function _callee14$(_context15) {
                                        while (1) {
                                          switch (_context15.prev = _context15.next) {
                                            case 0:
                                              if (!/login/i.test(response.finalUrl)) {
                                                _context15.next = 2;
                                                break;
                                              }
                                              return _context15.abrupt("return", {
                                                status: UPDATE_STATUS.AUTH_EXPIRED,
                                                platformName: "Epic",
                                                loginUrl: "https://www.epicgames.com/id/login"
                                              });
                                            case 2:
                                              ordersLength = ((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : (_response$response2$o = _response$response2.orders) === null || _response$response2$o === void 0 ? void 0 : _response$response2$o.length) || 0;
                                              if (!(ordersLength >= 0)) {
                                                _context15.next = 28;
                                                break;
                                              }
                                              orderedGames = response.response.orders.map(function (order) {
                                                var _order$items;
                                                return (_order$items = order.items) === null || _order$items === void 0 ? void 0 : _order$items[0];
                                              }).filter(function (item) {
                                                return Boolean(item);
                                              });
                                              _context15.next = 7;
                                              return Promise.all(orderedGames.map(/*#__PURE__*/function () {
                                                var _ref17 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(item) {
                                                  var pageSlug;
                                                  return _regeneratorRuntime().wrap(function _callee13$(_context14) {
                                                    while (1) {
                                                      switch (_context14.prev = _context14.next) {
                                                        case 0:
                                                          if (!games.find(function (game) {
                                                            return game.namespace === item.namespace && game.offerId === item.offerId;
                                                          })) {
                                                            _context14.next = 2;
                                                            break;
                                                          }
                                                          return _context14.abrupt("return", true);
                                                        case 2:
                                                          _context14.next = 4;
                                                          return getPagePlug(item.namespace, item.offerId);
                                                        case 4:
                                                          pageSlug = _context14.sent;
                                                          console.log("[EGLC] pageSlug: ".concat(pageSlug));
                                                          if (pageSlug) {
                                                            games.push({
                                                              namespace: item.namespace,
                                                              offerId: item.offerId,
                                                              pageSlug: pageSlug
                                                            });
                                                            GM_setValue("ownedGames", games);
                                                          }
                                                          return _context14.abrupt("return", true);
                                                        case 8:
                                                        case "end":
                                                          return _context14.stop();
                                                      }
                                                    }
                                                  }, _callee13);
                                                }));
                                                return function (_x14) {
                                                  return _ref17.apply(this, arguments);
                                                };
                                              }()));
                                            case 7:
                                              nextPageToken2 = response.response.nextPageToken;
                                              if (!nextPageToken2) {
                                                _context15.next = 17;
                                                break;
                                              }
                                              if (!loop) {
                                                _context15.next = 12;
                                                break;
                                              }
                                              _context15.next = 12;
                                              return new Promise(function (resolve) {
                                                setTimeout(function () {
                                                  resolve(true);
                                                }, 1e3);
                                              });
                                            case 12:
                                              _context15.next = 14;
                                              return updateEpicOwnedGames(loop, ++i, games, nextPageToken2);
                                            case 14:
                                              return _context15.abrupt("return", _context15.sent);
                                            case 17:
                                              if (!loop) {
                                                _context15.next = 22;
                                                break;
                                              }
                                              GM_setValue("ownedGames", games);
                                              _context15.next = 21;
                                              return showUpdateResult("Epic已拥有游戏数据更新完成", "success");
                                            case 21:
                                              return _context15.abrupt("return", true);
                                            case 22:
                                              GM_setValue("ownedGames", games);
                                              checkEpicGame(false);
                                              console.log("[EGLC] updateEpicOwnedGames: Finish!");
                                              return _context15.abrupt("return", true);
                                            case 28:
                                              if (!(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : (_response$response3$p = _response$response3.products) === null || _response$response3$p === void 0 ? void 0 : _response$response3$p.length) !== 0)) {
                                                _context15.next = 33;
                                                break;
                                              }
                                              console.error(response);
                                              _context15.next = 32;
                                              return showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                                            case 32:
                                              return _context15.abrupt("return", false);
                                            case 33:
                                              return _context15.abrupt("return", false);
                                            case 34:
                                            case "end":
                                              return _context15.stop();
                                          }
                                        }
                                      }, _callee14);
                                    }));
                                    return function (_x13) {
                                      return _ref16.apply(this, arguments);
                                    };
                                  }())["catch"](/*#__PURE__*/function () {
                                    var _ref18 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(error) {
                                      return _regeneratorRuntime().wrap(function _callee15$(_context16) {
                                        while (1) {
                                          switch (_context16.prev = _context16.next) {
                                            case 0:
                                              console.error(error);
                                              _context16.next = 3;
                                              return showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                                            case 3:
                                              return _context16.abrupt("return", false);
                                            case 4:
                                            case "end":
                                              return _context16.stop();
                                          }
                                        }
                                      }, _callee15);
                                    }));
                                    return function (_x15) {
                                      return _ref18.apply(this, arguments);
                                    };
                                  }()));
                                case 17:
                                case "end":
                                  return _context17.stop();
                              }
                            }
                          }, _callee16);
                        }));
                        return _updateEpicOwnedGames.apply(this, arguments);
                      };
                      updateEpicOwnedGames = function _updateEpicOwnedGames2() {
                        return _updateEpicOwnedGames.apply(this, arguments);
                      };
                      _requestWithRedirect = function _requestWithRedirect3() {
                        _requestWithRedirect = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(initialUrl, baseOptions) {
                          var maxRedirects,
                            currentUrl,
                            i,
                            response,
                            status,
                            location,
                            _args13 = arguments;
                          return _regeneratorRuntime().wrap(function _callee12$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  maxRedirects = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : 10;
                                  currentUrl = initialUrl;
                                  i = 0;
                                case 3:
                                  if (!(i < maxRedirects)) {
                                    _context13.next = 22;
                                    break;
                                  }
                                  _context13.next = 6;
                                  return new Promise(function (res, rej) {
                                    GM_xmlhttpRequest(_objectSpread(_objectSpread({}, baseOptions), {}, {
                                      url: currentUrl,
                                      redirect: "manual",
                                      onload: res,
                                      onerror: rej,
                                      ontimeout: rej
                                    }));
                                  });
                                case 6:
                                  response = _context13.sent;
                                  status = response.status;
                                  if (!(status === 301 || status === 302 || status === 303 || status === 307 || status === 308)) {
                                    _context13.next = 16;
                                    break;
                                  }
                                  _context13.next = 11;
                                  return extractAndSetCookies(response.responseHeaders, currentUrl);
                                case 11:
                                  location = getLocationHeader(response.responseHeaders);
                                  if (location) {
                                    _context13.next = 14;
                                    break;
                                  }
                                  throw new Error("[EGLC] Redirect without Location header");
                                case 14:
                                  currentUrl = location;
                                  return _context13.abrupt("continue", 19);
                                case 16:
                                  if (!(status === 200)) {
                                    _context13.next = 18;
                                    break;
                                  }
                                  return _context13.abrupt("return", response);
                                case 18:
                                  throw response;
                                case 19:
                                  i++;
                                  _context13.next = 3;
                                  break;
                                case 22:
                                  throw new Error("[EGLC] Too many redirects");
                                case 23:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee12);
                        }));
                        return _requestWithRedirect.apply(this, arguments);
                      };
                      requestWithRedirect = function _requestWithRedirect2(_x10, _x11) {
                        return _requestWithRedirect.apply(this, arguments);
                      };
                      getLocationHeader = function _getLocationHeader(responseHeaders) {
                        var match = responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.match(/^location:\s*(.+)/im);
                        return match ? match[1].trim() : null;
                      };
                      extractAndSetCookies = function _extractAndSetCookies(responseHeaders, url) {
                        if (!responseHeaders) return Promise.resolve();
                        var setCookieLines = responseHeaders.split(/\r?\n/).filter(function (line) {
                          return /^set-cookie:\s*/i.test(line);
                        });
                        if (!setCookieLines.length) return Promise.resolve();
                        var cookiePromises = setCookieLines.map(function (line) {
                          var cookieStr = line.replace(/^set-cookie:\s*/i, "");
                          var cookie = parseSetCookieHeader(cookieStr, url);
                          return new Promise(function (resolve) {
                            GM_cookie.set(cookie, function (error) {
                              if (error) console.error("[EGLC] Cookie set error:", error);
                              resolve();
                            });
                          });
                        });
                        return Promise.all(cookiePromises);
                      };
                      parseSetCookieHeader = function _parseSetCookieHeader(cookieString, fallbackUrl) {
                        var parts = cookieString.split(";").map(function (s) {
                          return s.trim();
                        });
                        var _parts = _toArray(parts),
                          nameValue = _parts[0],
                          attrs = _parts.slice(1);
                        var eqIdx = nameValue.indexOf("=");
                        var name = eqIdx >= 0 ? nameValue.slice(0, eqIdx).trim() : nameValue.trim();
                        var value = eqIdx >= 0 ? nameValue.slice(eqIdx + 1).trim() : "";
                        var cookie = {
                          url: fallbackUrl,
                          name: name,
                          value: value || "",
                          path: "/",
                          secure: false,
                          httpOnly: false,
                          expirationDate: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 30
                        };
                        attrs.forEach(function (attr) {
                          var eqIdx2 = attr.indexOf("=");
                          var key = eqIdx2 >= 0 ? attr.slice(0, eqIdx2).trim().toLowerCase() : attr.trim().toLowerCase();
                          var val = eqIdx2 >= 0 ? attr.slice(eqIdx2 + 1).trim() : "";
                          if (key === "domain") cookie.domain = val.startsWith(".") ? val : ".".concat(val);else if (key === "path") cookie.path = val || "/";else if (key === "secure") cookie.secure = true;else if (key === "httponly") cookie.httpOnly = true;else if (key === "expires") {
                            var exp = new Date(val).getTime();
                            if (!isNaN(exp)) cookie.expirationDate = Math.floor(exp / 1e3);
                          } else if (key === "max-age") {
                            cookie.expirationDate = Math.floor(Date.now() / 1e3) + parseInt(val, 10);
                          }
                        });
                        return cookie;
                      };
                      getAllEpicCookies = function _getAllEpicCookies() {
                        return new Promise(function (resolve, reject) {
                          GM_cookie.list({
                            url: "https://accounts.epicgames.com/"
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
                      };
                      getEpicCookies = function _getEpicCookies(name) {
                        return new Promise(function (resolve, reject) {
                          GM_cookie.list({
                            url: "https://accounts.epicgames.com/",
                            name: name
                          }, function (cookies, error) {
                            var _cookies$;
                            if (error) {
                              reject(error);
                              return;
                            }
                            resolve(((_cookies$ = cookies[0]) === null || _cookies$ === void 0 ? void 0 : _cookies$.value) || "null");
                          });
                        });
                      };
                      _getPagePlug = function _getPagePlug3() {
                        _getPagePlug = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(namespace, offerId) {
                          return _regeneratorRuntime().wrap(function _callee11$(_context12) {
                            while (1) {
                              switch (_context12.prev = _context12.next) {
                                case 0:
                                  console.log("[EGLC] getPagePlug...");
                                  if (!(catalogOfferSha256Hash === false)) {
                                    _context12.next = 4;
                                    break;
                                  }
                                  _context12.next = 4;
                                  return getSha256Hash();
                                case 4:
                                  if (catalogOfferSha256Hash) {
                                    _context12.next = 7;
                                    break;
                                  }
                                  console.log("[EGLC] No catalogOfferSha256Hash");
                                  return _context12.abrupt("return", false);
                                case 7:
                                  return _context12.abrupt("return", new Promise(function (resolve, reject) {
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
                                    var _ref15 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(response) {
                                      var _response$response, _response$response$da, _response$response$da2;
                                      var _offerMappings$, _customAttributes$fin, _customAttributes$fin2, _response$response$da3, offerMappings, urlSlug, customAttributes;
                                      return _regeneratorRuntime().wrap(function _callee10$(_context11) {
                                        while (1) {
                                          switch (_context11.prev = _context11.next) {
                                            case 0:
                                              if (!((_response$response = response.response) !== null && _response$response !== void 0 && (_response$response$da = _response$response.data) !== null && _response$response$da !== void 0 && (_response$response$da2 = _response$response$da.Catalog) !== null && _response$response$da2 !== void 0 && _response$response$da2.catalogOffer)) {
                                                _context11.next = 3;
                                                break;
                                              }
                                              _response$response$da3 = response.response.data.Catalog.catalogOffer, offerMappings = _response$response$da3.offerMappings, urlSlug = _response$response$da3.urlSlug, customAttributes = _response$response$da3.customAttributes;
                                              return _context11.abrupt("return", _toConsumableArray(new Set([offerMappings === null || offerMappings === void 0 ? void 0 : (_offerMappings$ = offerMappings[0]) === null || _offerMappings$ === void 0 ? void 0 : _offerMappings$.pageSlug, urlSlug, customAttributes === null || customAttributes === void 0 ? void 0 : (_customAttributes$fin = customAttributes.find(function (e) {
                                                return e.key === "com.epicgames.app.productSlug";
                                              })) === null || _customAttributes$fin === void 0 ? void 0 : (_customAttributes$fin2 = _customAttributes$fin.value) === null || _customAttributes$fin2 === void 0 ? void 0 : _customAttributes$fin2.replace(/\/home$/, "")].filter(function (slug) {
                                                return Boolean(slug);
                                              }))));
                                            case 3:
                                              return _context11.abrupt("return", false);
                                            case 4:
                                            case "end":
                                              return _context11.stop();
                                          }
                                        }
                                      }, _callee10);
                                    }));
                                    return function (_x12) {
                                      return _ref15.apply(this, arguments);
                                    };
                                  }())["catch"](function (error) {
                                    console.error(error);
                                    return false;
                                  }));
                                case 8:
                                case "end":
                                  return _context12.stop();
                              }
                            }
                          }, _callee11);
                        }));
                        return _getPagePlug.apply(this, arguments);
                      };
                      getPagePlug = function _getPagePlug2(_x0, _x1) {
                        return _getPagePlug.apply(this, arguments);
                      };
                      _getSha256Hash = function _getSha256Hash3() {
                        _getSha256Hash = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee1() {
                          return _regeneratorRuntime().wrap(function _callee1$(_context10) {
                            while (1) {
                              switch (_context10.prev = _context10.next) {
                                case 0:
                                  console.log("[EGLC] getSha256Hash...");
                                  return _context10.abrupt("return", new Promise(function (resolve, reject) {
                                    GM_xmlhttpRequest({
                                      method: "GET",
                                      url: "https://store.epicgames.com/p/grand-theft-auto-v?lang=zh-CN",
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
                                    var _ref11 = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
                                    var _ref12 = _slicedToArray(_ref11, 2);
                                    catalogOfferSha256Hash = _ref12[1];
                                    var _ref13 = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ["en-US"];
                                    var _ref14 = _slicedToArray(_ref13, 2);
                                    locale = _ref14[1];
                                    console.log("[EGLC] ", JSON.stringify({
                                      catalogOfferSha256Hash: catalogOfferSha256Hash,
                                      locale: locale
                                    }));
                                  })["catch"](function (error) {
                                    console.error(error);
                                  }));
                                case 2:
                                case "end":
                                  return _context10.stop();
                              }
                            }
                          }, _callee1);
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
                        _checkEpicGame = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0() {
                          var first,
                            again,
                            ownedGames,
                            wishlistGames,
                            excludedClass,
                            epicLink,
                            autoUpdate,
                            runner,
                            _args1 = arguments;
                          return _regeneratorRuntime().wrap(function _callee0$(_context1) {
                            while (1) {
                              switch (_context1.prev = _context1.next) {
                                case 0:
                                  first = _args1.length > 0 && _args1[0] !== undefined ? _args1[0] : true;
                                  again = _args1.length > 1 && _args1[1] !== undefined ? _args1[1] : false;
                                  loadTimes++;
                                  if (!(loadTimes > 1e3)) {
                                    _context1.next = 6;
                                    break;
                                  }
                                  observer.disconnect();
                                  return _context1.abrupt("return");
                                case 6:
                                  ownedGames = getEpicOwnedGames();
                                  wishlistGames = GM_getValue("epicWishist") || [];
                                  excludedClass = again ? "epic-game-checked" : "epic-game-link-owned";
                                  epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]').filter(function (el) {
                                    return !el.classList.contains(excludedClass);
                                  });
                                  if (!(epicLink.length === 0)) {
                                    _context1.next = 12;
                                    break;
                                  }
                                  return _context1.abrupt("return");
                                case 12:
                                  if (first) {
                                    autoUpdate = function autoUpdate() {
                                      return updateEpicOwnedGames(false);
                                    };
                                    runner = autoUpdate;
                                    if (typeof runAutoUpdateWithRateLimit === "function") {
                                      runner = function runner() {
                                        return runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                                      };
                                    }
                                    Promise.resolve(runner()).then(function (result) {
                                      if (_typeof(result) === "object" && (result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                                        showToast("Epic 登录状态已过期，请先登录", "error", {
                                          duration: 0,
                                          closable: true,
                                          link: {
                                            href: result.loginUrl,
                                            text: "去登录"
                                          }
                                        });
                                      }
                                    });
                                  }
                                  epicLink.forEach(function (el) {
                                    var _href$match, _href$match$, _href$match2, _href$match2$;
                                    addClass(el, "epic-game-checked");
                                    var href = getHref(el);
                                    if (!/\/$/.test(href)) href += "/";
                                    var epicGameName = (_href$match = href.match(/https?:\/\/(www|store)\.epicgames\.com(\/.*?)?\/p(roduct)?\/([^?/]+)/i)) === null || _href$match === void 0 ? void 0 : (_href$match$ = _href$match[4]) === null || _href$match$ === void 0 ? void 0 : _href$match$.toLowerCase();
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
                                      return;
                                    }
                                    var epicGameOfferId = (_href$match2 = href.match(/https?:\/\/(store|www)\.epicgames\.com\/purchase\?offers=([\w-]+)/i)) === null || _href$match2 === void 0 ? void 0 : (_href$match2$ = _href$match2[2]) === null || _href$match2$ === void 0 ? void 0 : _href$match2$.toLowerCase();
                                    if (epicGameOfferId) {
                                      if (ownedGames.find(function (game) {
                                        return epicGameOfferId.includes(game.offerId);
                                      })) {
                                        addClass(el, "epic-game-link-owned");
                                      } else if (wishlistGames.find(function (game) {
                                        return epicGameOfferId.includes(game.offerId);
                                      })) {
                                        addClass(el, "epic-game-link-wishlist");
                                      }
                                    }
                                  });
                                case 14:
                                case "end":
                                  return _context1.stop();
                              }
                            }
                          }, _callee0);
                        }));
                        return _checkEpicGame.apply(this, arguments);
                      };
                      checkEpicGame = function _checkEpicGame2() {
                        return _checkEpicGame.apply(this, arguments);
                      };
                      if (!started) {
                        _context18.next = 18;
                        break;
                      }
                      return _context18.abrupt("return");
                    case 18:
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
                      _context18.next = 25;
                      return getSha256Hash();
                    case 25:
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
                      GM_addStyle("\n.epic-game-link-owned {\n  color:#ffffff !important;\n  background:#5c8a00 !important\n}\n.epic-game-link-wishlist {\n  color:#ffffff !important;\n  background:#007399 !important\n}");
                    case 30:
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

  // src/platforms/gog.ts
  var require_gog = __commonJS({
    "src/platforms/gog.ts": function srcPlatformsGogTs(exports, module) {
      "use strict";

      function createGogModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showToast = context.showToast,
          runAutoUpdateWithRateLimit = context.runAutoUpdateWithRateLimit,
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
              if (first) {
                var autoUpdate = function autoUpdate() {
                  return updateGogGameLibrary(false);
                };
                var runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = function runner() {
                    return runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                  };
                }
                Promise.resolve(runner()).then(function (result) {
                  if (_typeof(result) === "object" && (result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                    showToast("GOG 登录状态已过期，请先登录", "error", {
                      duration: 0,
                      closable: true,
                      link: {
                        href: result.loginUrl,
                        text: "去登录"
                      }
                    });
                  }
                });
              }
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
                var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(response) {
                  var _response$response4, _response$response4$p, _response$response5, _response$response5$p;
                  var pageGames;
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
                          if (!((_response$response4 = response.response) !== null && _response$response4 !== void 0 && (_response$response4$p = _response$response4.products) !== null && _response$response4$p !== void 0 && _response$response4$p.length)) {
                            _context19.next = 23;
                            break;
                          }
                          pageGames = response.response.products.map(function (product) {
                            var _product$url;
                            var urlParts = (_product$url = product.url) === null || _product$url === void 0 ? void 0 : _product$url.split("/");
                            return product.slug || (urlParts === null || urlParts === void 0 ? void 0 : urlParts[urlParts.length - 1]);
                          }).filter(function (game) {
                            return Boolean(game);
                          });
                          games = [].concat(_toConsumableArray(games), _toConsumableArray(pageGames));
                          if (!((response.response.totalPages || 0) > i)) {
                            _context19.next = 13;
                            break;
                          }
                          _context19.next = 10;
                          return updateGogGameLibrary(loop, ++i, games);
                        case 10:
                          return _context19.abrupt("return", _context19.sent);
                        case 13:
                          if (!loop) {
                            _context19.next = 18;
                            break;
                          }
                          GM_setValue("gogGames", _toConsumableArray(new Set(games)).filter(function (e) {
                            return e;
                          }));
                          _context19.next = 17;
                          return showUpdateResult("gog游戏库数据更新完成", "success");
                        case 17:
                          return _context19.abrupt("return", true);
                        case 18:
                          GM_setValue("gogGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getGogGameLibrary()), _toConsumableArray(games)))).filter(function (e) {
                            return e;
                          }));
                          checkGogGame(false);
                          return _context19.abrupt("return", true);
                        case 23:
                          if (!(((_response$response5 = response.response) === null || _response$response5 === void 0 ? void 0 : (_response$response5$p = _response$response5.products) === null || _response$response5$p === void 0 ? void 0 : _response$response5$p.length) !== 0)) {
                            _context19.next = 28;
                            break;
                          }
                          console.error(response);
                          _context19.next = 27;
                          return showUpdateResult("gog游戏库数据更新失败", "error");
                        case 27:
                          return _context19.abrupt("return", false);
                        case 28:
                          return _context19.abrupt("return", false);
                        case 29:
                        case "end":
                          return _context19.stop();
                      }
                    }
                  }, _callee18);
                }));
                return function (_x16) {
                  return _ref19.apply(this, arguments);
                };
              }())["catch"](/*#__PURE__*/function () {
                var _ref20 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(error) {
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
                return function (_x17) {
                  return _ref20.apply(this, arguments);
                };
              }());
            }
            _updateLibrary3 = updateGogGameLibrary;
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

  // src/core/itch-linkage.ts
  var require_itch_linkage = __commonJS({
    "src/core/itch-linkage.ts": function srcCoreItchLinkageTs(exports, module) {
      "use strict";

      var ITCH_LINKAGE_CODE_KEY = "itchLinkageCode";
      function sha256(value) {
        var _globalThis$crypto;
        var fallback = function fallback() {
          return sha256Fallback(value);
        };
        if (!((_globalThis$crypto = globalThis.crypto) !== null && _globalThis$crypto !== void 0 && _globalThis$crypto.subtle) || typeof TextEncoder === "undefined") {
          return Promise.resolve(fallback());
        }
        return globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(function (buffer) {
          return Array.from(new Uint8Array(buffer)).map(function (_byte) {
            return _byte.toString(16).padStart(2, "0");
          }).join("");
        })["catch"](fallback);
      }
      function sha256Fallback(value) {
        var bytes = unescape(encodeURIComponent(value)).split("").map(function (_char) {
          return _char.charCodeAt(0);
        });
        var bitLength = bytes.length * 8;
        bytes.push(128);
        while (bytes.length % 64 !== 56) {
          bytes.push(0);
        }
        for (var index = 7; index >= 0; index--) {
          bytes.push(bitLength / Math.pow(2, index * 8) & 255);
        }
        var constants = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        var hash = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
        var rotateRight = function rotateRight(number, bits) {
          return number >>> bits | number << 32 - bits;
        };
        for (var offset = 0; offset < bytes.length; offset += 64) {
          var words = new Array(64);
          for (var _index = 0; _index < 16; _index++) {
            var position = offset + _index * 4;
            words[_index] = bytes[position] << 24 | bytes[position + 1] << 16 | bytes[position + 2] << 8 | bytes[position + 3];
          }
          for (var _index2 = 16; _index2 < 64; _index2++) {
            var s0 = rotateRight(words[_index2 - 15], 7) ^ rotateRight(words[_index2 - 15], 18) ^ words[_index2 - 15] >>> 3;
            var s1 = rotateRight(words[_index2 - 2], 17) ^ rotateRight(words[_index2 - 2], 19) ^ words[_index2 - 2] >>> 10;
            words[_index2] = words[_index2 - 16] + s0 + words[_index2 - 7] + s1 | 0;
          }
          var a = hash[0],
            b = hash[1],
            c = hash[2],
            d = hash[3],
            e = hash[4],
            f = hash[5],
            g = hash[6],
            h = hash[7];
          for (var _index3 = 0; _index3 < 64; _index3++) {
            var _s = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
            var choice = e & f ^ ~e & g;
            var temp1 = h + _s + choice + constants[_index3] + words[_index3] | 0;
            var _s2 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
            var majority = a & b ^ a & c ^ b & c;
            var temp2 = _s2 + majority | 0;
            var _ref21 = [g, f, e, d + temp1 | 0, c, b, a, temp1 + temp2 | 0];
            h = _ref21[0];
            g = _ref21[1];
            f = _ref21[2];
            e = _ref21[3];
            d = _ref21[4];
            c = _ref21[5];
            b = _ref21[6];
            a = _ref21[7];
          }
          hash[0] = hash[0] + a | 0;
          hash[1] = hash[1] + b | 0;
          hash[2] = hash[2] + c | 0;
          hash[3] = hash[3] + d | 0;
          hash[4] = hash[4] + e | 0;
          hash[5] = hash[5] + f | 0;
          hash[6] = hash[6] + g | 0;
          hash[7] = hash[7] + h | 0;
        }
        return hash.map(function (word) {
          return (word >>> 0).toString(16).padStart(8, "0");
        }).join("");
      }
      function createItchLinkage(_ref22) {
        var getGames = _ref22.getGames,
          addGames = _ref22.addGames,
          updateLibrary = _ref22.updateLibrary,
          showToast = _ref22.showToast;
        var mousePosition = {
          x: 0,
          y: 0
        };
        var linkageCode = GM_getValue(ITCH_LINKAGE_CODE_KEY) || "";
        document.addEventListener("mousemove", function (event) {
          mousePosition = {
            x: event.clientX,
            y: event.clientY
          };
        }, {
          passive: true
        });
        function exposeLinkage() {
          if (!linkageCode) return;
          var linkage = function itchLibraryLinkage() {};
          Object.defineProperties(linkage, {
            connected: {
              enumerable: true,
              get: function get() {
                return true;
              }
            },
            has: {
              enumerable: true,
              value: function value(game) {
                return typeof game === "string" && getGames().includes(game);
              }
            },
            get: {
              enumerable: true,
              value: function value() {
                return _toConsumableArray(getGames());
              }
            },
            add: {
              enumerable: true,
              value: function value(games) {
                return addGames(games);
              }
            },
            removeOwned: {
              enumerable: true,
              value: function value(games) {
                return Array.isArray(games) ? games.filter(function (game) {
                  return !getGames().includes(game);
                }) : [];
              }
            },
            update: {
              enumerable: true,
              value: function value() {
                return updateLibrary(false, 1);
              }
            }
          });
          unsafeWindow[linkageCode] = linkage;
        }
        function generateLinkageCode() {
          var navigatorInfo = navigator;
          var fingerprint = JSON.stringify({
            browser: {
              userAgent: navigator.userAgent,
              language: navigator.language,
              languages: navigator.languages,
              vendor: navigator.vendor
            },
            system: {
              platform: navigator.platform,
              hardwareConcurrency: navigator.hardwareConcurrency,
              deviceMemory: navigatorInfo.deviceMemory,
              screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
              }
            },
            time: (/* @__PURE__ */new Date()).toISOString(),
            window: {
              innerWidth: window.innerWidth,
              innerHeight: window.innerHeight,
              outerWidth: window.outerWidth,
              outerHeight: window.outerHeight
            },
            mouse: mousePosition
          });
          return sha256(fingerprint).then(function (code) {
            linkageCode = code;
            GM_setValue(ITCH_LINKAGE_CODE_KEY, linkageCode);
            exposeLinkage();
            window.prompt("Itch 联动码已生成并保存，请复制：", linkageCode);
            return linkageCode;
          })["catch"](function (error) {
            console.error("生成 Itch 联动码失败", error);
            showToast("生成 Itch 联动码失败：浏览器不支持 SHA-256", "error");
            return "";
          });
        }
        exposeLinkage();
        return {
          generateLinkageCode: generateLinkageCode
        };
      }
      module.exports = {
        createItchLinkage: createItchLinkage
      };
    }
  });

  // src/platforms/itch.ts
  var require_itch = __commonJS({
    "src/platforms/itch.ts": function srcPlatformsItchTs(exports, module) {
      "use strict";

      var _require_itch_linkage = require_itch_linkage(),
        createItchLinkage = _require_itch_linkage.createItchLinkage;
      function createItchModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          parseHtml = context.parseHtml,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showToast = context.showToast,
          runAutoUpdateWithRateLimit = context.runAutoUpdateWithRateLimit,
          UPDATE_STATUS = context.UPDATE_STATUS;
        var _updateLibrary4;
        var started = false;
        function getItchGameLibrary() {
          return GM_getValue("itchGames") || [];
        }
        function addItchGames(games) {
          if (!Array.isArray(games)) return getItchGameLibrary();
          var library = _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games))));
          GM_setValue("itchGames", library);
          return library;
        }
        var moduleApi = {
          key: "itch",
          enabled: function enabled() {
            return settings.platformEnabled.itch;
          },
          isCacheEmpty: function isCacheEmpty() {
            return getItchGameLibrary().length === 0;
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
              if (first) {
                var autoUpdate = function autoUpdate() {
                  return updateItchGameLibrary(false);
                };
                var runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = function runner() {
                    return runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                  };
                }
                Promise.resolve(runner()).then(function (result) {
                  if (_typeof(result) === "object" && (result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                    showToast("itch.io 登录状态已过期，请先登录", "error", {
                      duration: 0,
                      closable: true,
                      link: {
                        href: result.loginUrl,
                        text: "去登录"
                      }
                    });
                  }
                });
              }
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
                var _ref23 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20(response) {
                  var _response$response6, _response$response7;
                  var itchDoc, purchaseLinks, pageGames;
                  return _regeneratorRuntime().wrap(function _callee20$(_context21) {
                    while (1) {
                      switch (_context21.prev = _context21.next) {
                        case 0:
                          if (!/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                            _context21.next = 4;
                            break;
                          }
                          return _context21.abrupt("return", {
                            status: UPDATE_STATUS.AUTH_EXPIRED,
                            platformName: "itch.io",
                            loginUrl: "https://itch.io/login"
                          });
                        case 4:
                          if (!((_response$response6 = response.response) !== null && _response$response6 !== void 0 && _response$response6.num_items)) {
                            _context21.next = 25;
                            break;
                          }
                          itchDoc = parseHtml("<div>".concat(response.response.content || "", "</div>"));
                          purchaseLinks = Array.from(itchDoc.querySelectorAll("a.thumb_link.game_link"));
                          pageGames = purchaseLinks.map(function (el) {
                            var _getHref$match;
                            return (_getHref$match = getHref(el).match(/https?:\/\/(.*?\/.*?)\//i)) === null || _getHref$match === void 0 ? void 0 : _getHref$match[1];
                          }).filter(function (game) {
                            return Boolean(game);
                          });
                          games = [].concat(_toConsumableArray(games), _toConsumableArray(pageGames));
                          if (!(response.response.num_items === 50)) {
                            _context21.next = 15;
                            break;
                          }
                          _context21.next = 12;
                          return updateItchGameLibrary(loop, ++i, games);
                        case 12:
                          return _context21.abrupt("return", _context21.sent);
                        case 15:
                          if (!loop) {
                            _context21.next = 20;
                            break;
                          }
                          GM_setValue("itchGames", _toConsumableArray(new Set(games)));
                          _context21.next = 19;
                          return showUpdateResult("itch游戏库数据更新完成", "success");
                        case 19:
                          return _context21.abrupt("return", true);
                        case 20:
                          GM_setValue("itchGames", _toConsumableArray(/* @__PURE__ */new Set([].concat(_toConsumableArray(getItchGameLibrary()), _toConsumableArray(games)))));
                          checkItchGame(false);
                          return _context21.abrupt("return", true);
                        case 25:
                          if (!(((_response$response7 = response.response) === null || _response$response7 === void 0 ? void 0 : _response$response7.num_items) === 0)) {
                            _context21.next = 30;
                            break;
                          }
                          GM_setValue("itchGames", _toConsumableArray(new Set(games)));
                          _context21.next = 29;
                          return showUpdateResult("itch游戏库数据更新完成", "success");
                        case 29:
                          return _context21.abrupt("return", true);
                        case 30:
                          console.error(response);
                          _context21.next = 33;
                          return showUpdateResult("itch游戏库数据更新失败", "error");
                        case 33:
                          return _context21.abrupt("return", false);
                        case 34:
                        case "end":
                          return _context21.stop();
                      }
                    }
                  }, _callee20);
                }));
                return function (_x18) {
                  return _ref23.apply(this, arguments);
                };
              }())["catch"](/*#__PURE__*/function () {
                var _ref24 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21(error) {
                  return _regeneratorRuntime().wrap(function _callee21$(_context22) {
                    while (1) {
                      switch (_context22.prev = _context22.next) {
                        case 0:
                          console.error(error);
                          _context22.next = 3;
                          return showUpdateResult("itch游戏库数据更新失败", "error");
                        case 3:
                          return _context22.abrupt("return", false);
                        case 4:
                        case "end":
                          return _context22.stop();
                      }
                    }
                  }, _callee21);
                }));
                return function (_x19) {
                  return _ref24.apply(this, arguments);
                };
              }());
            }
            _updateLibrary4 = updateItchGameLibrary;
            GM_addStyle(".itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
            unsafeWindow.checkItchGame = checkItchGame;
          }
        };
        var itchLinkage = createItchLinkage({
          getGames: getItchGameLibrary,
          addGames: addItchGames,
          updateLibrary: function updateLibrary() {
            var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            if (!started) moduleApi.start();
            return _updateLibrary4(loop, i);
          },
          showToast: showToast
        });
        moduleApi.generateLinkageCode = itchLinkage.generateLinkageCode;
        return moduleApi;
      }
      module.exports = {
        createItchModule: createItchModule
      };
    }
  });

  // src/platforms/ig.ts
  var require_ig = __commonJS({
    "src/platforms/ig.ts": function srcPlatformsIgTs(exports, module) {
      "use strict";

      function createIgModule(context) {
        var settings = context.settings,
          queryLinks = context.queryLinks,
          addClass = context.addClass,
          getHref = context.getHref,
          parseHtml = context.parseHtml,
          showUpdateStep = context.showUpdateStep,
          showUpdateResult = context.showUpdateResult,
          showToast = context.showToast,
          runAutoUpdateWithRateLimit = context.runAutoUpdateWithRateLimit,
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
        function requestIgShowcasePage(_x20, _x21) {
          return _requestIgShowcasePage.apply(this, arguments);
        }
        function _requestIgShowcasePage() {
          _requestIgShowcasePage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22(page, cookies) {
            return _regeneratorRuntime().wrap(function _callee22$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    return _context23.abrupt("return", new Promise(function (resolve, reject) {
                      GM_xmlhttpRequest({
                        url: "https://www.indiegala.com/library/showcase/".concat(page),
                        method: "GET",
                        timeout: 3e4,
                        headers: {
                          cookie: cookies
                        },
                        onerror: reject,
                        ontimeout: reject,
                        onload: function onload(response) {
                          response.status === 200 ? resolve(response) : reject(response);
                        }
                      });
                    }));
                  case 1:
                  case "end":
                    return _context23.stop();
                }
              }
            }, _callee22);
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
          }).filter(function (game) {
            return Boolean(game);
          });
          return {
            pages: pages,
            games: games
          };
        }
        function updateIgGameLibrary() {
          return _updateIgGameLibrary.apply(this, arguments);
        }
        function _updateIgGameLibrary() {
          _updateIgGameLibrary = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
            var loop,
              owned,
              cookies,
              firstPageResponse,
              firstParsed,
              allGames,
              page,
              response,
              parsed,
              _args24 = arguments;
            return _regeneratorRuntime().wrap(function _callee23$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    loop = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : true;
                    _context24.prev = 1;
                    owned = getIgOwnedGames();
                    if (loop) {
                      showUpdateStep("ig", "第 1 页");
                    }
                    _context24.next = 6;
                    return getIgCookies();
                  case 6:
                    cookies = _context24.sent;
                    _context24.next = 9;
                    return requestIgShowcasePage(1, cookies);
                  case 9:
                    firstPageResponse = _context24.sent;
                    if (!(new URL(firstPageResponse.finalUrl).pathname === "/login")) {
                      _context24.next = 12;
                      break;
                    }
                    return _context24.abrupt("return", {
                      status: UPDATE_STATUS.AUTH_EXPIRED,
                      platformName: "IG",
                      loginUrl: "https://www.indiegala.com/login"
                    });
                  case 12:
                    firstParsed = parseIgShowcase(firstPageResponse.responseText, 1);
                    allGames = [].concat(_toConsumableArray(owned), _toConsumableArray(firstParsed.games));
                    if (loop) {
                      _context24.next = 19;
                      break;
                    }
                    allGames = Array.from(new Set(allGames)).filter(Boolean);
                    GM_setValue("IG-Owned", {
                      time: Date.now(),
                      games: allGames
                    });
                    markIgLinks();
                    return _context24.abrupt("return", true);
                  case 19:
                    page = 2;
                  case 20:
                    if (!(page <= firstParsed.pages)) {
                      _context24.next = 30;
                      break;
                    }
                    showUpdateStep("ig", "\u7B2C ".concat(page, " \u9875"));
                    _context24.next = 24;
                    return requestIgShowcasePage(page, cookies);
                  case 24:
                    response = _context24.sent;
                    parsed = parseIgShowcase(response.responseText, page);
                    allGames = allGames.concat(parsed.games);
                  case 27:
                    page += 1;
                    _context24.next = 20;
                    break;
                  case 30:
                    allGames = Array.from(new Set(allGames)).filter(Boolean);
                    GM_setValue("IG-Owned", {
                      time: Date.now(),
                      games: allGames
                    });
                    _context24.next = 34;
                    return showUpdateResult("IG游戏库数据更新完成", "success");
                  case 34:
                    markIgLinks();
                    return _context24.abrupt("return", true);
                  case 38:
                    _context24.prev = 38;
                    _context24.t0 = _context24["catch"](1);
                    console.error(_context24.t0);
                    if (!loop) {
                      _context24.next = 44;
                      break;
                    }
                    _context24.next = 44;
                    return showUpdateResult("IG游戏库数据更新失败", "error");
                  case 44:
                    return _context24.abrupt("return", false);
                  case 45:
                  case "end":
                    return _context24.stop();
                }
              }
            }, _callee23, null, [[1, 38]]);
          }));
          return _updateIgGameLibrary.apply(this, arguments);
        }
        var moduleApi = {
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
            var autoUpdate = function autoUpdate() {
              return updateIgGameLibrary(false);
            };
            var runner = autoUpdate;
            if (typeof runAutoUpdateWithRateLimit === "function") {
              runner = function runner() {
                return runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
              };
            }
            Promise.resolve(runner()).then(function (result) {
              if (_typeof(result) === "object" && (result === null || result === void 0 ? void 0 : result.status) === UPDATE_STATUS.AUTH_EXPIRED) {
                showToast("IG 登录状态已过期，请先登录", "error", {
                  duration: 0,
                  closable: true,
                  link: {
                    href: result.loginUrl,
                    text: "去登录"
                  }
                });
              }
            });
            var observer = new MutationObserver(function () {
              markIgLinks();
            });
            observer.observe(document.documentElement, {
              attributes: false,
              characterData: false,
              childList: true,
              subtree: true
            });
            GM_addStyle(".ig-owned{color:#ffffff !important;background:#5c8a00 !important}");
          }
        };
        return moduleApi;
      }
      module.exports = {
        createIgModule: createIgModule
      };
    }
  });

  // src/runtime/bootstrap.ts
  var require_bootstrap = __commonJS({
    "src/runtime/bootstrap.ts": function srcRuntimeBootstrapTs(exports, module) {
      "use strict";

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
      var _require_gist_sync = require_gist_sync(),
        createGistSyncController = _require_gist_sync.createGistSyncController;
      var _require_constants = require_constants(),
        UPDATE_STATUS = _require_constants.UPDATE_STATUS,
        BASE_STYLE = _require_constants.BASE_STYLE;
      var _require_epic = require_epic(),
        createEpicModule = _require_epic.createEpicModule;
      var _require_gog = require_gog(),
        createGogModule = _require_gog.createGogModule;
      var _require_itch = require_itch(),
        createItchModule = _require_itch.createItchModule;
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
        var _createGistSyncContro = createGistSyncController({
            showDialog: showDialog,
            showToast: showToast
          }),
          openGistSyncDialog = _createGistSyncContro.openGistSyncDialog;
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
              GM_openInTab(loginUrl, {
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
          showUpdateResult = _createStartupFlow.showUpdateResult,
          openManualUpdateDialogAndRun = _createStartupFlow.openManualUpdateDialogAndRun,
          runAutoUpdateWithRateLimit = _createStartupFlow.runAutoUpdateWithRateLimit;
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
          runAutoUpdateWithRateLimit: runAutoUpdateWithRateLimit,
          UPDATE_STATUS: UPDATE_STATUS
        };
        GM_registerMenuCommand("设置", setting);
        GM_registerMenuCommand("平台开关", openPlatformSwitchDialog);
        GM_registerMenuCommand("数据同步设置", openGistSyncDialog);
        GM_addStyle(BASE_STYLE);
        var itchModule = createItchModule(moduleContext);
        GM_registerMenuCommand("生成Itch联动码", function () {
          return itchModule.generateLinkageCode();
        });
        if (!isUrlEnabled(window.location.href)) return;
        var modules = [createEpicModule(moduleContext), createGogModule(moduleContext), itchModule,
        // createCubeModule(moduleContext),
        createIgModule(moduleContext)];
        GM_registerMenuCommand("更新游戏库", function () {
          openManualUpdateDialogAndRun(modules);
        });
        runInitialFlow(modules);
      }
      module.exports = {
        bootstrapMergedRuntime: bootstrapMergedRuntime2
      };
    }
  });

  // src/index.ts
  var _require_bootstrap = require_bootstrap(),
    bootstrapMergedRuntime = _require_bootstrap.bootstrapMergedRuntime;
  (function main() {
    bootstrapMergedRuntime();
  })();
})();