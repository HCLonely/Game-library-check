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
  const SETTINGS_KEY = 'globalSettings';

  function getGlobalSettings() {
    const defaults = {
      whiteList: GM_getValue('whiteList') || [],
      blackList: GM_getValue('blackList') || [],
      platformEnabled: { epic: true, gog: true, itch: true, cube: true }
    };
    const saved = GM_getValue(SETTINGS_KEY) || {};
    return {
      whiteList: Array.isArray(saved.whiteList) ? saved.whiteList : defaults.whiteList,
      blackList: Array.isArray(saved.blackList) ? saved.blackList : defaults.blackList,
      platformEnabled: { ...defaults.platformEnabled, ...(saved.platformEnabled || {}) }
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

  function createModalRoot() {
    let root = document.getElementById('glc-modal-root');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'glc-modal-root';
    document.body.appendChild(root);
    return root;
  }

  function showDialog({ title, bodyHtml, trustedBodyHtml = false, bodyText = '', bodyNode, confirmText = '确定', cancelText = '取消', onConfirm, onCancel, denyText, onDeny, hideCancel = false }) {
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
    const titleEl = root.querySelector('.glc-dialog-title');
    const bodyEl = root.querySelector('.glc-dialog-body');
    const cancelBtn = root.querySelector('[data-glc-cancel]');
    const denyBtn = root.querySelector('[data-glc-deny]');
    const confirmBtn = root.querySelector('[data-glc-confirm]');
    if (titleEl) titleEl.textContent = title || '';
    if (bodyEl) {
      bodyEl.textContent = '';
      if (bodyNode instanceof Node) {
        bodyEl.replaceChildren(bodyNode);
      } else if (trustedBodyHtml && typeof bodyHtml === 'string') {
        bodyEl.innerHTML = bodyHtml;
      } else {
        bodyEl.textContent = bodyText || '';
      }
    }
    if (cancelBtn) {
      cancelBtn.textContent = cancelText;
      cancelBtn.style.display = hideCancel ? 'none' : '';
    }
    if (denyBtn) {
      denyBtn.textContent = denyText || '';
      denyBtn.style.display = denyText ? '' : 'none';
    }
    if (confirmBtn) confirmBtn.textContent = confirmText;
    const close = () => { root.innerHTML = ''; };
    cancelBtn?.addEventListener('click', () => {
      if (typeof onCancel === 'function') onCancel(root);
      close();
    });
    denyBtn?.addEventListener('click', () => {
      if (typeof onDeny === 'function') onDeny(root);
      close();
    });
    confirmBtn?.addEventListener('click', () => {
      if (typeof onConfirm === 'function') onConfirm(root);
      close();
    });
  }

  function showToast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `glc-toast glc-toast-${type}`;
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 4000);
  }

  function showProgressPanel(stateMap) {
    const root = createModalRoot();
    root.innerHTML = `
      <div class="glc-mask">
        <div class="glc-dialog glc-progress-dialog" role="dialog" aria-modal="true">
          <h3 class="glc-dialog-title"></h3>
          <ul class="glc-progress-list"></ul>
        </div>
      </div>`;
    const titleEl = root.querySelector('.glc-dialog-title');
    const listEl = root.querySelector('.glc-progress-list');
    if (titleEl) titleEl.textContent = '正在更新缓存';
    if (listEl) {
      Object.entries(stateMap || {}).forEach(([platform, state]) => {
        const li = document.createElement('li');
        const platformEl = document.createElement('span');
        platformEl.className = 'glc-progress-platform';
        platformEl.textContent = String(platform).toUpperCase();
        const stateEl = document.createElement('span');
        stateEl.className = 'glc-progress-state';
        stateEl.textContent = String(state);
        li.appendChild(platformEl);
        li.appendChild(stateEl);
        listEl.appendChild(li);
      });
    }
  }

  function queryLinks(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function addClass(el, className) {
    if (el && !el.classList.contains(className)) el.classList.add(className);
  }

  function getHref(el) {
    return (el && el.getAttribute('href')) || '';
  }

  function parseHtml(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function collectEmptyCaches(enabledModules) {
    return enabledModules.filter((module) => module.isCacheEmpty()).map((module) => module.key);
  }

  function showEmptyCacheAggregationDialog(emptyKeys, onConfirm, onCancel) {
    const bodyNode = document.createElement('div');
    emptyKeys.forEach((key, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.platform = key;
      input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${key.toUpperCase()}`));
      bodyNode.appendChild(label);
      if (index < emptyKeys.length - 1) bodyNode.appendChild(document.createElement('br'));
    });
    showDialog({
      title: '检测到缓存为空的平台',
      bodyNode,
      confirmText: '立即更新',
      cancelText: '稍后再说',
      onConfirm: (root) => {
        const selected = Array.from(root.querySelectorAll('input[data-platform]:checked'))
          .map((el) => el.getAttribute('data-platform'));
        onConfirm(selected);
      },
      onCancel: () => {
        if (typeof onCancel === 'function') onCancel();
      }
    });
  }

  async function batchUpdateSelectedModules(enabledModules, selectedKeys) {
    const state = Object.fromEntries(selectedKeys.map((key) => [key, 'waiting']));
    showProgressPanel(state);
    for (const key of selectedKeys) {
      const module = enabledModules.find((item) => item.key === key);
      if (!module) continue;
      state[key] = 'running';
      showProgressPanel(state);
      try {
        const updateResult = await module.updateLibrary();
        if (updateResult === true) {
          state[key] = 'success';
        } else {
          state[key] = 'error';
          showToast(`${key.toUpperCase()} 更新失败`, 'error');
        }
      } catch (error) {
        console.error(error);
        state[key] = 'error';
        showToast(`${key.toUpperCase()} 更新失败`, 'error');
      }
      showProgressPanel(state);
    }
  }

  async function runInitialFlow() {
    const enabledModules = modules.filter((module) => module.enabled());
    const emptyKeys = collectEmptyCaches(enabledModules);
    if (emptyKeys.length > 0) {
      showEmptyCacheAggregationDialog(
        emptyKeys,
        async (selectedKeys) => {
          if (selectedKeys.length > 0) await batchUpdateSelectedModules(enabledModules, selectedKeys);
          enabledModules.forEach((module) => module.start());
        },
        () => {
          enabledModules.forEach((module) => module.start());
        }
      );
      return;
    }
    enabledModules.forEach((module) => module.start());
  }

  function showNativeOverhang(options = {}) {
    const type = options.type === 'error' ? 'error' : 'info';
    if (options.html) {
      showDialog({
        title: type === 'error' ? '错误' : '提示',
        bodyHtml: options.message || '',
        trustedBodyHtml: true,
        confirmText: options.closeConfirm ? '关闭' : '确定',
        hideCancel: true
      });
      return;
    }
    showToast(options.message || '', type);
  }

  const swalCompatState = { config: null, panelMap: {} };

  const Swal = {
    fire(config = {}) {
      swalCompatState.config = { ...config };
      return new Promise((resolve) => {
        const settle = (result) => resolve({ value: undefined, isConfirmed: false, isDenied: false, ...result });
        if (config.input === 'textarea') {
          showDialog({
            title: config.title || '',
            bodyHtml: '<textarea id="glc-swal-input" class="glc-textarea"></textarea>',
            trustedBodyHtml: true,
            confirmText: config.confirmButtonText || '确定',
            cancelText: config.cancelButtonText || '取消',
            onConfirm: () => {
              const value = document.getElementById('glc-swal-input')?.value;
              settle({ value, isConfirmed: true });
            },
            onCancel: () => settle({ value: undefined })
          });
          const inputEl = document.getElementById('glc-swal-input');
          if (inputEl) inputEl.value = config.inputValue || '';
          return;
        }

        if (config.showCancelButton || config.showDenyButton || typeof config.preConfirm === 'function') {
          showDialog({
            title: config.title || '',
            bodyNode: config.bodyNode,
            bodyHtml: config.trustedHtml === true ? (config.html || '') : '',
            trustedBodyHtml: config.trustedHtml === true,
            bodyText: config.text || '',
            confirmText: config.confirmButtonText || '确定',
            cancelText: config.cancelButtonText || '取消',
            denyText: config.showDenyButton ? (config.denyButtonText || '拒绝') : '',
            hideCancel: !config.showCancelButton && !config.showDenyButton,
            onConfirm: () => {
              const value = typeof config.preConfirm === 'function' ? config.preConfirm() : true;
              settle({ value, isConfirmed: true });
            },
            onCancel: () => settle({ value: undefined }),
            onDeny: () => settle({ isDenied: true })
          });
          return;
        }

        if (config.title && config.text && /第\s*\d+\s*页/.test(config.text)) {
          swalCompatState.panelMap.default = config.text;
          showProgressPanel(swalCompatState.panelMap);
          settle({ value: true, isConfirmed: true });
          return;
        }

        showToast(config.title || config.text || '', config.icon || 'info');
        settle({ value: true, isConfirmed: true });
      });
    },
    update(config = {}) {
      swalCompatState.config = { ...(swalCompatState.config || {}), ...config };
      if (config.title && config.text && /第\s*\d+\s*页/.test(config.text)) {
        swalCompatState.panelMap.default = config.text;
        showProgressPanel(swalCompatState.panelMap);
      } else if (config.icon === 'success' || config.icon === 'error') {
        showToast(config.title || '', config.icon);
      }
      return Promise.resolve({ value: true, isConfirmed: true, isDenied: false });
    }
  };

  function openPlatformSwitchDialog() {
    const settings = getGlobalSettings();
    const current = settings.platformEnabled;
    const bodyNode = document.createElement('div');
    [
      ['glc-epic', 'Epic', current.epic],
      ['glc-gog', 'GOG', current.gog],
      ['glc-itch', 'Itch', current.itch],
      ['glc-cube', 'Cube', current.cube]
    ].forEach(([id, labelText, checked], index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.checked = Boolean(checked);
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${labelText}`));
      bodyNode.appendChild(label);
      if (index < 3) bodyNode.appendChild(document.createElement('br'));
    });
    Swal.fire({
      title: '平台开关',
      bodyNode,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      preConfirm: () => ({
        epic: document.getElementById('glc-epic').checked,
        gog: document.getElementById('glc-gog').checked,
        itch: document.getElementById('glc-itch').checked,
        cube: document.getElementById('glc-cube').checked
      })
    }).then(({ value }) => {
      if (!value) return;
      settings.platformEnabled = value;
      setGlobalSettings(settings);
    });
  }

  function createEpicModule() {
    let updateLibrary;
    let started = false;
    const moduleApi = {
      key: 'epic',
      enabled: () => settings.platformEnabled.epic,
      isCacheEmpty: () => (GM_getValue('ownedGames') || []).length === 0,
      updateLibrary: async () => {
        if (!updateLibrary) await moduleApi.start();
        return updateLibrary();
      },
      start: async () => {
        if (started) return;
        started = true;
        if (!GM_getValue('version')) {
          GM_deleteValue('epicGamesLibrary');
          GM_deleteValue('ownedGames');
          GM_deleteValue('wishlist');
          GM_setValue('version', '1.1');
        }
        let loadTimes = 0;
        let catalogOfferSha256Hash = false;
        // let wishlistSha256Hash = false;
        // let accountId = 0;
        let locale = 'en-US';

        await getSha256Hash();

        checkEpicGame();

        const observer = new MutationObserver(() => { checkEpicGame(false, true); });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });

        async function checkEpicGame(first = true, again = false) {
          // eslint-disable-next-line no-plusplus
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          const ownedGames = getEpicOwnedGames();
          const wishlistGames = GM_getValue('epicWishist') || [];
          const excludedClass = again ? 'epic-game-checked' : 'epic-game-link-owned';
          const epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]')
            .filter((el) => !el.classList.contains(excludedClass));
          if (epicLink.length === 0) return;
          if (first) updateEpicOwnedGames(false);
          epicLink.forEach((el) => {
            addClass(el, 'epic-game-checked');
            let href = getHref(el);
            if (!/\/$/.test(href)) href += '/';
            const epicGameName = href.match(/https?:\/\/www\.epicgames\.com\/store\/.*?\/p(roduct)?\/([^?/]+)/i)?.[2]?.toLowerCase() ||
              href.match(/https?:\/\/store\.epicgames\.com\/.*?\/p(roduct)?\/([^?/]+)/i)?.[2]?.toLowerCase();
            if (epicGameName) {
              if (ownedGames.find((game) => game.pageSlug.includes(epicGameName))) {
                addClass(el, 'epic-game-link-owned');
              } else if (wishlistGames.find((game) => game.pageSlug.includes(epicGameName))) {
                addClass(el, 'epic-game-link-wishlist');
              }
            }
          });
        }
        function getEpicOwnedGames() {
          return GM_getValue('ownedGames') || [];
        }
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
        async function getSha256Hash() {
          console.log('[EGLC] getSha256Hash...');
          return new Promise((resolve, reject) => {
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
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then((response) => {
            // [, accountId, wishlistSha256Hash] = response.responseText.match(/"queryKey":\["getWishlist",\["accountId","([\w\d]+?)"\],"([\w\d]+?)"\]/i) || [];
            [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
            [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ['en-US'];
            console.log('[EGLC] ', JSON.stringify({ /* accountId, wishlistSha256Hash, */ catalogOfferSha256Hash, locale }));
          })
            .catch((error) => {
              console.error(error);
            });
        }
        async function getPagePlug(namespace, offerId) {
          console.log('[EGLC] getPagePlug...');
          if (catalogOfferSha256Hash === false) {
            await getSha256Hash();
          }
          if (!catalogOfferSha256Hash) {
            console.log('[EGLC] No catalogOfferSha256Hash');
            return false;
          }
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              // eslint-disable-next-line max-len
              url: `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22${offerId}%22,%22sandboxId%22:%22${namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${catalogOfferSha256Hash}%22%7D%7D`,
              timeout: 30000,
              fetch: true,
              headers: {
                accept: 'application/json, text/plain, */*'
              },
              responseType: 'json',
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
                  offerMappings?.[0]?.pageSlug, urlSlug, customAttributes?.find((e) => e.key === 'com.epicgames.app.productSlug')?.value?.replace(/\/home$/, '')
                ].filter((e) => e))
              ];
            }
            return false;
          })
            .catch((error) => {
              console.error(error);
              return false;
            });
        }
        // eslint-disable-next-line no-unused-vars
        async function updateEpicAuth(loop) {
          console.log('[EGLC] updateEpicAuth...');
          if (loop) {
            Swal.fire({
              title: '正在更新Epic凭证...',
              icon: 'info'
            });
          }
          const reputationResult = await new Promise((resolve, reject) => {
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
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => response.status === 200)
            .catch((error) => {
              console.error(error);
              return false;
            });
          if (!reputationResult) {
            return false;
          }
          const authenticateResult = await new Promise((resolve, reject) => {
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
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => response.status === 200)
            .catch((error) => {
              console.error(error);
              return false;
            });
          if (!authenticateResult) {
            return false;
          }
          const refreshCsrfResult = await new Promise((resolve, reject) => {
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
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => response.response?.success === true)
            .catch((error) => {
              console.error(error);
              return false;
            });
          if (!refreshCsrfResult) {
            return false;
          }
          return true;
        }
        function updateEpicOwnedGames(loop = true, i = 0, games = GM_getValue('ownedGames') || [], nextPageToken = '') {
          console.log('[EGLC] updateEpicOwnedGames...');
          if (!loop && i !== 0) {
            GM_setValue('ownedGames', games);
            checkEpicGame(false);
            return;
          }
          return new Promise((resolve, reject) => {
            if (loop) {
              Swal[i === 0 ? 'fire' : 'update']({
                title: '正在更新Epic已拥有游戏数据...',
                text: `第 ${i + 1} 页`,
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ''}`,
              timeout: 30000,
              nocache: true,
              responseType: 'json',
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => {
            if (/login/i.test(response.finalUrl)) {
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
                }).then(({ value }) => {
                  if (value) GM_openInTab('https://www.epicgames.com/id/login', { active: true, insert: true, setParent: true });
                });
              } else {
                showNativeOverhang({
                  type: 'error',
                  message: 'Epic登录凭证已过期，请重新登录<a href="https://www.epicgames.com/id/login" target="_blank">https://www.epicgames.com/id/login</a>',
                  html: true,
                  closeConfirm: true
                });
              }
              return false;
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
                  GM_setValue('ownedGames', games);
                }
              }));
              // const lastCreatedAt = new Date(response.response.orders[ordersLength - 1]?.createdAtMillis || null).toISOString();
              const { nextPageToken } = response.response;

              if (nextPageToken) {
                /*
                if (response.response.total - games.length > 0 && !loop) {
                  return Swal.fire({
                    title: '游戏库检测脚本提醒',
                    icon: 'warning',
                    text: '检测到Epic已拥有游戏数据缺失，是否重新获取？',
                    showCancelButton: true,
                    confirmButtonText: '获取',
                    cancelButtonText: '取消'
                  }).then(({ value }) => {
                    if (value) updateEpicOwnedGames();
                  });
                }
                */
                if (loop) {
                  await new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(true);
                    }, 1000);
                  });
                }
                return await updateEpicOwnedGames(loop, ++i, games, nextPageToken); // eslint-disable-line
              } else if (loop) {
                GM_setValue('ownedGames', games);
                await Swal.update({
                  icon: 'success',
                  title: 'Epic已拥有游戏数据更新完成',
                  text: ''
                });
                return true;
              }
              GM_setValue('ownedGames', games);
              checkEpicGame(false);
              console.log('[EGLC] updateEpicOwnedGames: Finish!');
              return true;
            } else if (response.response?.products?.length !== 0) {
              console.error(response);
              await Swal.update({
                icon: 'error',
                title: 'Epic已拥有游戏数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            }
            return false;
          })
            .catch(async (error) => {
              console.error(error);
              await Swal.update({
                icon: 'error',
                title: 'Epic已拥有游戏数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            });
        }

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

        updateLibrary = updateEpicOwnedGames;
        GM_registerMenuCommand('更新Epic已拥有游戏数据', updateEpicOwnedGames);

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

  function createGogModule() {
    let updateLibrary;
    let started = false;
    const moduleApi = {
      key: 'gog',
      enabled: () => settings.platformEnabled.gog,
      isCacheEmpty: () => (GM_getValue('gogGames') || []).length === 0,
      updateLibrary: () => {
        if (!updateLibrary) moduleApi.start();
        return updateLibrary();
      },
      start: () => {
        if (started) return;
        started = true;
        let loadTimes = 0;

        checkGogGame();

        const observer = new MutationObserver(() => { checkGogGame(false, true); });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });

        function checkGogGame(first = true, again = false) {
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          const gogGames = getGogGameLibrary();
          const excludedClass = again ? 'gog-game-checked' : 'gog-game-link-owned';
          const gogLink = queryLinks('a[href*="www.gog.com/"]')
            .filter((el) => !el.classList.contains(excludedClass));
          if (gogLink.length === 0) return;
          if (first) updateGogGameLibrary(false);
          gogLink.forEach((el) => {
            addClass(el, 'gog-game-checked');
            let href = getHref(el);
            if (!/\/$/.test(href)) href += '/';
            const gogGameLink = href.match(/https?:\/\/www\.gog\.com\/(?:[\w-]+\/)?game\/([^/?#]+)/i)?.[1]?.toLowerCase();
            if (gogGameLink && gogGames.some((game) => game.toLowerCase() === gogGameLink)) {
              addClass(el, 'gog-game-link-owned');
            }
          });
        }
        function getGogGameLibrary() {
          return GM_getValue('gogGames') || [];
        }
        function updateGogGameLibrary(loop = true, i = 1, games = []) {
          if (!loop && i !== 1) {
            GM_setValue('gogGames', [...new Set([...getGogGameLibrary(), ...games])]);
            checkGogGame(false);
            return;
          }
          return new Promise((resolve, reject) => {
            if (loop) {
              Swal[i === 1 ? 'fire' : 'update']({
                title: '正在更新gog游戏库数据...',
                text: `第 ${i} 页`,
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=${i}&sortBy=date_purchased`,
              timeout: 15000,
              nocache: true,
              responseType: 'json',
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => {
            if (/openlogin/i.test(response.finalUrl)) {
              if (loop) {
                Swal.fire({
                  title: '获取gog游戏库数据失败！',
                  text: '请先登录',
                  icon: 'error',
                  showCancelButton: true,
                  confirmButtonText: '登录',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  if (value) GM_openInTab('https://www.gog.com/#openlogin', { active: true, insert: true, setParent: true });
                });
              } else {
                showNativeOverhang({
                  type: 'error',
                  message: 'GOG登录凭证已过期，请重新登录<a href="https://www.gog.com/#openlogin" target="_blank">https://www.gog.com/#openlogin</a>',
                  html: true,
                  closeConfirm: true
                });
              }
              return false;
            } else if (response.response?.products?.length) {
              games = [...games, ...response.response.products.map((e) => (e?.slug || e?.url?.split('/')?.[e?.url?.split('/').length - 1]))]; // eslint-disable-line

              if (response.response?.totalPages > i) {
                return await updateGogGameLibrary(loop, ++i, games); // eslint-disable-line
              } else if (loop) {
                GM_setValue('gogGames', [...new Set(games)].filter((e) => e));
                await Swal.update({
                  icon: 'success',
                  title: 'gog游戏库数据更新完成',
                  text: ''
                });
                return true;
              }
              GM_setValue('gogGames', [...new Set([...getGogGameLibrary(), ...games])].filter((e) => e));
              checkGogGame(false);
              return true;
            } else if (response.response?.products?.length !== 0) {
              console.error(response);
              await Swal.update({
                icon: 'error',
                title: 'gog游戏库数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            }
            return false;
          })
            .catch(async (error) => {
              console.error(error);
              await Swal.update({
                icon: 'error',
                title: 'gog游戏库数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            });
        }

        updateLibrary = updateGogGameLibrary;
        GM_registerMenuCommand('更新gog游戏库', updateGogGameLibrary);

        GM_addStyle('.gog-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
      }
    };
    return moduleApi;
  }

  function createItchModule() {
    let updateLibrary;
    let started = false;
    const moduleApi = {
      key: 'itch',
      enabled: () => settings.platformEnabled.itch,
      isCacheEmpty: () => (GM_getValue('itchGames') || []).length === 0,
      updateLibrary: () => {
        if (!updateLibrary) moduleApi.start();
        return updateLibrary();
      },
      start: () => {
        if (started) return;
        started = true;
        let loadTimes = 0;

        checkItchGame();

        const observer = new MutationObserver(() => { checkItchGame(false, true); });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });

        function checkItchGame(first = true, again = false) {
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          const itchGames = getItchGameLibrary();
          const excludedClass = again ? 'itch-io-game-checked' : 'itch-io-game-link-owned';
          const itchLink = queryLinks('a[href*=".itch.io/"]')
            .filter((el) => !el.classList.contains(excludedClass));
          if (itchLink.length === 0) return;
          if (first) updateItchGameLibrary(false);
          itchLink.forEach((el) => {
            addClass(el, 'itch-io-game-checked');
            let href = getHref(el);
            if (!/\/$/.test(href)) href += '/';
            const itchGameLink = href.match(/https?:\/\/(.*?\/.*?)\//i)?.[1];
            if (itchGameLink && itchGames.includes(itchGameLink)) {
              addClass(el, 'itch-io-game-link-owned');
            }
          });
        }
        function getItchGameLibrary() {
          return GM_getValue('itchGames') || [];
        }
        function updateItchGameLibrary(loop = true, i = 1, games = []) {
          if (!loop && i !== 1) {
            GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])]);
            checkItchGame(false);
            return;
          }
          return new Promise((resolve, reject) => {
            if (loop) {
              Swal[i === 1 ? 'fire' : 'update']({
                title: '正在更新itch游戏库数据...',
                text: `第 ${i} 页`,
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://itch.io/my-purchases?page=${i}&format=json`,
              timeout: 15000,
              nocache: true,
              responseType: 'json',
              onerror: reject,
              ontimeout: reject,
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => {
            if (/https?:\/\/itch.io\/login/i.test(response.finalUrl)) {
              if (loop) {
                Swal.fire({
                  title: '获取itch游戏库数据失败！',
                  text: '请先登录',
                  icon: 'error',
                  showCancelButton: true,
                  confirmButtonText: '登录',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  if (value) GM_openInTab('https://itch.io/login', { active: true, insert: true, setParent: true });
                });
              } else {
                showNativeOverhang({
                  type: 'error',
                  message: 'itch.io登录凭证已过期，请重新登录<a href="https://itch.io/login" target="_blank">https://itch.io/login</a>',
                  html: true,
                  closeConfirm: true
                });
              }
              return false;
            } else if (response.response?.num_items) { // eslint-disable-line camelcase
              const itchDoc = parseHtml(`<div>${response.response.content}</div>`);
              const purchaseLinks = Array.from(itchDoc.querySelectorAll('a.thumb_link.game_link'));
              games = [...games, ...purchaseLinks.map((el) => getHref(el)
                .match(/https?:\/\/(.*?\/.*?)\//i)?.[1])];

              if (response.response.num_items === 50) {
                return await updateItchGameLibrary(loop, ++i, games); // eslint-disable-line
              } else if (loop) {
                GM_setValue('itchGames', [...new Set(games)]);
                await Swal.update({
                  icon: 'success',
                  title: 'itch游戏库数据更新完成',
                  text: ''
                });
                return true;
              }
              GM_setValue('itchGames', [...new Set([...getItchGameLibrary(), ...games])]);
              checkItchGame(false);
              return true;
            } else if (response.response?.num_items === 0) { // eslint-disable-line camelcase
              GM_setValue('itchGames', [...new Set(games)]);
              await Swal.update({
                icon: 'success',
                title: 'itch游戏库数据更新完成',
                text: ''
              });
              return true;
            }
            console.error(response);
            await Swal.update({
              icon: 'error',
              title: 'itch游戏库数据更新失败',
              text: '详情请查看控制台'
            });
            return false;
          })
            .catch(async (error) => {
              console.error(error);
              await Swal.update({
                icon: 'error',
                title: 'itch游戏库数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            });
        }

        updateLibrary = updateItchGameLibrary;
        GM_registerMenuCommand('更新itch游戏库', updateItchGameLibrary);

        GM_addStyle('.itch-io-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
        unsafeWindow.checkItchGame = checkItchGame;
      }
    };
    return moduleApi;
  }

  function createCubeModule() {
    let updateLibrary;
    let started = false;
    const moduleApi = {
      key: 'cube',
      enabled: () => settings.platformEnabled.cube,
      isCacheEmpty: () => (GM_getValue('cubeGames') || []).length === 0,
      updateLibrary: () => {
        if (!updateLibrary) moduleApi.start();
        return updateLibrary();
      },
      start: () => {
        if (started) return;
        started = true;
        let loadTimes = 0;

        checkCubeGame();

        const observer = new MutationObserver(() => { checkCubeGame(false, true); });
        observer.observe(document.documentElement, {
          attributes: false,
          characterData: false,
          childList: true,
          subtree: true
        });

        function checkCubeGame(first = true, again = false) {
          loadTimes++;
          if (loadTimes > 1000) {
            observer.disconnect();
            return;
          }
          const cubeGames = getCubeGameLibrary();
          const excludedClass = again ? 'cube-game-checked' : 'cube-game-link-owned';
          const cubeLink = queryLinks('a[href*="store.cubejoy.com/html/en/store/goodsdetail/detail"]')
            .filter((el) => !el.classList.contains(excludedClass));
          if (cubeLink.length === 0) return;
          if (first) updateCubeGameLibrary(false);
          cubeLink.forEach((el) => {
            addClass(el, 'cube-game-checked');
            let href = getHref(el);
            if (!/\/$/.test(href)) href += '/';
            const cubeGameId = href.match(/https?:\/\/store\.cubejoy\.com\/html\/en\/store\/goodsdetail\/detail([\d]+).html/i)?.[1];
            if (cubeGameId && cubeGames.includes(parseInt(cubeGameId, 10))) {
              addClass(el, 'cube-game-link-owned');
            }
          });
        }
        function getCubeGameLibrary() {
          return GM_getValue('cubeGames') || [];
        }
        function updateCubeGameLibrary(loop = true, i = 1, games = []) {
          if (!loop && i !== 1) {
            GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])]);
            checkCubeGame(false);
            return;
          }
          return new Promise((resolve, reject) => {
            if (loop) {
              Swal[i === 1 ? 'fire' : 'update']({
                title: '正在更新方块游戏库数据...',
                text: `第 ${i} 页`,
                icon: 'info'
              });
            }
            GM_xmlhttpRequest({
              method: 'POST',
              url: `https://account.cubejoy.com/Comment/MyGameReq?pageIndex=${i}&pageSize=24`,
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
              onload: (response) => {
                response.status === 200 ? resolve(response) : reject(response);
              }
            });
          }).then(async (response) => {
            if (response.response?.resultCode === 0) {
              if (loop) {
                Swal.fire({
                  title: '获取方块游戏库数据失败！',
                  text: '请先登录',
                  icon: 'error',
                  showCancelButton: true,
                  confirmButtonText: '登录',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  if (value) GM_openInTab('https://account.cubejoy.com/html/login.html', { active: true, insert: true, setParent: true });
                });
              } else {
                showNativeOverhang({
                  type: 'error',
                  message: '方块登录凭证已过期，请重新登录<a href="https://account.cubejoy.com/html/login.html" target="_blank">https://account.cubejoy.com/html/login.html</a>',
                  html: true,
                  closeConfirm: true
                });
              }
              return false;
            } else if (response.response?.result?.list?.length) {
              games = [...games, ...response.response.result.list.map((e) => e.S_Id)]; // eslint-disable-line

              if (response.response?.result.total > i * 24) {
                return await updateCubeGameLibrary(loop, ++i, games); // eslint-disable-line
              } else if (loop) {
                GM_setValue('cubeGames', [...new Set(games)].filter((e) => e));
                await Swal.update({
                  icon: 'success',
                  title: 'cube游戏库数据更新完成',
                  text: ''
                });
                return true;
              }
              GM_setValue('cubeGames', [...new Set([...getCubeGameLibrary(), ...games])].filter((e) => e));
              checkCubeGame(false);
              return true;
            } else if (response.response?.result?.list?.length !== 0) {
              console.error(response);
              await Swal.update({
                icon: 'error',
                title: '方块游戏库数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            }
            return false;
          })
            .catch(async (error) => {
              console.error(error);
              await Swal.update({
                icon: 'error',
                title: '方块游戏库数据更新失败',
                text: '详情请查看控制台'
              });
              return false;
            });
        }

        updateLibrary = updateCubeGameLibrary;
        GM_registerMenuCommand('更新cube游戏库', updateCubeGameLibrary);

        GM_addStyle('.cube-game-link-owned{color:#ffffff !important;background:#5c8a00 !important}');
      }
    };
    return moduleApi;
  }

  function addWhiteList() {
    const whiteList = settings.whiteList || [];
    Swal.fire({
      title: '添加白名单网站',
      input: 'textarea',
      inputValue: whiteList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value !== undefined) {
        settings.whiteList = value ? value.split('\n') : [];
        settings.blackList = settings.blackList || [];
        setGlobalSettings(settings);
      }
    });
  }

  function addBlackList() {
    const blackList = settings.blackList || [];
    Swal.fire({
      title: '添加黑名单网站',
      input: 'textarea',
      inputValue: blackList.join('\n'),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
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
    }).then(({ isConfirmed, isDenied }) => {
      if (isConfirmed) {
        addWhiteList();
      } else if (isDenied) {
        addBlackList();
      }
    });
  }

  const settings = getGlobalSettings();

  GM_registerMenuCommand('设置', setting);
  GM_registerMenuCommand('平台开关', openPlatformSwitchDialog);
  GM_addStyle(`
.glc-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center}
.glc-dialog{background:#fff;color:#111;padding:16px;border-radius:10px;min-width:340px;max-width:560px;font-size:14px;box-shadow:0 20px 45px rgba(0,0,0,.24)}
.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.4}
.glc-dialog-body{line-height:1.6}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
.glc-dialog-actions button{border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#111;padding:6px 12px;cursor:pointer}
.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box}
.glc-toast{position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#1f2937;color:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,.2)}
.glc-toast-error{background:#b91c1c}
.glc-toast-success{background:#15803d}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px}
.glc-progress-platform{font-weight:700}
  `);

  if (!isUrlEnabledByList(window.location.href, settings)) return;

  const modules = [
    createEpicModule(),
    createGogModule(),
    createItchModule(),
    createCubeModule()
  ];
  runInitialFlow();
}());
