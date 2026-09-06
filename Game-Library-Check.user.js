// ==UserScript==
// @name           游戏库检测-合集
// @name:en        Game Library Check
// @namespace      game-library-check
// @version        2.0.3
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
// @grant          GM_unregisterMenuCommand
// @grant          GM_addValueChangeListener
// @grant          GM_removeValueChangeListener
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
// @connect        gist.githubusercontent.com
// @connect        cdn.jsdelivr.net
// @run-at         document-end
// @noframes
// ==/UserScript==
"use strict";

(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
        exports: {}
      }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);

  // src/ui/dialog.ts
  var require_dialog = __commonJS({
    "src/ui/dialog.ts"(exports, module) {
      "use strict";

      var activeDialogClose = null;
      function createModalRoot() {
        let root = document.getElementById("glc-modal-root");
        if (root) return root;
        root = document.createElement("div");
        root.id = "glc-modal-root";
        document.body.appendChild(root);
        return root;
      }
      function showDialog({
        title,
        bodyHtml,
        trustedBodyHtml = false,
        bodyText = "",
        bodyNode,
        confirmText = "确定",
        cancelText = "取消",
        onConfirm,
        onCancel,
        denyText,
        onDeny,
        hideCancel = false
      }) {
        if (typeof activeDialogClose === "function") {
          activeDialogClose();
        }
        const root = createModalRoot();
        root.innerHTML = `
    <div class="glc-mask">
      <div class="glc-dialog glc-dialog-shell" role="dialog" aria-modal="true">
        <h3 class="glc-dialog-title glc-dialog-header"></h3>
        <div class="glc-dialog-body glc-dialog-content"></div>
        <div class="glc-dialog-actions">
          <button type="button" data-glc-cancel></button>
          <button type="button" data-glc-deny></button>
          <button type="button" data-glc-confirm></button>
        </div>
      </div>
    </div>`;
        const maskEl = root.querySelector(".glc-mask");
        const titleEl = root.querySelector(".glc-dialog-title");
        const bodyEl = root.querySelector(".glc-dialog-body");
        const cancelBtn = root.querySelector("[data-glc-cancel]");
        const denyBtn = root.querySelector("[data-glc-deny]");
        const confirmBtn = root.querySelector("[data-glc-confirm]");
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
        let closed = false;
        const close = () => {
          if (closed) return;
          closed = true;
          document.removeEventListener("keydown", onKeydown);
          maskEl?.removeEventListener("click", onMaskClick);
          if (activeDialogClose === close) {
            activeDialogClose = null;
          }
          root.innerHTML = "";
        };
        const runAndClose = callback => {
          try {
            if (typeof callback === "function") callback(root);
          } finally {
            close();
          }
        };
        const onKeydown = event => {
          if (closed) return;
          if (event.key === "Escape") runAndClose(onCancel);
        };
        const onMaskClick = event => {
          if (closed) return;
          if (event.target !== maskEl) return;
          runAndClose(onCancel);
        };
        activeDialogClose = close;
        document.addEventListener("keydown", onKeydown);
        maskEl?.addEventListener("click", onMaskClick);
        cancelBtn?.addEventListener("click", () => {
          if (closed) return;
          runAndClose(onCancel);
        });
        denyBtn?.addEventListener("click", () => {
          if (closed) return;
          runAndClose(onDeny);
        });
        confirmBtn?.addEventListener("click", () => {
          if (closed) return;
          runAndClose(onConfirm);
        });
      }
      module.exports = {
        createModalRoot,
        showDialog
      };
    }
  });

  // src/ui/toast.ts
  var require_toast = __commonJS({
    "src/ui/toast.ts"(exports, module) {
      "use strict";

      function createToastContainer() {
        let container = document.getElementById("glc-toast-container");
        if (container) return container;
        container = document.createElement("div");
        container.id = "glc-toast-container";
        document.body.appendChild(container);
        return container;
      }
      function showToast(message, type = "info", options = {}) {
        const el = document.createElement("div");
        el.className = `glc-toast glc-toast-content glc-toast-${type}`;
        el.textContent = message;
        if (options?.link?.href) {
          const link = document.createElement("a");
          link.href = options.link.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = options.link.text || options.link.href;
          link.className = "glc-toast-link";
          el.appendChild(document.createTextNode(" "));
          el.appendChild(link);
        }
        if (options?.closable) {
          const closeButton = document.createElement("button");
          closeButton.type = "button";
          closeButton.className = "glc-toast-close";
          closeButton.textContent = "×";
          closeButton.addEventListener("click", () => el.remove());
          el.appendChild(document.createTextNode(" "));
          el.appendChild(closeButton);
        }
        el.classList.add("glc-toast-enter");
        createToastContainer().appendChild(el);
        const duration = typeof options.duration === "number" ? options.duration : 6e3;
        if (duration <= 0) return;
        window.setTimeout(() => {
          el.classList.remove("glc-toast-enter");
          el.classList.add("glc-toast-leave");
          window.setTimeout(() => el.remove(), 140);
        }, duration);
      }
      module.exports = {
        createToastContainer,
        showToast
      };
    }
  });

  // src/ui/progress.ts
  var require_progress = __commonJS({
    "src/ui/progress.ts"(exports, module) {
      "use strict";

      function createProgressController(createModalRoot) {
        let progressPanelStateMap = {};
        function showProgressPanel(stateMap, {
          replace = false
        } = {}) {
          if (replace) {
            progressPanelStateMap = {
              ...(stateMap || {})
            };
          } else {
            progressPanelStateMap = {
              ...progressPanelStateMap,
              ...(stateMap || {})
            };
          }
          const root = createModalRoot();
          root.innerHTML = `
      <div class="glc-mask">
        <div class="glc-dialog glc-progress-dialog" role="dialog" aria-modal="true">
          <h3 class="glc-dialog-title"></h3>
          <ul class="glc-progress-list"></ul>
        </div>
      </div>`;
          const titleEl = root.querySelector(".glc-dialog-title");
          const listEl = root.querySelector(".glc-progress-list");
          if (titleEl) titleEl.textContent = "正在更新缓存";
          if (listEl) {
            Object.entries(progressPanelStateMap).forEach(([platform, state]) => {
              const li = document.createElement("li");
              li.className = "glc-progress-row";
              const platformEl = document.createElement("span");
              platformEl.className = "glc-progress-platform";
              platformEl.textContent = String(platform).toUpperCase();
              const stateEl = document.createElement("span");
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
          const root = createModalRoot();
          if (root.querySelector(".glc-progress-dialog")) root.innerHTML = "";
        }
        return {
          showProgressPanel,
          clearProgressPanel
        };
      }
      module.exports = {
        createProgressController
      };
    }
  });

  // src/core/sha256.ts
  var sha256_exports = {};
  __export(sha256_exports, {
    sha256: () => sha256
  });
  function sha256(bytes) {
    const constants = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
    const state = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
    padded.set(bytes);
    padded[bytes.length] = 128;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 8, Math.floor(bytes.length / 536870912));
    view.setUint32(padded.length - 4, bytes.length * 8);
    const rotate = (x, n) => x >>> n | x << 32 - n;
    const words = new Int32Array(64);
    for (let offset = 0; offset < padded.length; offset += 64) {
      for (let i = 0; i < 16; i++) words[i] = view.getInt32(offset + i * 4);
      for (let i = 16; i < 64; i++) {
        const x = words[i - 15],
          y = words[i - 2];
        words[i] = words[i - 16] + (rotate(x, 7) ^ rotate(x, 18) ^ x >>> 3) + words[i - 7] + (rotate(y, 17) ^ rotate(y, 19) ^ y >>> 10);
      }
      let [a, b, c, d, e, f, g, h] = state;
      for (let i = 0; i < 64; i++) {
        const t1 = h + (rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25)) + (e & f ^ ~e & g) + constants[i] + words[i] | 0;
        const t2 = (rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22)) + (a & b ^ a & c ^ b & c) | 0;
        h = g;
        g = f;
        f = e;
        e = d + t1 | 0;
        d = c;
        c = b;
        b = a;
        a = t1 + t2 | 0;
      }
      [a, b, c, d, e, f, g, h].forEach((value, i) => {
        state[i] = state[i] + value | 0;
      });
    }
    return state.map(value => (value >>> 0).toString(16).padStart(8, "0")).join("");
  }
  var init_sha256 = __esm({
    "src/core/sha256.ts"() {
      "use strict";
    }
  });

  // src/core/sync-data.ts
  var sync_data_exports = {};
  __export(sync_data_exports, {
    SYNC_KEYS: () => SYNC_KEYS,
    applySnapshot: () => applySnapshot,
    canonical: () => canonical,
    chooseDirection: () => chooseDirection,
    hashData: () => hashData,
    libraryUpdateInProgress: () => libraryUpdateInProgress,
    localVersion: () => localVersion,
    makeSnapshot: () => makeSnapshot,
    parseSnapshot: () => parseSnapshot,
    readData: () => readData,
    setSyncValue: () => setSyncValue,
    trackLibraryUpdate: () => trackLibraryUpdate,
    validateData: () => validateData
  });
  async function trackLibraryUpdate(work) {
    const key = `gistLibraryUpdate:${Date.now()}:${Math.random()}`;
    GM_setValue(key, Date.now() + 9e5);
    const heartbeat = setInterval(() => GM_setValue(key, Date.now() + 9e5), 6e4);
    try {
      return await work();
    } finally {
      clearInterval(heartbeat);
      GM_deleteValue(key);
    }
  }
  function libraryUpdateInProgress() {
    let updating = false;
    for (const key of GM_listValues()) {
      if (!key.startsWith("gistLibraryUpdate:")) continue;
      if (Number(GM_getValue(key)) > Date.now()) updating = true;else GM_deleteValue(key);
    }
    return updating;
  }
  function canonical(value) {
    if (Array.isArray(value)) return `[${value.map(canonical).sort().join(",")}]`;
    if (value && typeof value === "object") return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
    return JSON.stringify(value) ?? "null";
  }
  function businessValue(key, value) {
    if (key === "IG-Owned" && value && typeof value === "object") return {
      games: value.games
    };
    return value;
  }
  function readData() {
    const data = {};
    for (const key of SYNC_KEYS) {
      const value = GM_getValue(key);
      if (value !== void 0) data[key] = businessValue(key, value);
    }
    return data;
  }
  function setSyncValue(key, value) {
    const changed = canonical(businessValue(key, GM_getValue(key))) !== canonical(businessValue(key, value));
    GM_setValue(key, value);
    if (changed) {
      const previous = GM_getValue(VERSION_KEY);
      GM_setValue(VERSION_KEY, {
        updatedAt: Math.max(Date.now(), (previous?.updatedAt || 0) + 1),
        fingerprint: canonical(readData())
      });
    }
  }
  function localVersion() {
    const data = readData();
    const fingerprint = canonical(data);
    const version = GM_getValue(VERSION_KEY);
    return {
      data,
      fingerprint,
      updatedAt: version?.fingerprint === fingerprint ? version.updatedAt : 0
    };
  }
  async function hashData(data) {
    const bytes = new TextEncoder().encode(canonical(data));
    if (typeof crypto === "undefined" || !crypto.subtle) {
      const {
        sha256: sha2562
      } = (init_sha256(), __toCommonJS(sha256_exports));
      return sha2562(bytes);
    }
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
  }
  async function makeSnapshot(data, updatedAt) {
    return {
      schemaVersion: 2,
      dataUpdatedAt: updatedAt,
      dataHash: await hashData(data),
      data
    };
  }
  function isRecord(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }
  function validateData(raw) {
    if (!isRecord(raw)) throw new Error("远程备份格式无效");
    const data = {};
    const strings = v => Array.isArray(v) && v.every(x => typeof x === "string");
    for (const key of SYNC_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
      const value = raw[key];
      let valid = false;
      if (["gogGames", "itchGames", "whiteList", "blackList"].includes(key)) valid = strings(value);
      if (key === "cubeGames") valid = Array.isArray(value) && value.every(x => typeof x === "number" && Number.isFinite(x));
      if (key === "IG-Owned") valid = isRecord(value) && strings(value.games);
      if (key === "ownedGames" || key === "epicWishist") valid = Array.isArray(value) && value.every(x => isRecord(x) && typeof x.offerId === "string" && strings(x.pageSlug) && (key !== "ownedGames" || typeof x.namespace === "string"));
      if (key === "globalSettings") valid = isRecord(value) && strings(value.whiteList) && strings(value.blackList) && isRecord(value.platformEnabled) && Object.values(value.platformEnabled).every(x => typeof x === "boolean");
      if (!valid) throw new Error(`远程备份中的 ${key} 格式无效`);
      data[key] = businessValue(key, value);
    }
    if (!Object.keys(data).length) throw new Error("备份没有可同步的数据");
    return data;
  }
  async function parseSnapshot(raw) {
    if (!isRecord(raw)) throw new Error("远程备份格式无效");
    if (!("schemaVersion" in raw)) return makeSnapshot(validateData(raw), 0);
    if (raw.schemaVersion !== 2) throw new Error("不支持的备份版本");
    if (!Number.isSafeInteger(raw.dataUpdatedAt) || Number(raw.dataUpdatedAt) <= 0 || Number(raw.dataUpdatedAt) > Date.now() + 3e5) throw new Error("备份时间无效，请检查设备时间");
    const snapshot = await makeSnapshot(validateData(raw.data), Number(raw.dataUpdatedAt));
    if (snapshot.dataHash !== raw.dataHash) throw new Error("备份内容校验失败");
    return snapshot;
  }
  function chooseDirection(local, remote) {
    if (!Number.isSafeInteger(local.dataUpdatedAt) || local.dataUpdatedAt < 0 || local.dataUpdatedAt > Date.now() + 3e5) throw new Error("本地数据时间异常，请检查设备时间");
    if (!remote) {
      if (local.dataUpdatedAt > 0 && Object.keys(local.data).length) return "upload";
      throw new Error("本地数据没有更新时间，请手动上传建立基线");
    }
    if (local.dataHash === remote.dataHash && remote.dataUpdatedAt > 0) return "unchanged";
    if (!Object.keys(local.data).length && remote.dataUpdatedAt > 0) return "download";
    if (!local.dataUpdatedAt || !remote.dataUpdatedAt) throw new Error("旧数据缺少更新时间，请手动选择上传或下载建立基线");
    if (local.dataUpdatedAt === remote.dataUpdatedAt) throw new Error("两端时间相同但内容不同，请手动选择上传或下载");
    return local.dataUpdatedAt > remote.dataUpdatedAt ? "upload" : "download";
  }
  function applySnapshot(snapshot) {
    const old = new Map([...SYNC_KEYS, VERSION_KEY, "version"].map(key => [key, GM_getValue(key)]));
    try {
      for (const key of SYNC_KEYS) {
        if (Object.prototype.hasOwnProperty.call(snapshot.data, key)) GM_setValue(key, snapshot.data[key]);else GM_deleteValue(key);
      }
      if ("ownedGames" in snapshot.data) GM_setValue("version", "1.1");
      GM_setValue(VERSION_KEY, {
        updatedAt: snapshot.dataUpdatedAt,
        fingerprint: canonical(snapshot.data)
      });
    } catch (error) {
      for (const [key, value] of old) {
        if (value === void 0) GM_deleteValue(key);else GM_setValue(key, value);
      }
      throw error;
    }
  }
  var SYNC_KEYS, VERSION_KEY;
  var init_sync_data = __esm({
    "src/core/sync-data.ts"() {
      "use strict";

      SYNC_KEYS = ["ownedGames", "epicWishist", "gogGames", "itchGames", "cubeGames", "IG-Owned", "globalSettings", "whiteList", "blackList"];
      VERSION_KEY = "gistDataVersion";
    }
  });

  // src/core/settings.ts
  var require_settings = __commonJS({
    "src/core/settings.ts"(exports, module) {
      "use strict";

      var {
        setSyncValue: setSyncValue2
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      var SETTINGS_KEY = "globalSettings";
      function getGlobalSettings() {
        const defaults = {
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
        const saved = GM_getValue(SETTINGS_KEY) || {};
        return {
          whiteList: Array.isArray(saved.whiteList) ? saved.whiteList : defaults.whiteList,
          blackList: Array.isArray(saved.blackList) ? saved.blackList : defaults.blackList,
          platformEnabled: {
            ...defaults.platformEnabled,
            ...(saved.platformEnabled || {})
          }
        };
      }
      function setGlobalSettings(settings) {
        setSyncValue2(SETTINGS_KEY, settings);
      }
      function isUrlEnabledByList(url, settings) {
        const {
          whiteList,
          blackList
        } = settings;
        if (whiteList.length > 0) return whiteList.some(item => url.includes(item));
        if (blackList.length > 0) return !blackList.some(item => url.includes(item));
        return true;
      }
      function createSettingsController({
        showDialog
      }) {
        const settings = getGlobalSettings();
        function openPlatformSwitchDialog() {
          const current = settings.platformEnabled;
          const bodyNode = document.createElement("div");
          const platformRows = [["glc-epic", "Epic", current.epic], ["glc-gog", "GOG", current.gog], ["glc-itch", "Itch", current.itch],
          // ['glc-cube', 'Cube', current.cube],
          ["glc-ig", "IG", current.ig]];
          platformRows.forEach(([id, labelText, checked], index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = id;
            input.checked = Boolean(checked);
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${labelText}`));
            bodyNode.appendChild(label);
            if (index < 4) bodyNode.appendChild(document.createElement("br"));
          });
          showDialog({
            title: "平台开关",
            bodyNode,
            confirmText: "保存",
            cancelText: "取消",
            onConfirm: root => {
              settings.platformEnabled = {
                ...current,
                epic: root.querySelector("#glc-epic")?.checked ?? false,
                gog: root.querySelector("#glc-gog")?.checked ?? false,
                itch: root.querySelector("#glc-itch")?.checked ?? false,
                // cube: root.querySelector('#glc-cube').checked,
                ig: root.querySelector("#glc-ig")?.checked ?? false
              };
              setGlobalSettings(settings);
            }
          });
        }
        function showListEditor(title, initialValue, onSave) {
          const bodyNode = document.createElement("textarea");
          bodyNode.className = "glc-textarea";
          bodyNode.value = initialValue.join("\n");
          showDialog({
            title,
            bodyNode,
            confirmText: "保存",
            cancelText: "取消",
            onConfirm: root => {
              const value = root.querySelector(".glc-textarea")?.value || "";
              onSave(value ? value.split("\n") : []);
            }
          });
        }
        function addWhiteList() {
          showListEditor("添加白名单网站", settings.whiteList || [], value => {
            settings.whiteList = value;
            settings.blackList = settings.blackList || [];
            setGlobalSettings(settings);
          });
        }
        function addBlackList() {
          showListEditor("添加黑名单网站", settings.blackList || [], value => {
            settings.blackList = value;
            settings.whiteList = settings.whiteList || [];
            setGlobalSettings(settings);
          });
        }
        function setting() {
          const bodyNode = document.createElement("div");
          const whiteButton = document.createElement("button");
          const blackButton = document.createElement("button");
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
            bodyNode,
            confirmText: "关闭",
            hideCancel: true
          });
          document.getElementById("glc-open-whitelist")?.addEventListener("click", addWhiteList);
          document.getElementById("glc-open-blacklist")?.addEventListener("click", addBlackList);
        }
        return {
          settings,
          setting,
          openPlatformSwitchDialog,
          /** 使用此控制器的当前设置确定 URL 是否已启用。 */
          isUrlEnabled: url => isUrlEnabledByList(url, settings)
        };
      }
      module.exports = {
        getGlobalSettings,
        setGlobalSettings,
        isUrlEnabledByList,
        createSettingsController
      };
    }
  });

  // src/core/startup.ts
  var require_startup = __commonJS({
    "src/core/startup.ts"(exports, module) {
      "use strict";

      var {
        trackLibraryUpdate: trackLibraryUpdate2
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      function createStartupFlow({
        showDialog,
        showProgressPanel,
        clearProgressPanel,
        showToast,
        showLoginExpiredDialog,
        updateStatus
      }) {
        let inBatchUpdateFlow = false;
        const PLATFORM_UPDATE_RATE_KEY = "platformUpdateRate";
        const PLATFORM_LAST_UPDATE_AT_KEY = "platformLastUpdateAt";
        const TEN_MINUTES_MS = 10 * 60 * 1e3;
        const ONE_HOUR_MS = 60 * 60 * 1e3;
        function sanitizePlatformRateMap(raw, now = Date.now()) {
          if (!raw || typeof raw !== "object") return {};
          const oneHourAgo = now - ONE_HOUR_MS;
          const source = raw;
          const result = {};
          Object.keys(source).forEach(key => {
            const list = Array.isArray(source[key]) ? source[key] : [];
            result[key] = list.filter(ts => typeof ts === "number" && Number.isFinite(ts) && ts >= oneHourAgo && ts <= now);
          });
          return result;
        }
        function canRunAutoUpdate(platformKey, now = Date.now()) {
          const rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY), now);
          const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
          const tenMinutesAgo = now - TEN_MINUTES_MS;
          const oneHourAgo = now - ONE_HOUR_MS;
          const countIn10Minutes = history.filter(ts => ts >= tenMinutesAgo).length;
          const countIn1Hour = history.filter(ts => ts >= oneHourAgo).length;
          GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
          return countIn10Minutes < 5 && countIn1Hour < 30;
        }
        function recordAutoUpdateSuccess(platformKey, now = Date.now()) {
          const rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY), now);
          const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
          rateMap[platformKey] = history.concat(now).filter(ts => ts >= now - ONE_HOUR_MS);
          GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
          const lastUpdateMap = GM_getValue(PLATFORM_LAST_UPDATE_AT_KEY) || {};
          lastUpdateMap[platformKey] = now;
          GM_setValue(PLATFORM_LAST_UPDATE_AT_KEY, lastUpdateMap);
        }
        async function runAutoUpdateWithRateLimit(libraryModule, autoUpdateRunner) {
          if (!libraryModule?.key || typeof autoUpdateRunner !== "function") return false;
          if (!canRunAutoUpdate(libraryModule.key)) return false;
          const result = await trackLibraryUpdate2(autoUpdateRunner);
          if (result === true) recordAutoUpdateSuccess(libraryModule.key);
          return result;
        }
        function collectEmptyCaches(enabledModules) {
          return enabledModules.filter(libraryModule => libraryModule.isCacheEmpty()).map(libraryModule => libraryModule.key);
        }
        function showEmptyCacheAggregationDialog(emptyKeys, onConfirm, onCancel) {
          const bodyNode = document.createElement("div");
          emptyKeys.forEach((key, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.dataset.platform = key;
            input.checked = true;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${key.toUpperCase()}`));
            bodyNode.appendChild(label);
            if (index < emptyKeys.length - 1) bodyNode.appendChild(document.createElement("br"));
          });
          showDialog({
            title: "检测到缓存为空的平台",
            bodyNode,
            confirmText: "立即更新",
            cancelText: "稍后再说",
            onConfirm: root => {
              const selected = Array.from(root.querySelectorAll("input[data-platform]:checked")).map(el => el.dataset.platform).filter(key => Boolean(key));
              onConfirm(selected);
            },
            onCancel: () => {
              if (typeof onCancel === "function") onCancel();
            }
          });
        }
        function getSelectedPlatformKeys(root) {
          return Array.from(root.querySelectorAll("input[data-platform]:checked:not(:disabled)")).map(el => el.dataset.platform).filter(key => Boolean(key));
        }
        function updateManualUpdateConfirmState(root) {
          if (!root) return;
          const confirmButton = root.querySelector("[data-glc-confirm]");
          if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
        }
        function buildPlatformCheckboxBody(modules, onSelectionChange) {
          const bodyNode = document.createElement("div");
          modules.forEach((libraryModule, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            const enabled = libraryModule.enabled();
            input.type = "checkbox";
            input.dataset.platform = libraryModule.key;
            input.checked = enabled;
            input.disabled = !enabled;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${libraryModule.key.toUpperCase()}`));
            bodyNode.appendChild(label);
            if (index < modules.length - 1) bodyNode.appendChild(document.createElement("br"));
          });
          bodyNode.addEventListener("change", () => {
            if (typeof onSelectionChange === "function") onSelectionChange(document.getElementById("glc-modal-root"));
          });
          return bodyNode;
        }
        function openManualUpdateDialogAndRun(modules) {
          const enabledModules = modules.filter(libraryModule => libraryModule.enabled());
          const bodyNode = buildPlatformCheckboxBody(modules, updateManualUpdateConfirmState);
          showDialog({
            title: "更新游戏库",
            bodyNode,
            confirmText: "开始更新",
            cancelText: "取消",
            onConfirm: async root => {
              const selectedKeys = getSelectedPlatformKeys(root);
              if (selectedKeys.length === 0) {
                showToast("请至少选择一个平台", "warning");
                return;
              }
              await batchUpdateSelectedModules(enabledModules, selectedKeys);
            }
          });
          updateManualUpdateConfirmState(document.getElementById("glc-modal-root"));
        }
        function extractFailureReason(failure) {
          if (!failure) return "未知错误";
          if (typeof failure === "string") return failure;
          if (failure instanceof Error && failure.message) return failure.message;
          if (typeof failure === "object") {
            const details = failure;
            if (typeof details.message === "string" && details.message.trim()) return details.message;
            if (typeof details.reason === "string" && details.reason.trim()) return details.reason;
            if (typeof details.error === "string" && details.error.trim()) return details.error;
          }
          return "未知错误";
        }
        function showUpdateFailureDialog(key, failure) {
          const platform = key.toUpperCase();
          const reason = extractFailureReason(failure);
          showDialog({
            title: "平台更新失败",
            bodyText: `${platform} 更新失败：${reason}`,
            confirmText: "确认",
            hideCancel: true
          });
        }
        function isAuthExpiredResult(result) {
          return typeof result === "object" && result !== null && result.status === updateStatus.AUTH_EXPIRED;
        }
        async function batchUpdateSelectedModules(enabledModules, selectedKeys) {
          const state = Object.fromEntries(selectedKeys.map(key => [key, "waiting"]));
          let interruptedByAuthExpired = false;
          inBatchUpdateFlow = true;
          showProgressPanel(state, {
            replace: true
          });
          try {
            for (const key of selectedKeys) {
              const libraryModule = enabledModules.find(item => item.key === key);
              if (!libraryModule) continue;
              state[key] = "running";
              showProgressPanel({
                [key]: state[key]
              });
              try {
                const updateResult = await trackLibraryUpdate2(() => libraryModule.updateLibrary());
                if (updateResult === true) {
                  state[key] = "success";
                } else if (isAuthExpiredResult(updateResult)) {
                  interruptedByAuthExpired = true;
                  state[key] = updateStatus.AUTH_EXPIRED;
                  clearProgressPanel();
                  showLoginExpiredDialog(updateResult.platformName, updateResult.loginUrl);
                  break;
                } else {
                  state[key] = "error";
                  showUpdateFailureDialog(key, updateResult);
                }
              } catch (error) {
                console.error(error);
                state[key] = "error";
                showUpdateFailureDialog(key, error);
              }
              if (!interruptedByAuthExpired) showProgressPanel({
                [key]: state[key]
              });
            }
          } finally {
            inBatchUpdateFlow = false;
          }
          if (!interruptedByAuthExpired) clearProgressPanel();
        }
        async function runInitialFlow(modules) {
          const enabledModules = modules.filter(libraryModule => libraryModule.enabled());
          const emptyKeys = collectEmptyCaches(enabledModules);
          if (emptyKeys.length > 0) {
            showEmptyCacheAggregationDialog(emptyKeys, async selectedKeys => {
              if (selectedKeys.length > 0) await batchUpdateSelectedModules(enabledModules, selectedKeys);
              enabledModules.forEach(libraryModule => libraryModule.start());
            }, () => {
              enabledModules.forEach(libraryModule => libraryModule.start());
            });
            return;
          }
          enabledModules.forEach(libraryModule => libraryModule.start());
        }
        function showUpdateStep(platform, text) {
          showProgressPanel({
            [platform]: text
          });
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
          collectEmptyCaches,
          showEmptyCacheAggregationDialog,
          batchUpdateSelectedModules,
          openManualUpdateDialogAndRun,
          runInitialFlow,
          showUpdateStep,
          showUpdateResult,
          runAutoUpdateWithRateLimit
        };
      }
      module.exports = {
        createStartupFlow
      };
    }
  });

  // src/core/gist-transport.ts
  var gist_transport_exports = {};
  __export(gist_transport_exports, {
    SyncError: () => SyncError,
    readRemote: () => readRemote,
    request: () => request,
    writeRemote: () => writeRemote
  });
  function request(url, conf, method = "GET", data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method,
        data,
        responseType: "json",
        timeout: 3e4,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${conf.TOKEN}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        onerror: () => reject(new SyncError("网络异常，请检查连接")),
        ontimeout: () => reject(new SyncError("连接超时，请稍后重试")),
        onload: response => {
          if (response.status >= 200 && response.status < 300) {
            resolve(response);
            return;
          }
          const headers = response.responseHeaders || "";
          const retry = headers.match(/^retry-after:\s*(.+)$/im)?.[1]?.trim();
          const reset = headers.match(/^x-ratelimit-reset:\s*(\d+)/im)?.[1];
          const apiMessage = response.response?.message;
          const limited = response.status === 429 || response.status === 403 && (/^x-ratelimit-remaining:\s*0\s*$/im.test(headers) || Boolean(retry) || typeof apiMessage === "string" && /secondary rate limit|rate limit exceeded/i.test(apiMessage));
          if (limited) {
            const retryAt = retry ? /^\d+$/.test(retry) ? Date.now() + Number(retry) * 1e3 : Date.parse(retry) : Number(reset) * 1e3;
            reject(new SyncError("GitHub 请求限流，稍后自动重试", false, Number.isFinite(retryAt) ? retryAt : 0));
          } else if (response.status === 401 || response.status === 403) reject(new SyncError("Token 无效或权限不足，请重新保存配置并测试", true));else if (response.status === 404) reject(new SyncError("Gist 不存在或没有访问权限", true));else reject(new SyncError(`GitHub 请求失败（${response.status}）`, response.status < 500));
        }
      });
    });
  }
  async function readRemote(conf) {
    const response = await request(urlFor(conf), conf);
    const body = response.response;
    if (!body?.files || typeof body.files !== "object" || body.truncated) throw new SyncError("Gist 文件列表不完整，无法安全同步", true);
    const file = Object.prototype.hasOwnProperty.call(body.files, conf.FILE_NAME) ? body.files[conf.FILE_NAME] : void 0;
    if (!file) return null;
    let raw;
    if (file.truncated) {
      const rawUrl = file.raw_url && new URL(file.raw_url);
      if (!rawUrl || rawUrl.protocol !== "https:" || rawUrl.hostname !== "gist.githubusercontent.com") throw new SyncError("远程文件地址无效", true);
      const response2 = await new Promise((resolve, reject) => GM_xmlhttpRequest({
        url: rawUrl.href,
        method: "GET",
        timeout: 3e4,
        responseType: "text",
        onload: resolve,
        onerror: () => reject(new SyncError("下载完整备份失败")),
        ontimeout: () => reject(new SyncError("下载完整备份超时"))
      }));
      if (response2.status !== 200) throw new SyncError("无法下载完整备份");
      try {
        raw = JSON.parse(response2.responseText);
      } catch {
        throw new SyncError("远程文件不是有效 JSON", true);
      }
    } else {
      try {
        raw = JSON.parse(file.content || "");
      } catch {
        throw new SyncError("远程文件不是有效 JSON", true);
      }
    }
    try {
      return await parseSnapshot2(raw);
    } catch (error) {
      throw new SyncError(error.message, true);
    }
  }
  async function writeRemote(conf, snapshot) {
    await request(urlFor(conf), conf, "PATCH", JSON.stringify({
      files: {
        [conf.FILE_NAME]: {
          content: JSON.stringify(snapshot)
        }
      }
    }));
    const confirmed = await readRemote(conf);
    if (!confirmed || confirmed.dataHash !== snapshot.dataHash || confirmed.dataUpdatedAt !== snapshot.dataUpdatedAt) throw new SyncError("远程内容已变化，未能确认上传结果");
  }
  var parseSnapshot2, SyncError, urlFor;
  var init_gist_transport = __esm({
    "src/core/gist-transport.ts"() {
      "use strict";

      ({
        parseSnapshot: parseSnapshot2
      } = (init_sync_data(), __toCommonJS(sync_data_exports)));
      SyncError = class extends Error {
        constructor(message, permanent = false, retryAt = 0) {
          super(message);
          this.permanent = permanent;
          this.retryAt = retryAt;
        }
      };
      urlFor = conf => `https://api.github.com/gists/${encodeURIComponent(conf.GIST_ID)}`;
    }
  });

  // src/core/gist-auto-sync.ts
  var gist_auto_sync_exports = {};
  __export(gist_auto_sync_exports, {
    CONF_KEY: () => CONF_KEY,
    createSyncEngine: () => createSyncEngine,
    getGistConf: () => getGistConf,
    getState: () => getState,
    isDue: () => isDue,
    relativeTime: () => relativeTime,
    stateKey: () => stateKey
  });
  function getGistConf() {
    const conf = GM_getValue(CONF_KEY) || {};
    return {
      TOKEN: conf.TOKEN || "",
      GIST_ID: conf.GIST_ID || "",
      FILE_NAME: conf.FILE_NAME || "",
      enabled: conf.enabled === true,
      intervalHours: Number.isInteger(conf.intervalHours) && Number(conf.intervalHours) >= 1 && Number(conf.intervalHours) <= 720 ? Number(conf.intervalHours) : 24
    };
  }
  function stateKey(conf) {
    return `gistSyncState:${JSON.stringify([conf.GIST_ID, conf.FILE_NAME])}`;
  }
  function getState(conf = getGistConf()) {
    return GM_getValue(stateKey(conf)) || {};
  }
  function relativeTime(at, now = Date.now()) {
    if (!at) return "尚未同步";
    const minutes = Math.max(0, Math.floor((now - at) / 6e4));
    return minutes < 1 ? "刚刚同步" : minutes < 60 ? `${minutes} 分钟前同步` : minutes < 1440 ? `${Math.floor(minutes / 60)} 小时前同步` : `${Math.floor(minutes / 1440)} 天前同步`;
  }
  function isDue(conf, state, now = Date.now()) {
    return conf.enabled && !state.paused && (state.nextRetryAt ? now >= state.nextRetryAt : !state.lastSyncSuccessAt || now >= state.lastSyncSuccessAt + conf.intervalHours * 36e5);
  }
  function createSyncEngine(options) {
    const read = options.read || readRemote2;
    const write = options.write || writeRemote2;
    const delay = options.delay || (ms => new Promise(resolve => window.setTimeout(resolve, ms)));
    const owner = `${Date.now()}-${Math.random()}`;
    let busy = false;
    let disposed = false;
    const lease = () => GM_getValue(LOCK_KEY);
    const sameConf = conf => JSON.stringify(conf) === JSON.stringify(getGistConf());
    function release() {
      if (lease()?.owner === owner) GM_deleteValue(LOCK_KEY);
    }
    async function run(mode = "auto", scheduled = false) {
      if (busy || disposed) return;
      const conf = getGistConf();
      if (!conf.TOKEN || !conf.GIST_ID || !conf.FILE_NAME) {
        if (!scheduled) options.notify("请先保存完整的 Gist 配置并测试", true);
        return;
      }
      if (scheduled && (!options.allowed() || !isDue(conf, getState(conf)))) return;
      if (libraryUpdateInProgress2()) {
        if (!scheduled) options.notify("游戏库正在更新，完成后再同步", false);
        return;
      }
      busy = true;
      let acquired = false;
      const guard = () => {
        if (disposed || !sameConf(conf) || lease()?.owner !== owner || scheduled && !options.allowed()) throw new SyncError2("同步条件已变化，请重新同步");
        GM_setValue(LOCK_KEY, {
          owner,
          until: Date.now() + 3e5
        });
      };
      try {
        await delay(100 + Math.random() * 200);
        const current = lease();
        if (current && current.until > Date.now()) {
          if (!scheduled) options.notify("其他标签页正在同步，请稍后再试", false);
          return;
        }
        GM_setValue(LOCK_KEY, {
          owner,
          until: Date.now() + 3e5
        });
        await delay(150);
        if (lease()?.owner !== owner) return;
        acquired = true;
        guard();
        if (scheduled && !isDue(conf, getState(conf))) return;
        GM_setValue(stateKey(conf), {
          ...getState(conf),
          lastAttemptAt: Date.now()
        });
        options.changed();
        const initial = localVersion2();
        const local = await makeSnapshot2(initial.data, initial.updatedAt);
        const remote = await read(conf);
        guard();
        const unchangedLocal = () => {
          const current2 = localVersion2();
          if (libraryUpdateInProgress2() || current2.fingerprint !== initial.fingerprint || current2.updatedAt !== initial.updatedAt) throw new SyncError2("本地数据刚刚更新，将重新比较后同步");
        };
        unchangedLocal();
        let direction;
        try {
          direction = mode === "auto" ? chooseDirection2(local, remote) : mode;
        } catch (error) {
          throw new SyncError2(error.message, true);
        }
        let resultTime = remote?.dataUpdatedAt;
        if (direction === "upload") {
          if (!Object.keys(local.data).length) throw new SyncError2("本地没有可上传的数据", true);
          try {
            validateData2(local.data);
          } catch {
            throw new SyncError2("本地游戏库或设置格式无效，请先更新游戏库并保存设置", true);
          }
          const snapshot = mode === "upload" ? await makeSnapshot2(local.data, Date.now()) : local;
          const latest = await read(conf);
          guard();
          unchangedLocal();
          if (latest?.dataHash !== remote?.dataHash || latest?.dataUpdatedAt !== remote?.dataUpdatedAt) throw new SyncError2("远程数据刚刚更新，将重新比较后同步");
          await write(conf, snapshot);
          guard();
          unchangedLocal();
          GM_setValue("gistDataVersion", {
            updatedAt: snapshot.dataUpdatedAt,
            fingerprint: initial.fingerprint
          });
          resultTime = snapshot.dataUpdatedAt;
        } else if (direction === "download") {
          if (!remote) throw new SyncError2("远程文件不存在，无法下载", true);
          const snapshot = remote.dataUpdatedAt ? remote : await makeSnapshot2(remote.data, Date.now());
          guard();
          unchangedLocal();
          if (!remote.dataUpdatedAt) {
            const latest = await read(conf);
            guard();
            unchangedLocal();
            if (latest?.dataHash !== remote.dataHash || latest.dataUpdatedAt !== 0) throw new SyncError2("远程数据刚刚更新，请重新下载");
            await write(conf, snapshot);
            guard();
            unchangedLocal();
          }
          applySnapshot2(snapshot);
          resultTime = snapshot.dataUpdatedAt;
        } else if (remote) {
          GM_setValue("gistDataVersion", {
            updatedAt: remote.dataUpdatedAt,
            fingerprint: initial.fingerprint
          });
        }
        GM_setValue(stateKey(conf), {
          lastSyncSuccessAt: Date.now(),
          lastAttemptAt: Date.now(),
          lastDirection: direction,
          remoteUpdatedAt: resultTime
        });
        options.notify(direction === "upload" ? "Gist 同步成功：已上传本地数据" : direction === "download" ? "Gist 同步成功：已下载远程数据" : "Gist 同步成功：两端数据已一致", false);
        if (direction === "download") options.applied();
      } catch (error) {
        if (acquired && !disposed && sameConf(conf) && lease()?.owner === owner) {
          const failure = error instanceof SyncError2 ? error : new SyncError2("同步失败，无法完成数据读写");
          const state = getState(conf);
          const failures = (state.failures || 0) + 1;
          GM_setValue(stateKey(conf), {
            ...state,
            lastError: failure.message,
            failures,
            paused: failure.permanent,
            nextRetryAt: Math.max(failure.retryAt, Date.now() + [5, 15, 60][Math.min(failures - 1, 2)] * 6e4)
          });
          options.notify(`Gist 同步失败：${failure.message}`, true);
        }
      } finally {
        if (acquired) release();
        busy = false;
        options.changed();
      }
    }
    return {
      run,
      isBusy: () => busy,
      dispose: () => {
        disposed = true;
        release();
      }
    };
  }
  var SyncError2, readRemote2, writeRemote2, localVersion2, makeSnapshot2, chooseDirection2, applySnapshot2, libraryUpdateInProgress2, validateData2, CONF_KEY, LOCK_KEY;
  var init_gist_auto_sync = __esm({
    "src/core/gist-auto-sync.ts"() {
      "use strict";

      ({
        SyncError: SyncError2,
        readRemote: readRemote2,
        writeRemote: writeRemote2
      } = (init_gist_transport(), __toCommonJS(gist_transport_exports)));
      ({
        localVersion: localVersion2,
        makeSnapshot: makeSnapshot2,
        chooseDirection: chooseDirection2,
        applySnapshot: applySnapshot2,
        libraryUpdateInProgress: libraryUpdateInProgress2,
        validateData: validateData2
      } = (init_sync_data(), __toCommonJS(sync_data_exports)));
      CONF_KEY = "gistConf";
      LOCK_KEY = "gistSyncLease";
    }
  });

  // src/core/gist-sync.ts
  var require_gist_sync = __commonJS({
    "src/core/gist-sync.ts"(exports, module) {
      "use strict";

      var {
        getGistConf: getGistConf2,
        getState: getState2,
        stateKey: stateKey2,
        relativeTime: relativeTime2,
        createSyncEngine: createSyncEngine2,
        CONF_KEY: CONF_KEY2
      } = (init_gist_auto_sync(), __toCommonJS(gist_auto_sync_exports));
      var {
        readRemote: readRemote3
      } = (init_gist_transport(), __toCommonJS(gist_transport_exports));
      var {
        localVersion: localVersion3
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      function createGistSyncController({
        showDialog,
        showToast,
        isAllowed = () => true,
        onDataApplied = () => {}
      }) {
        let menuId;
        let caption = "";
        let timer;
        let statusNode;
        let pending;
        let active = false;
        let stateListener;
        let watchedState = "";
        const listeners = [];
        const notify = (message, error) => {
          if (document.visibilityState === "hidden") {
            pending = {
              message,
              error
            };
            return;
          }
          showToast(message, error ? "error" : "success", {
            duration: error ? 1e4 : 6e3,
            closable: true
          });
        };
        const engineOptions = {
          notify,
          changed: refresh,
          applied: onDataApplied,
          allowed: isAllowed
        };
        let engine = createSyncEngine2(engineOptions);
        const absolute = at => at ? new Date(at).toLocaleString() : "无记录";
        function refresh() {
          const conf = getGistConf2();
          const state = getState2(conf);
          if (active && typeof GM_addValueChangeListener === "function" && watchedState !== stateKey2(conf)) {
            if (stateListener !== void 0 && typeof GM_removeValueChangeListener === "function") GM_removeValueChangeListener(stateListener);
            watchedState = stateKey2(conf);
            stateListener = GM_addValueChangeListener(watchedState, refresh);
          }
          let label = relativeTime2(state.lastSyncSuccessAt);
          if (state.lastError) label = `同步失败 · ${state.lastSyncSuccessAt ? "上次成功 " + relativeTime2(state.lastSyncSuccessAt).replace("同步", "") : "尚未成功同步"}`;
          if (engine.isBusy()) label = "正在同步…";
          const nextCaption = `数据同步设置（${label}）`;
          if (active && nextCaption !== caption) {
            if (menuId !== void 0 && typeof GM_unregisterMenuCommand === "function") GM_unregisterMenuCommand(menuId);
            if (!caption || typeof GM_unregisterMenuCommand === "function") menuId = GM_registerMenuCommand(nextCaption, openGistSyncDialog);
            caption = nextCaption;
          }
          if (statusNode?.isConnected) {
            const next = !conf.enabled ? "自动同步已关闭" : state.paused ? "已暂停，请处理错误后重新保存并测试" : absolute(state.nextRetryAt || (state.lastSyncSuccessAt ? state.lastSyncSuccessAt + conf.intervalHours * 36e5 : Date.now()));
            statusNode.textContent = `最近同步：${relativeTime2(state.lastSyncSuccessAt)}（${absolute(state.lastSyncSuccessAt)}）
上次结果：${state.lastDirection ? {
              upload: "已上传",
              download: "已下载",
              unchanged: "两端一致"
            }[state.lastDirection] : "无记录"}
本地数据更新：${absolute(localVersion3().updatedAt)}
远程数据更新：${absolute(state.remoteUpdatedAt)}
下次同步：${next}${state.lastError ? "\n最近错误：" + state.lastError : ""}`;
          }
        }
        function tick() {
          refresh();
          if (document.visibilityState !== "hidden" && pending) {
            const item = pending;
            pending = void 0;
            notify(item.message, item.error);
          }
          void engine.run("auto", true);
        }
        function start() {
          if (active) return;
          engine = createSyncEngine2(engineOptions);
          active = true;
          refresh();
          timer = window.setInterval(tick, 6e4);
          document.addEventListener("visibilitychange", tick);
          window.addEventListener("pagehide", stop, {
            once: true
          });
          if (typeof GM_addValueChangeListener === "function") {
            listeners.push(GM_addValueChangeListener(CONF_KEY2, () => {
              refresh();
              void engine.run("auto", true);
            }));
            listeners.push(GM_addValueChangeListener("gistDataVersion", (_key, _old, _value, remote) => {
              if (remote) onDataApplied();
              refresh();
            }));
          }
          tick();
        }
        function stop() {
          active = false;
          if (timer !== void 0) window.clearInterval(timer);
          document.removeEventListener("visibilitychange", tick);
          for (const id of listeners) if (typeof GM_removeValueChangeListener === "function") GM_removeValueChangeListener(id);
          listeners.length = 0;
          if (stateListener !== void 0 && typeof GM_removeValueChangeListener === "function") GM_removeValueChangeListener(stateListener);
          stateListener = void 0;
          watchedState = "";
          engine.dispose();
        }
        window.addEventListener("pageshow", event => {
          if (event.persisted) start();
        });
        function field(body, label, value, type = "text") {
          const wrapper = document.createElement("label");
          wrapper.className = "glc-form-field";
          const title = document.createElement("div");
          title.className = "glc-input-label";
          title.textContent = label;
          const input = document.createElement("input");
          input.className = "glc-input";
          input.type = type;
          input.value = value;
          wrapper.appendChild(title);
          wrapper.appendChild(input);
          body.appendChild(wrapper);
          return input;
        }
        function openGistSyncDialog() {
          const conf = getGistConf2();
          const body = document.createElement("div");
          const token = field(body, "GitHub Token", conf.TOKEN, "password");
          const gist = field(body, "Gist ID", conf.GIST_ID);
          const file = field(body, "文件名", conf.FILE_NAME);
          const enabled = field(body, "自动同步 Gist（按数据更新时间上传或下载）", "", "checkbox");
          enabled.checked = conf.enabled;
          const interval = field(body, "同步间隔（1 小时～30 天）", String(conf.intervalHours % 24 === 0 ? conf.intervalHours / 24 : conf.intervalHours), "number");
          interval.min = "1";
          interval.step = "1";
          const unit = document.createElement("select");
          unit.className = "glc-input";
          unit.setAttribute("aria-label", "同步间隔单位");
          for (const [value, text] of [["1", "小时"], ["24", "天"]]) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            unit.appendChild(option);
          }
          unit.value = conf.intervalHours % 24 === 0 ? "24" : "1";
          body.appendChild(unit);
          const updateDisabled = () => {
            interval.disabled = unit.disabled = !enabled.checked;
            interval.max = unit.value === "24" ? "30" : "720";
          };
          enabled.addEventListener("change", updateDisabled);
          unit.addEventListener("change", updateDisabled);
          updateDisabled();
          const note = document.createElement("p");
          note.textContent = "较新整份数据覆盖较旧数据。浏览器关闭时不运行，下次打开适用网页补同步。旧备份首次使用请手动选择上传或下载建立基线。";
          body.appendChild(note);
          statusNode = document.createElement("p");
          statusNode.style.whiteSpace = "pre-line";
          body.appendChild(statusNode);
          const actions = document.createElement("div");
          actions.className = "glc-inline-actions";
          body.appendChild(actions);
          const buttons = [];
          function button(text, action) {
            const button2 = document.createElement("button");
            button2.type = "button";
            button2.className = "glc-inline-button";
            button2.textContent = text;
            button2.addEventListener("click", async () => {
              if (buttons.some(item => item.disabled)) return;
              buttons.forEach(item => {
                item.disabled = true;
              });
              try {
                await action();
              } finally {
                buttons.forEach(item => {
                  item.disabled = false;
                });
                refresh();
              }
            });
            buttons.push(button2);
            actions.appendChild(button2);
          }
          const readInputs = () => ({
            TOKEN: token.value.trim(),
            GIST_ID: gist.value.trim(),
            FILE_NAME: file.value.trim(),
            enabled: enabled.checked,
            intervalHours: enabled.checked ? Number(interval.value) * Number(unit.value) : conf.intervalHours
          });
          button("保存配置并测试", async () => {
            const next = readInputs();
            if (!next.TOKEN || !next.GIST_ID || !next.FILE_NAME || !Number.isInteger(Number(interval.value)) || !Number.isInteger(next.intervalHours) || next.intervalHours < 1 || next.intervalHours > 720) {
              notify("请填写完整配置，间隔须为 1 小时～30 天的整数小时或天数", true);
              return;
            }
            try {
              if (!next.enabled) GM_setValue(CONF_KEY2, next);
              await readRemote3(next);
              const state = getState2(next);
              GM_setValue(stateKey2(next), {
                ...state,
                paused: false,
                lastError: void 0,
                nextRetryAt: void 0,
                failures: 0
              });
              GM_setValue(CONF_KEY2, next);
              notify("配置已保存，连接测试成功", false);
              void engine.run("auto", true);
            } catch (error) {
              notify(`连接测试失败：${error.message}`, true);
            }
          });
          for (const [text, mode] of [["立即同步", "auto"], ["手动上传（覆盖远程）", "upload"], ["手动下载（覆盖本地）", "download"]]) {
            button(text, async () => {
              if (JSON.stringify(readInputs()) !== JSON.stringify(getGistConf2())) {
                notify("配置已修改，请先保存配置并测试", true);
                return;
              }
              await engine.run(mode);
            });
          }
          showDialog({
            title: "Gist 数据同步设置",
            bodyNode: body,
            confirmText: "关闭",
            hideCancel: true
          });
          refresh();
        }
        return {
          openGistSyncDialog,
          start,
          stop
        };
      }
      module.exports = {
        createGistSyncController,
        getGistConf: getGistConf2
      };
    }
  });

  // src/shared/constants.ts
  var require_constants = __commonJS({
    "src/shared/constants.ts"(exports, module) {
      "use strict";

      var UPDATE_STATUS = {
        SUCCESS: "success",
        ERROR: "error",
        AUTH_EXPIRED: "auth_expired"
      };
      var BASE_STYLE = `
.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}
.glc-dialog{background:#fff;color:#0f172a;border:1px solid #e2e8f0;padding:20px;border-radius:12px;min-width:360px;max-width:580px;font-size:14px;box-shadow:0 14px 36px rgba(15,23,42,.16),0 4px 14px rgba(15,23,42,.08)}
.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700}
.glc-dialog-body{line-height:1.6;color:#334155}
.glc-dialog{box-sizing:border-box;min-width:min(360px,100%);max-width:min(580px,100%);max-height:calc(100dvh - 40px);display:flex;flex-direction:column}
.glc-dialog-body{min-height:0;overflow-y:auto;overscroll-behavior:contain}
.glc-dialog-title,.glc-dialog-actions{flex-shrink:0}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9}
.glc-dialog-actions button{border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease,box-shadow .14s ease}
.glc-dialog-actions button:hover{background:#f8fbff;border-color:#c6d4e8}
.glc-dialog-actions button:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}
.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff;box-shadow:0 6px 16px rgba(37,99,235,.24)}
.glc-dialog-actions [data-glc-confirm]:hover{border-color:#1d4ed8;background:#1d4ed8}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:10px;padding:10px 12px;color:#0f172a;background:#fff}
.glc-form-field{display:block;margin-bottom:10px}
.glc-input-label{margin-bottom:6px;color:#334155}
.glc-input{width:100%;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:8px;padding:8px 10px;color:#0f172a;background:#fff}
.glc-inline-actions{display:flex;gap:10px;margin-top:8px}
.glc-inline-actions{flex-wrap:wrap}
.glc-input[type=checkbox]{width:auto;accent-color:#2563eb}
.glc-input:disabled,.glc-inline-button:disabled{opacity:.55;cursor:not-allowed}
.glc-inline-button{border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease}
.glc-inline-button:hover{background:#f8fbff;border-color:#c6d4e8}
#glc-toast-container{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none}
.glc-toast{background:#f8fafc;color:#0f172a;padding:11px 15px;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 12px 30px rgba(15,23,42,.12);pointer-events:auto;max-width:420px;word-break:break-word;opacity:1}
.glc-toast-success{background:#f0fdf4;color:#166534;border-color:#86efac}
.glc-toast-error{background:#fef2f2;color:#991b1b;border-color:#fecaca}
.glc-toast-link{color:#1d4ed8;text-decoration:underline;font-weight:600}
.glc-toast-error .glc-toast-link{color:#b91c1c}
.glc-toast-close{margin-left:8px;border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;line-height:1}
.glc-toast-enter{animation:glc-toast-fade-in .16s ease}
.glc-toast-leave{animation:glc-toast-fade-out .16s ease forwards}
@keyframes glc-toast-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes glc-toast-fade-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
.glc-progress-platform{font-weight:700;color:#0f172a}
.glc-progress-state{color:#334155}
`;
      module.exports = {
        UPDATE_STATUS,
        BASE_STYLE
      };
    }
  });

  // src/platforms/epic.ts
  var require_epic = __commonJS({
    "src/platforms/epic.ts"(exports, module) {
      "use strict";

      var {
        setSyncValue: setSyncValue2
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      function createEpicModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          showUpdateStep,
          showUpdateResult,
          // showLoginExpiredDialog,
          showToast,
          runAutoUpdateWithRateLimit,
          UPDATE_STATUS
        } = context;
        let updateLibrary;
        let started = false;
        const moduleApi = {
          key: "epic",
          enabled: () => settings.platformEnabled.epic,
          isCacheEmpty: () => (GM_getValue("ownedGames") || []).length === 0,
          updateLibrary: async () => {
            if (!updateLibrary) await moduleApi.start();
            return updateLibrary();
          },
          start: async () => {
            if (started) return;
            started = true;
            if (!GM_getValue("version")) {
              GM_deleteValue("epicGamesLibrary");
              GM_deleteValue("ownedGames");
              GM_deleteValue("wishlist");
              GM_setValue("version", "1.1");
            }
            let loadTimes = 0;
            let catalogOfferSha256Hash = false;
            let locale = "en-US";
            await getSha256Hash();
            checkEpicGame();
            window.addEventListener?.("glc-library-synced", () => {
              if (settings.platformEnabled.epic) {
                loadTimes = 0;
                void checkEpicGame(false);
              }
            });
            const observer = new MutationObserver(() => {
              checkEpicGame(false, true);
            });
            observer.observe(document.documentElement, {
              attributes: false,
              characterData: false,
              childList: true,
              subtree: true
            });
            async function checkEpicGame(first = true, again = false) {
              if (!settings.platformEnabled.epic) return;
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const ownedGames = getEpicOwnedGames();
              const wishlistGames = GM_getValue("epicWishist") || [];
              const excludedClass = again ? "epic-game-checked" : "epic-game-link-owned";
              const epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]').filter(el => !el.classList.contains(excludedClass));
              if (epicLink.length === 0) return;
              if (first) {
                const autoUpdate = () => updateEpicOwnedGames(false);
                let runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                }
                Promise.resolve(runner()).then(result => {
                  if (typeof result === "object" && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
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
              epicLink.forEach(el => {
                addClass(el, "epic-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const epicGameName = href.match(/https?:\/\/(www|store)\.epicgames\.com(\/.*?)?\/p(roduct)?\/([^?/]+)/i)?.[4]?.toLowerCase();
                if (epicGameName) {
                  if (ownedGames.find(game => game.pageSlug.includes(epicGameName))) {
                    addClass(el, "epic-game-link-owned");
                  } else if (wishlistGames.find(game => game.pageSlug.includes(epicGameName))) {
                    addClass(el, "epic-game-link-wishlist");
                  }
                  return;
                }
                const epicGameOfferId = href.match(/https?:\/\/(store|www)\.epicgames\.com\/purchase\?offers=([\w-]+)/i)?.[2]?.toLowerCase();
                if (epicGameOfferId) {
                  if (ownedGames.find(game => epicGameOfferId.includes(game.offerId))) {
                    addClass(el, "epic-game-link-owned");
                  } else if (wishlistGames.find(game => epicGameOfferId.includes(game.offerId))) {
                    addClass(el, "epic-game-link-wishlist");
                  }
                }
              });
            }
            function getEpicOwnedGames() {
              return GM_getValue("ownedGames") || [];
            }
            async function getSha256Hash() {
              console.log("[EGLC] getSha256Hash...");
              return new Promise((resolve, reject) => {
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
                  onload: response => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(response => {
                [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
                [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ["en-US"];
                console.log("[EGLC] ", JSON.stringify({
                  catalogOfferSha256Hash,
                  locale
                }));
              }).catch(error => {
                console.error(error);
              });
            }
            async function getPagePlug(namespace, offerId) {
              console.log("[EGLC] getPagePlug...");
              if (catalogOfferSha256Hash === false) {
                await getSha256Hash();
              }
              if (!catalogOfferSha256Hash) {
                console.log("[EGLC] No catalogOfferSha256Hash");
                return false;
              }
              return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                  method: "GET",
                  url: `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22${offerId}%22,%22sandboxId%22:%22${namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${catalogOfferSha256Hash}%22%7D%7D`,
                  timeout: 3e4,
                  fetch: true,
                  headers: {
                    accept: "application/json, text/plain, */*"
                  },
                  responseType: "json",
                  onerror: reject,
                  ontimeout: reject,
                  onload: response => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async response => {
                if (response.response?.data?.Catalog?.catalogOffer) {
                  const {
                    offerMappings,
                    urlSlug,
                    customAttributes
                  } = response.response.data.Catalog.catalogOffer;
                  return [...new Set([offerMappings?.[0]?.pageSlug, urlSlug, customAttributes?.find(e => e.key === "com.epicgames.app.productSlug")?.value?.replace(/\/home$/, "")].filter(slug => Boolean(slug)))];
                }
                return false;
              }).catch(error => {
                console.error(error);
                return false;
              });
            }
            function getEpicCookies(name) {
              return new Promise((resolve, reject) => {
                GM_cookie.list({
                  url: "https://accounts.epicgames.com/",
                  name
                }, (cookies, error) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve(cookies[0]?.value || "null");
                });
              });
            }
            function getAllEpicCookies() {
              return new Promise((resolve, reject) => {
                GM_cookie.list({
                  url: "https://accounts.epicgames.com/"
                }, (cookies, error) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve(cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(";"));
                });
              });
            }
            function parseSetCookieHeader(cookieString, fallbackUrl) {
              const parts = cookieString.split(";").map(s => s.trim());
              const [nameValue, ...attrs] = parts;
              const eqIdx = nameValue.indexOf("=");
              const name = eqIdx >= 0 ? nameValue.slice(0, eqIdx).trim() : nameValue.trim();
              const value = eqIdx >= 0 ? nameValue.slice(eqIdx + 1).trim() : "";
              const cookie = {
                url: fallbackUrl,
                name,
                value: value || "",
                path: "/",
                secure: false,
                httpOnly: false,
                expirationDate: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 30
              };
              attrs.forEach(attr => {
                const eqIdx2 = attr.indexOf("=");
                const key = eqIdx2 >= 0 ? attr.slice(0, eqIdx2).trim().toLowerCase() : attr.trim().toLowerCase();
                const val = eqIdx2 >= 0 ? attr.slice(eqIdx2 + 1).trim() : "";
                if (key === "domain") cookie.domain = val.startsWith(".") ? val : `.${val}`;else if (key === "path") cookie.path = val || "/";else if (key === "secure") cookie.secure = true;else if (key === "httponly") cookie.httpOnly = true;else if (key === "expires") {
                  const exp = new Date(val).getTime();
                  if (!isNaN(exp)) cookie.expirationDate = Math.floor(exp / 1e3);
                } else if (key === "max-age") {
                  cookie.expirationDate = Math.floor(Date.now() / 1e3) + parseInt(val, 10);
                }
              });
              return cookie;
            }
            function extractAndSetCookies(responseHeaders, url) {
              if (!responseHeaders) return Promise.resolve();
              const setCookieLines = responseHeaders.split(/\r?\n/).filter(line => /^set-cookie:\s*/i.test(line));
              if (!setCookieLines.length) return Promise.resolve();
              const cookiePromises = setCookieLines.map(line => {
                const cookieStr = line.replace(/^set-cookie:\s*/i, "");
                const cookie = parseSetCookieHeader(cookieStr, url);
                return new Promise(resolve => {
                  GM_cookie.set(cookie, error => {
                    if (error) console.error("[EGLC] Cookie set error:", error);
                    resolve();
                  });
                });
              });
              return Promise.all(cookiePromises);
            }
            function getLocationHeader(responseHeaders) {
              const match = responseHeaders?.match(/^location:\s*(.+)/im);
              return match ? match[1].trim() : null;
            }
            async function requestWithRedirect(initialUrl, baseOptions, maxRedirects = 10) {
              let currentUrl = initialUrl;
              for (let i = 0; i < maxRedirects; i++) {
                const response = await new Promise((res, rej) => {
                  GM_xmlhttpRequest({
                    ...baseOptions,
                    url: currentUrl,
                    redirect: "manual",
                    onload: res,
                    onerror: rej,
                    ontimeout: rej
                  });
                });
                const {
                  status
                } = response;
                if (status === 301 || status === 302 || status === 303 || status === 307 || status === 308) {
                  await extractAndSetCookies(response.responseHeaders, currentUrl);
                  const location = getLocationHeader(response.responseHeaders);
                  if (!location) throw new Error("[EGLC] Redirect without Location header");
                  currentUrl = location;
                  continue;
                }
                if (status === 200) {
                  return response;
                }
                throw response;
              }
              throw new Error("[EGLC] Too many redirects");
            }
            async function updateEpicOwnedGames(loop = true, i = 0, games = [...(GM_getValue("ownedGames") || [])], nextPageToken = "") {
              console.log("[EGLC] updateEpicOwnedGames...");
              if (!loop && i !== 0) {
                setSyncValue2("ownedGames", games);
                checkEpicGame(false);
                return;
              }
              const xsrfToken = await getEpicCookies("XSRF-AM-TOKEN");
              const allCookies = await getAllEpicCookies();
              if (loop) {
                showUpdateStep("epic", `第 ${i + 1} 页`);
              }
              return requestWithRedirect(`https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?count=10&sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ""}`, {
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
                  "x-xsrf-token": xsrfToken.toString(),
                  cookie: allCookies
                }
              }).then(async response => {
                if (/login/i.test(response.finalUrl)) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "Epic",
                    loginUrl: "https://www.epicgames.com/id/login"
                  };
                }
                const ordersLength = response.response?.orders?.length || 0;
                if (ordersLength >= 0) {
                  const orderedGames = response.response.orders.map(order => order.items?.[0]).filter(item => Boolean(item));
                  await Promise.all(orderedGames.map(async item => {
                    if (games.find(game => game.namespace === item.namespace && game.offerId === item.offerId)) {
                      return true;
                    }
                    const pageSlug = await getPagePlug(item.namespace, item.offerId);
                    console.log(`[EGLC] pageSlug: ${pageSlug}`);
                    if (pageSlug) {
                      games.push({
                        namespace: item.namespace,
                        offerId: item.offerId,
                        pageSlug
                      });
                    }
                    return true;
                  }));
                  const {
                    nextPageToken: nextPageToken2
                  } = response.response;
                  if (nextPageToken2) {
                    if (loop) {
                      await new Promise(resolve => {
                        setTimeout(() => {
                          resolve(true);
                        }, 1e3);
                      });
                    }
                    return await updateEpicOwnedGames(loop, ++i, games, nextPageToken2);
                  } else if (loop) {
                    setSyncValue2("ownedGames", games);
                    await showUpdateResult("Epic已拥有游戏数据更新完成", "success");
                    return true;
                  }
                  setSyncValue2("ownedGames", games);
                  checkEpicGame(false);
                  console.log("[EGLC] updateEpicOwnedGames: Finish!");
                  return true;
                } else if (response.response?.products?.length !== 0) {
                  console.error(response);
                  await showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                  return false;
                }
                return false;
              }).catch(async error => {
                console.error(error);
                await showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                return false;
              });
            }
            updateLibrary = updateEpicOwnedGames;
            GM_addStyle(`
.epic-game-link-owned {
  color:#ffffff !important;
  background:#5c8a00 !important
}
.epic-game-link-wishlist {
  color:#ffffff !important;
  background:#007399 !important
}`);
          }
        };
        return moduleApi;
      }
      module.exports = {
        createEpicModule
      };
    }
  });

  // src/platforms/gog.ts
  var require_gog = __commonJS({
    "src/platforms/gog.ts"(exports, module) {
      "use strict";

      var {
        setSyncValue: setSyncValue2
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      function createGogModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          showUpdateStep,
          showUpdateResult,
          // showLoginExpiredDialog,
          showToast,
          runAutoUpdateWithRateLimit,
          UPDATE_STATUS
        } = context;
        let updateLibrary;
        let started = false;
        const moduleApi = {
          key: "gog",
          enabled: () => settings.platformEnabled.gog,
          isCacheEmpty: () => (GM_getValue("gogGames") || []).length === 0,
          updateLibrary: () => {
            if (!updateLibrary) moduleApi.start();
            return updateLibrary();
          },
          start: () => {
            if (started) return;
            started = true;
            let loadTimes = 0;
            checkGogGame();
            window.addEventListener?.("glc-library-synced", () => {
              if (settings.platformEnabled.gog) {
                loadTimes = 0;
                void checkGogGame(false);
              }
            });
            const observer = new MutationObserver(() => {
              checkGogGame(false, true);
            });
            observer.observe(document.documentElement, {
              attributes: false,
              characterData: false,
              childList: true,
              subtree: true
            });
            function checkGogGame(first = true, again = false) {
              if (!settings.platformEnabled.gog) return;
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const gogGames = getGogGameLibrary();
              const excludedClass = again ? "gog-game-checked" : "gog-game-link-owned";
              const gogLink = queryLinks('a[href*="www.gog.com/"]').filter(el => !el.classList.contains(excludedClass));
              if (gogLink.length === 0) return;
              if (first) {
                const autoUpdate = () => updateGogGameLibrary(false);
                let runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                }
                Promise.resolve(runner()).then(result => {
                  if (typeof result === "object" && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
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
              gogLink.forEach(el => {
                addClass(el, "gog-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const gogGameLink = href.match(/https?:\/\/www\.gog\.com\/(?:[\w-]+\/)?game\/([^/?#]+)/i)?.[1]?.toLowerCase();
                if (gogGameLink && gogGames.some(game => game.toLowerCase() === gogGameLink)) {
                  addClass(el, "gog-game-link-owned");
                }
              });
            }
            function getGogGameLibrary() {
              return GM_getValue("gogGames") || [];
            }
            function updateGogGameLibrary(loop = true, i = 1, games = []) {
              if (!loop && i !== 1) {
                setSyncValue2("gogGames", [... /* @__PURE__ */new Set([...getGogGameLibrary(), ...games])]);
                checkGogGame(false);
                return;
              }
              return new Promise((resolve, reject) => {
                if (loop) {
                  showUpdateStep("gog", `第 ${i} 页`);
                }
                GM_xmlhttpRequest({
                  method: "GET",
                  url: `https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=${i}&sortBy=date_purchased`,
                  timeout: 15e3,
                  nocache: true,
                  responseType: "json",
                  onerror: reject,
                  ontimeout: reject,
                  onload: response => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async response => {
                if (/openlogin/i.test(response.finalUrl)) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "GOG",
                    loginUrl: "https://www.gog.com/#openlogin"
                  };
                } else if (response.response?.products?.length) {
                  const pageGames = response.response.products.map(product => {
                    const urlParts = product.url?.split("/");
                    return product.slug || urlParts?.[urlParts.length - 1];
                  }).filter(game => Boolean(game));
                  games = [...games, ...pageGames];
                  if ((response.response.totalPages || 0) > i) {
                    return await updateGogGameLibrary(loop, ++i, games);
                  } else if (loop) {
                    setSyncValue2("gogGames", [...new Set(games)].filter(e => e));
                    await showUpdateResult("gog游戏库数据更新完成", "success");
                    return true;
                  }
                  setSyncValue2("gogGames", [... /* @__PURE__ */new Set([...getGogGameLibrary(), ...games])].filter(e => e));
                  checkGogGame(false);
                  return true;
                } else if (response.response?.products?.length !== 0) {
                  console.error(response);
                  await showUpdateResult("gog游戏库数据更新失败", "error");
                  return false;
                }
                return false;
              }).catch(async error => {
                console.error(error);
                await showUpdateResult("gog游戏库数据更新失败", "error");
                return false;
              });
            }
            updateLibrary = updateGogGameLibrary;
            GM_addStyle(".gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
          }
        };
        return moduleApi;
      }
      module.exports = {
        createGogModule
      };
    }
  });

  // src/core/itch-linkage.ts
  var require_itch_linkage = __commonJS({
    "src/core/itch-linkage.ts"(exports, module) {
      "use strict";

      var ITCH_LINKAGE_CODE_KEY = "itchLinkageCode";
      function sha2562(value) {
        const fallback = () => sha256Fallback(value);
        if (!globalThis.crypto?.subtle || typeof TextEncoder === "undefined") {
          return Promise.resolve(fallback());
        }
        return globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(buffer => Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, "0")).join("")).catch(fallback);
      }
      function sha256Fallback(value) {
        const bytes = unescape(encodeURIComponent(value)).split("").map(char => char.charCodeAt(0));
        const bitLength = bytes.length * 8;
        bytes.push(128);
        while (bytes.length % 64 !== 56) bytes.push(0);
        for (let index = 7; index >= 0; index--) bytes.push(bitLength / 2 ** (index * 8) & 255);
        const constants = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        const hash = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
        const rotateRight = (number, bits) => number >>> bits | number << 32 - bits;
        for (let offset = 0; offset < bytes.length; offset += 64) {
          const words = new Array(64);
          for (let index = 0; index < 16; index++) {
            const position = offset + index * 4;
            words[index] = bytes[position] << 24 | bytes[position + 1] << 16 | bytes[position + 2] << 8 | bytes[position + 3];
          }
          for (let index = 16; index < 64; index++) {
            const s0 = rotateRight(words[index - 15], 7) ^ rotateRight(words[index - 15], 18) ^ words[index - 15] >>> 3;
            const s1 = rotateRight(words[index - 2], 17) ^ rotateRight(words[index - 2], 19) ^ words[index - 2] >>> 10;
            words[index] = words[index - 16] + s0 + words[index - 7] + s1 | 0;
          }
          let [a, b, c, d, e, f, g, h] = hash;
          for (let index = 0; index < 64; index++) {
            const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
            const choice = e & f ^ ~e & g;
            const temp1 = h + s1 + choice + constants[index] + words[index] | 0;
            const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
            const majority = a & b ^ a & c ^ b & c;
            const temp2 = s0 + majority | 0;
            [h, g, f, e, d, c, b, a] = [g, f, e, d + temp1 | 0, c, b, a, temp1 + temp2 | 0];
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
        return hash.map(word => (word >>> 0).toString(16).padStart(8, "0")).join("");
      }
      function createItchLinkage({
        getGames,
        addGames,
        updateLibrary,
        showToast
      }) {
        let mousePosition = {
          x: 0,
          y: 0
        };
        let linkageCode = GM_getValue(ITCH_LINKAGE_CODE_KEY) || "";
        document.addEventListener("mousemove", event => {
          mousePosition = {
            x: event.clientX,
            y: event.clientY
          };
        }, {
          passive: true
        });
        function exposeLinkage() {
          if (!linkageCode) return;
          const linkage = function itchLibraryLinkage() {};
          Object.defineProperties(linkage, {
            connected: {
              enumerable: true,
              get: () => true
            },
            has: {
              enumerable: true,
              value: game => typeof game === "string" && getGames().includes(game)
            },
            get: {
              enumerable: true,
              value: () => [...getGames()]
            },
            add: {
              enumerable: true,
              value: games => addGames(games)
            },
            removeOwned: {
              enumerable: true,
              value: games => Array.isArray(games) ? games.filter(game => !getGames().includes(game)) : []
            },
            update: {
              enumerable: true,
              value: () => updateLibrary(false, 1)
            }
          });
          unsafeWindow[linkageCode] = linkage;
        }
        function generateLinkageCode() {
          const navigatorInfo = navigator;
          const fingerprint = JSON.stringify({
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
          return sha2562(fingerprint).then(code => {
            linkageCode = code;
            GM_setValue(ITCH_LINKAGE_CODE_KEY, linkageCode);
            exposeLinkage();
            window.prompt("Itch 联动码已生成并保存，请复制：", linkageCode);
            return linkageCode;
          }).catch(error => {
            console.error("生成 Itch 联动码失败", error);
            showToast("生成 Itch 联动码失败：浏览器不支持 SHA-256", "error");
            return "";
          });
        }
        exposeLinkage();
        return {
          generateLinkageCode
        };
      }
      module.exports = {
        createItchLinkage
      };
    }
  });

  // src/platforms/itch.ts
  var require_itch = __commonJS({
    "src/platforms/itch.ts"(exports, module) {
      "use strict";

      var {
        setSyncValue: setSyncValue2,
        trackLibraryUpdate: trackLibraryUpdate2
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      var {
        createItchLinkage
      } = require_itch_linkage();
      function createItchModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          parseHtml,
          showUpdateStep,
          showUpdateResult,
          // showLoginExpiredDialog,
          showToast,
          runAutoUpdateWithRateLimit,
          UPDATE_STATUS
        } = context;
        let updateLibrary;
        let started = false;
        function getItchGameLibrary() {
          return GM_getValue("itchGames") || [];
        }
        function addItchGames(games) {
          if (!Array.isArray(games)) return getItchGameLibrary();
          const library = [... /* @__PURE__ */new Set([...getItchGameLibrary(), ...games])];
          setSyncValue2("itchGames", library);
          return library;
        }
        const moduleApi = {
          key: "itch",
          enabled: () => settings.platformEnabled.itch,
          isCacheEmpty: () => getItchGameLibrary().length === 0,
          updateLibrary: () => {
            if (!updateLibrary) moduleApi.start();
            return updateLibrary();
          },
          start: () => {
            if (started) return;
            started = true;
            let loadTimes = 0;
            checkItchGame();
            window.addEventListener?.("glc-library-synced", () => {
              if (settings.platformEnabled.itch) {
                loadTimes = 0;
                void checkItchGame(false);
              }
            });
            const observer = new MutationObserver(() => {
              checkItchGame(false, true);
            });
            observer.observe(document.documentElement, {
              attributes: false,
              characterData: false,
              childList: true,
              subtree: true
            });
            function checkItchGame(first = true, again = false) {
              if (!settings.platformEnabled.itch) return;
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const itchGames = getItchGameLibrary();
              const excludedClass = again ? "itch-io-game-checked" : "itch-io-game-link-owned";
              const itchLink = queryLinks('a[href*=".itch.io/"]').filter(el => !el.classList.contains(excludedClass));
              if (itchLink.length === 0) return;
              if (first) {
                const autoUpdate = () => updateItchGameLibrary(false);
                let runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                }
                Promise.resolve(runner()).then(result => {
                  if (typeof result === "object" && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
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
              itchLink.forEach(el => {
                addClass(el, "itch-io-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const itchGameLink = href.match(/https?:\/\/(.*?\/.*?)\//i)?.[1];
                if (itchGameLink && itchGames.includes(itchGameLink)) {
                  addClass(el, "itch-io-game-link-owned");
                }
              });
            }
            function updateItchGameLibrary(loop = true, i = 1, games = []) {
              if (!loop && i !== 1) {
                setSyncValue2("itchGames", [... /* @__PURE__ */new Set([...getItchGameLibrary(), ...games])]);
                checkItchGame(false);
                return;
              }
              return new Promise((resolve, reject) => {
                if (loop) {
                  showUpdateStep("itch", `第 ${i} 页`);
                }
                GM_xmlhttpRequest({
                  method: "GET",
                  url: `https://itch.io/my-purchases?page=${i}&format=json`,
                  timeout: 15e3,
                  nocache: true,
                  responseType: "json",
                  onerror: reject,
                  ontimeout: reject,
                  onload: response => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async response => {
                if (/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "itch.io",
                    loginUrl: "https://itch.io/login"
                  };
                } else if (response.response?.num_items) {
                  const itchDoc = parseHtml(`<div>${response.response.content || ""}</div>`);
                  const purchaseLinks = Array.from(itchDoc.querySelectorAll("a.thumb_link.game_link"));
                  const pageGames = purchaseLinks.map(el => getHref(el).match(/https?:\/\/(.*?\/.*?)\//i)?.[1]).filter(game => Boolean(game));
                  games = [...games, ...pageGames];
                  if (response.response.num_items === 50) {
                    return await updateItchGameLibrary(loop, ++i, games);
                  } else if (loop) {
                    setSyncValue2("itchGames", [...new Set(games)]);
                    await showUpdateResult("itch游戏库数据更新完成", "success");
                    return true;
                  }
                  setSyncValue2("itchGames", [... /* @__PURE__ */new Set([...getItchGameLibrary(), ...games])]);
                  checkItchGame(false);
                  return true;
                } else if (response.response?.num_items === 0) {
                  setSyncValue2("itchGames", [...new Set(games)]);
                  await showUpdateResult("itch游戏库数据更新完成", "success");
                  return true;
                }
                console.error(response);
                await showUpdateResult("itch游戏库数据更新失败", "error");
                return false;
              }).catch(async error => {
                console.error(error);
                await showUpdateResult("itch游戏库数据更新失败", "error");
                return false;
              });
            }
            updateLibrary = updateItchGameLibrary;
            GM_addStyle(".itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
            unsafeWindow.checkItchGame = checkItchGame;
          }
        };
        const itchLinkage = createItchLinkage({
          getGames: getItchGameLibrary,
          addGames: addItchGames,
          updateLibrary: (loop = false, i = 1) => {
            if (!started) moduleApi.start();
            return trackLibraryUpdate2(() => updateLibrary(loop, i));
          },
          showToast
        });
        moduleApi.generateLinkageCode = itchLinkage.generateLinkageCode;
        return moduleApi;
      }
      module.exports = {
        createItchModule
      };
    }
  });

  // src/platforms/ig.ts
  var require_ig = __commonJS({
    "src/platforms/ig.ts"(exports, module) {
      "use strict";

      var {
        setSyncValue: setSyncValue2
      } = (init_sync_data(), __toCommonJS(sync_data_exports));
      function createIgModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          parseHtml,
          showUpdateStep,
          showUpdateResult,
          // showLoginExpiredDialog,
          showToast,
          runAutoUpdateWithRateLimit,
          UPDATE_STATUS
        } = context;
        let started = false;
        function getIgOwnedGames() {
          return (GM_getValue("IG-Owned")?.games || []).filter(Boolean).map(item => item.toLowerCase());
        }
        function markIgLinks() {
          if (!settings.platformEnabled.ig) return;
          const owned = getIgOwnedGames();
          const links = queryLinks('a[href*=".indiegala.com"]:not(.ig-checked)');
          links.forEach(el => {
            addClass(el, "ig-checked");
            const href = getHref(el);
            if (!href) return;
            try {
              const parsed = new URL(href, window.location.href);
              const pathnameKey = parsed.pathname.replace(/\//g, "").toLowerCase();
              const hostnameKey = parsed.hostname.split(".")[0].toLowerCase();
              if (owned.includes(pathnameKey) || owned.includes(hostnameKey)) addClass(el, "ig-owned");
            } catch (error) {
              console.error(error);
            }
          });
        }
        function getIgCookies() {
          return new Promise((resolve, reject) => {
            GM_cookie.list({
              url: "https://www.indiegala.com/library/showcase/1"
            }, (cookies, error) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(";"));
            });
          });
        }
        async function requestIgShowcasePage(page, cookies) {
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              url: `https://www.indiegala.com/library/showcase/${page}`,
              method: "GET",
              timeout: 3e4,
              headers: {
                cookie: cookies
              },
              onerror: reject,
              ontimeout: reject,
              onload: response => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          });
        }
        function parseIgShowcase(responseText, page) {
          const doc = parseHtml(responseText);
          let pages = 1;
          if (page === 1) {
            const pageLinks = Array.from(doc.querySelectorAll('a.profile-private-page-library-pagination-item[href*="library/showcase"]'));
            const lastPageHref = pageLinks.find(el => el.querySelector(".fa-angle-double-right"))?.getAttribute("href") || "";
            const parsedPage = Number((lastPageHref.match(/\d+/) || [1])[0]);
            pages = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
          }
          const games = Array.from(doc.querySelectorAll("a.library-showcase-title")).map(el => el.getAttribute("href")?.match(/https?:\/\/.*?\.indiegala\.com\/(.*)/)?.[1]?.toLowerCase()).filter(game => Boolean(game));
          return {
            pages,
            games
          };
        }
        async function updateIgGameLibrary(loop = true) {
          try {
            const owned = getIgOwnedGames();
            if (loop) {
              showUpdateStep("ig", "第 1 页");
            }
            const cookies = await getIgCookies();
            const firstPageResponse = await requestIgShowcasePage(1, cookies);
            if (new URL(firstPageResponse.finalUrl).pathname === "/login") {
              return {
                status: UPDATE_STATUS.AUTH_EXPIRED,
                platformName: "IG",
                loginUrl: "https://www.indiegala.com/login"
              };
            }
            const firstParsed = parseIgShowcase(firstPageResponse.responseText, 1);
            let allGames = [...owned, ...firstParsed.games];
            if (!loop) {
              allGames = Array.from(new Set(allGames)).filter(Boolean);
              setSyncValue2("IG-Owned", {
                time: Date.now(),
                games: allGames
              });
              markIgLinks();
              return true;
            }
            for (let page = 2; page <= firstParsed.pages; page += 1) {
              showUpdateStep("ig", `第 ${page} 页`);
              const response = await requestIgShowcasePage(page, cookies);
              const parsed = parseIgShowcase(response.responseText, page);
              allGames = allGames.concat(parsed.games);
            }
            allGames = Array.from(new Set(allGames)).filter(Boolean);
            setSyncValue2("IG-Owned", {
              time: Date.now(),
              games: allGames
            });
            await showUpdateResult("IG游戏库数据更新完成", "success");
            markIgLinks();
            return true;
          } catch (error) {
            console.error(error);
            if (loop) {
              await showUpdateResult("IG游戏库数据更新失败", "error");
            }
            return false;
          }
        }
        const moduleApi = {
          key: "ig",
          enabled: () => settings.platformEnabled.ig,
          isCacheEmpty: () => getIgOwnedGames().length === 0,
          updateLibrary: () => updateIgGameLibrary(),
          start: () => {
            if (started) return;
            started = true;
            markIgLinks();
            window.addEventListener?.("glc-library-synced", () => {
              if (settings.platformEnabled.ig) markIgLinks();
            });
            const autoUpdate = () => updateIgGameLibrary(false);
            let runner = autoUpdate;
            if (typeof runAutoUpdateWithRateLimit === "function") {
              runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
            }
            Promise.resolve(runner()).then(result => {
              if (typeof result === "object" && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
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
            const observer = new MutationObserver(() => {
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
        createIgModule
      };
    }
  });

  // src/runtime/bootstrap.ts
  var require_bootstrap = __commonJS({
    "src/runtime/bootstrap.ts"(exports, module) {
      "use strict";

      var {
        createModalRoot,
        showDialog
      } = require_dialog();
      var {
        showToast
      } = require_toast();
      var {
        createProgressController
      } = require_progress();
      var {
        createSettingsController
      } = require_settings();
      var {
        createStartupFlow
      } = require_startup();
      var {
        createGistSyncController
      } = require_gist_sync();
      var {
        UPDATE_STATUS,
        BASE_STYLE
      } = require_constants();
      var {
        createEpicModule
      } = require_epic();
      var {
        createGogModule
      } = require_gog();
      var {
        createItchModule
      } = require_itch();
      var {
        createIgModule
      } = require_ig();
      function bootstrapMergedRuntime2() {
        const {
          showProgressPanel,
          clearProgressPanel
        } = createProgressController(createModalRoot);
        const {
          settings,
          setting,
          openPlatformSwitchDialog,
          isUrlEnabled
        } = createSettingsController({
          showDialog
        });
        let modules = [];
        const {
          start: startGistSync
        } = createGistSyncController({
          showDialog,
          showToast,
          isAllowed: () => isUrlEnabled(window.location.href),
          onDataApplied: () => {
            const {
              getGlobalSettings
            } = require_settings();
            Object.assign(settings, getGlobalSettings());
            const classes = ["epic-game-checked", "epic-game-link-owned", "epic-game-link-wishlist", "gog-game-checked", "gog-game-link-owned", "itch-io-game-checked", "itch-io-game-link-owned", "cube-game-checked", "cube-game-link-owned", "ig-checked", "ig-owned"];
            document.querySelectorAll(classes.map(name => `.${name}`).join(",")).forEach(el => el.classList.remove(...classes));
            if (isUrlEnabled(window.location.href)) {
              modules.filter(item => item.enabled()).forEach(item => item.start());
              window.dispatchEvent(new Event("glc-library-synced"));
            }
          }
        });
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
            bodyText: `${platformName} 登录凭证已过期，需要重新登录。`,
            confirmText: "去登录",
            cancelText: "稍后",
            onConfirm: () => {
              GM_openInTab(loginUrl, {
                active: true,
                insert: true,
                setParent: true
              });
            }
          });
        }
        const {
          runInitialFlow,
          showUpdateStep,
          showUpdateResult,
          openManualUpdateDialogAndRun,
          runAutoUpdateWithRateLimit
        } = createStartupFlow({
          showDialog,
          showProgressPanel,
          clearProgressPanel,
          showToast,
          showLoginExpiredDialog,
          updateStatus: UPDATE_STATUS
        });
        const moduleContext = {
          settings,
          queryLinks,
          addClass,
          getHref,
          parseHtml,
          showToast,
          showUpdateStep,
          showUpdateResult,
          showLoginExpiredDialog,
          runAutoUpdateWithRateLimit,
          UPDATE_STATUS
        };
        GM_registerMenuCommand("设置", setting);
        GM_registerMenuCommand("平台开关", openPlatformSwitchDialog);
        GM_addStyle(BASE_STYLE);
        startGistSync();
        const itchModule = createItchModule(moduleContext);
        GM_registerMenuCommand("生成Itch联动码", () => itchModule.generateLinkageCode());
        modules = [createEpicModule(moduleContext), createGogModule(moduleContext), itchModule,
        // createCubeModule(moduleContext),
        createIgModule(moduleContext)];
        if (!isUrlEnabled(window.location.href)) return;
        GM_registerMenuCommand("更新游戏库", () => {
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
  var {
    bootstrapMergedRuntime
  } = require_bootstrap();
  (function main() {
    bootstrapMergedRuntime();
  })();
})();