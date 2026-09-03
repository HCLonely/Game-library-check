declare function GM_getValue<T = unknown>(key: string, defaultValue?: T): T | undefined;
declare function GM_setValue(key: string, value: unknown): void;
declare function GM_deleteValue(key: string): void;
declare function GM_listValues(): string[];
declare function GM_addStyle(css: string): void;
declare const unsafeWindow: Window & Record<string, unknown>;
declare function require(moduleName: string): any;

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
  onload?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  onerror?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  ontimeout?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  [key: string]: unknown;
}

declare function GM_xmlhttpRequest<TResponse = unknown>(
  details: GMXmlHttpRequestDetails<TResponse>
): void;
declare function GM_openInTab(url: string, options?: boolean | Record<string, unknown>): unknown;
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
  list(
    details: { url: string; name?: string },
    callback: (cookies: GMCookie[], error?: unknown) => void
  ): void;
  set(cookie: GMCookie & { url: string }, callback: (error?: unknown) => void): void;
}

declare const GM_cookie: GMCookieApi;

declare const module: {
  exports: unknown;
};
