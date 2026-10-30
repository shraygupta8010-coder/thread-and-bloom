'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function Toast() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => removeToast(toast.id), 3500);
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info;
        const colorClass =
          toast.type === 'success' ? 'bg-[#2D6A4F]' :
          toast.type === 'error' ? 'bg-red-600' : 'bg-[#1A1A1A]';

        return (
          <div
            key={toast.id}
            className={`${colorClass} text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-xl pointer-events-auto animate-toast-in`}
          >
            <Icon className="w-4 h-4 flex-shrink-0 opacity-90" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity ml-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
