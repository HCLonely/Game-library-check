import type {
  GlobalSettings,
  LibraryModule,
  ModuleContext,
  ProgressPanelOptions,
  ProgressStateMap,
  ShowDialog,
  ShowToast,
  ToastType,
  UpdateStatusConstants
} from '../shared/types';

interface ProgressController {
  showProgressPanel: (stateMap: ProgressStateMap, options?: ProgressPanelOptions) => void;
  clearProgressPanel: () => void;
}

interface SettingsController {
  settings: GlobalSettings;
  setting: () => void;
  openPlatformSwitchDialog: () => void;
  isUrlEnabled: (url: string) => boolean;
}

interface StartupFlowController {
  runInitialFlow: (modules: LibraryModule[]) => Promise<void>;
  showUpdateStep: (platform: string, text: string) => void;
  showUpdateResult: (title: string, type: ToastType) => Promise<boolean>;
  openManualUpdateDialogAndRun: (modules: LibraryModule[]) => void;
  runAutoUpdateWithRateLimit: ModuleContext['runAutoUpdateWithRateLimit'];
}

interface ItchModule extends LibraryModule {
  generateLinkageCode: () => Promise<string>;
}

type PlatformModuleFactory = (context: ModuleContext) => LibraryModule;

const { createModalRoot, showDialog } = require('../ui/dialog') as {
  createModalRoot: () => HTMLElement;
  showDialog: ShowDialog;
};
const { showToast } = require('../ui/toast') as { showToast: ShowToast };
const { createProgressController } = require('../ui/progress') as {
  createProgressController: (createRoot: () => HTMLElement) => ProgressController;
};
const { createSettingsController } = require('../core/settings') as {
  createSettingsController: (options: { showDialog: ShowDialog }) => SettingsController;
};
const { createStartupFlow } = require('../core/startup') as {
  createStartupFlow: (options: {
    showDialog: ShowDialog;
    showProgressPanel: ProgressController['showProgressPanel'];
    clearProgressPanel: ProgressController['clearProgressPanel'];
    showToast: ShowToast;
    showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
    updateStatus: UpdateStatusConstants;
  }) => StartupFlowController;
};
const { createGistSyncController } = require('../core/gist-sync') as {
  createGistSyncController: (options: {
    showDialog: ShowDialog;
    showToast: ShowToast;
  }) => { openGistSyncDialog: () => void };
};
const { UPDATE_STATUS, BASE_STYLE } = require('../shared/constants') as {
  UPDATE_STATUS: UpdateStatusConstants;
  BASE_STYLE: string;
};
const { createEpicModule } = require('../platforms/epic') as {
  createEpicModule: PlatformModuleFactory;
};
const { createGogModule } = require('../platforms/gog') as {
  createGogModule: PlatformModuleFactory;
};
const { createItchModule } = require('../platforms/itch') as {
  createItchModule: (context: ModuleContext) => ItchModule;
};
// const { createCubeModule } = require('../platforms/cube') as {
//   createCubeModule: PlatformModuleFactory;
// };
const { createIgModule } = require('../platforms/ig') as {
  createIgModule: PlatformModuleFactory;
};

function bootstrapMergedRuntime(): void {
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

  function queryLinks(selector: string): Element[] {
    return Array.from(document.querySelectorAll(selector));
  }

  function addClass(el: Element | null | undefined, className: string): void {
    if (el && !el.classList.contains(className)) el.classList.add(className);
  }

  function getHref(el: Element | null | undefined): string {
    return (el && el.getAttribute('href')) || '';
  }

  function parseHtml(html: string): Document {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function showLoginExpiredDialog(platformName: string, loginUrl: string): void {
    showDialog({
      title: '登录状态已失效',
      bodyText: `${platformName} 登录凭证已过期，需要重新登录。`,
      confirmText: '去登录',
      cancelText: '稍后',
      onConfirm: () => {
        GM_openInTab(loginUrl, { active: true, insert: true, setParent: true });
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

  const moduleContext: ModuleContext = {
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

  GM_registerMenuCommand('设置', setting);
  GM_registerMenuCommand('平台开关', openPlatformSwitchDialog);
  GM_registerMenuCommand('数据同步设置', openGistSyncDialog);
  GM_addStyle(BASE_STYLE);

  const itchModule = createItchModule(moduleContext);
  GM_registerMenuCommand('生成Itch联动码', () => itchModule.generateLinkageCode());

  if (!isUrlEnabled(window.location.href)) return;

  const modules: LibraryModule[] = [
    createEpicModule(moduleContext),
    createGogModule(moduleContext),
    itchModule,
    // createCubeModule(moduleContext),
    createIgModule(moduleContext)
  ];

  GM_registerMenuCommand('更新游戏库', () => {
    openManualUpdateDialogAndRun(modules);
  });

  runInitialFlow(modules);
}

module.exports = { bootstrapMergedRuntime };
