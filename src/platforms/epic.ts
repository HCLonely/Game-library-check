import type { LibraryModule, ModuleContext, UpdateResult } from '../shared/types';

interface EpicCachedGame {
  namespace: string;
  offerId: string;
  pageSlug: string[];
}

interface EpicWishlistGame {
  offerId: string;
  pageSlug: string[];
}

interface EpicCatalogResponse {
  data?: {
    Catalog?: {
      catalogOffer?: {
        offerMappings?: Array<{ pageSlug?: string }>;
        urlSlug?: string;
        customAttributes?: Array<{ key: string; value?: string }>;
      };
    };
  };
}

interface EpicOrderItem {
  namespace: string;
  offerId: string;
}

interface EpicOrderHistoryResponse {
  orders: Array<{ items?: EpicOrderItem[] }>;
  nextPageToken?: string;
  products?: unknown[];
}

type EpicRequestOptions = Omit<
  GMXmlHttpRequestDetails<EpicOrderHistoryResponse>,
  'url' | 'onload' | 'onerror' | 'ontimeout'
>;

/**
 * Creates the Epic Games module that marks owned and wishlisted store links and maintains its cache.
 *
 * @param context - Shared runtime services, settings, UI feedback, and update-status constants.
 * @returns An Epic Games library module with startup and update actions.
 */
