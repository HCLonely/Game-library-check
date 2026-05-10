function createModalRoot() {
  let root = document.getElementById('glc-modal-root');
  if (root) return root;
  root = document.createElement('div');
  root.id = 'glc-modal-root';
  document.body.appendChild(root);
  return root;
}

function showDialog({ title, bodyHtml, trustedBodyHtml = false, bodyText = '', bodyNode, confirmText = '确定', cancelText = '取消', onConfirm, onCancel, denyText, onDeny, hideCancel = false }) {
  const root = createModalRoot();
  root.innerHTML = `
    <div class="glc-mask">
      <div class="glc-dialog" role="dialog" aria-modal="true">
        <h3 class="glc-dialog-title"></h3>
        <div class="glc-dialog-body"></div>
        <div class="glc-dialog-actions">
          <button type="button" data-glc-cancel></button>
          <button type="button" data-glc-deny></button>
          <button type="button" data-glc-confirm></button>
        </div>
      </div>
    </div>`;
  const maskEl = root.querySelector('.glc-mask');
  const dialogEl = root.querySelector('.glc-dialog');
  const titleEl = root.querySelector('.glc-dialog-title');
  const bodyEl = root.querySelector('.glc-dialog-body');
  const cancelBtn = root.querySelector('[data-glc-cancel]');
  const denyBtn = root.querySelector('[data-glc-deny]');
  const confirmBtn = root.querySelector('[data-glc-confirm]');
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
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKeydown);
    maskEl?.removeEventListener('click', onMaskClick);
    root.innerHTML = '';
  };

  const runAndClose = (callback) => {
    try {
      if (typeof callback === 'function') callback(root);
    } finally {
      close();
    }
  };

  const onKeydown = (event) => {
    if (closed) return;
    if (event.key === 'Escape') runAndClose(onCancel);
  };

  const onMaskClick = (event) => {
    if (closed) return;
    if (event.target === maskEl) runAndClose(onCancel);
  };

  document.addEventListener('keydown', onKeydown);
  maskEl?.addEventListener('click', onMaskClick);
  dialogEl?.addEventListener('click', (event) => event.stopPropagation());

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
