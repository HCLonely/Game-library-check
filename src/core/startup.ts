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

/**
 * Creates the startup and update orchestration controller.
 *
 * @param options - UI dependencies and update-status constants.
 * @returns Methods for automatic, initial, and manually selected library updates.
 */
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

  /**
   * Normalizes persisted update timestamps and removes entries outside the prior hour.
   *
   * @param raw - Untrusted storage value.
   * @param now - Reference timestamp used for filtering.
   * @returns Per-platform, in-window numeric timestamps.
   */
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

  /**
   * Checks the per-platform automatic-update limits and persists the sanitized rate history.
   *
   * Allows fewer than five runs in ten minutes and fewer than 30 in one hour.
   *
   * @param platformKey - Platform to evaluate.
   * @param now - Reference timestamp for rate limiting.
   * @returns Whether an automatic update may run.
   */
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

  /**
   * Records a successful automatic update in rate-history and last-update storage.
   *
   * @param platformKey - Updated platform.
   * @param now - Timestamp to record.
   */
  function recordAutoUpdateSuccess(platformKey: string, now = Date.now()): void {
    const rateMap = sanitizePlatformRateMap(GM_getValue<unknown>(PLATFORM_UPDATE_RATE_KEY), now);
    const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
    rateMap[platformKey] = history.concat(now).filter((ts) => ts >= now - ONE_HOUR_MS);
    GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);

    const lastUpdateMap = GM_getValue<Record<string, number>>(PLATFORM_LAST_UPDATE_AT_KEY) || {};
    lastUpdateMap[platformKey] = now;
    GM_setValue(PLATFORM_LAST_UPDATE_AT_KEY, lastUpdateMap);
  }

  /**
   * Runs an automatic updater only when the module and rate limit permit it.
   *
   * Successful runs update the persisted rate history; invalid inputs or rate-limited runs return `false`.
   *
   * @param libraryModule - Platform module being updated.
   * @param autoUpdateRunner - Function that performs the update.
   * @returns The runner's result, or `false` when it was not run.
   */
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

  /**
   * Lists enabled modules that currently have no cached library data.
   *
   * @param enabledModules - Modules to inspect.
   * @returns Keys for modules with empty caches.
   */
  function collectEmptyCaches(enabledModules: LibraryModule[]): string[] {
    return enabledModules.filter((libraryModule) => libraryModule.isCacheEmpty())
      .map((libraryModule) => libraryModule.key);
  }

  /**
   * Opens a dialog that lets the user choose empty-cache platforms to update.
   *
   * @param emptyKeys - Platform keys with empty caches.
   * @param onConfirm - Receives checked keys when the user starts updates.
   * @param onCancel - Optional callback when the dialog is dismissed.
   */
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

  /**
   * Reads checked, enabled platform keys from a dialog root.
   *
   * @param root - Dialog content root.
   * @returns Selected platform keys.
   */
  function getSelectedPlatformKeys(root: HTMLElement): string[] {
    return Array.from(root.querySelectorAll<HTMLInputElement>('input[data-platform]:checked:not(:disabled)'))
      .map((el) => el.dataset.platform)
      .filter((key): key is string => Boolean(key));
  }

  /**
   * Enables the manual-update confirmation button only when a platform is selected.
   *
   * @param root - Modal root, if it is currently mounted.
   */
  function updateManualUpdateConfirmState(root: HTMLElement | null): void {
    if (!root) return;
    const confirmButton = root.querySelector<HTMLButtonElement>('[data-glc-confirm]');
    if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
  }

  /**
   * Builds checkbox controls for manual platform selection.
   *
   * Disabled modules are shown but cannot be selected.
   *
   * @param modules - Modules to display.
   * @param onSelectionChange - Optional callback after checkbox changes.
   * @returns Dialog body containing the platform checkboxes.
   */
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

  /**
   * Opens the manual update picker and runs the selected enabled modules after confirmation.
   *
   * @param modules - Available library modules.
   */
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

  /**
   * Extracts a user-visible error message from a failed update result or thrown value.
   *
   * @param failure - Failure value to inspect.
   * @returns A specific reason when available, otherwise the localized unknown-error message.
   */
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

  /**
   * Opens a modal describing an update failure for one platform.
   *
   * @param key - Failed platform key.
   * @param failure - Result or error that explains the failure.
   */
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

  /**
   * Narrows an update result to the authentication-expired outcome.
   *
   * @param result - Update result to inspect.
   * @returns Whether the result signals that the user must log in again.
   */
  function isAuthExpiredResult(result: UpdateResult): result is AuthExpiredUpdateResult {
    return typeof result === 'object'
      && result !== null
      && result.status === updateStatus.AUTH_EXPIRED;
  }

  /**
   * Updates selected platforms sequentially while reporting progress and per-platform failures.
   *
   * Authentication expiry stops remaining work, clears progress, and opens the login dialog; otherwise the
   * progress panel is cleared after all selected modules have been attempted.
   *
   * @param enabledModules - Modules eligible to run.
   * @param selectedKeys - Platform keys selected by the user.
   */
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

  /**
   * Starts enabled modules, first offering a batch update when any enabled cache is empty.
   *
   * @param modules - Available library modules.
   */
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

  /**
   * Displays an incremental progress message for one platform.
   *
   * @param platform - Platform whose progress changed.
   * @param text - Progress text to show.
   */
  function showUpdateStep(platform: string, text: string): void {
    showProgressPanel({ [platform]: text });
  }

  /**
   * Shows an update outcome, using a modal for batch-update errors and toasts otherwise.
   *
   * @param title - Outcome text.
   * @param type - Toast severity.
   * @returns A resolved acknowledgement promise after the outcome has been shown.
   */
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
