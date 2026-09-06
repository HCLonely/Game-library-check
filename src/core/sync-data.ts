/** Only business data travels between devices. Credentials and runtime state stay local. */
export const SYNC_KEYS = ['ownedGames', 'epicWishist', 'gogGames', 'itchGames', 'cubeGames', 'IG-Owned', 'globalSettings', 'whiteList', 'blackList'] as const;
const VERSION_KEY = 'gistDataVersion';
/** A per-update lease prevents applying a download while a library request is in flight. */
export async function trackLibraryUpdate<T>(work: () => T | Promise<T>): Promise<T> {
  const key = `gistLibraryUpdate:${Date.now()}:${Math.random()}`;
  GM_setValue(key, Date.now() + 900000);
  const heartbeat = setInterval(() => GM_setValue(key, Date.now() + 900000), 60000);
  try { return await work(); }
  finally { clearInterval(heartbeat); GM_deleteValue(key); }
}
export function libraryUpdateInProgress(): boolean {
  let updating = false;
  for (const key of GM_listValues()) {
    if (!key.startsWith('gistLibraryUpdate:')) continue;
    if (Number(GM_getValue(key)) > Date.now()) updating = true;
    else GM_deleteValue(key);
  }
  return updating;
}
export interface Snapshot {
  schemaVersion: 2;
  dataUpdatedAt: number;
  dataHash: string;
  data: Record<string, unknown>;
}

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).sort().join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}

function businessValue(key: string, value: unknown): unknown {
  if (key === 'IG-Owned' && value && typeof value === 'object') return { games: (value as { games: unknown }).games };
  return value;
}

export function readData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const key of SYNC_KEYS) {
    const value = GM_getValue(key);
    if (value !== undefined) data[key] = businessValue(key, value);
  }
  return data;
}

/** Called only at a completed library/settings write, never during synchronization. */
export function setSyncValue(key: string, value: unknown): void {
  const changed = canonical(businessValue(key, GM_getValue(key))) !== canonical(businessValue(key, value));
  GM_setValue(key, value);
  if (changed) {
    const previous = GM_getValue<{ updatedAt: number }>(VERSION_KEY);
    GM_setValue(VERSION_KEY, { updatedAt: Math.max(Date.now(), (previous?.updatedAt || 0) + 1), fingerprint: canonical(readData()) });
  }
}

export function localVersion(): { data: Record<string, unknown>; updatedAt: number; fingerprint: string } {
  const data = readData();
  const fingerprint = canonical(data);
  const version = GM_getValue<{ updatedAt: number; fingerprint: string }>(VERSION_KEY);
  return { data, fingerprint, updatedAt: version?.fingerprint === fingerprint ? version.updatedAt : 0 };
}

export async function hashData(data: Record<string, unknown>): Promise<string> {
  const bytes = new TextEncoder().encode(canonical(data));
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    const { sha256 } = require('./sha256.ts') as typeof import('./sha256');
    return sha256(bytes);
  }
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function makeSnapshot(data: Record<string, unknown>, updatedAt: number): Promise<Snapshot> {
  return { schemaVersion: 2, dataUpdatedAt: updatedAt, dataHash: await hashData(data), data };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

/** Validate every whitelisted value before any writes, including legacy backups. */
export function validateData(raw: unknown): Record<string, unknown> {
  if (!isRecord(raw)) throw new Error('远程备份格式无效');
  const data: Record<string, unknown> = {};
  const strings = (v: unknown): boolean => Array.isArray(v) && v.every(x => typeof x === 'string');
  for (const key of SYNC_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
    const value = raw[key];
    let valid = false;
    if (['gogGames', 'itchGames', 'whiteList', 'blackList'].includes(key)) valid = strings(value);
    if (key === 'cubeGames') valid = Array.isArray(value) && value.every(x => typeof x === 'number' && Number.isFinite(x));
    if (key === 'IG-Owned') valid = isRecord(value) && strings(value.games);
    if (key === 'ownedGames' || key === 'epicWishist') valid = Array.isArray(value) && value.every(x => isRecord(x) && typeof x.offerId === 'string' && strings(x.pageSlug) && (key !== 'ownedGames' || typeof x.namespace === 'string'));
    if (key === 'globalSettings') valid = isRecord(value) && strings(value.whiteList) && strings(value.blackList) && isRecord(value.platformEnabled) && Object.values(value.platformEnabled).every(x => typeof x === 'boolean');
    if (!valid) throw new Error(`远程备份中的 ${key} 格式无效`);
    data[key] = businessValue(key, value);
  }
  if (!Object.keys(data).length) throw new Error('备份没有可同步的数据');
  return data;
}

export async function parseSnapshot(raw: unknown): Promise<Snapshot> {
  if (!isRecord(raw)) throw new Error('远程备份格式无效');
  if (!('schemaVersion' in raw)) return makeSnapshot(validateData(raw), 0);
  if (raw.schemaVersion !== 2) throw new Error('不支持的备份版本');
  if (!Number.isSafeInteger(raw.dataUpdatedAt) || Number(raw.dataUpdatedAt) <= 0 || Number(raw.dataUpdatedAt) > Date.now() + 300000) throw new Error('备份时间无效，请检查设备时间');
  const snapshot = await makeSnapshot(validateData(raw.data), Number(raw.dataUpdatedAt));
  if (snapshot.dataHash !== raw.dataHash) throw new Error('备份内容校验失败');
  return snapshot;
}

export function chooseDirection(local: Snapshot, remote: Snapshot | null): 'upload' | 'download' | 'unchanged' {
  if (!Number.isSafeInteger(local.dataUpdatedAt) || local.dataUpdatedAt < 0 || local.dataUpdatedAt > Date.now() + 300000) throw new Error('本地数据时间异常，请检查设备时间');
  if (!remote) {
    if (local.dataUpdatedAt > 0 && Object.keys(local.data).length) return 'upload';
    throw new Error('本地数据没有更新时间，请手动上传建立基线');
  }
  if (local.dataHash === remote.dataHash && remote.dataUpdatedAt > 0) return 'unchanged';
  if (!Object.keys(local.data).length && remote.dataUpdatedAt > 0) return 'download';
  if (!local.dataUpdatedAt || !remote.dataUpdatedAt) throw new Error('旧数据缺少更新时间，请手动选择上传或下载建立基线');
  if (local.dataUpdatedAt === remote.dataUpdatedAt) throw new Error('两端时间相同但内容不同，请手动选择上传或下载');
  return local.dataUpdatedAt > remote.dataUpdatedAt ? 'upload' : 'download';
}

/** Replace the complete shared snapshot and roll back if any storage write fails. */
export function applySnapshot(snapshot: Snapshot): void {
  const old = new Map<string, unknown>([...SYNC_KEYS, VERSION_KEY, 'version'].map(key => [key, GM_getValue(key)]));
  try {
    for (const key of SYNC_KEYS) {
      if (Object.prototype.hasOwnProperty.call(snapshot.data, key)) GM_setValue(key, snapshot.data[key]);
      else GM_deleteValue(key);
    }
    // Prevent the pre-1.1 Epic migration from deleting an imported library.
    if ('ownedGames' in snapshot.data) GM_setValue('version', '1.1');
    GM_setValue(VERSION_KEY, { updatedAt: snapshot.dataUpdatedAt, fingerprint: canonical(snapshot.data) });
  } catch (error) {
    for (const [key, value] of old) {
      if (value === undefined) GM_deleteValue(key); else GM_setValue(key, value);
    }
    throw error;
  }
}
