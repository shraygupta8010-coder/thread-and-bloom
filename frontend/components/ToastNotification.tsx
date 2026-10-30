'use client';

interface ToastNotificationProps {
  message: string;
  visible: boolean;
}

export default function ToastNotification({ message, visible }: ToastNotificationProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 pointer-events-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined text-primary-fixed-dim text-xl">check_circle</span>
      <span className="font-label-md text-xs tracking-wide">{message}</span>
    </div>
  );
}
