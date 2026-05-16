const { createModalRoot, showDialog } = require('../ui/dialog');
const { showToast } = require('../ui/toast');
const { createProgressController } = require('../ui/progress');
const { createSettingsController } = require('../core/settings');
const { createStartupFlow } = require('../core/startup');
const { createGistSyncController } = require('../core/gist-sync');
const { UPDATE_STATUS, BASE_STYLE } = require('../shared/constants');
const { createEpicModule } = require('../platforms/epic');
const { createGogModule } = require('../platforms/gog');
const { createItchModule } = require('../platforms/itch');
// const { createCubeModule } = require('../platforms/cube');
const { createIgModule } = require('../platforms/ig');

function bootstrapMergedRuntime() {
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
    return (el && el.getAttribute('href')) || '';
  }

  function parseHtml(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function showLoginExpiredDialog(platformName, loginUrl) {
    showDialog({
      title: '登录状态已失效',
      bodyText: `${platformName} 登录凭证已过期，需要重新登录。`,
      confirmText: '去登录',
      cancelText: '稍后',
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

  GM_registerMenuCommand('设置', setting);
  GM_registerMenuCommand('平台开关', openPlatformSwitchDialog);
  GM_registerMenuCommand('数据同步设置', openGistSyncDialog);
  GM_addStyle(BASE_STYLE);

  if (!isUrlEnabled(window.location.href)) return;

  const modules = [
    createEpicModule(moduleContext),
    createGogModule(moduleContext),
    createItchModule(moduleContext),
    // createCubeModule(moduleContext),
    createIgModule(moduleContext)
  ];

  GM_registerMenuCommand('更新游戏库', () => {
    openManualUpdateDialogAndRun(modules);
  });

  runInitialFlow(modules);
}

module.exports = { bootstrapMergedRuntime };
