import type { DialogOptions } from '../shared/types';

let activeDialogClose: (() => void) | null = null;

/** 返回共享的模态框挂载点；若不存在则创建并追加该挂载点。 */
function createModalRoot(): HTMLElement {
  let root = document.getElementById('glc-modal-root');
  if (root) return root;
  root = document.createElement('div');
  root.id = 'glc-modal-root';
  document.body.appendChild(root);
  return root;
}

/** 替换当前活动的对话框，并管理其按钮、回调、键盘事件和遮罩层生命周期。 */
function showDialog({
  title,
  bodyHtml,
  trustedBodyHtml = false,
  bodyText = '',
  bodyNode,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  denyText,
  onDeny,
  hideCancel = false
}: DialogOptions): void {
  if (typeof activeDialogClose === 'function') {
    activeDialogClose();
  }

  const root = createModalRoot();
  root.innerHTML = `
    <div class="glc-mask">
      <div class="glc-dialog glc-dialog-shell" role="dialog" aria-modal="true">
        <h3 class="glc-dialog-title glc-dialog-header"></h3>
        <div class="glc-dialog-body glc-dialog-content"></div>
        <div class="glc-dialog-actions">
          <button type="button" data-glc-cancel></button>
          <button type="button" data-glc-deny></button>
          <button type="button" data-glc-confirm></button>
        </div>
      </div>
    </div>`;
  const maskEl = root.querySelector<HTMLElement>('.glc-mask');
  const titleEl = root.querySelector<HTMLElement>('.glc-dialog-title');
  const bodyEl = root.querySelector<HTMLElement>('.glc-dialog-body');
  const cancelBtn = root.querySelector<HTMLButtonElement>('[data-glc-cancel]');
  const denyBtn = root.querySelector<HTMLButtonElement>('[data-glc-deny]');
  const confirmBtn = root.querySelector<HTMLButtonElement>('[data-glc-confirm]');
  if (titleEl) titleEl.textContent = title || '';
  if (bodyEl) {
    bodyEl.textContent = '';
    if (bodyNode instanceof Node) {
      bodyEl.replaceChildren(bodyNode);
    } else if (trustedBodyHtml && typeof bodyHtml === 'string') {
      bodyEl.innerHTML = bodyHtml;
    } else {
      bodyEl.textContent = bodyText || '';
    }
  }
  if (cancelBtn) {
    cancelBtn.textContent = cancelText;
    cancelBtn.style.display = hideCancel ? 'none' : '';
  }
  if (denyBtn) {
    denyBtn.textContent = denyText || '';
    denyBtn.style.display = denyText ? '' : 'none';
  }
  if (confirmBtn) confirmBtn.textContent = confirmText;

  let closed = false;
  /** 关闭当前活动的对话框，并移除其事件监听器。 */
  const close = (): void => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKeydown);
    maskEl?.removeEventListener('click', onMaskClick);
    if (activeDialogClose === close) {
      activeDialogClose = null;
    }
    root.innerHTML = '';
  };

  /** 在关闭对话框前调用可选的对话框操作。 */
  const runAndClose = (callback?: (root: HTMLElement) => void | Promise<void>): void => {
    try {
      if (typeof callback === 'function') callback(root);
    } finally {
      close();
    }
  };

  /** 按下 Escape 快捷键时关闭对话框。 */
  const onKeydown = (event: KeyboardEvent): void => {
    if (closed) return;
    if (event.key === 'Escape') runAndClose(onCancel);
  };

  /** 用户点击对话框周围的遮罩层时关闭对话框。 */
  const onMaskClick = (event: MouseEvent): void => {
    if (closed) return;
    if (event.target !== maskEl) return;
    runAndClose(onCancel);
  };

  activeDialogClose = close;
  document.addEventListener('keydown', onKeydown);
  maskEl?.addEventListener('click', onMaskClick);

  cancelBtn?.addEventListener('click', () => {
    if (closed) return;
    runAndClose(onCancel);
  });
  denyBtn?.addEventListener('click', () => {
    if (closed) return;
    runAndClose(onDeny);
  });
  confirmBtn?.addEventListener('click', () => {
    if (closed) return;
    runAndClose(onConfirm);
  });
}

module.exports = {
  createModalRoot,
  showDialog
};