function createEpicModule(context: ModuleContext): LibraryModule {
  const {
    settings,
    queryLinks,
    addClass,
    getHref,
    showUpdateStep,
    showUpdateResult,
    // showLoginExpiredDialog,
    showToast,
    runAutoUpdateWithRateLimit,
    UPDATE_STATUS
  } = context;

  let updateLibrary: (() => Promise<UpdateResult>) | undefined;
  let started = false;
  const moduleApi = {
    key: 'epic',
    enabled: () => settings.platformEnabled.epic,
    isCacheEmpty: () => (GM_getValue<EpicCachedGame[]>('ownedGames') || []).length === 0,
    updateLibrary: async () => {
      if (!updateLibrary) await moduleApi.start();
      return updateLibrary!();
    },
    start: async () => {
      if (started) return;
      started = true;
      if (!GM_getValue('version')) {
        GM_deleteValue('epicGamesLibrary');
        GM_deleteValue('ownedGames');
        GM_deleteValue('wishlist');
        GM_setValue('version', '1.1');
      }
      let loadTimes = 0;
      let catalogOfferSha256Hash: string | false | undefined = false;
      let locale: string | undefined = 'en-US';

      await getSha256Hash();

      checkEpicGame();

      const observer = new MutationObserver(() => { checkEpicGame(false, true); });
      observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
      });

      /**
       * Marks unprocessed Epic store links as owned or wishlisted from cached account data.
       *
       * The initial scan starts a rate-limited background update and surfaces its authentication-expired result.
       *
       * @param first - Whether this is the initial scan that may trigger an update.
       * @param again - Whether a mutation-triggered scan should only skip already scanned links.
       */
      async function checkEpicGame(first = true, again = false): Promise<void> {
        loadTimes++;
        if (loadTimes > 1000) {
          observer.disconnect();
          return;
        }
        const ownedGames = getEpicOwnedGames();
        const wishlistGames = GM_getValue<EpicWishlistGame[]>('epicWishist') || [];
        const excludedClass = again ? 'epic-game-checked' : 'epic-game-link-owned';
        const epicLink = queryLinks('a[href*="www.epicgames.com/store/"],a[href*="store.epicgames.com/"]')
          .filter((el) => !el.classList.contains(excludedClass));
        if (epicLink.length === 0) return;
        if (first) {
          /** Refreshes the Epic ownership cache without interactive status UI. */
          const autoUpdate = () => updateEpicOwnedGames(false);
          let runner = autoUpdate;
          if (typeof runAutoUpdateWithRateLimit === 'function') {
            runner = () => runAutoUpdateWithRateLimit(moduleApi, autoUpdate);
          }
          Promise.resolve(runner()).then((result) => {
            if (typeof result === 'object' && result?.status === UPDATE_STATUS.AUTH_EXPIRED) {
              showToast('Epic 登录状态已过期，请先登录', 'error', { duration: 0, closable: true, link: { href: result.loginUrl, text: '去登录' } });
            }
          });
        }
        epicLink.forEach((el) => {
          addClass(el, 'epic-game-checked');
          let href = getHref(el);
          if (!/\/$/.test(href)) href += '/';
          const epicGameName = href.match(/https?:\/\/(www|store)\.epicgames\.com(\/.*?)?\/p(roduct)?\/([^?/]+)/i)?.[4]?.toLowerCase();
          if (epicGameName) {
            if (ownedGames.find((game) => game.pageSlug.includes(epicGameName))) {
              addClass(el, 'epic-game-link-owned');
            } else if (wishlistGames.find((game) => game.pageSlug.includes(epicGameName))) {
              addClass(el, 'epic-game-link-wishlist');
            }
            return;
          }
          const epicGameOfferId = href.match(/https?:\/\/(store|www)\.epicgames\.com\/purchase\?offers=([\w-]+)/i)?.[2]?.toLowerCase();
          if (epicGameOfferId) {
            if (ownedGames.find((game) => epicGameOfferId.includes(game.offerId))) {
              addClass(el, 'epic-game-link-owned');
            } else if (wishlistGames.find((game) => epicGameOfferId.includes(game.offerId))) {
              addClass(el, 'epic-game-link-wishlist');
            }
          }
        });
      }

      /**
       * Reads cached Epic ownership records from userscript storage.
       *
       * @returns Owned game records, or an empty array when no cache exists.
       */
      function getEpicOwnedGames(): EpicCachedGame[] {
        return GM_getValue<EpicCachedGame[]>('ownedGames') || [];
      }

      /**
       * Loads Epic's store page to capture the persisted catalog-query hash and active locale.
       *
       * Failures are logged and leave the catalog lookup unavailable until a later retry.
       */
      async function getSha256Hash(): Promise<void> {
        console.log('[EGLC] getSha256Hash...');
        return new Promise<GMXmlHttpRequestResponse<string>>((resolve, reject) => {
          GM_xmlhttpRequest<string>({
            method: 'GET',
            url: 'https://store.epicgames.com/p/grand-theft-auto-v?lang=zh-CN',
            timeout: 30000,
            fetch: true,
            headers: {
              accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
            },
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then((response) => {
          [, catalogOfferSha256Hash] = response.responseText.match(/"],"([\w\d]+?)"],"queryHash":"\[\\"getCatalogOffer\\"/i) || [];
          [, locale] = response.responseText.match(/"localizationData":{"locale":"(.+?)"/i) || ['en-US'];
          console.log('[EGLC] ', JSON.stringify({ catalogOfferSha256Hash, locale }));
        })
          .catch((error) => {
            console.error(error);
          });
      }

      /**
       * Resolves an Epic catalog offer into page slugs used to match store links.
       *
       * @param namespace - Epic sandbox namespace for the offer.
       * @param offerId - Epic offer ID to query.
       * @returns Deduplicated product slugs, or `false` when catalog data cannot be obtained.
       */
      async function getPagePlug(namespace: string, offerId: string): Promise<string[] | false> {
        console.log('[EGLC] getPagePlug...');
        if (catalogOfferSha256Hash === false) {
          await getSha256Hash();
        }
        if (!catalogOfferSha256Hash) {
          console.log('[EGLC] No catalogOfferSha256Hash');
          return false;
        }
        return new Promise<GMXmlHttpRequestResponse<EpicCatalogResponse>>((resolve, reject) => {
          GM_xmlhttpRequest<EpicCatalogResponse>({
            method: 'GET',
            url: `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22zh-CN%22,%22country%22:%22CN%22,%22offerId%22:%22${offerId}%22,%22sandboxId%22:%22${namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22${catalogOfferSha256Hash}%22%7D%7D`,
            timeout: 30000,
            fetch: true,
            headers: {
              accept: 'application/json, text/plain, */*'
            },
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            onload: (response) => {
              response.status === 200 ? resolve(response) : reject(response);
            }
          });
        }).then(async (response) => {
          if (response.response?.data?.Catalog?.catalogOffer) {
            const { offerMappings, urlSlug, customAttributes } = response.response.data.Catalog.catalogOffer;
            return [
              ...new Set([
                offerMappings?.[0]?.pageSlug,
                urlSlug,
                customAttributes?.find((e) => e.key === 'com.epicgames.app.productSlug')?.value?.replace(/\/home$/, '')
              ].filter((slug): slug is string => Boolean(slug)))
            ];
          }
          return false;
        })
          .catch((error) => {
            console.error(error);
            return false;
          });
      }

      // async function updateEpicAuth(loop) {
      //   console.log('[EGLC] updateEpicAuth...');
      //   if (loop) {
      //     context.showToast('正在更新Epic凭证...', 'info');
      //   }
      //   const reputationResult = await new Promise((resolve, reject) => {
      //     GM_xmlhttpRequest({
      //       method: 'GET',
      //       url: 'https://www.epicgames.com/id/api/reputation',
      //       headers: {
      //         accept: 'application/json, text/plain, */*',
      //         referer: 'https://www.epicgames.com/id/login',
      //         'sec-fetch-site': 'same-origin'
      //       },
      //       timeout: 30000,
      //       nocache: true,
      //       responseType: 'json',
      //       onerror: reject,
      //       ontimeout: reject,
      //       onload: (response) => {
      //         response.status === 200 ? resolve(response) : reject(response);
      //       }
      //     });
      //   }).then(async (response) => response.status === 200)
      //     .catch((error) => {
      //       console.error(error);
      //       return false;
      //     });
      //   if (!reputationResult) {
      //     return false;
      //   }
      //   const authenticateResult = await new Promise((resolve, reject) => {
      //     GM_xmlhttpRequest({
      //       method: 'GET',
      //       url: 'https://www.epicgames.com/id/api/authenticate',
      //       headers: {
      //         accept: 'application/json, text/plain, */*',
      //         referer: 'https://www.epicgames.com/id/login',
      //         'x-epic-client-id': 'undefined',
      //         'x-epic-display-mode': 'web',
      //         'x-epic-duration': '700',
      //         'x-epic-event-action': 'null',
      //         'x-epic-event-category': 'null',
      //         'x-epic-platform': 'WEB',
      //         'x-epic-strategy-flags': '',
      //         'x-requested-with': 'XMLHttpRequest'
      //       },
      //       timeout: 30000,
      //       nocache: true,
      //       responseType: 'json',
      //       onerror: reject,
      //       ontimeout: reject,
      //       onload: (response) => {
      //         response.status === 200 ? resolve(response) : reject(response);
      //       }
      //     });
      //   }).then(async (response) => response.status === 200)
      //     .catch((error) => {
      //       console.error(error);
      //       return false;
      //     });
      //   if (!authenticateResult) {
      //     return false;
      //   }
      //   const refreshCsrfResult = await new Promise((resolve, reject) => {
      //     GM_xmlhttpRequest({
      //       method: 'POST',
      //       url: 'https://www.epicgames.com/account/v2/refresh-csrf',
      //       headers: {
      //         accept: 'application/json, text/plain, */*',
      //         origin: 'https://www.epicgames.com',
      //         referer: 'https://www.epicgames.com/account/personal'
      //       },
      //       timeout: 30000,
      //       nocache: true,
      //       responseType: 'json',
      //       onerror: reject,
      //       ontimeout: reject,
      //       onload: (response) => {
      //         response.status === 200 ? resolve(response) : reject(response);
      //       }
      //     });
      //   }).then(async (response) => response.response?.success === true)
      //     .catch((error) => {
      //       console.error(error);
      //       return false;
      //     });
      //   if (!refreshCsrfResult) {
      //     return false;
      //   }
      //   return true;
      // }

      /**
       * Reads one Epic account cookie for authenticated order-history requests.
       *
       * @param name - Cookie name to retrieve.
       * @returns The cookie value, or the `null` string when it is absent.
       */
      function getEpicCookies(name: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
          GM_cookie.list({ url: 'https://accounts.epicgames.com/', name }, (cookies, error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(cookies[0]?.value || 'null');
          });
        });
      }

      /**
       * Serializes all Epic account cookies into a request Cookie header.
       *
       * @returns A semicolon-delimited Cookie header value.
       */
      function getAllEpicCookies(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
          GM_cookie.list({ url: 'https://accounts.epicgames.com/' }, (cookies, error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';'));
          });
        });
      }

      /**
       * Parses one Set-Cookie header into the object required by the GM cookie API.
       *
       * @param cookieString - Raw Set-Cookie header value.
       * @param fallbackUrl - URL used when the header does not define a domain.
       * @returns A cookie object with the fallback URL and parsed attributes.
       */
      function parseSetCookieHeader(cookieString: string, fallbackUrl: string): GMCookie & { url: string } {
        const parts = cookieString.split(';').map((s) => s.trim());
        const [nameValue, ...attrs] = parts;
        const eqIdx = nameValue.indexOf('=');
        const name = eqIdx >= 0 ? nameValue.slice(0, eqIdx).trim() : nameValue.trim();
        const value = eqIdx >= 0 ? nameValue.slice(eqIdx + 1).trim() : '';

        const cookie: GMCookie & { url: string } = {
          url: fallbackUrl,
          name,
          value: value || '',
          path: '/',
          secure: false,
          httpOnly: false,
          expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)
        };

        attrs.forEach((attr) => {
          const eqIdx = attr.indexOf('=');
          const key = eqIdx >= 0 ? attr.slice(0, eqIdx).trim()
            .toLowerCase() : attr.trim().toLowerCase();
          const val = eqIdx >= 0 ? attr.slice(eqIdx + 1).trim() : '';

          if (key === 'domain') cookie.domain = val.startsWith('.') ? val : `.${val}`;
          else if (key === 'path') cookie.path = val || '/';
          else if (key === 'secure') cookie.secure = true;
          else if (key === 'httponly') cookie.httpOnly = true;
          else if (key === 'expires') {
            const exp = new Date(val).getTime();
            if (!isNaN(exp)) cookie.expirationDate = Math.floor(exp / 1000);
          } else if (key === 'max-age') {
            cookie.expirationDate = Math.floor(Date.now() / 1000) + parseInt(val, 10);
          }
        });

        return cookie;
      }

      /**
       * Extracts Set-Cookie headers from a response and persists them through the GM cookie API.
       *
       * @param responseHeaders - Raw HTTP response headers.
       * @param url - URL that received the response.
       * @returns A promise that resolves after every parsed cookie has been submitted.
       */
      function extractAndSetCookies(responseHeaders: string, url: string): Promise<void[]> | Promise<void> {
        if (!responseHeaders) return Promise.resolve();
        const setCookieLines = responseHeaders.split(/\r?\n/).filter((line) => /^set-cookie:\s*/i.test(line));
        if (!setCookieLines.length) return Promise.resolve();

        const cookiePromises = setCookieLines.map((line) => {
          const cookieStr = line.replace(/^set-cookie:\s*/i, '');
          const cookie = parseSetCookieHeader(cookieStr, url);
          return new Promise<void>((resolve) => {
            GM_cookie.set(cookie, (error) => {
              if (error) console.error('[EGLC] Cookie set error:', error);
              resolve();
            });
          });
        });

        return Promise.all(cookiePromises);
      }

      /**
       * Reads the Location value from raw HTTP response headers.
       *
       * @param responseHeaders - Raw HTTP response headers.
       * @returns The redirect target, or `null` when no Location header exists.
       */
      function getLocationHeader(responseHeaders: string): string | null {
        const match = responseHeaders?.match(/^location:\s*(.+)/im);
        return match ? match[1].trim() : null;
      }

      /**
       * Requests Epic order data while manually following redirects and persisting redirect cookies.
       *
       * @param initialUrl - First URL to request.
       * @param baseOptions - Request options shared by every redirect hop.
       * @param maxRedirects - Maximum redirects allowed before failing.
       * @returns The final successful order-history response.
       * @throws When a redirect lacks a Location header, a response fails, or the redirect limit is exceeded.
       */
      async function requestWithRedirect(
        initialUrl: string,
        baseOptions: EpicRequestOptions,
        maxRedirects = 10
      ): Promise<GMXmlHttpRequestResponse<EpicOrderHistoryResponse>> {
        let currentUrl = initialUrl;

        for (let i = 0; i < maxRedirects; i++) {
          const response = await new Promise<GMXmlHttpRequestResponse<EpicOrderHistoryResponse>>((res, rej) => {
            GM_xmlhttpRequest<EpicOrderHistoryResponse>({
              ...baseOptions,
              url: currentUrl,
              redirect: 'manual',
              onload: res,
              onerror: rej,
              ontimeout: rej
            });
          });

          const { status } = response;
          if (status === 301 || status === 302 || status === 303 || status === 307 || status === 308) {
            await extractAndSetCookies(response.responseHeaders, currentUrl);
            const location = getLocationHeader(response.responseHeaders);
            if (!location) throw new Error('[EGLC] Redirect without Location header');
            currentUrl = location;
            continue;
          }

          if (status === 200) {
            return response;
          }

          throw response;
        }

        throw new Error('[EGLC] Too many redirects');
      }

      /**
       * Fetches Epic order history, resolves catalog slugs, and writes owned games to persistent storage.
       *
       * Interactive runs show progress and completion. Login redirects return the authentication-expired sentinel;
       * background runs merge partial results and rescan links after each completed update.
       *
       * @param loop - Whether to fetch every page with interactive progress.
       * @param i - Current zero-based order-history page index.
       * @param games - Ownership records accumulated from prior pages.
       * @param nextPageToken - Pagination token for the next order-history request.
       * @returns Update success, failure, or an authentication-expired result.
       */
      async function updateEpicOwnedGames(
        loop = true,
        i = 0,
        games: EpicCachedGame[] = GM_getValue<EpicCachedGame[]>('ownedGames') || [],
        nextPageToken = ''
      ): Promise<UpdateResult> {
        console.log('[EGLC] updateEpicOwnedGames...');
        if (!loop && i !== 0) {
          GM_setValue('ownedGames', games);
          checkEpicGame(false);
          return;
        }
        const xsrfToken = await getEpicCookies('XSRF-AM-TOKEN');
        const allCookies = await getAllEpicCookies();
        if (loop) {
          showUpdateStep('epic', `第 ${i + 1} 页`);
        }
        return requestWithRedirect(
          `https://accounts.epicgames.com/account/v2/payment/ajaxGetOrderHistory?count=10&sortDir=DESC&sortBy=DATE&locale=${locale}${nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ''}`,
          {
            method: 'GET',
            timeout: 30000,
            nocache: true,
            responseType: 'json',
            fetch: true,
            headers: {
              referer: 'https://accounts.epicgames.com/',
              dnt: '1',
              pragma: 'no-cache',
              priority: 'u=1, i',
              'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"Windows"',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'sec-gpc': '1',
              'x-csrf-token': 'null',
              'x-xsrf-token': xsrfToken,
              cookie: allCookies
            }
          }
        ).then(async (response) => {
          if (/login/i.test(response.finalUrl)) {
            return {
              status: UPDATE_STATUS.AUTH_EXPIRED,
              platformName: 'Epic',
              loginUrl: 'https://www.epicgames.com/id/login'
            };
          }
          const ordersLength = response.response?.orders?.length || 0;
          if (ordersLength >= 0) {
            const orderedGames = response.response.orders
              .map((order) => order.items?.[0])
              .filter((item): item is EpicOrderItem => Boolean(item));
            // console.info(orderedGames);
            await Promise.all(orderedGames.map(async (item) => {
              // console.info(item);
              // const ttt = games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId);
              if (games.find((game) => game.namespace === item.namespace && game.offerId === item.offerId)) {
                // console.info(item.namespace, ttt);
                return true;
              }
              // console.info('pageSlug');
              const pageSlug = await getPagePlug(item.namespace, item.offerId);
              console.log(`[EGLC] pageSlug: ${pageSlug}`);
              if (pageSlug) {
                games.push({
                  namespace: item.namespace,
                  offerId: item.offerId,
                  pageSlug
                });
                GM_setValue('ownedGames', games);
              }
              return true;
            }));
            const { nextPageToken } = response.response;

            if (nextPageToken) {
              if (loop) {
                await new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(true);
                  }, 1000);
                });
              }
              return await updateEpicOwnedGames(loop, ++i, games, nextPageToken);
            } else if (loop) {
              GM_setValue('ownedGames', games);
              await showUpdateResult('Epic已拥有游戏数据更新完成', 'success');
              return true;
            }
            GM_setValue('ownedGames', games);
            checkEpicGame(false);
            console.log('[EGLC] updateEpicOwnedGames: Finish!');
            return true;
          } else if (response.response?.products?.length !== 0) {
            console.error(response);
            await showUpdateResult('Epic已拥有游戏数据更新失败', 'error');
            return false;
          }
          return false;
        })
          .catch(async (error) => {
            console.error(error);
            await showUpdateResult('Epic已拥有游戏数据更新失败', 'error');
            return false;
          });
      }

      updateLibrary = updateEpicOwnedGames;

      GM_addStyle(`
.epic-game-link-owned {
  color:#ffffff !important;
  background:#5c8a00 !important
}
.epic-game-link-wishlist {
  color:#ffffff !important;
  background:#007399 !important
}`);

      // void updateEpicAuth;
    }
  };
  return moduleApi;
}

module.exports = {
  createEpicModule
};
