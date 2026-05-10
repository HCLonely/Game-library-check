function createStartupFlow({ showDialog, showProgressPanel, clearProgressPanel, showToast, showLoginExpiredDialog, updateStatus }) {
  let inBatchUpdateFlow = false;

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
            showToast(`${key.toUpperCase()} 更新失败`, 'error');
          }
        } catch (error) {
          console.error(error);
          state[key] = 'error';
          showToast(`${key.toUpperCase()} 更新失败`, 'error');
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
    showUpdateResult
  };
}

module.exports = {
  createStartupFlow
};
