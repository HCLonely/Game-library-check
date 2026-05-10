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
  el.className = `glc-toast glc-toast-${type}`;
  el.textContent = message;
  createToastContainer().appendChild(el);
  window.setTimeout(() => el.remove(), 4000);
}

module.exports = {
  createToastContainer,
  showToast
};
