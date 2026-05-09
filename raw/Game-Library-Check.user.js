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

  function openPlatformSwitchDialog() {
    const settings = getGlobalSettings();
    const current = settings.platformEnabled;
    Swal.fire({
      title: '平台开关',
      html: `
        <label><input type="checkbox" id="glc-epic" ${current.epic ? 'checked' : ''}/> Epic</label><br/>
        <label><input type="checkbox" id="glc-gog" ${current.gog ? 'checked' : ''}/> GOG</label><br/>
        <label><input type="checkbox" id="glc-itch" ${current.itch ? 'checked' : ''}/> Itch</label><br/>
        <label><input type="checkbox" id="glc-cube" ${current.cube ? 'checked' : ''}/> Cube</label>
      `,
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

  GM_registerMenuCommand('平台开关', openPlatformSwitchDialog);
  GM_addStyle(GM_getResourceText('overhang'));

  const settings = getGlobalSettings();
  if (!isUrlEnabledByList(window.location.href, settings)) return;

  const modules = [];
  modules.forEach((module) => module.start());
}());
