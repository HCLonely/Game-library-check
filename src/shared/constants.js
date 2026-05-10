const UPDATE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  AUTH_EXPIRED: 'auth_expired'
};

const BASE_STYLE = `
.glc-mask{position:fixed;inset:0;background:rgba(15,23,42,.52);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}
.glc-dialog{background:#fff;color:#0f172a;border:1px solid #dbe4f0;padding:20px;border-radius:16px;min-width:360px;max-width:580px;font-size:14px;box-shadow:0 24px 64px rgba(15,23,42,.22),0 8px 24px rgba(15,23,42,.12)}
.glc-dialog-title{margin:0 0 14px;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700;letter-spacing:.2px}
.glc-dialog-body{line-height:1.65;color:#475569}
.glc-dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid #edf2f8}
.glc-dialog-actions button{border:1px solid #d0dbe8;border-radius:10px;background:#fff;color:#0f172a;padding:8px 14px;cursor:pointer;transition:background-color .14s ease,border-color .14s ease,transform .14s ease,box-shadow .14s ease}
.glc-dialog-actions button:hover{background:#f8fbff;border-color:#c6d4e8;transform:translateY(-1px)}
.glc-dialog-actions button:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}
.glc-dialog-actions [data-glc-confirm]{border-color:#1d4ed8;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);color:#fff;box-shadow:0 8px 20px rgba(37,99,235,.3)}
.glc-dialog-actions [data-glc-confirm]:hover{border-color:#1e40af;background:linear-gradient(135deg,#1d4ed8 0%,#1e40af 100%)}
.glc-textarea{width:100%;min-height:160px;box-sizing:border-box;border:1px solid #d0dbe8;border-radius:10px;padding:10px 12px;color:#0f172a;background:#fff}
#glc-toast-container{position:fixed;right:18px;bottom:18px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:none}
.glc-toast{background:#1f2937;color:#fff;padding:11px 15px;border-radius:12px;border:1px solid rgba(255,255,255,.14);box-shadow:0 16px 36px rgba(15,23,42,.28);pointer-events:auto;max-width:420px;word-break:break-word;opacity:1}
.glc-toast-success{background:#15803d}
.glc-toast-error{background:#b91c1c}
.glc-toast-enter{animation:glc-toast-fade-in .16s ease}
.glc-toast-leave{animation:glc-toast-fade-out .16s ease forwards}
@keyframes glc-toast-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes glc-toast-fade-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
.glc-progress-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.glc-progress-list li{display:flex;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid #e6edf7;border-radius:10px;background:#f8fbff}
.glc-progress-platform{font-weight:700;color:#0f172a;letter-spacing:.3px}
.glc-progress-state{color:#334155}
`;

module.exports = {
  UPDATE_STATUS,
  BASE_STYLE
};
