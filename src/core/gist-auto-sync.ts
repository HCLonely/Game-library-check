import type { GistConf } from './gist-transport';
import type { Snapshot } from './sync-data';
const { SyncError, readRemote, writeRemote } = require('./gist-transport.ts') as typeof import('./gist-transport');
const { localVersion, makeSnapshot, chooseDirection, applySnapshot, libraryUpdateInProgress, validateData } = require('./sync-data.ts') as typeof import('./sync-data');
export const CONF_KEY = 'gistConf';
const LOCK_KEY = 'gistSyncLease';
export interface SyncState {
  lastSyncSuccessAt?: number; lastDirection?: 'upload' | 'download' | 'unchanged';
  lastAttemptAt?: number; lastError?: string; nextRetryAt?: number; failures?: number; paused?: boolean;
  remoteUpdatedAt?: number;
}
export function getGistConf(): GistConf {
  const conf = GM_getValue<Partial<GistConf>>(CONF_KEY) || {};
  return { TOKEN: conf.TOKEN || '', GIST_ID: conf.GIST_ID || '', FILE_NAME: conf.FILE_NAME || '', enabled: conf.enabled === true,
    intervalHours: Number.isInteger(conf.intervalHours) && Number(conf.intervalHours) >= 1 && Number(conf.intervalHours) <= 720 ? Number(conf.intervalHours) : 24 };
}
export function stateKey(conf: GistConf): string { return `gistSyncState:${JSON.stringify([conf.GIST_ID, conf.FILE_NAME])}`; }
export function getState(conf = getGistConf()): SyncState { return GM_getValue<SyncState>(stateKey(conf)) || {}; }
export function relativeTime(at?: number, now = Date.now()): string {
  if (!at) return '尚未同步';
  const minutes = Math.max(0, Math.floor((now - at) / 60000));
  return minutes < 1 ? '刚刚同步' : minutes < 60 ? `${minutes} 分钟前同步` : minutes < 1440 ? `${Math.floor(minutes / 60)} 小时前同步` : `${Math.floor(minutes / 1440)} 天前同步`;
}
export function isDue(conf: GistConf, state: SyncState, now = Date.now()): boolean {
  return conf.enabled && !state.paused && (state.nextRetryAt ? now >= state.nextRetryAt : !state.lastSyncSuccessAt || now >= state.lastSyncSuccessAt + conf.intervalHours * 3600000);
}
export interface EngineOptions {
  notify: (message: string, error: boolean) => void;
  changed: () => void;
  applied: () => void;
  allowed: () => boolean;
  read?: (conf: GistConf) => Promise<Snapshot | null>;
  write?: (conf: GistConf, snapshot: Snapshot) => Promise<void>;
  delay?: (ms: number) => Promise<void>;
}
export function createSyncEngine(options: EngineOptions) {
  const read = options.read || readRemote;
  const write = options.write || writeRemote;
  const delay = options.delay || ((ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms)));
  const owner = `${Date.now()}-${Math.random()}`;
  let busy = false;
  let disposed = false;
  type Lease = { owner: string; until: number };
  const lease = (): Lease | undefined => GM_getValue<Lease>(LOCK_KEY);
  const sameConf = (conf: GistConf): boolean => JSON.stringify(conf) === JSON.stringify(getGistConf());
  function release(): void { if (lease()?.owner === owner) GM_deleteValue(LOCK_KEY); }
  async function run(mode: 'auto' | 'upload' | 'download' = 'auto', scheduled = false): Promise<void> {
    if (busy || disposed) return;
    const conf = getGistConf();
    if (!conf.TOKEN || !conf.GIST_ID || !conf.FILE_NAME) {
      if (!scheduled) options.notify('请先保存完整的 Gist 配置并测试', true);
      return;
    }
    if (scheduled && (!options.allowed() || !isDue(conf, getState(conf)))) return;
    if (libraryUpdateInProgress()) {
      if (!scheduled) options.notify('游戏库正在更新，完成后再同步', false);
      return;
    }
    busy = true;
    let acquired = false;
    const guard = (): void => {
      if (disposed || !sameConf(conf) || lease()?.owner !== owner || (scheduled && !options.allowed())) throw new SyncError('同步条件已变化，请重新同步');
      GM_setValue(LOCK_KEY, { owner, until: Date.now() + 300000 });
    };
    try {
      // GM storage has no compare-and-swap. Jitter + lease + ownership checks reduce duplicate work.
      await delay(100 + Math.random() * 200);
      const current = lease();
      if (current && current.until > Date.now()) {
        if (!scheduled) options.notify('其他标签页正在同步，请稍后再试', false);
        return;
      }
      GM_setValue(LOCK_KEY, { owner, until: Date.now() + 300000 });
      await delay(150);
      if (lease()?.owner !== owner) return;
      acquired = true;
      guard();
      if (scheduled && !isDue(conf, getState(conf))) return;
      GM_setValue(stateKey(conf), { ...getState(conf), lastAttemptAt: Date.now() });
      options.changed();
      const initial = localVersion();
      const local = await makeSnapshot(initial.data, initial.updatedAt);
      const remote = await read(conf);
      guard();
      const unchangedLocal = (): void => {
        const current = localVersion();
        if (libraryUpdateInProgress() || current.fingerprint !== initial.fingerprint || current.updatedAt !== initial.updatedAt) throw new SyncError('本地数据刚刚更新，将重新比较后同步');
      };
      unchangedLocal();
      let direction: 'upload' | 'download' | 'unchanged';
      try { direction = mode === 'auto' ? chooseDirection(local, remote) : mode; }
      catch (error) { throw new SyncError((error as Error).message, true); }
      let resultTime = remote?.dataUpdatedAt;
      if (direction === 'upload') {
        if (!Object.keys(local.data).length) throw new SyncError('本地没有可上传的数据', true);
        try { validateData(local.data); }
        catch { throw new SyncError('本地游戏库或设置格式无效，请先更新游戏库并保存设置', true); }
        const snapshot = mode === 'upload' ? await makeSnapshot(local.data, Date.now()) : local;
        const latest = await read(conf);
        guard(); unchangedLocal();
        if (latest?.dataHash !== remote?.dataHash || latest?.dataUpdatedAt !== remote?.dataUpdatedAt) throw new SyncError('远程数据刚刚更新，将重新比较后同步');
        await write(conf, snapshot);
        guard(); unchangedLocal();
        // Establish explicit manual baseline without rewriting the local business data.
        GM_setValue('gistDataVersion', { updatedAt: snapshot.dataUpdatedAt, fingerprint: initial.fingerprint });
        resultTime = snapshot.dataUpdatedAt;
      } else if (direction === 'download') {
        if (!remote) throw new SyncError('远程文件不存在，无法下载', true);
        const snapshot = remote.dataUpdatedAt ? remote : await makeSnapshot(remote.data, Date.now());
        guard(); unchangedLocal();
        if (!remote.dataUpdatedAt) {
          const latest = await read(conf);
          guard(); unchangedLocal();
          if (latest?.dataHash !== remote.dataHash || latest.dataUpdatedAt !== 0) throw new SyncError('远程数据刚刚更新，请重新下载');
          await write(conf, snapshot);
          guard(); unchangedLocal();
        }
        applySnapshot(snapshot);
        resultTime = snapshot.dataUpdatedAt;
      } else if (remote) {
        // Equal content adopts the shared timestamp; no business write or ping-pong.
        GM_setValue('gistDataVersion', { updatedAt: remote.dataUpdatedAt, fingerprint: initial.fingerprint });
      }
      GM_setValue(stateKey(conf), { lastSyncSuccessAt: Date.now(), lastAttemptAt: Date.now(), lastDirection: direction, remoteUpdatedAt: resultTime } satisfies SyncState);
      options.notify(direction === 'upload' ? 'Gist 同步成功：已上传本地数据' : direction === 'download' ? 'Gist 同步成功：已下载远程数据' : 'Gist 同步成功：两端数据已一致', false);
      if (direction === 'download') options.applied();
    } catch (error) {
      if (acquired && !disposed && sameConf(conf) && lease()?.owner === owner) {
        const failure = error instanceof SyncError ? error : new SyncError('同步失败，无法完成数据读写');
        const state = getState(conf);
        const failures = (state.failures || 0) + 1;
        GM_setValue(stateKey(conf), { ...state, lastError: failure.message, failures, paused: failure.permanent,
          nextRetryAt: Math.max(failure.retryAt, Date.now() + [5, 15, 60][Math.min(failures - 1, 2)] * 60000) });
        options.notify(`Gist 同步失败：${failure.message}`, true);
      }
    } finally {
      if (acquired) release();
      busy = false;
      options.changed();
    }
  }
  return { run, isBusy: () => busy, dispose: () => { disposed = true; release(); } };
}
