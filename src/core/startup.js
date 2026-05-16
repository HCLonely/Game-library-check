function createStartupFlow({ showDialog, showProgressPanel, clearProgressPanel, showToast, showLoginExpiredDialog, updateStatus }) {
  let inBatchUpdateFlow = false;
  const PLATFORM_UPDATE_RATE_KEY = 'platformUpdateRate';
  const PLATFORM_LAST_UPDATE_AT_KEY = 'platformLastUpdateAt';
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const ONE_HOUR_MS = 60 * 60 * 1000;

  function sanitizePlatformRateMap(raw, now = Date.now()) {
    if (!raw || typeof raw !== 'object') return {};
    const oneHourAgo = now - ONE_HOUR_MS;
    const result = {};
    Object.keys(raw).forEach((key) => {
      const list = Array.isArray(raw[key]) ? raw[key] : [];
      result[key] = list.filter((ts) => Number.isFinite(ts) && ts >= oneHourAgo && ts <= now);
    });
    return result;
  }

  function canRunAutoUpdate(platformKey, now = Date.now()) {
    const rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY) || {}, now);
    const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
    const tenMinutesAgo = now - TEN_MINUTES_MS;
    const oneHourAgo = now - ONE_HOUR_MS;
    const countIn10Minutes = history.filter((ts) => ts >= tenMinutesAgo).length;
    const countIn1Hour = history.filter((ts) => ts >= oneHourAgo).length;
    GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);
    return countIn10Minutes < 5 && countIn1Hour < 30;
  }

  function recordAutoUpdateSuccess(platformKey, now = Date.now()) {
    const rateMap = sanitizePlatformRateMap(GM_getValue(PLATFORM_UPDATE_RATE_KEY) || {}, now);
    const history = Array.isArray(rateMap[platformKey]) ? rateMap[platformKey] : [];
    rateMap[platformKey] = history.concat(now).filter((ts) => ts >= now - ONE_HOUR_MS);
    GM_setValue(PLATFORM_UPDATE_RATE_KEY, rateMap);

    const lastUpdateMap = GM_getValue(PLATFORM_LAST_UPDATE_AT_KEY) || {};
    lastUpdateMap[platformKey] = now;
    GM_setValue(PLATFORM_LAST_UPDATE_AT_KEY, lastUpdateMap);
  }

  async function runAutoUpdateWithRateLimit(module, autoUpdateRunner) {
    if (!module?.key || typeof autoUpdateRunner !== 'function') return false;
    if (!canRunAutoUpdate(module.key)) return false;
    const result = await autoUpdateRunner();
    if (result === true) recordAutoUpdateSuccess(module.key);
    return result;
  }

  function collectEmptyCaches(enabledModules) {
    return enabledModules.filter((module) => module.isCacheEmpty()).map((module) => module.key);
  }

  function showEmptyCacheAggregationDialog(emptyKeys, onConfirm, onCancel) {
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
        const selected = Array.from(root.querySelectorAll('input[data-platform]:checked'))
          .map((el) => el.getAttribute('data-platform'));
        onConfirm(selected);
      },
      onCancel: () => {
        if (typeof onCancel === 'function') onCancel();
      }
    });
  }

  function getSelectedPlatformKeys(root) {
    return Array.from(root.querySelectorAll('input[data-platform]:checked:not(:disabled)'))
      .map((el) => el.getAttribute('data-platform'));
  }

  function updateManualUpdateConfirmState(root) {
    if (!root) return;
    const confirmButton = root.querySelector('[data-glc-confirm]');
    if (confirmButton) confirmButton.disabled = getSelectedPlatformKeys(root).length === 0;
  }

  function buildPlatformCheckboxBody(modules, onSelectionChange) {
    const bodyNode = document.createElement('div');
    modules.forEach((module, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      const enabled = module.enabled();
      input.type = 'checkbox';
      input.dataset.platform = module.key;
      input.checked = enabled;
      input.disabled = !enabled;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${module.key.toUpperCase()}`));
      bodyNode.appendChild(label);
      if (index < modules.length - 1) bodyNode.appendChild(document.createElement('br'));
    });
    bodyNode.addEventListener('change', () => {
      if (typeof onSelectionChange === 'function') onSelectionChange(document.getElementById('glc-modal-root'));
    });
    return bodyNode;
  }

  function openManualUpdateDialogAndRun(modules) {
    const enabledModules = modules.filter((module) => module.enabled());
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

  function extractFailureReason(failure) {
    if (!failure) return '未知错误';
    if (typeof failure === 'string') return failure;
    if (failure instanceof Error && failure.message) return failure.message;
    if (typeof failure.message === 'string' && failure.message.trim()) return failure.message;
    if (typeof failure.reason === 'string' && failure.reason.trim()) return failure.reason;
    if (typeof failure.error === 'string' && failure.error.trim()) return failure.error;
    return '未知错误';
  }

  function showUpdateFailureDialog(key, failure) {
    const platform = key.toUpperCase();
    const reason = extractFailureReason(failure);
    showDialog({
      title: '平台更新失败',
      bodyText: `${platform} 更新失败：${reason}`,
      confirmText: '我知道了',
      hideCancel: true
    });
  }

  async function batchUpdateSelectedModules(enabledModules, selectedKeys) {
    const state = Object.fromEntries(selectedKeys.map((key) => [key, 'waiting']));
    let interruptedByAuthExpired = false;
    inBatchUpdateFlow = true;
    showProgressPanel(state, { replace: true });
    try {
      for (const key of selectedKeys) {
        const module = enabledModules.find((item) => item.key === key);
        if (!module) continue;
        state[key] = 'running';
        showProgressPanel({ [key]: state[key] });
        try {
          const updateResult = await module.updateLibrary();
          if (updateResult === true) {
            state[key] = 'success';
          } else if (updateResult?.status === updateStatus.AUTH_EXPIRED) {
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

  async function runInitialFlow(modules) {
    const enabledModules = modules.filter((module) => module.enabled());
    const emptyKeys = collectEmptyCaches(enabledModules);
    if (emptyKeys.length > 0) {
      showEmptyCacheAggregationDialog(
        emptyKeys,
        async (selectedKeys) => {
          if (selectedKeys.length > 0) await batchUpdateSelectedModules(enabledModules, selectedKeys);
          enabledModules.forEach((module) => module.start());
        },
        () => {
          enabledModules.forEach((module) => module.start());
        }
      );
      return;
    }
    enabledModules.forEach((module) => module.start());
  }

  function showUpdateStep(platform, text) {
    showProgressPanel({ [platform]: text });
  }

  function showUpdateResult(title, type) {
    if (!inBatchUpdateFlow) clearProgressPanel();
    if (type === 'error') {
      showDialog({
        title: '平台更新失败',
        bodyText: title,
        confirmText: '我知道了',
        hideCancel: true
      });
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
