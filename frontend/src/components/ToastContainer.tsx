import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '../store/bookStore';
import Toast, { ToastType } from './Toast';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

// Singleton for managing toasts across the application
export const ToastManager = {
  toastCallback: (toast: Omit<ToastItem, 'id'>) => {},
  
  show(message: string, type: ToastType = 'info', title?: string, duration?: number) {
    this.toastCallback({
      message,
      type,
      title,
      duration,
    });
  },
  
  success(message: string, title?: string, duration?: number) {
    this.show(message, 'success', title, duration);
  },
  
  error(message: string, title?: string, duration?: number) {
    this.show(message, 'error', title, duration);
  },
  
  info(message: string, title?: string, duration?: number) {
    this.show(message, 'info', title, duration);
  },
  
  warning(message: string, title?: string, duration?: number) {
    this.show(message, 'warning', title, duration);
  }
};

const ToastContainer = () => {
  const { message, error, clearMessage, clearError } = useStore();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const maxToasts = 5; // Maximum number of toasts to show at once
  
  useEffect(() => {
    // Register the callback to allow showing toasts from anywhere
    ToastManager.toastCallback = (toast) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts(prev => {
        const newToasts = [...prev, { ...toast, id }];
        // Limit the number of toasts
        return newToasts.slice(Math.max(0, newToasts.length - maxToasts));
      });
    };
  }, []);

  useEffect(() => {
    if (message) {
      ToastManager.success(message);
      clearMessage();
    }
  }, [message, clearMessage]);

  useEffect(() => {
    if (error) {
      // Try to parse error if it's JSON
      let errorMessage = error;
      let errorTitle = 'Error';
      
      try {
        if (typeof error === 'string' && (error.startsWith('{') || error.startsWith('['))) {
          const parsedError = JSON.parse(error);
          if (parsedError.message) {
            errorMessage = parsedError.message;
          }
          if (parsedError.error) {
            errorTitle = parsedError.error;
          }
        }
      } catch (e) {
        // Just use the original error message if parsing fails
      }
      
      ToastManager.error(errorMessage, errorTitle);
      clearError();
    }
  }, [error, clearError]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getPositionClass = () => {
    // You could make this configurable in the future
    return 'fixed bottom-0 right-0 z-50 p-4 space-y-3 pointer-events-none max-h-screen overflow-hidden';
  };

  return (
    <div className={getPositionClass()}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            id={toast.id}
            message={toast.message} 
            type={toast.type} 
            title={toast.title}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;