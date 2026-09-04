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
 * 创建 Epic Games 模块，用于标记已拥有和愿望单中的商店链接并维护其缓存。
 *
 * @param context - 共享运行时服务、设置、用户界面反馈和更新状态常量。
 * @returns 包含启动和更新操作的 Epic Games 游戏库模块。
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
       * 根据缓存的账户数据，将未处理的 Epic 商店链接标记为已拥有或已加入愿望单。
       *
       * 首次扫描会启动受速率限制的后台更新，并呈现其认证过期结果。
       *
       * @param first - 是否为可能触发更新的首次扫描。
       * @param again - 由变更触发的扫描是否只跳过已扫描的链接。
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
          /** 在不显示交互式状态界面的情况下刷新 Epic 所有权缓存。 */
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
       * 从用户脚本存储中读取缓存的 Epic 所有权记录。
       *
       * @returns 已拥有游戏记录；不存在缓存时返回空数组。
       */
      function getEpicOwnedGames(): EpicCachedGame[] {
        return GM_getValue<EpicCachedGame[]>('ownedGames') || [];
      }

      /**
       * 加载 Epic 商店页面以获取持久化的目录查询哈希和当前区域设置。
       *
       * 失败会被记录，并使目录查询不可用，直到后续重试。
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
       * 将 Epic 目录优惠解析为用于匹配商店链接的页面短标识。
       *
       * @param namespace - 此优惠的 Epic 沙盒命名空间。
       * @param offerId - 要查询的 Epic 优惠 ID。
       * @returns 去重后的产品短标识；无法获取目录数据时为 `false`。
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
       * 读取一个 Epic 账户 Cookie，用于已认证的订单历史请求。
       *
       * @param name - 要获取的 Cookie 名称。
       * @returns Cookie 值；不存在时为 `null` 字符串。
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
       * 将全部 Epic 账户 Cookie 序列化为请求 Cookie 头。
       *
       * @returns 以分号分隔的 Cookie 请求头值。
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
       * 将一个 Set-Cookie 响应头解析为 GM cookie API 所需的对象。
       *
       * @param cookieString - 原始 Set-Cookie 请求头值。
       * @param fallbackUrl - 请求头未定义域名时使用的 URL。
       * @returns 包含回退 URL 和已解析属性的 Cookie 对象。
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
       * 从响应中提取 Set-Cookie 响应头，并通过 GM cookie API 持久化。
       *
       * @param responseHeaders - 原始 HTTP 响应头。
       * @param url - 接收该响应的 URL。
       * @returns 每个解析出的 Cookie 都已提交后完成的 Promise。
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
       * 从原始 HTTP 响应头中读取 Location 值。
       *
       * @param responseHeaders - 原始 HTTP 响应头。
       * @returns 重定向目标；不存在 Location 请求头时为 `null`。
       */
      function getLocationHeader(responseHeaders: string): string | null {
        const match = responseHeaders?.match(/^location:\s*(.+)/im);
        return match ? match[1].trim() : null;
      }

      /**
       * 请求 Epic 订单数据，同时手动跟随重定向并持久化重定向 Cookie。
       *
       * @param initialUrl - 首个要请求的 URL。
       * @param baseOptions - 每次重定向跳转共享的请求选项。
       * @param maxRedirects - 判定失败前允许的最大重定向次数。
       * @returns 最终成功的订单历史响应。
       * @throws 当重定向缺少 Location 请求头、响应失败或超过重定向限制时抛出。
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
       * 获取 Epic 订单历史、解析目录短标识，并将已拥有游戏写入持久化存储。
       *
       * 交互式运行会显示进度和完成状态。登录重定向会返回认证过期哨兵值；后台运行会合并部分结果，
       * 并在每次更新完成后重新扫描链接。
       *
       * @param loop - 是否获取每一页并显示交互式进度。
       * @param i - 当前从 0 开始的订单历史页索引。
       * @param games - 从先前页面累积的所有权记录。
       * @param nextPageToken - 下一次订单历史请求的分页令牌。
       * @returns 更新成功、失败或认证过期结果。
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
