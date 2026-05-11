const UPDATE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  AUTH_EXPIRED: 'auth_expired'
};

const BASE_STYLE = `
.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}
.glc-dialog{background:#fff;color:#0f172a;border:1px solid #e2e8f0;padding:20px;border-radius:12px;min-width:360px;max-width:580px;font-size:14px;box-shadow:0 14px 36px rgba(15,23,42,.16),0 4px 14px rgba(15,23,42,.08)}
.glc-dialog-title{margin:0 0 12px;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700}
.glc-dialog-body{line-height:1.6;color:#334155}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9}
.glc-dialog-actions button{border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease,box-shadow .14s ease}
.glc-dialog-actions button:hover{background:#f8fbff;border-color:#c6d4e8}
.glc-dialog-actions button:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}
.glc-dialog-actions [data-glc-confirm]{border-color:#2563eb;background:#2563eb;color:#fff;box-shadow:0 6px 16px rgba(37,99,235,.24)}
.glc-dialog-actions [data-glc-confirm]:hover{border-color:#1d4ed8;background:#1d4ed8}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:10px;padding:10px 12px;color:#0f172a;background:#fff}
#glc-toast-container{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none}
.glc-toast{background:#f8fafc;color:#0f172a;padding:11px 15px;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 12px 30px rgba(15,23,42,.12);pointer-events:auto;max-width:420px;word-break:break-word;opacity:1}
.glc-toast-success{background:#f0fdf4;color:#166534;border-color:#86efac}
.glc-toast-error{background:#fef2f2;color:#991b1b;border-color:#fecaca}
.glc-toast-enter{animation:glc-toast-fade-in .16s ease}
.glc-toast-leave{animation:glc-toast-fade-out .16s ease forwards}
@keyframes glc-toast-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes glc-toast-fade-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
.glc-progress-platform{font-weight:700;color:#0f172a}
.glc-progress-state{color:#334155}
`;

module.exports = {
  UPDATE_STATUS,
  BASE_STYLE
};
