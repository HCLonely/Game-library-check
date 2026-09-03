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
  /** Shows the current per-platform update progress. */
  showProgressPanel: (stateMap: ProgressStateMap, options?: ProgressPanelOptions) => void;
  /** Removes the active update progress display. */
  clearProgressPanel: () => void;
}

interface SettingsController {
  settings: GlobalSettings;
  /** Opens the global settings dialog. */
  setting: () => void;
  /** Opens the platform enablement dialog. */
  openPlatformSwitchDialog: () => void;
  /** Determines whether a URL is enabled by the saved allow/block lists. */
  isUrlEnabled: (url: string) => boolean;
}

interface StartupFlowController {
  /** Runs the initial update workflow for active modules. */
  runInitialFlow: (modules: LibraryModule[]) => Promise<void>;
  /** Updates the visible status for one platform. */
  showUpdateStep: (platform: string, text: string) => void;
  /** Shows the final status for one platform update. */
  showUpdateResult: (title: string, type: ToastType) => Promise<boolean>;
  /** Opens the manual update selector and runs the chosen modules. */
  openManualUpdateDialogAndRun: (modules: LibraryModule[]) => void;
  /** Runs a module update subject to platform rate limiting. */
  runAutoUpdateWithRateLimit: ModuleContext['runAutoUpdateWithRateLimit'];
}

interface ItchModule extends LibraryModule {
  /** Generates an itch.io linkage code. */
  generateLinkageCode: () => Promise<string>;
}

/** Creates one platform module from the common runtime context. */
type PlatformModuleFactory = (context: ModuleContext) => LibraryModule;

const { createModalRoot, showDialog } = require('../ui/dialog.ts') as {
  /** Creates the modal container used by shared UI. */
  createModalRoot: () => HTMLElement;
  /** Opens a shared modal dialog. */
  showDialog: ShowDialog;
};
const { showToast } = require('../ui/toast.ts') as {
  /** Displays a shared toast notification. */
  showToast: ShowToast;
};
const { createProgressController } = require('../ui/progress.ts') as {
  /** Creates the shared progress panel controller. */
  createProgressController: (createRoot: () => HTMLElement) => ProgressController;
};
const { createSettingsController } = require('../core/settings.ts') as {
  /** Creates the global settings controller. */
  createSettingsController: (options: {
    /** Opens settings dialogs. */
    showDialog: ShowDialog;
  }) => SettingsController;
};
const { createStartupFlow } = require('../core/startup.ts') as {
  /** Creates the initial and manual library update controller. */
  createStartupFlow: (options: {
    /** Opens dialogs needed by update flows. */
    showDialog: ShowDialog;
    /** Shows per-platform update progress. */
    showProgressPanel: ProgressController['showProgressPanel'];
    /** Removes the update progress display. */
    clearProgressPanel: ProgressController['clearProgressPanel'];
    /** Displays update feedback. */
    showToast: ShowToast;
    /** Prompts the user to reauthenticate after session expiration. */
    showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
    updateStatus: UpdateStatusConstants;
  }) => StartupFlowController;
};
const { createGistSyncController } = require('../core/gist-sync.ts') as {
  /** Creates the Gist synchronization dialog controller. */
  createGistSyncController: (options: {
    /** Opens Gist synchronization dialogs. */
    showDialog: ShowDialog;
    /** Displays Gist synchronization feedback. */
    showToast: ShowToast;
  }) => {
    /** Opens the Gist synchronization dialog. */
    openGistSyncDialog: () => void;
  };
};
const { UPDATE_STATUS, BASE_STYLE } = require('../shared/constants.ts') as {
  UPDATE_STATUS: UpdateStatusConstants;
  BASE_STYLE: string;
};
const { createEpicModule } = require('../platforms/epic.ts') as {
  /** Creates the Epic Games Store platform module. */
  createEpicModule: PlatformModuleFactory;
};
const { createGogModule } = require('../platforms/gog.ts') as {
  /** Creates the GOG platform module. */
  createGogModule: PlatformModuleFactory;
};
const { createItchModule } = require('../platforms/itch.ts') as {
  /** Creates the itch.io platform module. */
  createItchModule: (context: ModuleContext) => ItchModule;
};
// const { createCubeModule } = require('../platforms/cube.ts') as {
//   createCubeModule: PlatformModuleFactory;
// };
const { createIgModule } = require('../platforms/ig.ts') as {
  /** Creates the IndieGala platform module. */
  createIgModule: PlatformModuleFactory;
};

/**
 * Initializes the merged userscript runtime, shared UI services, platform modules, styles, and menu actions.
 *
 * Startup exits before platform initialization when the current URL is disabled by user settings.
 */
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

  /**
   * Finds elements matching a selector for platform link scanners.
   *
   * @param selector - CSS selector to query from the document.
   * @returns Matching elements as an array.
   */
  function queryLinks(selector: string): Element[] {
    return Array.from(document.querySelectorAll(selector));
  }

  /**
   * Adds a CSS class to an element when it is present and not already marked.
   *
   * @param el - Optional target element.
   * @param className - Class to apply.
   */
  function addClass(el: Element | null | undefined, className: string): void {
    if (el && !el.classList.contains(className)) el.classList.add(className);
  }

  /**
   * Reads an element's href attribute without requiring it to be an anchor.
   *
   * @param el - Optional element whose href should be read.
   * @returns The href attribute, or an empty string when unavailable.
   */
  function getHref(el: Element | null | undefined): string {
    return (el && el.getAttribute('href')) || '';
  }

  /**
   * Parses remote HTML into an inert document for platform-specific scraping.
   *
   * @param html - HTML source to parse.
   * @returns A document created with the HTML parser.
   */
  function parseHtml(html: string): Document {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  /**
   * Opens a login-expired dialog that can launch the affected platform's login page in a new tab.
   *
   * @param platformName - Display name of the expired platform session.
   * @param loginUrl - Login page to open after confirmation.
   */
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
