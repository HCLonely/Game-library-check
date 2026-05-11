function createToastContainer() {
  let container = document.getElementById('glc-toast-container');
  if (container) return container;
  container = document.createElement('div');
  container.id = 'glc-toast-container';
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `glc-toast glc-toast-content glc-toast-${type}`;
  el.textContent = message;
  el.classList.add('glc-toast-enter');
  createToastContainer().appendChild(el);

  window.setTimeout(() => {
    el.classList.remove('glc-toast-enter');
    el.classList.add('glc-toast-leave');
    window.setTimeout(() => el.remove(), 140);
  }, 6000);
}

module.exports = {
  createToastContainer,
  showToast
};
