import { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Match animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50',
    error: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50',
    info: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50'
  };

  const iconStyles = {
    success: 'text-cyan-400',
    error: 'text-red-400',
    info: 'text-blue-400'
  };

  return (
    <div
      className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{ minWidth: 'min(320px, calc(100vw - 2rem))', maxWidth: 'min(500px, calc(100vw - 2rem))' }}
    >
      <div className={`backdrop-blur-xl border-2 rounded-xl sm:rounded-2xl shadow-2xl ${typeStyles[type]} p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4`}>
        {/* Icon */}
        <div className={`flex-shrink-0 ${iconStyles[type]}`}>
          {type === 'success' && (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'error' && (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-xs sm:text-sm break-words">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-white/60 hover:text-white transition-colors touch-manipulation"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Toast Container for managing multiple toasts
export function ToastContainer({ toasts, removeToast }: { 
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>;
  removeToast: (id: string) => void;
}) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${24 + index * 90}px` }} className="fixed right-6 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
}
