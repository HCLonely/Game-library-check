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
  /** 显示当前各平台的更新进度。 */
  showProgressPanel: (stateMap: ProgressStateMap, options?: ProgressPanelOptions) => void;
  /** 移除当前的更新进度显示。 */
  clearProgressPanel: () => void;
}

interface SettingsController {
  settings: GlobalSettings;
  /** 打开全局设置对话框。 */
  setting: () => void;
  /** 打开平台启用设置对话框。 */
  openPlatformSwitchDialog: () => void;
  /** 判断 URL 是否由保存的允许/阻止列表启用。 */
  isUrlEnabled: (url: string) => boolean;
}

interface StartupFlowController {
  /** 为活动模块运行初始更新流程。 */
  runInitialFlow: (modules: LibraryModule[]) => Promise<void>;
  /** 更新一个平台的可见状态。 */
  showUpdateStep: (platform: string, text: string) => void;
  /** 显示一个平台更新的最终状态。 */
  showUpdateResult: (title: string, type: ToastType) => Promise<boolean>;
  /** 打开手动更新选择器并运行选定模块。 */
  openManualUpdateDialogAndRun: (modules: LibraryModule[]) => void;
  /** 在平台速率限制条件下运行模块更新。 */
  runAutoUpdateWithRateLimit: ModuleContext['runAutoUpdateWithRateLimit'];
}

interface ItchModule extends LibraryModule {
  /** 生成 itch.io 关联代码。 */
  generateLinkageCode: () => Promise<string>;
}

/** 根据通用运行时上下文创建一个平台模块。 */
type PlatformModuleFactory = (context: ModuleContext) => LibraryModule;

const { createModalRoot, showDialog } = require('../ui/dialog.ts') as {
  /** 创建供共享 UI 使用的模态容器。 */
  createModalRoot: () => HTMLElement;
  /** 打开共享模态对话框。 */
  showDialog: ShowDialog;
};
const { showToast } = require('../ui/toast.ts') as {
  /** 显示共享提示通知。 */
  showToast: ShowToast;
};
const { createProgressController } = require('../ui/progress.ts') as {
  /** 创建共享进度面板控制器。 */
  createProgressController: (createRoot: () => HTMLElement) => ProgressController;
};
const { createSettingsController } = require('../core/settings.ts') as {
  /** 创建全局设置控制器。 */
  createSettingsController: (options: {
    /** 打开设置对话框。 */
    showDialog: ShowDialog;
  }) => SettingsController;
};
const { createStartupFlow } = require('../core/startup.ts') as {
  /** 创建初始和手动游戏库更新控制器。 */
  createStartupFlow: (options: {
    /** 打开更新流程所需的对话框。 */
    showDialog: ShowDialog;
    /** 显示各平台更新进度。 */
    showProgressPanel: ProgressController['showProgressPanel'];
    /** 移除更新进度显示。 */
    clearProgressPanel: ProgressController['clearProgressPanel'];
    /** 显示更新反馈。 */
    showToast: ShowToast;
    /** 在会话过期后提示用户重新认证。 */
    showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
    updateStatus: UpdateStatusConstants;
  }) => StartupFlowController;
};
const { createGistSyncController } = require('../core/gist-sync.ts') as {
  /** 创建 Gist 同步对话框控制器。 */
  createGistSyncController: (options: {
    /** 打开 Gist 同步对话框。 */
    showDialog: ShowDialog;
    /** 显示 Gist 同步反馈。 */
    showToast: ShowToast;
  }) => {
    /** 打开 Gist 同步对话框。 */
    openGistSyncDialog: () => void;
  };
};
const { UPDATE_STATUS, BASE_STYLE } = require('../shared/constants.ts') as {
  UPDATE_STATUS: UpdateStatusConstants;
  BASE_STYLE: string;
};
const { createEpicModule } = require('../platforms/epic.ts') as {
  /** 创建 Epic Games Store 平台模块。 */
  createEpicModule: PlatformModuleFactory;
};
const { createGogModule } = require('../platforms/gog.ts') as {
  /** 创建 GOG 平台模块。 */
  createGogModule: PlatformModuleFactory;
};
const { createItchModule } = require('../platforms/itch.ts') as {
  /** 创建 itch.io 平台模块。 */
  createItchModule: (context: ModuleContext) => ItchModule;
};
// const { createCubeModule } = require('../platforms/cube.ts') as {
//   createCubeModule: PlatformModuleFactory;
// };
const { createIgModule } = require('../platforms/ig.ts') as {
  /** 创建 IndieGala 平台模块。 */
  createIgModule: PlatformModuleFactory;
};

/**
 * 初始化合并后的用户脚本运行时、共享 UI 服务、平台模块、样式和菜单操作。
 *
 * 当前 URL 被用户设置禁用时，启动会在初始化平台前退出。
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
   * 查找与选择器匹配的元素，供平台链接扫描器使用。
   *
   * @param selector - 要从文档查询的 CSS 选择器。
   * @returns 匹配元素组成的数组。
   */
  function queryLinks(selector: string): Element[] {
    return Array.from(document.querySelectorAll(selector));
  }

  /**
   * 当元素存在且尚未标记时，为其添加 CSS 类。
   *
   * @param el - 可选的目标元素。
   * @param className - 要应用的类。
   */
  function addClass(el: Element | null | undefined, className: string): void {
    if (el && !el.classList.contains(className)) el.classList.add(className);
  }

  /**
   * 无需元素为锚点即可读取其 href 属性。
   *
   * @param el - 要读取 href 的可选元素。
   * @returns href 属性；不可用时返回空字符串。
   */
  function getHref(el: Element | null | undefined): string {
    return (el && el.getAttribute('href')) || '';
  }

  /**
   * 将远程 HTML 解析为惰性文档，供平台特定的抓取操作使用。
   *
   * @param html - 要解析的 HTML 源码。
   * @returns 使用 HTML 解析器创建的文档。
   */
  function parseHtml(html: string): Document {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  /**
   * 打开登录过期对话框，可在新标签页中启动受影响平台的登录页。
   *
   * @param platformName - 会话过期平台的显示名称。
   * @param loginUrl - 确认后要打开的登录页。
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
