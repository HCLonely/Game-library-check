const UPDATE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  AUTH_EXPIRED: 'auth_expired'
};

const BASE_STYLE = `
.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}
.glc-dialog{background:#fff;color:#0f172a;border:1px solid #e2e8f0;padding:16px;border-radius:12px;min-width:340px;max-width:560px;font-size:14px;box-shadow:0 16px 36px rgba(15,23,42,.18)}
.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.4;color:#0f172a}
.glc-dialog-body{line-height:1.6;color:#475569}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9}
.glc-dialog-actions button{border:1px solid #d0d7e2;border-radius:8px;background:#fff;color:#0f172a;padding:6px 12px;cursor:pointer;transition:background-color .12s ease,border-color .12s ease}
.glc-dialog-actions button:hover{background:#f8fafc}
.glc-dialog-actions button:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}
.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff}
.glc-dialog-actions [data-glc-confirm]:hover{border-color:#1d4ed8;background:#1d4ed8}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box;border:1px solid #d0d7e2;border-radius:8px;padding:10px 12px;color:#0f172a}
#glc-toast-container{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none}
.glc-toast{background:#1f2937;color:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 10px 24px rgba(15,23,42,.24);pointer-events:auto;max-width:420px;word-break:break-word;opacity:1}
.glc-toast-success{background:#15803d}
.glc-toast-error{background:#b91c1c}
.glc-toast-enter{animation:glc-toast-fade-in .14s ease}
.glc-toast-leave{animation:glc-toast-fade-out .14s ease forwards}
@keyframes glc-toast-fade-in{from{opacity:0}to{opacity:1}}
@keyframes glc-toast-fade-out{from{opacity:1}to{opacity:0}}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid #f1f5f9}
.glc-progress-list li:last-child{border-bottom:none}
.glc-progress-platform{font-weight:700;color:#0f172a}
.glc-progress-state{color:#475569}
`;

module.exports = {
  UPDATE_STATUS,
  BASE_STYLE
};
