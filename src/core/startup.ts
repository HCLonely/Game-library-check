const { trackLibraryUpdate } = require('./sync-data.ts') as typeof import('./sync-data');
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
  /** 为启动流程打开选择和确认对话框。 */
  showDialog: ShowDialog;
  /** 显示当前各平台的更新进度。 */
  showProgressPanel: (stateMap: ProgressStateMap, options?: ProgressPanelOptions) => void;
  /** 移除当前显示的更新进度。 */
  clearProgressPanel: () => void;
  /** 显示面向用户的启动和更新反馈。 */
  showToast: ShowToast;
  /** 当平台会话过期时，提示用户重新认证。 */
  showLoginExpiredDialog: (platformName: string, loginUrl: string) => void;
  updateStatus: UpdateStatusConstants;
}

type PlatformRateMap = Record<string, number[]>;

/**
 * 创建启动和更新编排控制器。
 *
 * @param options - UI 依赖项和更新状态常量。
 * @returns 用于自动更新、初始更新和手动选择游戏库更新的方法。
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
   * 规范化持久化的更新时间戳，并移除前一小时范围外的条目。
   *
   * @param raw - 不可信的存储值。
   * @param now - 用于筛选的参考时间戳。
   * @returns 各平台位于时间窗口内的数值时间戳。
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
   * 检查各平台的自动更新限制，并持久化经清理的频率历史记录。
   *
   * 十分钟内少于五次、一个小时内少于 30 次运行时允许更新。
   *
   * @param platformKey - 要评估的平台。
   * @param now - 用于速率限制的参考时间戳。
   * @returns 是否可以运行自动更新。
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
   * 在频率历史记录和最后更新时间存储中记录一次成功的自动更新。
   *
   * @param platformKey - 已更新的平台。
   * @param now - 要记录的时间戳。
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
   * 仅在模块和速率限制允许时运行自动更新器。
   *
   * 成功运行会更新持久化频率历史记录；无效输入或受速率限制的运行返回 `false`。
   *
   * @param libraryModule - 正在更新的平台模块。
   * @param autoUpdateRunner - 执行更新的函数。
   * @returns 更新器的结果；未运行时返回 `false`。
   */
  async function runAutoUpdateWithRateLimit(
    libraryModule: LibraryModule,
    autoUpdateRunner: AutoUpdateRunner
  ): Promise<UpdateResult> {
    if (!libraryModule?.key || typeof autoUpdateRunner !== 'function') return false;
    if (!canRunAutoUpdate(libraryModule.key)) return false;
    const result = await trackLibraryUpdate(autoUpdateRunner);
    if (result === true) recordAutoUpdateSuccess(libraryModule.key);
    return result;
  }

  /**
   * 列出当前没有缓存游戏库数据的已启用模块。
   *
   * @param enabledModules - 要检查的模块。
   * @returns 缓存为空的模块键。
   */
  function collectEmptyCaches(enabledModules: LibraryModule[]): string[] {
    return enabledModules.filter((libraryModule) => libraryModule.isCacheEmpty())
      .map((libraryModule) => libraryModule.key);
  }

  /**
   * 打开对话框，让用户选择要更新的缓存为空的平台。
   *
   * @param emptyKeys - 缓存为空的平台键。
   * @param onConfirm - 用户开始更新时接收已勾选的平台键。
   * @param onCancel - 对话框关闭时的可选回调。
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
   * 从对话框根元素读取已勾选且启用的平台键。
   *
   * @param root - 对话框内容根元素。
   * @returns 已选择的平台键。
   */
  function getSelectedPlatformKeys(root: HTMLElement): string[] {
    return Array.from(root.querySelectorAll<HTMLInputElement>('input[data-platform]:checked:not(:disabled)'))
      .map((el) => el.dataset.platform)
      .filter((key): key is string => Boolean(key));
  }

  /**
   * 仅当已选择平台时启用手动更新确认按钮。
   *
   * @param root - 模态框根元素（如当前已挂载）。
   */
  function updateManualUpdateConfirmState(root: HTMLElement | null): void {
    if (!root) return;
    const confirmButton = root.querySelector<HTMLButtonElement>('[data-glc-confirm]');
    if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
  }

  /**
   * 为手动平台选择构建复选框控件。
   *
   * 已禁用模块会显示，但不可选择。
   *
   * @param modules - 要显示的模块。
   * @param onSelectionChange - 复选框更改后的可选回调。
   * @returns 包含平台复选框的对话框主体。
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
   * 打开手动更新选择器，并在确认后运行已选择且启用的模块。
   *
   * @param modules - 可用的游戏库模块。
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
   * 从失败的更新结果或抛出的值中提取用户可见的错误消息。
   *
   * @param failure - 要检查的失败值。
   * @returns 有明确原因时返回该原因；否则返回本地化的未知错误消息。
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
   * 打开描述单个平台更新失败的模态框。
   *
   * @param key - 失败的平台键。
   * @param failure - 用于说明失败原因的结果或错误。
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
   * 将更新结果收窄为认证过期的结果类型。
   *
   * @param result - 要检查的更新结果。
   * @returns 该结果是否表示用户必须重新登录。
   */
  function isAuthExpiredResult(result: UpdateResult): result is AuthExpiredUpdateResult {
    return typeof result === 'object'
      && result !== null
      && result.status === updateStatus.AUTH_EXPIRED;
  }

  /**
   * 按顺序更新已选择的平台，同时报告进度和各平台的失败情况。
   *
   * 认证过期会停止剩余工作、清除进度并打开登录对话框；否则，在尝试完所有已选择模块后
   * 清除进度面板。
   *
   * @param enabledModules - 有资格运行的模块。
   * @param selectedKeys - 用户选择的平台键。
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
          const updateResult = await trackLibraryUpdate(() => libraryModule.updateLibrary());
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
   * 启动已启用的模块；当任一已启用缓存为空时，先提供批量更新。
   *
   * @param modules - 可用的游戏库模块。
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
   * 显示单个平台的增量进度消息。
   *
   * @param platform - 进度发生变化的平台。
   * @param text - 要显示的进度文本。
   */
  function showUpdateStep(platform: string, text: string): void {
    showProgressPanel({ [platform]: text });
  }

  /**
   * 显示更新结果；批量更新错误使用模态框，其他情况使用提示消息。
   *
   * @param title - 结果文本。
   * @param type - 提示消息严重程度。
   * @returns 显示结果后已完成的确认结果。
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
