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

/** Displays a transient user-facing message. */
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
  /** Runs after the dialog's confirm action is selected. */
  onConfirm?: (root: HTMLElement) => void | Promise<void>;
  /** Runs after the dialog's cancel action is selected. */
  onCancel?: (root: HTMLElement) => void | Promise<void>;
  denyText?: string;
  /** Runs after the dialog's deny action is selected. */
  onDeny?: (root: HTMLElement) => void | Promise<void>;
  hideCancel?: boolean;
}

/** Opens a configurable modal dialog. */
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
  /** Indicates whether this platform module is enabled in settings. */
  enabled: () => boolean;
  /** Indicates whether the module's cached library has no entries. */
  isCacheEmpty: () => boolean;
  /** Refreshes the module's cached game library. */
  updateLibrary: () => Awaitable<UpdateResult>;
  /** Starts the module's page-level ownership marking behavior. */
  start: () => void;
}

/** Runs a non-interactive platform library refresh. */
export type AutoUpdateRunner = () => Awaitable<UpdateResult>;

export interface ModuleContext {
  settings: GlobalSettings;
  /** Finds page elements matching a CSS selector. */
  queryLinks: (selector: string) => Element[];
  /** Adds an ownership-state class to an element when present. */
  addClass: (element: Element | null | undefined, className: string) => void;
  /** Gets an element href as a normalized string. */
  getHref: (element: Element | null | undefined) => string;
  /** Parses HTML into a document for platform-specific extraction. */
  parseHtml: (html: string) => Document;
  /** Displays user-facing platform feedback. */
  showToast: ShowToast;
  /** Updates the progress display for a platform refresh. */
  showUpdateStep: (platform: string, text: string) => void;
  /** Shows the completion result for a platform refresh. */
  showUpdateResult: (title: string, type: ToastType) => Promise<boolean>;
  /** Prompts the user to reauthenticate with an expired platform session. */
  showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
  /** Runs an update with platform-specific rate limiting. */
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
