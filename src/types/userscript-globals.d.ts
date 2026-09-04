/** 从用户脚本存储中读取值。 */
declare function GM_getValue<T = unknown>(key: string, defaultValue?: T): T | undefined;
/** 将值写入用户脚本存储。 */
declare function GM_setValue(key: string, value: unknown): void;
/** 从用户脚本存储中移除值。 */
declare function GM_deleteValue(key: string): void;
/** 列出用户脚本存储的键。 */
declare function GM_listValues(): string[];
/** 将 CSS 注入当前文档。 */
declare function GM_addStyle(css: string): void;
declare const unsafeWindow: Window & Record<string, unknown>;
/** 按名称加载 CommonJS 模块。 */
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
  /** 处理已完成的请求响应。 */
  onload?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  /** 处理失败的请求响应。 */
  onerror?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  /** 处理请求超时响应。 */
  ontimeout?: (response: GMXmlHttpRequestResponse<TResponse>) => void;
  [key: string]: unknown;
}

/** 发送异步跨域用户脚本请求。 */
declare function GM_xmlhttpRequest<TResponse = unknown>(
  details: GMXmlHttpRequestDetails<TResponse>
): void;
/** 通过用户脚本管理器在浏览器标签页中打开 URL。 */
declare function GM_openInTab(url: string, options?: boolean | Record<string, unknown>): unknown;
/** 注册用户脚本菜单命令及其点击处理程序。 */
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
  /** 列出与请求的 URL 及可选 Cookie 名称匹配的 Cookie。 */
  list(
    details: { url: string; name?: string },
    callback: (cookies: GMCookie[], error?: unknown) => void
  ): void;

  /** 设置 Cookie，并通过回调报告任何 Greasemonkey API 错误。 */
  set(cookie: GMCookie & { url: string }, callback: (error?: unknown) => void): void;
}

declare const GM_cookie: GMCookieApi;

declare const module: {
  exports: unknown;
};
