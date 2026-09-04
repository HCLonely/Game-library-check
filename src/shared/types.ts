export type Awaitable<T> = T | Promise<T>;

export interface ToastOptions {
  duration?: number;
  closable?: boolean;
  link?: {
    href: string;
    text?: string;
  };
}

export type ToastType = 'info' | 'success' | 'error' | 'warning';

/** 显示短暂的用户提示消息。 */
export type ShowToast = (
  message: string,
  type?: ToastType,
  options?: ToastOptions
) => void;

export interface DialogOptions {
  title?: string;
  bodyHtml?: string;
  trustedBodyHtml?: boolean;
  bodyText?: string;
  bodyNode?: Node;
  confirmText?: string;
  cancelText?: string;
  /** 选择对话框的确认操作后执行。 */
  onConfirm?: (root: HTMLElement) => void | Promise<void>;
  /** 选择对话框的取消操作后执行。 */
  onCancel?: (root: HTMLElement) => void | Promise<void>;
  denyText?: string;
  /** 选择对话框的拒绝操作后执行。 */
  onDeny?: (root: HTMLElement) => void | Promise<void>;
  hideCancel?: boolean;
}

/** 打开可配置的模态对话框。 */
export type ShowDialog = (options: DialogOptions) => void;

export interface PlatformEnabledSettings {
  epic: boolean;
  gog: boolean;
  itch: boolean;
  cube: boolean;
  ig: boolean;
}

export interface GlobalSettings {
  whiteList: string[];
  blackList: string[];
  platformEnabled: PlatformEnabledSettings;
}

export interface UpdateStatusConstants {
  readonly SUCCESS: 'success';
  readonly ERROR: 'error';
  readonly AUTH_EXPIRED: 'auth_expired';
}

export interface AuthExpiredUpdateResult {
  status: 'auth_expired';
  platformName: string;
  loginUrl: string;
}

export type UpdateResult = boolean | AuthExpiredUpdateResult | void;

export interface LibraryModule {
  key: string;
  /** 指示此平台模块是否已在设置中启用。 */
  enabled: () => boolean;
  /** 指示该模块的缓存游戏库是否为空。 */
  isCacheEmpty: () => boolean;
  /** 刷新该模块缓存的游戏库。 */
  updateLibrary: () => Awaitable<UpdateResult>;
  /** 启动该模块在页面层级标记所有权的行为。 */
  start: () => void;
}

/** 执行非交互式的平台游戏库刷新。 */
export type AutoUpdateRunner = () => Awaitable<UpdateResult>;

export interface ModuleContext {
  settings: GlobalSettings;
  /** 查找匹配 CSS 选择器的页面元素。 */
  queryLinks: (selector: string) => Element[];
  /** 为存在的元素添加所有权状态类。 */
  addClass: (element: Element | null | undefined, className: string) => void;
  /** 以规范化字符串形式获取元素的 href。 */
  getHref: (element: Element | null | undefined) => string;
  /** 将 HTML 解析为文档，以供按平台提取信息。 */
  parseHtml: (html: string) => Document;
  /** 显示面向用户的平台反馈信息。 */
  showToast: ShowToast;
  /** 更新平台刷新过程的进度显示。 */
  showUpdateStep: (platform: string, text: string) => void;
  /** 显示平台刷新完成后的结果。 */
  showUpdateResult: (title: string, type: ToastType) => Promise<boolean>;
  /** 提示用户在平台会话过期后重新进行身份验证。 */
  showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
  /** 在平台特定的速率限制下执行更新。 */
  runAutoUpdateWithRateLimit: (
    module: LibraryModule,
    autoUpdateRunner: AutoUpdateRunner
  ) => Promise<UpdateResult>;
  UPDATE_STATUS: UpdateStatusConstants;
}

export type ProgressStateMap = Record<string, string>;

export interface ProgressPanelOptions {
  replace?: boolean;
}
