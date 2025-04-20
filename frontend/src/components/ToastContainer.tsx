import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '../store/bookStore';
import Toast, { ToastType } from './Toast';

/**
 * Toast item data structure
 */
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

/**
 * Toast callback parameters that can include dismiss action
 */
interface ToastCallbackParams extends Omit<ToastItem, 'id'> {
  id?: string;
  _dismiss?: boolean; // Add the _dismiss property here
}

/**
 * Toast manager singleton for application-wide toast notifications
 */
export const ToastManager = {
  toastCallback: (_toast: ToastCallbackParams) => {},
  
  /**
   * Show a toast notification
   * 
   * @param message - Toast message content
   * @param type - Toast visual style
   * @param title - Optional toast title/header
   * @param duration - Time in ms before auto-dismissal
   * @param id - Optional unique identifier for the toast
   */
  show(
    message: string, 
    type: ToastType = 'info', 
    title?: string, 
    duration?: number,
    id?: string
  ) {
    this.toastCallback({
      message,
      type,
      title,
      duration,
      id: id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    });
  },
  
  /**
   * Show a success toast
   */
  success(message: string, title?: string, duration?: number, id?: string) {
    this.show(message, 'success', title, duration, id);
  },
  
  /**
   * Show an error toast
   */
  error(message: string, title?: string, duration?: number, id?: string) {
    this.show(message, 'error', title, duration, id);
  },
  
  /**
   * Show an info toast
   */
  info(message: string, title?: string, duration?: number, id?: string) {
    this.show(message, 'info', title, duration, id);
  },
  
  /**
   * Show a warning toast
   */
  warning(message: string, title?: string, duration?: number, id?: string) {
    this.show(message, 'warning', title, duration, id);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss(id: string) {
    this.toastCallback({ id, message: '', type: 'info', _dismiss: true });
  }
};

/**
 * Component that manages toast notifications
 * Handles both programmatic and state-driven toasts
 */
const ToastContainer = () => {
  const { message, error, clearMessage, clearError } = useStore();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const maxToasts = 5; // Maximum number of toasts to show at once
  
  // Set up the toast manager
  useEffect(() => {
    // Register the callback to allow showing toasts from anywhere
    ToastManager.toastCallback = (toast) => {
      // Special case for dismissal
      if ('_dismiss' in toast && toast._dismiss === true) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
        return;
      }
      
      // Regular toast display
      setToasts(prev => {
        // Check if this toast ID already exists
        const existingIndex = prev.findIndex(t => t.id === toast.id);
        
        if (existingIndex >= 0) {
          // Replace the existing toast
          const newToasts = [...prev];
          newToasts[existingIndex] = toast as ToastItem;
          return newToasts;
        } else {
          // Add new toast, respecting the maximum limit
          const newToasts = [...prev, toast as ToastItem];
          return newToasts.slice(Math.max(0, newToasts.length - maxToasts));
        }
      });
    };
  }, []);

  // Handle message from global state
  useEffect(() => {
    if (message) {
      ToastManager.success(message);
      clearMessage();
    }
  }, [message, clearMessage]);

  // Handle error from global state
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

  /**
   * Remove a toast from the state
   */
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  /**
   * Get position classes for the toast container
   */
  const getPositionClass = () => {
    // Fixed position in the corner with spacing and overflow handling
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