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
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/ui/dialog.js
  var require_dialog = __commonJS({
    "src/ui/dialog.js"(exports, module) {
      var activeDialogClose = null;
      function createModalRoot() {
        let root = document.getElementById("glc-modal-root");
        if (root) return root;
        root = document.createElement("div");
        root.id = "glc-modal-root";
        document.body.appendChild(root);
        return root;
      }
      function showDialog({ title, bodyHtml, trustedBodyHtml = false, bodyText = "", bodyNode, confirmText = "确定", cancelText = "取消", onConfirm, onCancel, denyText, onDeny, hideCancel = false }) {
        if (typeof activeDialogClose === "function") {
          activeDialogClose();
        }
        const root = createModalRoot();
        root.innerHTML = `
    <div class="glc-mask">
      <div class="glc-dialog" role="dialog" aria-modal="true">
        <h3 class="glc-dialog-title"></h3>
        <div class="glc-dialog-body"></div>
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
        const runAndClose = (callback) => {
          try {
            if (typeof callback === "function") callback(root);
          } finally {
            close();
          }
        };
        const onKeydown = (event) => {
          if (closed) return;
          if (event.key === "Escape") runAndClose(onCancel);
        };
        const onMaskClick = (event) => {
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

  // src/ui/toast.js
  var require_toast = __commonJS({
    "src/ui/toast.js"(exports, module) {
      function createToastContainer() {
        let container = document.getElementById("glc-toast-container");
        if (container) return container;
        container = document.createElement("div");
        container.id = "glc-toast-container";
        document.body.appendChild(container);
        return container;
      }
      function showToast(message, type = "info") {
        const el = document.createElement("div");
        el.className = `glc-toast glc-toast-${type}`;
        el.textContent = message;
        el.classList.add("glc-toast-enter");
        createToastContainer().appendChild(el);
        window.setTimeout(() => {
          el.classList.remove("glc-toast-enter");
          el.classList.add("glc-toast-leave");
          window.setTimeout(() => el.remove(), 140);
        }, 4e3);
      }
      module.exports = {
        createToastContainer,
        showToast
      };
    }
  });

  // src/ui/progress.js
  var require_progress = __commonJS({
    "src/ui/progress.js"(exports, module) {
      function createProgressController(createModalRoot) {
        let progressPanelStateMap = {};
        function showProgressPanel(stateMap, { replace = false } = {}) {
          if (replace) {
            progressPanelStateMap = { ...stateMap || {} };
          } else {
            progressPanelStateMap = { ...progressPanelStateMap, ...stateMap || {} };
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

  // src/core/settings.js
  var require_settings = __commonJS({
    "src/core/settings.js"(exports, module) {
      var SETTINGS_KEY = "globalSettings";
      function getGlobalSettings() {
        const defaults = {
          whiteList: GM_getValue("whiteList") || [],
          blackList: GM_getValue("blackList") || [],
          platformEnabled: { epic: true, gog: true, itch: true, cube: true, ig: true }
        };
        const saved = GM_getValue(SETTINGS_KEY) || {};
        return {
          whiteList: Array.isArray(saved.whiteList) ? saved.whiteList : defaults.whiteList,
          blackList: Array.isArray(saved.blackList) ? saved.blackList : defaults.blackList,
          platformEnabled: { ...defaults.platformEnabled, ...saved.platformEnabled || {} }
        };
      }
      function setGlobalSettings(settings) {
        GM_setValue(SETTINGS_KEY, settings);
      }
      function isUrlEnabledByList(url, settings) {
        const { whiteList, blackList } = settings;
        if (whiteList.length > 0) return whiteList.some((item) => url.includes(item));
        if (blackList.length > 0) return !blackList.some((item) => url.includes(item));
        return true;
      }
      function createSettingsController({ showDialog }) {
        const settings = getGlobalSettings();
        function openPlatformSwitchDialog() {
          const current = settings.platformEnabled;
          const bodyNode = document.createElement("div");
          [
            ["glc-epic", "Epic", current.epic],
            ["glc-gog", "GOG", current.gog],
            ["glc-itch", "Itch", current.itch],
            ["glc-cube", "Cube", current.cube],
            ["glc-ig", "IG", current.ig]
          ].forEach(([id, labelText, checked], index) => {
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
            onConfirm: (root) => {
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
          const bodyNode = document.createElement("textarea");
          bodyNode.className = "glc-textarea";
          bodyNode.value = initialValue.join("\n");
          showDialog({
            title,
            bodyNode,
            confirmText: "保存",
            cancelText: "取消",
            onConfirm: (root) => {
              const value = root.querySelector(".glc-textarea")?.value || "";
              onSave(value ? value.split("\n") : []);
            }
          });
        }
        function addWhiteList() {
          showListEditor("添加白名单网站", settings.whiteList || [], (value) => {
            settings.whiteList = value;
            settings.blackList = settings.blackList || [];
            setGlobalSettings(settings);
          });
        }
        function addBlackList() {
          showListEditor("添加黑名单网站", settings.blackList || [], (value) => {
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
          isUrlEnabled: (url) => isUrlEnabledByList(url, settings)
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

  // src/core/startup.js
  var require_startup = __commonJS({
    "src/core/startup.js"(exports, module) {
      function createStartupFlow({ showDialog, showProgressPanel, clearProgressPanel, showToast, showLoginExpiredDialog, updateStatus }) {
        let inBatchUpdateFlow = false;
        function collectEmptyCaches(enabledModules) {
          return enabledModules.filter((module2) => module2.isCacheEmpty()).map((module2) => module2.key);
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
            onConfirm: (root) => {
              const selected = Array.from(root.querySelectorAll("input[data-platform]:checked")).map((el) => el.getAttribute("data-platform"));
              onConfirm(selected);
            },
            onCancel: () => {
              if (typeof onCancel === "function") onCancel();
            }
          });
        }
        function getSelectedPlatformKeys(root) {
          return Array.from(root.querySelectorAll("input[data-platform]:checked:not(:disabled)")).map((el) => el.getAttribute("data-platform"));
        }
        function updateManualUpdateConfirmState(root) {
          if (!root) return;
          const confirmButton = root.querySelector("[data-glc-confirm]");
          if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
        }
        function buildPlatformCheckboxBody(modules, onSelectionChange) {
          const bodyNode = document.createElement("div");
          modules.forEach((module2, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            const enabled = module2.enabled();
            input.type = "checkbox";
            input.dataset.platform = module2.key;
            input.checked = enabled;
            input.disabled = !enabled;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${module2.key.toUpperCase()}`));
            bodyNode.appendChild(label);
            if (index < modules.length - 1) bodyNode.appendChild(document.createElement("br"));
          });
          bodyNode.addEventListener("change", () => {
            if (typeof onSelectionChange === "function") onSelectionChange(document.getElementById("glc-modal-root"));
          });
          return bodyNode;
        }
        function openManualUpdateDialogAndRun(modules) {
          const enabledModules = modules.filter((module2) => module2.enabled());
          const bodyNode = buildPlatformCheckboxBody(modules, updateManualUpdateConfirmState);
          showDialog({
            title: "更新游戏库",
            bodyNode,
            confirmText: "开始更新",
            cancelText: "取消",
            onConfirm: async (root) => {
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
        async function batchUpdateSelectedModules(enabledModules, selectedKeys) {
          const state = Object.fromEntries(selectedKeys.map((key) => [key, "waiting"]));
          let interruptedByAuthExpired = false;
          inBatchUpdateFlow = true;
          showProgressPanel(state, { replace: true });
          try {
            for (const key of selectedKeys) {
              const module2 = enabledModules.find((item) => item.key === key);
              if (!module2) continue;
              state[key] = "running";
              showProgressPanel({ [key]: state[key] });
              try {
                const updateResult = await module2.updateLibrary();
                if (updateResult === true) {
                  state[key] = "success";
                } else if (updateResult?.status === updateStatus.AUTH_EXPIRED) {
                  interruptedByAuthExpired = true;
                  state[key] = updateStatus.AUTH_EXPIRED;
                  clearProgressPanel();
                  showLoginExpiredDialog(updateResult.platformName, updateResult.loginUrl);
                  break;
                } else {
                  state[key] = "error";
                  showToast(`${key.toUpperCase()} 更新失败`, "error");
                }
              } catch (error) {
                console.error(error);
                state[key] = "error";
                showToast(`${key.toUpperCase()} 更新失败`, "error");
              }
              if (!interruptedByAuthExpired) showProgressPanel({ [key]: state[key] });
            }
          } finally {
            inBatchUpdateFlow = false;
          }
          if (!interruptedByAuthExpired) clearProgressPanel();
        }
        async function runInitialFlow(modules) {
          const enabledModules = modules.filter((module2) => module2.enabled());
          const emptyKeys = collectEmptyCaches(enabledModules);
          if (emptyKeys.length > 0) {
            showEmptyCacheAggregationDialog(
              emptyKeys,
              async (selectedKeys) => {
                if (selectedKeys.length > 0) await batchUpdateSelectedModules(enabledModules, selectedKeys);
                enabledModules.forEach((module2) => module2.start());
              },
              () => {
                enabledModules.forEach((module2) => module2.start());
              }
            );
            return;
          }
          enabledModules.forEach((module2) => module2.start());
        }
        function showUpdateStep(platform, text) {
          showProgressPanel({ [platform]: text });
        }
        function showUpdateResult(title, type) {
          if (!inBatchUpdateFlow) clearProgressPanel();
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
          showUpdateResult
        };
      }
      module.exports = {
        createStartupFlow
      };
    }
  });

  // src/shared/constants.js
  var require_constants = __commonJS({
    "src/shared/constants.js"(exports, module) {
      var UPDATE_STATUS = {
        SUCCESS: "success",
        ERROR: "error",
        AUTH_EXPIRED: "auth_expired"
      };
      var BASE_STYLE = `
.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.52);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}
.glc-dialog{background:#fff;color:#0f172a;border:1px solid #dbe4f0;padding:20px;border-radius:16px;min-width:360px;max-width:580px;font-size:14px;box-shadow:0 24px 64px rgba(15,23,42,.22),0 8px 24px rgba(15,23,42,.12)}
.glc-dialog-title{margin:0 0 14px;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700;letter-spacing:.2px}
.glc-dialog-body{line-height:1.65;color:#475569}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid #edf2f8}
.glc-dialog-actions button{border:1px solid #d0dbe8;border-radius:10px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease,transform .14s ease,box-shadow .14s ease}
.glc-dialog-actions button:hover{background:#f8fbff;border-color:#c6d4e8;transform:translateY(-1px)}
.glc-dialog-actions button:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}
.glc-dialog-actions [data-glc-confirm]{border-color:#1d4ed8;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);color:#fff;box-shadow:0 8px 20px rgba(37,99,235,.3)}
.glc-dialog-actions [data-glc-confirm]:hover{border-color:#1e40af;background:linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%)}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:10px;padding:10px 12px;color:#0f172a;background:#fff}
#glc-toast-container{position:fixed;right:18px;bottom:18px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:none}
.glc-toast{background:#1f2937;color:#fff;padding:11px 15px;border-radius:12px;border:1px solid rgba(255,255,255,.14);box-shadow:0 16px 36px rgba(15,23,42,.28);pointer-events:auto;max-width:420px;word-break:break-word;opacity:1}
.glc-toast-success{background:#15803d}
.glc-toast-error{background:#b91c1c}
.glc-toast-enter{animation:glc-toast-fade-in .16s ease}
.glc-toast-leave{animation:glc-toast-fade-out .16s ease forwards}
@keyframes glc-toast-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes glc-toast-fade-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid #e6edf7;border-radius:10px;background:#f8fbff}
.glc-progress-platform{font-weight:700;color:#0f172a;letter-spacing:.3px}
.glc-progress-state{color:#334155}
`;
      module.exports = {
        UPDATE_STATUS,
        BASE_STYLE
      };
    }
  });

  // src/platforms/epic.js
  var require_epic = __commonJS({
    "src/platforms/epic.js"(exports, module) {
      function createEpicModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          showUpdateStep,
          showUpdateResult,
          showLoginExpiredDialog,
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
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const ownedGames = getEpicOwnedGames();
              const wishlistGames = GM_getValue("epicWishist") || [];
              const excludedClass = again ? "epic-game-checked" : "epic-game-link-owned";
              const epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]').filter((el) => !el.classList.contains(excludedClass));
              if (epicLink.length === 0) return;
              if (first) updateEpicOwnedGames(false);
              epicLink.forEach((el) => {
                addClass(el, "epic-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const epicGameName = href.match(/https?:\/\/www\.epicgames\.com\/store\/.*?\/p(roduct)?\/([^?/]+)/i)?.[2]?.toLowerCase() || href.match(/https?:\/\/store\.epicgames\.com\/.*?\/p(roduct)?\/([^?/]+)/i)?.[2]?.toLowerCase();
                if (epicGameName) {
                  if (ownedGames.find((game) => game.pageSlug.includes(epicGameName))) {
                    addClass(el, "epic-game-link-owned");
                  } else if (wishlistGames.find((game) => game.pageSlug.includes(epicGameName))) {
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
                  url: "https://store.epicgames.com/zh-CN/p/grand-theft-auto-v",
                  timeout: 3e4,
                  fetch: true,
                  headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
                  },
                  onerror: reject,
                  ontimeout: reject,
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then((response) => {
                [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
                [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ["en-US"];
                console.log("[EGLC] ", JSON.stringify({ catalogOfferSha256Hash, locale }));
              }).catch((error) => {
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => {
                if (response.response?.data?.Catalog?.catalogOffer) {
                  const { offerMappings, urlSlug, customAttributes } = response.response.data.Catalog.catalogOffer;
                  return [
                    ...new Set([
                      offerMappings?.[0]?.pageSlug,
                      urlSlug,
                      customAttributes?.find((e) => e.key === "com.epicgames.app.productSlug")?.value?.replace(/\/home$/, "")
                    ].filter((e) => e))
                  ];
                }
                return false;
              }).catch((error) => {
                console.error(error);
                return false;
              });
            }
            async function updateEpicAuth(loop) {
              console.log("[EGLC] updateEpicAuth...");
              if (loop) {
                context.showToast("正在更新Epic凭证...", "info");
              }
              const reputationResult = await new Promise((resolve, reject) => {
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => response.status === 200).catch((error) => {
                console.error(error);
                return false;
              });
              if (!reputationResult) {
                return false;
              }
              const authenticateResult = await new Promise((resolve, reject) => {
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => response.status === 200).catch((error) => {
                console.error(error);
                return false;
              });
              if (!authenticateResult) {
                return false;
              }
              const refreshCsrfResult = await new Promise((resolve, reject) => {
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => response.response?.success === true).catch((error) => {
                console.error(error);
                return false;
              });
              if (!refreshCsrfResult) {
                return false;
              }
              return true;
            }
            function updateEpicOwnedGames(loop = true, i = 0, games = GM_getValue("ownedGames") || [], nextPageToken = "") {
              console.log("[EGLC] updateEpicOwnedGames...");
              if (!loop && i !== 0) {
                GM_setValue("ownedGames", games);
                checkEpicGame(false);
                return;
              }
              return new Promise((resolve, reject) => {
                if (loop) {
                  showUpdateStep("epic", `第 ${i + 1} 页`);
                }
                GM_xmlhttpRequest({
                  method: "GET",
                  url: `https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ""}`,
                  timeout: 3e4,
                  nocache: true,
                  responseType: "json",
                  onerror: reject,
                  ontimeout: reject,
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => {
                if (/login/i.test(response.finalUrl)) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "Epic",
                    loginUrl: "https://www.epicgames.com/id/login"
                  };
                }
                const ordersLength = response.response?.orders?.length || 0;
                if (ordersLength >= 0) {
                  const orderedGames = response.response.orders.map((e) => e?.items?.[0] || null).filter((e) => e);
                  await Promise.all(orderedGames.map(async (item) => {
                    if (games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId)) {
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
                      GM_setValue("ownedGames", games);
                    }
                    return true;
                  }));
                  const { nextPageToken: nextPageToken2 } = response.response;
                  if (nextPageToken2) {
                    if (loop) {
                      await new Promise((resolve) => {
                        setTimeout(() => {
                          resolve(true);
                        }, 1e3);
                      });
                    }
                    return await updateEpicOwnedGames(loop, ++i, games, nextPageToken2);
                  } else if (loop) {
                    GM_setValue("ownedGames", games);
                    await showUpdateResult("Epic已拥有游戏数据更新完成", "success");
                    return true;
                  }
                  GM_setValue("ownedGames", games);
                  checkEpicGame(false);
                  console.log("[EGLC] updateEpicOwnedGames: Finish!");
                  return true;
                } else if (response.response?.products?.length !== 0) {
                  console.error(response);
                  await showUpdateResult("Epic已拥有游戏数据更新失败", "error");
                  return false;
                }
                return false;
              }).catch(async (error) => {
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
            void updateEpicAuth;
          }
        };
        return moduleApi;
      }
      module.exports = {
        createEpicModule
      };
    }
  });

  // src/platforms/gog.js
  var require_gog = __commonJS({
    "src/platforms/gog.js"(exports, module) {
      function createGogModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          showUpdateStep,
          showUpdateResult,
          showLoginExpiredDialog,
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
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const gogGames = getGogGameLibrary();
              const excludedClass = again ? "gog-game-checked" : "gog-game-link-owned";
              const gogLink = queryLinks('a[href*="www.gog.com/"]').filter((el) => !el.classList.contains(excludedClass));
              if (gogLink.length === 0) return;
              if (first) updateGogGameLibrary(false);
              gogLink.forEach((el) => {
                addClass(el, "gog-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const gogGameLink = href.match(/https?:\/\/www\.gog\.com\/(?:[\w-]+\/)?game\/([^/?#]+)/i)?.[1]?.toLowerCase();
                if (gogGameLink && gogGames.some((game) => game.toLowerCase() === gogGameLink)) {
                  addClass(el, "gog-game-link-owned");
                }
              });
            }
            function getGogGameLibrary() {
              return GM_getValue("gogGames") || [];
            }
            function updateGogGameLibrary(loop = true, i = 1, games = []) {
              if (!loop && i !== 1) {
                GM_setValue("gogGames", [.../* @__PURE__ */ new Set([...getGogGameLibrary(), ...games])]);
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => {
                if (/openlogin/i.test(response.finalUrl)) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "GOG",
                    loginUrl: "https://www.gog.com/#openlogin"
                  };
                } else if (response.response?.products?.length) {
                  games = [...games, ...response.response.products.map((e) => e?.slug || e?.url?.split("/")?.[e?.url?.split("/").length - 1])];
                  if (response.response?.totalPages > i) {
                    return await updateGogGameLibrary(loop, ++i, games);
                  } else if (loop) {
                    GM_setValue("gogGames", [...new Set(games)].filter((e) => e));
                    await showUpdateResult("gog游戏库数据更新完成", "success");
                    return true;
                  }
                  GM_setValue("gogGames", [.../* @__PURE__ */ new Set([...getGogGameLibrary(), ...games])].filter((e) => e));
                  checkGogGame(false);
                  return true;
                } else if (response.response?.products?.length !== 0) {
                  console.error(response);
                  await showUpdateResult("gog游戏库数据更新失败", "error");
                  return false;
                }
                return false;
              }).catch(async (error) => {
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

  // src/platforms/itch.js
  var require_itch = __commonJS({
    "src/platforms/itch.js"(exports, module) {
      function createItchModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          parseHtml,
          showUpdateStep,
          showUpdateResult,
          showLoginExpiredDialog,
          UPDATE_STATUS
        } = context;
        let updateLibrary;
        let started = false;
        const moduleApi = {
          key: "itch",
          enabled: () => settings.platformEnabled.itch,
          isCacheEmpty: () => (GM_getValue("itchGames") || []).length === 0,
          updateLibrary: () => {
            if (!updateLibrary) moduleApi.start();
            return updateLibrary();
          },
          start: () => {
            if (started) return;
            started = true;
            let loadTimes = 0;
            checkItchGame();
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
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const itchGames = getItchGameLibrary();
              const excludedClass = again ? "itch-io-game-checked" : "itch-io-game-link-owned";
              const itchLink = queryLinks('a[href*=".itch.io/"]').filter((el) => !el.classList.contains(excludedClass));
              if (itchLink.length === 0) return;
              if (first) updateItchGameLibrary(false);
              itchLink.forEach((el) => {
                addClass(el, "itch-io-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const itchGameLink = href.match(/https?:\/\/(.*?\/.*?)\//i)?.[1];
                if (itchGameLink && itchGames.includes(itchGameLink)) {
                  addClass(el, "itch-io-game-link-owned");
                }
              });
            }
            function getItchGameLibrary() {
              return GM_getValue("itchGames") || [];
            }
            function updateItchGameLibrary(loop = true, i = 1, games = []) {
              if (!loop && i !== 1) {
                GM_setValue("itchGames", [.../* @__PURE__ */ new Set([...getItchGameLibrary(), ...games])]);
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => {
                if (/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "itch.io",
                    loginUrl: "https://itch.io/login"
                  };
                } else if (response.response?.num_items) {
                  const itchDoc = parseHtml(`<div>${response.response.content}</div>`);
                  const purchaseLinks = Array.from(itchDoc.querySelectorAll("a.thumb_link.game_link"));
                  games = [...games, ...purchaseLinks.map((el) => getHref(el).match(/https?:\/\/(.*?\/.*?)\//i)?.[1])];
                  if (response.response.num_items === 50) {
                    return await updateItchGameLibrary(loop, ++i, games);
                  } else if (loop) {
                    GM_setValue("itchGames", [...new Set(games)]);
                    await showUpdateResult("itch游戏库数据更新完成", "success");
                    return true;
                  }
                  GM_setValue("itchGames", [.../* @__PURE__ */ new Set([...getItchGameLibrary(), ...games])]);
                  checkItchGame(false);
                  return true;
                } else if (response.response?.num_items === 0) {
                  GM_setValue("itchGames", [...new Set(games)]);
                  await showUpdateResult("itch游戏库数据更新完成", "success");
                  return true;
                }
                console.error(response);
                await showUpdateResult("itch游戏库数据更新失败", "error");
                return false;
              }).catch(async (error) => {
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
        return moduleApi;
      }
      module.exports = {
        createItchModule
      };
    }
  });

  // src/platforms/cube.js
  var require_cube = __commonJS({
    "src/platforms/cube.js"(exports, module) {
      function createCubeModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          showUpdateStep,
          showUpdateResult,
          showLoginExpiredDialog,
          UPDATE_STATUS
        } = context;
        let updateLibrary;
        let started = false;
        const moduleApi = {
          key: "cube",
          enabled: () => settings.platformEnabled.cube,
          isCacheEmpty: () => (GM_getValue("cubeGames") || []).length === 0,
          updateLibrary: () => {
            if (!updateLibrary) moduleApi.start();
            return updateLibrary();
          },
          start: () => {
            if (started) return;
            started = true;
            let loadTimes = 0;
            checkCubeGame();
            const observer = new MutationObserver(() => {
              checkCubeGame(false, true);
            });
            observer.observe(document.documentElement, {
              attributes: false,
              characterData: false,
              childList: true,
              subtree: true
            });
            function checkCubeGame(first = true, again = false) {
              loadTimes++;
              if (loadTimes > 1e3) {
                observer.disconnect();
                return;
              }
              const cubeGames = getCubeGameLibrary();
              const excludedClass = again ? "cube-game-checked" : "cube-game-link-owned";
              const cubeLink = queryLinks('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]').filter((el) => !el.classList.contains(excludedClass));
              if (cubeLink.length === 0) return;
              if (first) updateCubeGameLibrary(false);
              cubeLink.forEach((el) => {
                addClass(el, "cube-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const cubeGameId = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)?.[1];
                if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
                  addClass(el, "cube-game-link-owned");
                }
              });
            }
            function getCubeGameLibrary() {
              return GM_getValue("cubeGames") || [];
            }
            function updateCubeGameLibrary(loop = true, i = 1, games = []) {
              if (!loop && i !== 1) {
                GM_setValue("cubeGames", [.../* @__PURE__ */ new Set([...getCubeGameLibrary(), ...games])]);
                checkCubeGame(false);
                return;
              }
              return new Promise((resolve, reject) => {
                if (loop) {
                  showUpdateStep("cube", `第 ${i} 页`);
                }
                GM_xmlhttpRequest({
                  method: "POST",
                  url: `https://account.cubejoy.com/Comment/MyGameReq?pageIndex=${i}&pageSize=24`,
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
                  onload: (response) => {
                    response.status === 200 ? resolve(response) : reject(response);
                  }
                });
              }).then(async (response) => {
                if (response.response?.resultCode === 0) {
                  return {
                    status: UPDATE_STATUS.AUTH_EXPIRED,
                    platformName: "方块",
                    loginUrl: "https://account.cubejoy.com/html/login.html"
                  };
                } else if (response.response?.result?.list?.length) {
                  games = [...games, ...response.response.result.list.map((e) => e.S_Id)];
                  if (response.response?.result.total > i * 24) {
                    return await updateCubeGameLibrary(loop, ++i, games);
                  } else if (loop) {
                    GM_setValue("cubeGames", [...new Set(games)].filter((e) => e));
                    await showUpdateResult("cube游戏库数据更新完成", "success");
                    return true;
                  }
                  GM_setValue("cubeGames", [.../* @__PURE__ */ new Set([...getCubeGameLibrary(), ...games])].filter((e) => e));
                  checkCubeGame(false);
                  return true;
                } else if (response.response?.result?.list?.length !== 0) {
                  console.error(response);
                  await showUpdateResult("方块游戏库数据更新失败", "error");
                  return false;
                }
                return false;
              }).catch(async (error) => {
                console.error(error);
                await showUpdateResult("方块游戏库数据更新失败", "error");
                return false;
              });
            }
            updateLibrary = updateCubeGameLibrary;
            GM_addStyle(".cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}");
          }
        };
        return moduleApi;
      }
      module.exports = {
        createCubeModule
      };
    }
  });

  // src/platforms/ig.js
  var require_ig = __commonJS({
    "src/platforms/ig.js"(exports, module) {
      function createIgModule(context) {
        const {
          settings,
          queryLinks,
          addClass,
          getHref,
          parseHtml,
          showUpdateStep,
          showUpdateResult,
          showLoginExpiredDialog,
          UPDATE_STATUS
        } = context;
        let started = false;
        function getIgOwnedGames() {
          return (GM_getValue("IG-Owned")?.games || []).filter(Boolean).map((item) => item.toLowerCase());
        }
        function markIgLinks() {
          const owned = getIgOwnedGames();
          const links = queryLinks('a[href*=".indiegala.com"]:not(.ig-checked)');
          links.forEach((el) => {
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
            GM_cookie.list({ url: "https://www.indiegala.com/library/showcase/1" }, (cookies, error) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";"));
            });
          });
        }
        async function requestIgShowcasePage(page, cookies) {
          return TM_request({
            url: `https://www.indiegala.com/library/showcase/${page}`,
            method: "GET",
            timeout: 3e4,
            retry: 3,
            headers: { cookie: cookies }
          });
        }
        function parseIgShowcase(responseText, page) {
          const doc = parseHtml(responseText);
          let pages = 1;
          if (page === 1) {
            const pageLinks = Array.from(doc.querySelectorAll('a.profile-private-page-library-pagination-item[href*="library/showcase"]'));
            const lastPageHref = pageLinks.find((el) => el.querySelector(".fa-angle-double-right"))?.getAttribute("href") || "";
            const parsedPage = Number((lastPageHref.match(/\d+/) || [1])[0]);
            pages = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
          }
          const games = Array.from(doc.querySelectorAll("a.library-showcase-title")).map((el) => el.getAttribute("href")?.match(/https?:\/\/.*?\.indiegala\.com\/(.*)/)?.[1]?.toLowerCase()).filter(Boolean);
          return { pages, games };
        }
        async function updateIgGameLibrary() {
          try {
            showUpdateStep("ig", "第 1 页");
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
            let allGames = [...firstParsed.games];
            for (let page = 2; page <= firstParsed.pages; page += 1) {
              showUpdateStep("ig", `第 ${page} 页`);
              const response = await requestIgShowcasePage(page, cookies);
              const parsed = parseIgShowcase(response.responseText, page);
              allGames = allGames.concat(parsed.games);
            }
            allGames = Array.from(new Set(allGames)).filter(Boolean);
            GM_setValue("IG-Owned", { time: Date.now(), games: allGames });
            await showUpdateResult("IG游戏库数据更新完成", "success");
            markIgLinks();
            return true;
          } catch (error) {
            console.error(error);
            await showUpdateResult("IG游戏库数据更新失败", "error");
            return false;
          }
        }
        return {
          key: "ig",
          enabled: () => settings.platformEnabled.ig,
          isCacheEmpty: () => getIgOwnedGames().length === 0,
          updateLibrary: () => updateIgGameLibrary(),
          start: () => {
            if (started) return;
            started = true;
            markIgLinks();
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
      }
      module.exports = {
        createIgModule
      };
    }
  });

  // src/runtime/bootstrap.js
  var require_bootstrap = __commonJS({
    "src/runtime/bootstrap.js"(exports, module) {
      var { createModalRoot, showDialog } = require_dialog();
      var { showToast } = require_toast();
      var { createProgressController } = require_progress();
      var { createSettingsController } = require_settings();
      var { createStartupFlow } = require_startup();
      var { UPDATE_STATUS, BASE_STYLE } = require_constants();
      var { createEpicModule } = require_epic();
      var { createGogModule } = require_gog();
      var { createItchModule } = require_itch();
      var { createCubeModule } = require_cube();
      var { createIgModule } = require_ig();
      function bootstrapMergedRuntime2() {
        const { showProgressPanel, clearProgressPanel } = createProgressController(createModalRoot);
        const {
          settings,
          setting,
          openPlatformSwitchDialog,
          isUrlEnabled
        } = createSettingsController({ showDialog });
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
            onConfirm: () => GM_openInTab(loginUrl, { active: true, insert: true, setParent: true })
          });
        }
        const {
          runInitialFlow,
          showUpdateStep,
          showUpdateResult,
          openManualUpdateDialogAndRun
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
          UPDATE_STATUS
        };
        GM_registerMenuCommand("设置", setting);
        GM_registerMenuCommand("平台开关", openPlatformSwitchDialog);
        GM_addStyle(BASE_STYLE);
        if (!isUrlEnabled(window.location.href)) return;
        const modules = [
          createEpicModule(moduleContext),
          createGogModule(moduleContext),
          createItchModule(moduleContext),
          createCubeModule(moduleContext),
          createIgModule(moduleContext)
        ];
        GM_registerMenuCommand("更新游戏库", () => {
          openManualUpdateDialogAndRun(modules);
        });
        runInitialFlow(modules);
      }
      module.exports = { bootstrapMergedRuntime: bootstrapMergedRuntime2 };
    }
  });

  // src/index.js
  var { bootstrapMergedRuntime } = require_bootstrap();
  (function main() {
    bootstrapMergedRuntime();
  })();
})();

