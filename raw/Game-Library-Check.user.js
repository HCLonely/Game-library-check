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
            // ['glc-cube', 'Cube', current.cube],
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
                // cube: root.querySelector('#glc-cube').checked,
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
        const PLATFORM_UPDATE_RATE_KEY = "platformUpdateRate";
        const PLATFORM_LAST_UPDATE_AT_KEY = "platformLastUpdateAt";
        const TEN_MINUTES_MS = 10 * 60 * 1e3;
        const ONE_HOUR_MS = 60 * 60 * 1e3;
        function sanitizePlatformRateMap(raw, now = Date.now()) {
          if (!raw || typeof raw !== "object") return {};
          const oneHourAgo = now - ONE_HOUR_MS;
          const result = {};
          Object.keys(raw).forEach((key) => {
            const list = Array.isArray(raw[key]) ? raw[key] : [];
            result[key] = list.filter((ts) => Number.isFinite(ts) && ts >= oneHourAgo && ts <= now);
          });
          return result;
        }
        function canRunAutoUpdate(platformKey, now = Date.now()) {
          const rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY) || {}, now);
          const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
          const tenMinutesAgo = now - TEN_MINUTES_MS;
          const oneHourAgo = now - ONE_HOUR_MS;
          const countIn10Minutes = history.filter((ts) => ts >= tenMinutesAgo).length;
          const countIn1Hour = history.filter((ts) => ts >= oneHourAgo).length;
          GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
          return countIn10Minutes < 5 && countIn1Hour < 30;
        }
        function recordAutoUpdateSuccess(platformKey, now = Date.now()) {
          const rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY) || {}, now);
          const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
          rateMap[platformKey] = history.concat(now).filter((ts) => ts >= now - ONE_HOUR_MS);
          GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
          const lastUpdateMap = GM_getValue(PLATFORM_LAST_UPDATE_AT_KEY) || {};
          lastUpdateMap[platformKey] = now;
          GM_setValue(PLATFORM_LAST_UPDATE_AT_KEY, lastUpdateMap);
        }
        async function runAutoUpdateWithRateLimit(module2, autoUpdateRunner) {
          if (!module2?.key || typeof autoUpdateRunner !== "function") return false;
          if (!canRunAutoUpdate(module2.key)) return false;
          const result = await autoUpdateRunner();
          if (result === true) recordAutoUpdateSuccess(module2.key);
          return result;
        }
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
        function extractFailureReason(failure) {
          if (!failure) return "未知错误";
          if (typeof failure === "string") return failure;
          if (failure instanceof Error && failure.message) return failure.message;
          if (typeof failure.message === "string" && failure.message.trim()) return failure.message;
          if (typeof failure.reason === "string" && failure.reason.trim()) return failure.reason;
          if (typeof failure.error === "string" && failure.error.trim()) return failure.error;
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
                  showUpdateFailureDialog(key, updateResult);
                }
              } catch (error) {
                console.error(error);
                state[key] = "error";
                showUpdateFailureDialog(key, error);
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

  // src/core/gist-sync.js
  var require_gist_sync = __commonJS({
    "src/core/gist-sync.js"(exports, module) {
      var GIST_CONF_KEY = "gistConf";
      function getGistConf() {
        const conf = GM_getValue(GIST_CONF_KEY) || {};
        return {
          TOKEN: conf.TOKEN || "",
          GIST_ID: conf.GIST_ID || "",
          FILE_NAME: conf.FILE_NAME || ""
        };
      }
      function setGistConf(conf) {
        GM_setValue(GIST_CONF_KEY, conf);
      }
      function requestWithRetry(options, retry = 0) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            ...options,
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status >= 200 && response.status < 400 ? resolve(response) : reject(response);
            }
          });
        }).catch((error) => {
          if (retry <= 0) throw error;
          return requestWithRetry(options, retry - 1);
        });
      }
      function setGistData(token, gistId, fileName, content) {
        const data = JSON.stringify({
          files: {
            [fileName]: {
              content: JSON.stringify(content)
            }
          }
        });
        return requestWithRetry({
          url: `https://api.github.com/gists/${gistId}`,
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${token}`
          },
          data,
          responseType: "json",
          method: "PATCH",
          timeout: 3e4
        }, 3).then((response) => {
          const body = response?.response;
          const remoteContent = body?.files?.[fileName]?.content;
          return response.status === 200 && remoteContent === JSON.stringify(content);
        }).catch((error) => {
          console.error(error);
          return false;
        });
      }
      function getGistData(token, gistId, fileName) {
        return requestWithRetry({
          url: `https://api.github.com/gists/${gistId}`,
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${token}`
          },
          responseType: "json",
          method: "GET",
          timeout: 3e4
        }, 3).then((response) => {
          if (response.status !== 200) return false;
          const content = response?.response?.files?.[fileName]?.content;
          if (!content) return false;
          return JSON.parse(content);
        }).catch((error) => {
          console.error(error);
          return false;
        });
      }
      function createLabeledInput(labelText, value, placeholder, type = "text") {
        const wrapper = document.createElement("label");
        wrapper.className = "glc-form-field";
        const text = document.createElement("div");
        text.className = "glc-input-label";
        text.textContent = labelText;
        const input = document.createElement("input");
        input.className = "glc-input";
        input.type = type;
        input.placeholder = placeholder;
        input.value = value;
        wrapper.appendChild(text);
        wrapper.appendChild(input);
        return { wrapper, input };
      }
      function createGistSyncController({ showDialog, showToast }) {
        function validateConf(conf) {
          return Boolean(conf.TOKEN && conf.GIST_ID && conf.FILE_NAME);
        }
        function buildUploadPayload() {
          const payload = {};
          const keys = GM_listValues();
          keys.forEach((key) => {
            if (key === GIST_CONF_KEY) return;
            payload[key] = GM_getValue(key);
          });
          return payload;
        }
        async function uploadData(conf) {
          if (!validateConf(conf)) {
            showToast("请先保存配置并测试", "error");
            return;
          }
          const payload = buildUploadPayload();
          const ok = await setGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME, payload);
          if (ok) {
            showToast("同步到 Gist 成功", "success");
            return;
          }
          showToast("同步到 Gist 失败，请查看控制台错误", "error");
        }
        async function downloadData(conf) {
          if (!validateConf(conf)) {
            showToast("请先保存配置并测试", "error");
            return;
          }
          const remoteData = await getGistData(conf.TOKEN, conf.GIST_ID, conf.FILE_NAME);
          if (!remoteData || typeof remoteData !== "object") {
            showToast("未检测到远程数据，请检查配置", "error");
            return;
          }
          Object.entries(remoteData).forEach(([key, value]) => {
            if (key === GIST_CONF_KEY) return;
            GM_setValue(key, value);
          });
          showToast("从 Gist 同步成功", "success");
        }
        function openGistSyncDialog() {
          const conf = getGistConf();
          const bodyNode = document.createElement("div");
          const tokenField = createLabeledInput("Github Token", conf.TOKEN, "Github Token");
          const gistIdField = createLabeledInput("Gist ID", conf.GIST_ID, "Gist ID");
          const fileNameField = createLabeledInput("文件名", conf.FILE_NAME, "文件名");
          bodyNode.appendChild(tokenField.wrapper);
          bodyNode.appendChild(gistIdField.wrapper);
          bodyNode.appendChild(fileNameField.wrapper);
          const actionRow = document.createElement("div");
          actionRow.className = "glc-inline-actions";
          const uploadButton = document.createElement("button");
          uploadButton.type = "button";
          uploadButton.className = "glc-inline-button";
          uploadButton.textContent = "同步到Gist";
          const downloadButton = document.createElement("button");
          downloadButton.type = "button";
          downloadButton.className = "glc-inline-button";
          downloadButton.textContent = "从Gist同步";
          actionRow.appendChild(uploadButton);
          actionRow.appendChild(downloadButton);
          bodyNode.appendChild(actionRow);
          const readConfFromInputs = () => ({
            TOKEN: tokenField.input.value.trim(),
            GIST_ID: gistIdField.input.value.trim(),
            FILE_NAME: fileNameField.input.value.trim()
          });
          uploadButton.addEventListener("click", () => {
            uploadData(readConfFromInputs());
          });
          downloadButton.addEventListener("click", () => {
            downloadData(readConfFromInputs());
          });
          showDialog({
            title: "Gist 设置",
            bodyNode,
            confirmText: "保存配置并测试",
            cancelText: "关闭",
            onConfirm: async () => {
              const nextConf = readConfFromInputs();
              setGistConf(nextConf);
              if (!validateConf(nextConf)) {
                showToast("配置不完整，请填写 Token、Gist ID 和文件名", "error");
                return;
              }
              const ok = await getGistData(nextConf.TOKEN, nextConf.GIST_ID, nextConf.FILE_NAME);
              if (ok !== false) {
                showToast("测试成功", "success");
                return;
              }
              showToast("测试失败，请检查配置", "error");
            }
          });
        }
        return {
          openGistSyncDialog
        };
      }
      module.exports = {
        createGistSyncController,
        getGistConf,
        setGistConf,
        getGistData,
        setGistData
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
.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}
.glc-dialog{background:#fff;color:#0f172a;border:1px solid #e2e8f0;padding:20px;border-radius:12px;min-width:360px;max-width:580px;font-size:14px;box-shadow:0 14px 36px rgba(15,23,42,.16),0 4px 14px rgba(15,23,42,.08)}
.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700}
.glc-dialog-body{line-height:1.6;color:#334155}
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
              if (first) {
                const autoUpdate = () => updateEpicOwnedGames(false);
                let runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                }
                runner().then((result) => {
                  if (result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
                    showToast("Epic 登录状态已过期，请先登录", "error", { duration: 0, closable: true, link: { href: result.loginUrl, text: "去登录" } });
                  }
                });
              }
              epicLink.forEach((el) => {
                addClass(el, "epic-game-checked");
                let href = getHref(el);
                if (!/\/$/.test(href)) href += "/";
                const epicGameName = href.match(/https?:\/\/(www|store)\.epicgames\.com(\/.*?)?\/p(roduct)?\/([^?/]+)/i)?.[4]?.toLowerCase();
                if (epicGameName) {
                  if (ownedGames.find((game) => game.pageSlug.includes(epicGameName))) {
                    addClass(el, "epic-game-link-owned");
                  } else if (wishlistGames.find((game) => game.pageSlug.includes(epicGameName))) {
                    addClass(el, "epic-game-link-wishlist");
                  }
                  return;
                }
                const epicGameOfferId = href.match(/https?:\/\/(store|www)\.epicgames\.com\/purchase\?offers=([\w-]+)/i)?.[2]?.toLowerCase();
                if (epicGameOfferId) {
                  if (ownedGames.find((game) => epicGameOfferId.includes(game.offerId))) {
                    addClass(el, "epic-game-link-owned");
                  } else if (wishlistGames.find((game) => epicGameOfferId.includes(game.offerId))) {
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
            function getEpicCookies(name) {
              return new Promise((resolve, reject) => {
                GM_cookie.list({ url: "https://accounts.epicgames.com/", name }, (cookies, error) => {
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
                GM_cookie.list({ url: "https://accounts.epicgames.com/" }, (cookies, error) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve(cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";"));
                });
              });
            }
            function parseSetCookieHeader(cookieString, fallbackUrl) {
              const parts = cookieString.split(";").map((s) => s.trim());
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
              attrs.forEach((attr) => {
                const eqIdx2 = attr.indexOf("=");
                const key = eqIdx2 >= 0 ? attr.slice(0, eqIdx2).trim().toLowerCase() : attr.trim().toLowerCase();
                const val = eqIdx2 >= 0 ? attr.slice(eqIdx2 + 1).trim() : "";
                if (key === "domain") cookie.domain = val.startsWith(".") ? val : `.${val}`;
                else if (key === "path") cookie.path = val || "/";
                else if (key === "secure") cookie.secure = true;
                else if (key === "httponly") cookie.httpOnly = true;
                else if (key === "expires") {
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
              const setCookieLines = responseHeaders.split(/\r?\n/).filter((line) => /^set-cookie:\s*/i.test(line));
              if (!setCookieLines.length) return Promise.resolve();
              const cookiePromises = setCookieLines.map((line) => {
                const cookieStr = line.replace(/^set-cookie:\s*/i, "");
                const cookie = parseSetCookieHeader(cookieStr, url);
                return new Promise((resolve) => {
                  GM_cookie.set(cookie, (error) => {
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
                const { status } = response;
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
            async function updateEpicOwnedGames(loop = true, i = 0, games = GM_getValue("ownedGames") || [], nextPageToken = "") {
              console.log("[EGLC] updateEpicOwnedGames...");
              if (!loop && i !== 0) {
                GM_setValue("ownedGames", games);
                checkEpicGame(false);
                return;
              }
              const xsrfToken = await getEpicCookies("XSRF-AM-TOKEN");
              const allCookies = await getAllEpicCookies();
              if (loop) {
                showUpdateStep("epic", `第 ${i + 1} 页`);
              }
              return requestWithRedirect(
                `https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?count=10&sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ""}`,
                {
                  method: "GET",
                  timeout: 3e4,
                  nocache: true,
                  responseType: "json",
                  fetch: true,
                  headers: {
                    referer: "https://accounts.epicgames.com/",
                    dnt: 1,
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
                }
              ).then(async (response) => {
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
              if (first) {
                const autoUpdate = () => updateGogGameLibrary(false);
                let runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                }
                runner().then((result) => {
                  if (result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
                    showToast("GOG 登录状态已过期，请先登录", "error", { duration: 0, closable: true, link: { href: result.loginUrl, text: "去登录" } });
                  }
                });
              }
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
          // showLoginExpiredDialog,
          showToast,
          runAutoUpdateWithRateLimit,
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
              if (first) {
                const autoUpdate = () => updateItchGameLibrary(false);
                let runner = autoUpdate;
                if (typeof runAutoUpdateWithRateLimit === "function") {
                  runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
                }
                runner().then((result) => {
                  if (result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
                    showToast("itch.io 登录状态已过期，请先登录", "error", { duration: 0, closable: true, link: { href: result.loginUrl, text: "去登录" } });
                  }
                });
              }
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
          // showLoginExpiredDialog,
          showToast,
          runAutoUpdateWithRateLimit,
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
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              url: `https://www.indiegala.com/library/showcase/${page}`,
              method: "GET",
              timeout: 3e4,
              headers: { cookie: cookies },
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
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
            const lastPageHref = pageLinks.find((el) => el.querySelector(".fa-angle-double-right"))?.getAttribute("href") || "";
            const parsedPage = Number((lastPageHref.match(/\d+/) || [1])[0]);
            pages = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
          }
          const games = Array.from(doc.querySelectorAll("a.library-showcase-title")).map((el) => el.getAttribute("href")?.match(/https?:\/\/.*?\.indiegala\.com\/(.*)/)?.[1]?.toLowerCase()).filter(Boolean);
          return { pages, games };
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
              GM_setValue("IG-Owned", { time: Date.now(), games: allGames });
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
            GM_setValue("IG-Owned", { time: Date.now(), games: allGames });
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
            const autoUpdate = () => updateIgGameLibrary(false);
            let runner = autoUpdate;
            if (typeof runAutoUpdateWithRateLimit === "function") {
              runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
            }
            runner().then((result) => {
              if (result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
                showToast("IG 登录状态已过期，请先登录", "error", { duration: 0, closable: true, link: { href: result.loginUrl, text: "去登录" } });
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

  // src/runtime/bootstrap.js
  var require_bootstrap = __commonJS({
    "src/runtime/bootstrap.js"(exports, module) {
      var { createModalRoot, showDialog } = require_dialog();
      var { showToast } = require_toast();
      var { createProgressController } = require_progress();
      var { createSettingsController } = require_settings();
      var { createStartupFlow } = require_startup();
      var { createGistSyncController } = require_gist_sync();
      var { UPDATE_STATUS, BASE_STYLE } = require_constants();
      var { createEpicModule } = require_epic();
      var { createGogModule } = require_gog();
      var { createItchModule } = require_itch();
      var { createIgModule } = require_ig();
      function bootstrapMergedRuntime2() {
        const { showProgressPanel, clearProgressPanel } = createProgressController(createModalRoot);
        const {
          settings,
          setting,
          openPlatformSwitchDialog,
          isUrlEnabled
        } = createSettingsController({ showDialog });
        const { openGistSyncDialog } = createGistSyncController({
          showDialog,
          showToast
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
            onConfirm: () => GM_openInTab(loginUrl, { active: true, insert: true, setParent: true })
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
        GM_registerMenuCommand("数据同步设置", openGistSyncDialog);
        GM_addStyle(BASE_STYLE);
        if (!isUrlEnabled(window.location.href)) return;
        const modules = [
          createEpicModule(moduleContext),
          createGogModule(moduleContext),
          createItchModule(moduleContext),
          // createCubeModule(moduleContext),
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

