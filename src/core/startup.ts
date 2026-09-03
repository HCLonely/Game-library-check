import type {
  AuthExpiredUpdateResult,
  AutoUpdateRunner,
  LibraryModule,
  ProgressPanelOptions,
  ProgressStateMap,
  ShowDialog,
  ShowToast,
  ToastType,
  UpdateResult,
  UpdateStatusConstants
} from '../shared/types';

interface StartupFlowOptions {
  showDialog: ShowDialog;
  showProgressPanel: (stateMap: ProgressStateMap, options?: ProgressPanelOptions) => void;
  clearProgressPanel: () => void;
  showToast: ShowToast;
  showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
  updateStatus: UpdateStatusConstants;
}

type PlatformRateMap = Record<string, number[]>;

function createStartupFlow({
  showDialog,
  showProgressPanel,
  clearProgressPanel,
  showToast,
  showLoginExpiredDialog,
  updateStatus
}: StartupFlowOptions) {
  let inBatchUpdateFlow = false;
  const PLATFORM_UPDATE_RATE_KEY = 'platformUpdateRate';
  const PLATFORM_LAST_UPDATE_AT_KEY = 'platformLastUpdateAt';
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const ONE_HOUR_MS = 60 * 60 * 1000;

  function sanitizePlatformRateMap(raw: unknown, now = Date.now()): PlatformRateMap {
    if (!raw || typeof raw !== 'object') return {};
    const oneHourAgo = now - ONE_HOUR_MS;
    const source = raw as Record<string, unknown>;
    const result: PlatformRateMap = {};
    Object.keys(source).forEach((key) => {
      const list = Array.isArray(source[key]) ? source[key] : [];
      result[key] = list.filter((ts): ts is number => (
        typeof ts === 'number' && Number.isFinite(ts) && ts >= oneHourAgo && ts <= now
      ));
    });
    return result;
  }

  function canRunAutoUpdate(platformKey: string, now = Date.now()): boolean {
    const rateMap = sanitizePlatformRateMap(GM_getValue<unknown>(PLATFORM_UPDATE_RATE_KEY), now);
    const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
    const tenMinutesAgo = now - TEN_MINUTES_MS;
    const oneHourAgo = now - ONE_HOUR_MS;
    const countIn10Minutes = history.filter((ts) => ts >= tenMinutesAgo).length;
    const countIn1Hour = history.filter((ts) => ts >= oneHourAgo).length;
    GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
    return countIn10Minutes < 5 && countIn1Hour < 30;
  }

  function recordAutoUpdateSuccess(platformKey: string, now = Date.now()): void {
    const rateMap = sanitizePlatformRateMap(GM_getValue<unknown>(PLATFORM_UPDATE_RATE_KEY), now);
    const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
    rateMap[platformKey] = history.concat(now).filter((ts) => ts >= now - ONE_HOUR_MS);
    GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);

    const lastUpdateMap = GM_getValue<Record<string, number>>(PLATFORM_LAST_UPDATE_AT_KEY) || {};
    lastUpdateMap[platformKey] = now;
    GM_setValue(PLATFORM_LAST_UPDATE_AT_KEY, lastUpdateMap);
  }

  async function runAutoUpdateWithRateLimit(
    libraryModule: LibraryModule,
    autoUpdateRunner: AutoUpdateRunner
  ): Promise<UpdateResult> {
    if (!libraryModule?.key || typeof autoUpdateRunner !== 'function') return false;
    if (!canRunAutoUpdate(libraryModule.key)) return false;
    const result = await autoUpdateRunner();
    if (result === true) recordAutoUpdateSuccess(libraryModule.key);
    return result;
  }

  function collectEmptyCaches(enabledModules: LibraryModule[]): string[] {
    return enabledModules.filter((libraryModule) => libraryModule.isCacheEmpty())
      .map((libraryModule) => libraryModule.key);
  }

  function showEmptyCacheAggregationDialog(
    emptyKeys: string[],
    onConfirm: (selectedKeys: string[]) => void | Promise<void>,
    onCancel?: () => void
  ): void {
    const bodyNode = document.createElement('div');
    emptyKeys.forEach((key, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.platform = key;
      input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${key.toUpperCase()}`));
      bodyNode.appendChild(label);
      if (index < emptyKeys.length - 1) bodyNode.appendChild(document.createElement('br'));
    });
    showDialog({
      title: '检测到缓存为空的平台',
      bodyNode,
      confirmText: '立即更新',
      cancelText: '稍后再说',
      onConfirm: (root) => {
        const selected = Array.from(root.querySelectorAll<HTMLInputElement>('input[data-platform]:checked'))
          .map((el) => el.dataset.platform)
          .filter((key): key is string => Boolean(key));
        onConfirm(selected);
      },
      onCancel: () => {
        if (typeof onCancel === 'function') onCancel();
      }
    });
  }

  function getSelectedPlatformKeys(root: HTMLElement): string[] {
    return Array.from(root.querySelectorAll<HTMLInputElement>('input[data-platform]:checked:not(:disabled)'))
      .map((el) => el.dataset.platform)
      .filter((key): key is string => Boolean(key));
  }

  function updateManualUpdateConfirmState(root: HTMLElement | null): void {
    if (!root) return;
    const confirmButton = root.querySelector<HTMLButtonElement>('[data-glc-confirm]');
    if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
  }

  function buildPlatformCheckboxBody(
    modules: LibraryModule[],
    onSelectionChange?: (root: HTMLElement | null) => void
  ): HTMLElement {
    const bodyNode = document.createElement('div');
    modules.forEach((libraryModule, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      const enabled = libraryModule.enabled();
      input.type = 'checkbox';
      input.dataset.platform = libraryModule.key;
      input.checked = enabled;
      input.disabled = !enabled;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${libraryModule.key.toUpperCase()}`));
      bodyNode.appendChild(label);
      if (index < modules.length - 1) bodyNode.appendChild(document.createElement('br'));
    });
    bodyNode.addEventListener('change', () => {
      if (typeof onSelectionChange === 'function') onSelectionChange(document.getElementById('glc-modal-root'));
    });
    return bodyNode;
  }

  function openManualUpdateDialogAndRun(modules: LibraryModule[]): void {
    const enabledModules = modules.filter((libraryModule) => libraryModule.enabled());
    const bodyNode = buildPlatformCheckboxBody(modules, updateManualUpdateConfirmState);
    showDialog({
      title: '更新游戏库',
      bodyNode,
      confirmText: '开始更新',
      cancelText: '取消',
      onConfirm: async (root) => {
        const selectedKeys = getSelectedPlatformKeys(root);
        if (selectedKeys.length === 0) {
          showToast('请至少选择一个平台', 'warning');
          return;
        }
        await batchUpdateSelectedModules(enabledModules, selectedKeys);
      }
    });
    updateManualUpdateConfirmState(document.getElementById('glc-modal-root'));
  }

  function extractFailureReason(failure: unknown): string {
    if (!failure) return '未知错误';
    if (typeof failure === 'string') return failure;
    if (failure instanceof Error && failure.message) return failure.message;
    if (typeof failure === 'object') {
      const details = failure as Record<string, unknown>;
      if (typeof details.message === 'string' && details.message.trim()) return details.message;
      if (typeof details.reason === 'string' && details.reason.trim()) return details.reason;
      if (typeof details.error === 'string' && details.error.trim()) return details.error;
    }
    return '未知错误';
  }

  function showUpdateFailureDialog(key: string, failure: unknown): void {
    const platform = key.toUpperCase();
    const reason = extractFailureReason(failure);
    showDialog({
      title: '平台更新失败',
      bodyText: `${platform} 更新失败：${reason}`,
      confirmText: '确认',
      hideCancel: true
    });
  }

  function isAuthExpiredResult(result: UpdateResult): result is AuthExpiredUpdateResult {
    return typeof result === 'object'
      && result !== null
      && result.status === updateStatus.AUTH_EXPIRED;
  }

  async function batchUpdateSelectedModules(
    enabledModules: LibraryModule[],
    selectedKeys: string[]
  ): Promise<void> {
    const state: ProgressStateMap = Object.fromEntries(
      selectedKeys.map((key) => [key, 'waiting'])
    );
    let interruptedByAuthExpired = false;
    inBatchUpdateFlow = true;
    showProgressPanel(state, { replace: true });
    try {
      for (const key of selectedKeys) {
        const libraryModule = enabledModules.find((item) => item.key === key);
        if (!libraryModule) continue;
        state[key] = 'running';
        showProgressPanel({ [key]: state[key] });
        try {
          const updateResult = await libraryModule.updateLibrary();
          if (updateResult === true) {
            state[key] = 'success';
          } else if (isAuthExpiredResult(updateResult)) {
            interruptedByAuthExpired = true;
            state[key] = updateStatus.AUTH_EXPIRED;
            clearProgressPanel();
            showLoginExpiredDialog(updateResult.platformName, updateResult.loginUrl);
            break;
          } else {
            state[key] = 'error';
            showUpdateFailureDialog(key, updateResult);
          }
        } catch (error) {
          console.error(error);
          state[key] = 'error';
          showUpdateFailureDialog(key, error);
        }
        if (!interruptedByAuthExpired) showProgressPanel({ [key]: state[key] });
      }
    } finally {
      inBatchUpdateFlow = false;
    }
    if (!interruptedByAuthExpired) clearProgressPanel();
  }

  async function runInitialFlow(modules: LibraryModule[]): Promise<void> {
    const enabledModules = modules.filter((libraryModule) => libraryModule.enabled());
    const emptyKeys = collectEmptyCaches(enabledModules);
    if (emptyKeys.length > 0) {
      showEmptyCacheAggregationDialog(
        emptyKeys,
        async (selectedKeys) => {
          if (selectedKeys.length > 0) await batchUpdateSelectedModules(enabledModules, selectedKeys);
          enabledModules.forEach((libraryModule) => libraryModule.start());
        },
        () => {
          enabledModules.forEach((libraryModule) => libraryModule.start());
        }
      );
      return;
    }
    enabledModules.forEach((libraryModule) => libraryModule.start());
  }

  function showUpdateStep(platform: string, text: string): void {
    showProgressPanel({ [platform]: text });
  }

  function showUpdateResult(title: string, type: ToastType): Promise<boolean> {
    if (!inBatchUpdateFlow) clearProgressPanel();
    if (type === 'error') {
      if (inBatchUpdateFlow) {
        showDialog({
          title: '平台更新失败',
          bodyText: title,
          confirmText: '确认',
          hideCancel: true
        });
        return Promise.resolve(true);
      }
      showToast(title, type);
      return Promise.resolve(true);
    }
    showToast(title, type);
    return Promise.resolve(true);
  }

  return {
    collectEmptyCaches,
    showEmptyCacheAggregationDialog,
    batchUpdateSelectedModules,
    openManualUpdateDialogAndRun,
    runInitialFlow,
    showUpdateStep,
    showUpdateResult,
    runAutoUpdateWithRateLimit
  };
}

module.exports = {
  createStartupFlow
};
