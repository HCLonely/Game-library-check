const UPDATE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  AUTH_EXPIRED: 'auth_expired'
};

const BASE_STYLE = `
.glc-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center}
.glc-dialog{background:#fff;color:#111;padding:16px;border-radius:10px;min-width:340px;max-width:560px;font-size:14px;box-shadow:0 20px 45px rgba(0,0,0,.24)}
.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.4}
.glc-dialog-body{line-height:1.6}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
.glc-dialog-actions button{border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#111;padding:6px 12px;cursor:pointer}
.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box}
#glc-toast-container{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none}
.glc-toast{background:#1f2937;color:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,.2);pointer-events:auto;max-width:420px;word-break:break-word}
.glc-toast-error{background:#b91c1c}
.glc-toast-success{background:#15803d}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px}
.glc-progress-platform{font-weight:700}
`;

module.exports = {
  UPDATE_STATUS,
  BASE_STYLE
};
