import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useApp, type ToastNotification } from '../../context/AppContext';

function Toast({ toast }: { toast: ToastNotification }) {
  const { removeToast } = useApp();

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  const borderColors = {
    success: 'border-l-green-500',
    warning: 'border-l-amber-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  };

  return (
    <div
      className={`toast-enter flex items-start gap-3 px-4 py-3 bg-white dark:bg-[#161616] border border-[#E5E7EB] dark:border-[#292929] border-l-4 ${borderColors[toast.type]} rounded-lg shadow-lg max-w-sm`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <p className="flex-1 text-sm text-[#111827] dark:text-white leading-relaxed">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white transition-colors mt-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function NotificationToasts() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
