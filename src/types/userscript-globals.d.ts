/** Reads a value from userscript storage. */
declare function GM_getValue<T = unknown>(key: string, defaultValue?: T): T | undefined;
/** Writes a value to userscript storage. */
declare function GM_setValue(key: string, value: unknown): void;
/** Removes a value from userscript storage. */
declare function GM_deleteValue(key: string): void;
/** Lists keys stored by the userscript. */
declare function GM_listValues(): string[];
/** Injects CSS into the current document. */
declare function GM_addStyle(css: string): void;
declare const unsafeWindow: Window & Record<string, unknown>;
/** Loads a CommonJS module by name. */
declare function require(moduleName: string): unknown;

interface GMXmlHttpRequestResponse<TResponse = unknown> {
  finalUrl: string;
  readyState: number;
  response: TResponse;
  responseHeaders: string;
  responseText: string;
  status: number;
  statusText: string;
}

interface GMXmlHttpRequestDetails<TResponse = unknown> {
  method?: string;
  url: string;
  headers?: Record<string, string>;
  data?: string | Document | XMLHttpRequestBodyInit | null;
  responseType?: XMLHttpRequestResponseType;
  /** Handles a completed request response. */
  onload?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  /** Handles a failed request response. */
  onerror?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  /** Handles a request timeout response. */
  ontimeout?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  [key: string]: unknown;
}

/** Sends an asynchronous cross-origin userscript request. */
declare function GM_xmlhttpRequest<TResponse = unknown>(
  details: GMXmlHttpRequestDetails<TResponse>
): void;
/** Opens a URL in a browser tab through the userscript manager. */
declare function GM_openInTab(url: string, options?: boolean | Record<string, unknown>): unknown;
/** Registers a userscript menu command and its click handler. */
declare function GM_registerMenuCommand(caption: string, onClick: () => void): unknown;

interface GMCookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  expirationDate?: number;
}

interface GMCookieApi {
  /** Lists cookies matching the requested URL and optional cookie name. */
  list(
    details: { url: string; name?: string },
    callback: (cookies: GMCookie[], error?: unknown) => void
  ): void;

  /** Sets a cookie, reporting any Greasemonkey API error through the callback. */
  set(cookie: GMCookie & { url: string }, callback: (error?: unknown) => void): void;
}

declare const GM_cookie: GMCookieApi;

declare const module: {
  exports: unknown;
};
