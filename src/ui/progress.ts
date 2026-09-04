import type { ProgressPanelOptions, ProgressStateMap } from '../shared/types';

/** 创建由共享模态框根节点承载的进度面板控制器。 */
function createProgressController(createModalRoot: () => HTMLElement) {
  let progressPanelStateMap: ProgressStateMap = {};

  /** 合并或替换进度状态，然后重新渲染进度面板。 */
  function showProgressPanel(
    stateMap: ProgressStateMap,
    { replace = false }: ProgressPanelOptions = {}
  ): void {
    if (replace) {
      progressPanelStateMap = { ...(stateMap || {}) };
    } else {
      progressPanelStateMap = { ...progressPanelStateMap, ...(stateMap || {}) };
    }
    const root = createModalRoot();
    root.innerHTML = `
      <div class="glc-mask">
        <div class="glc-dialog glc-progress-dialog" role="dialog" aria-modal="true">
          <h3 class="glc-dialog-title"></h3>
          <ul class="glc-progress-list"></ul>
        </div>
      </div>`;
    const titleEl = root.querySelector<HTMLElement>('.glc-dialog-title');
    const listEl = root.querySelector<HTMLUListElement>('.glc-progress-list');
    if (titleEl) titleEl.textContent = '正在更新缓存';
    if (listEl) {
      Object.entries(progressPanelStateMap).forEach(([platform, state]) => {
        const li = document.createElement('li');
        li.className = 'glc-progress-row';
        const platformEl = document.createElement('span');
        platformEl.className = 'glc-progress-platform';
        platformEl.textContent = String(platform).toUpperCase();
        const stateEl = document.createElement('span');
        stateEl.className = 'glc-progress-state';
        stateEl.textContent = String(state);
        li.appendChild(platformEl);
        li.appendChild(stateEl);
        listEl.appendChild(li);
      });
    }
  }

  /** 清除已存储的进度状态，并移除已渲染的进度面板。 */
  function clearProgressPanel(): void {
    progressPanelStateMap = {};
    const root = createModalRoot();
    if (root.querySelector('.glc-progress-dialog')) root.innerHTML = '';
  }

  return {
    showProgressPanel,
    clearProgressPanel
  };
}

module.exports = {
  createProgressController
};
