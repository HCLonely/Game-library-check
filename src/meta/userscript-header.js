module.exports = `// ==UserScript==
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
// @require        https://greasyfork.org/scripts/418102-tm-request/code/TM_request.js?version=902218
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
// ==/UserScript==`;
