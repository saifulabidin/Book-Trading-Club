import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/bookStore';
import Toast from './Toast';

const MessageToast = () => {
  const { message, error, setMessage, setError } = useStore();
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);
  // Use useRef for timeouts to avoid using NodeJS.Timeout type
  const timeoutRefs = useRef<Record<string, number>>({});

  useEffect(() => {
    if (message) {
      const newToast = {
        id: crypto.randomUUID(),
        message,
        type: 'success' as const
      };
      setToasts(prev => [...prev, newToast]);
      setMessage(null);

      // Auto-remove after 5 seconds
      const timeoutId = window.setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
      
      timeoutRefs.current[newToast.id] = timeoutId;
      
      return () => {
        window.clearTimeout(timeoutRefs.current[newToast.id]);
        delete timeoutRefs.current[newToast.id];
      };
    }
  }, [message, setMessage]);

  useEffect(() => {
    if (error) {
      const newToast = {
        id: crypto.randomUUID(),
        message: error,
        type: 'error' as const
      };
      setToasts(prev => [...prev, newToast]);
      setError(null);

      // Auto-remove after 5 seconds
      const timeoutId = window.setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
      
      timeoutRefs.current[newToast.id] = timeoutId;
      
      return () => {
        window.clearTimeout(timeoutRefs.current[newToast.id]);
        delete timeoutRefs.current[newToast.id];
      };
    }
  }, [error, setError]);

  const removeToast = (id: string) => {
    if (timeoutRefs.current[id]) {
      window.clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default MessageToast;
