import React from 'react';
import { useToast } from './ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getBgColor(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-64 max-w-sm animate-fadeIn`}
        >
          <span className="text-lg">{getIcon(toast.type)}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200 text-lg"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;