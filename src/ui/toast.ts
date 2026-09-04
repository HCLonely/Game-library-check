import type { ToastOptions, ToastType } from '../shared/types';

/** 返回共享的提示消息容器；若不存在则创建并追加该容器。 */
function createToastContainer(): HTMLElement {
  let container = document.getElementById('glc-toast-container');
  if (container) return container;
  container = document.createElement('div');
  container.id = 'glc-toast-container';
  document.body.appendChild(container);
  return container;
}

/** 显示指定类型的提示消息，可选地附带链接、关闭按钮和定时关闭功能。 */
function showToast(
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
): void {
  const el = document.createElement('div');
  el.className = `glc-toast glc-toast-content glc-toast-${type}`;
  el.textContent = message;

  if (options?.link?.href) {
    const link = document.createElement('a');
    link.href = options.link.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = options.link.text || options.link.href;
    link.className = 'glc-toast-link';
    el.appendChild(document.createTextNode(' '));
    el.appendChild(link);
  }

  if (options?.closable) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'glc-toast-close';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => el.remove());
    el.appendChild(document.createTextNode(' '));
    el.appendChild(closeButton);
  }

  el.classList.add('glc-toast-enter');
  createToastContainer().appendChild(el);

  const duration = typeof options.duration === 'number' ? options.duration : 6000;
  if (duration <= 0) return;

  window.setTimeout(() => {
    el.classList.remove('glc-toast-enter');
    el.classList.add('glc-toast-leave');
    window.setTimeout(() => el.remove(), 140);
  }, duration);
}

module.exports = {
  createToastContainer,
  showToast
};
