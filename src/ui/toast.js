function createToastContainer() {
  let container = document.getElementById('glc-toast-container');
  if (container) return container;
  container = document.createElement('div');
  container.id = 'glc-toast-container';
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = 'info', options = {}) {
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
