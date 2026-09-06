import type { ShowDialog, ShowToast } from '../shared/types';
import type { GistConf } from './gist-transport';
const { getGistConf, getState, stateKey, relativeTime, createSyncEngine, CONF_KEY } = require('./gist-auto-sync.ts') as typeof import('./gist-auto-sync');
const { readRemote } = require('./gist-transport.ts') as typeof import('./gist-transport');
const { localVersion } = require('./sync-data.ts') as typeof import('./sync-data');

interface Options { showDialog: ShowDialog; showToast: ShowToast; isAllowed?: () => boolean; onDataApplied?: () => void }

function createGistSyncController({ showDialog, showToast, isAllowed = () => true, onDataApplied = () => {} }: Options) {
  let menuId: unknown;
  let caption = '';
  let timer: number | undefined;
  let statusNode: HTMLElement | undefined;
  let pending: { message: string; error: boolean } | undefined;
  let active = false;
  let stateListener: number | undefined;
  let watchedState = '';
  const listeners: number[] = [];
  const notify = (message: string, error: boolean): void => {
    if (document.visibilityState === 'hidden') { pending = { message, error }; return; }
    showToast(message, error ? 'error' : 'success', { duration: error ? 10000 : 6000, closable: true });
  };
  const engineOptions = { notify, changed: refresh, applied: onDataApplied, allowed: isAllowed };
  let engine = createSyncEngine(engineOptions);
  const absolute = (at?: number): string => at ? new Date(at).toLocaleString() : '无记录';
  function refresh(): void {
    const conf = getGistConf();
    const state = getState(conf);
    if (active && typeof GM_addValueChangeListener === 'function' && watchedState !== stateKey(conf)) {
      if (stateListener !== undefined && typeof GM_removeValueChangeListener === 'function') GM_removeValueChangeListener(stateListener);
      watchedState = stateKey(conf);
      stateListener = GM_addValueChangeListener(watchedState, refresh);
    }
    let label = relativeTime(state.lastSyncSuccessAt);
    if (state.lastError) label = `同步失败 · ${state.lastSyncSuccessAt ? '上次成功 ' + relativeTime(state.lastSyncSuccessAt).replace('同步', '') : '尚未成功同步'}`;
    if (engine.isBusy()) label = '正在同步…';
    const nextCaption = `数据同步设置（${label}）`;
    if (active && nextCaption !== caption) {
      if (menuId !== undefined && typeof GM_unregisterMenuCommand === 'function') GM_unregisterMenuCommand(menuId);
      if (!caption || typeof GM_unregisterMenuCommand === 'function') menuId = GM_registerMenuCommand(nextCaption, openGistSyncDialog);
      caption = nextCaption;
    }
    if (statusNode?.isConnected) {
      const next = !conf.enabled ? '自动同步已关闭' : state.paused ? '已暂停，请处理错误后重新保存并测试' : absolute(state.nextRetryAt || (state.lastSyncSuccessAt ? state.lastSyncSuccessAt + conf.intervalHours * 3600000 : Date.now()));
      statusNode.textContent = `最近同步：${relativeTime(state.lastSyncSuccessAt)}（${absolute(state.lastSyncSuccessAt)}）\n上次结果：${state.lastDirection ? ({ upload: '已上传', download: '已下载', unchanged: '两端一致' })[state.lastDirection] : '无记录'}\n本地数据更新：${absolute(localVersion().updatedAt)}\n远程数据更新：${absolute(state.remoteUpdatedAt)}\n下次同步：${next}${state.lastError ? '\n最近错误：' + state.lastError : ''}`;
    }
  }
  function tick(): void {
    refresh();
    if (document.visibilityState !== 'hidden' && pending) { const item = pending; pending = undefined; notify(item.message, item.error); }
    void engine.run('auto', true);
  }
  function start(): void {
    if (active) return;
    engine = createSyncEngine(engineOptions);
    active = true;
    refresh();
    timer = window.setInterval(tick, 60000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pagehide', stop, { once: true });
    if (typeof GM_addValueChangeListener === 'function') {
      listeners.push(GM_addValueChangeListener(CONF_KEY, () => { refresh(); void engine.run('auto', true); }));
      listeners.push(GM_addValueChangeListener('gistDataVersion', (_key, _old, _value, remote) => { if (remote) onDataApplied(); refresh(); }));
    }
    tick();
  }
  function stop(): void {
    active = false;
    if (timer !== undefined) window.clearInterval(timer);
    document.removeEventListener('visibilitychange', tick);
    for (const id of listeners) if (typeof GM_removeValueChangeListener === 'function') GM_removeValueChangeListener(id);
    listeners.length = 0;
    if (stateListener !== undefined && typeof GM_removeValueChangeListener === 'function') GM_removeValueChangeListener(stateListener);
    stateListener = undefined;
    watchedState = '';
    engine.dispose();
  }
  window.addEventListener('pageshow', event => { if (event.persisted) start(); });
  function field(body: HTMLElement, label: string, value: string, type = 'text'): HTMLInputElement {
    const wrapper = document.createElement('label'); wrapper.className = 'glc-form-field';
    const title = document.createElement('div'); title.className = 'glc-input-label'; title.textContent = label;
    const input = document.createElement('input'); input.className = 'glc-input'; input.type = type; input.value = value;
    wrapper.appendChild(title); wrapper.appendChild(input); body.appendChild(wrapper); return input;
  }
  function openGistSyncDialog(): void {
    const conf = getGistConf();
    const body = document.createElement('div');
    const token = field(body, 'GitHub Token', conf.TOKEN, 'password');
    const gist = field(body, 'Gist ID', conf.GIST_ID);
    const file = field(body, '文件名', conf.FILE_NAME);
    const enabled = field(body, '自动同步 Gist（按数据更新时间上传或下载）', '', 'checkbox'); enabled.checked = conf.enabled;
    const interval = field(body, '同步间隔（1 小时～30 天）', String(conf.intervalHours % 24 === 0 ? conf.intervalHours / 24 : conf.intervalHours), 'number');
    interval.min = '1'; interval.step = '1';
    const unit = document.createElement('select'); unit.className = 'glc-input'; unit.setAttribute('aria-label', '同步间隔单位');
    for (const [value, text] of [['1', '小时'], ['24', '天']]) { const option = document.createElement('option'); option.value = value; option.textContent = text; unit.appendChild(option); }
    unit.value = conf.intervalHours % 24 === 0 ? '24' : '1'; body.appendChild(unit);
    const updateDisabled = (): void => { interval.disabled = unit.disabled = !enabled.checked; interval.max = unit.value === '24' ? '30' : '720'; };
    enabled.addEventListener('change', updateDisabled); unit.addEventListener('change', updateDisabled); updateDisabled();
    const note = document.createElement('p'); note.textContent = '较新整份数据覆盖较旧数据。浏览器关闭时不运行，下次打开适用网页补同步。旧备份首次使用请手动选择上传或下载建立基线。'; body.appendChild(note);
    statusNode = document.createElement('p'); statusNode.style.whiteSpace = 'pre-line'; body.appendChild(statusNode);
    const actions = document.createElement('div'); actions.className = 'glc-inline-actions'; body.appendChild(actions);
    const buttons: HTMLButtonElement[] = [];
    function button(text: string, action: () => Promise<void>): void {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'glc-inline-button'; button.textContent = text;
      button.addEventListener('click', async () => {
        if (buttons.some(item => item.disabled)) return;
        buttons.forEach(item => { item.disabled = true; });
        try { await action(); } finally { buttons.forEach(item => { item.disabled = false; }); refresh(); }
      });
      buttons.push(button); actions.appendChild(button);
    }
    const readInputs = (): GistConf => ({ TOKEN: token.value.trim(), GIST_ID: gist.value.trim(), FILE_NAME: file.value.trim(), enabled: enabled.checked, intervalHours: enabled.checked ? Number(interval.value) * Number(unit.value) : conf.intervalHours });
    button('保存配置并测试', async () => {
      const next = readInputs();
      if (!next.TOKEN || !next.GIST_ID || !next.FILE_NAME || !Number.isInteger(Number(interval.value)) || !Number.isInteger(next.intervalHours) || next.intervalHours < 1 || next.intervalHours > 720) {
        notify('请填写完整配置，间隔须为 1 小时～30 天的整数小时或天数', true); return;
      }
      try {
        // Turning automation off must work even when offline or credentials have expired.
        if (!next.enabled) GM_setValue(CONF_KEY, next);
        await readRemote(next);
        const state = getState(next);
        GM_setValue(stateKey(next), { ...state, paused: false, lastError: undefined, nextRetryAt: undefined, failures: 0 });
        GM_setValue(CONF_KEY, next);
        notify('配置已保存，连接测试成功', false);
        void engine.run('auto', true);
      } catch (error) { notify(`连接测试失败：${(error as Error).message}`, true); }
    });
    for (const [text, mode] of [['立即同步', 'auto'], ['手动上传（覆盖远程）', 'upload'], ['手动下载（覆盖本地）', 'download']] as const) {
      button(text, async () => {
        if (JSON.stringify(readInputs()) !== JSON.stringify(getGistConf())) { notify('配置已修改，请先保存配置并测试', true); return; }
        await engine.run(mode);
      });
    }
    showDialog({ title: 'Gist 数据同步设置', bodyNode: body, confirmText: '关闭', hideCancel: true });
    refresh();
  }
  return { openGistSyncDialog, start, stop };
}
module.exports = { createGistSyncController, getGistConf };
