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
  onConfirm?: (root: HTMLElement) => void | Promise<void>;
  onCancel?: (root: HTMLElement) => void | Promise<void>;
  denyText?: string;
  onDeny?: (root: HTMLElement) => void | Promise<void>;
  hideCancel?: boolean;
}

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
  enabled: () => boolean;
  isCacheEmpty: () => boolean;
  updateLibrary: () => Awaitable<UpdateResult>;
  start: () => void;
}

export type AutoUpdateRunner = () => Awaitable<UpdateResult>;

export interface ModuleContext {
  settings: GlobalSettings;
  queryLinks: (selector: string) => Element[];
  addClass: (element: Element | null | undefined, className: string) => void;
  getHref: (element: Element | null | undefined) => string;
  parseHtml: (html: string) => Document;
  showToast: ShowToast;
  showUpdateStep: (platform: string, text: string) => void;
  showUpdateResult: (title: string, type: ToastType) => Promise<boolean>;
  showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
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
