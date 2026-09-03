declare function GM_getValue<T = unknown>(key: string, defaultValue?: T): T | undefined;
declare function GM_setValue(key: string, value: unknown): void;
declare function GM_listValues(): string[];
declare function GM_addStyle(css: string): void;
declare const unsafeWindow: Window & Record<string, unknown>;

interface GMXmlHttpRequestDetails {
  method?: string;
  url: string;
  headers?: Record<string, string>;
  data?: string | Document | XMLHttpRequestBodyInit | null;
  responseType?: XMLHttpRequestResponseType;
  onload?: (response: XMLHttpRequest) => void;
  onerror?: (response: XMLHttpRequest) => void;
  ontimeout?: (response: XMLHttpRequest) => void;
  [key: string]: unknown;
}

declare function GM_xmlhttpRequest(details: GMXmlHttpRequestDetails): void;
declare function GM_openInTab(url: string, options?: boolean | Record<string, unknown>): unknown;
declare function GM_registerMenuCommand(caption: string, onClick: () => void): unknown;
