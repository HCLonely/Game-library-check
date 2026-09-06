import type { Snapshot } from './sync-data';
const { parseSnapshot } = require('./sync-data.ts') as typeof import('./sync-data');
export interface GistConf { TOKEN: string; GIST_ID: string; FILE_NAME: string; enabled: boolean; intervalHours: number }
export class SyncError extends Error {
  permanent: boolean;
  retryAt: number;
  constructor(message: string, permanent = false, retryAt = 0) {
    super(message); this.permanent = permanent; this.retryAt = retryAt;
  }
}
interface GistBody { truncated?: boolean; files?: Record<string, { content?: string; truncated?: boolean; raw_url?: string }> }
export function request<T>(url: string, conf: GistConf, method = 'GET', data?: string): Promise<GMXmlHttpRequestResponse<T>> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest<T>({ url, method, data, responseType: 'json', timeout: 30000,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${conf.TOKEN}`, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      onerror: () => reject(new SyncError('网络异常，请检查连接')),
      ontimeout: () => reject(new SyncError('连接超时，请稍后重试')),
      onload: response => {
        if (response.status >= 200 && response.status < 300) { resolve(response); return; }
        const headers = response.responseHeaders || '';
        const retry = headers.match(/^retry-after:\s*(.+)$/im)?.[1]?.trim();
        const reset = headers.match(/^x-ratelimit-reset:\s*(\d+)/im)?.[1];
        const apiMessage = (response.response as { message?: unknown } | null)?.message;
        const limited = response.status === 429 || (response.status === 403 && (/^x-ratelimit-remaining:\s*0\s*$/im.test(headers) || Boolean(retry) || (typeof apiMessage === 'string' && /secondary rate limit|rate limit exceeded/i.test(apiMessage))));
        if (limited) {
          const retryAt = retry ? (/^\d+$/.test(retry) ? Date.now() + Number(retry) * 1000 : Date.parse(retry)) : Number(reset) * 1000;
          reject(new SyncError('GitHub 请求限流，稍后自动重试', false, Number.isFinite(retryAt) ? retryAt : 0));
        } else if (response.status === 401 || response.status === 403) reject(new SyncError('Token 无效或权限不足，请重新保存配置并测试', true));
        else if (response.status === 404) reject(new SyncError('Gist 不存在或没有访问权限', true));
        else reject(new SyncError(`GitHub 请求失败（${response.status}）`, response.status < 500));
      }
    });
  });
}
const urlFor = (conf: GistConf): string => `https://api.github.com/gists/${encodeURIComponent(conf.GIST_ID)}`;

/** null means an explicitly missing file in an accessible, complete Gist response. */
export async function readRemote(conf: GistConf): Promise<Snapshot | null> {
  const response = await request<GistBody>(urlFor(conf), conf);
  const body = response.response;
  if (!body?.files || typeof body.files !== 'object' || body.truncated) throw new SyncError('Gist 文件列表不完整，无法安全同步', true);
  const file = Object.prototype.hasOwnProperty.call(body.files, conf.FILE_NAME) ? body.files[conf.FILE_NAME] : undefined;
  if (!file) return null;
  let raw: unknown;
  if (file.truncated) {
    const rawUrl = file.raw_url && new URL(file.raw_url);
    if (!rawUrl || rawUrl.protocol !== 'https:' || rawUrl.hostname !== 'gist.githubusercontent.com') throw new SyncError('远程文件地址无效', true);
    // Never forward the GitHub API credential to the raw content host.
    const response = await new Promise<GMXmlHttpRequestResponse>((resolve, reject) => GM_xmlhttpRequest({
      url: rawUrl.href, method: 'GET', timeout: 30000, responseType: 'text',
      onload: resolve, onerror: () => reject(new SyncError('下载完整备份失败')), ontimeout: () => reject(new SyncError('下载完整备份超时'))
    }));
    if (response.status !== 200) throw new SyncError('无法下载完整备份');
    try { raw = JSON.parse(response.responseText); } catch { throw new SyncError('远程文件不是有效 JSON', true); }
  } else {
    try { raw = JSON.parse(file.content || ''); } catch { throw new SyncError('远程文件不是有效 JSON', true); }
  }
  try { return await parseSnapshot(raw); } catch (error) { throw new SyncError((error as Error).message, true); }
}
export async function writeRemote(conf: GistConf, snapshot: Snapshot): Promise<void> {
  await request<GistBody>(urlFor(conf), conf, 'PATCH', JSON.stringify({ files: { [conf.FILE_NAME]: { content: JSON.stringify(snapshot) } } }));
  const confirmed = await readRemote(conf);
  if (!confirmed || confirmed.dataHash !== snapshot.dataHash || confirmed.dataUpdatedAt !== snapshot.dataUpdatedAt) throw new SyncError('远程内容已变化，未能确认上传结果');
}
