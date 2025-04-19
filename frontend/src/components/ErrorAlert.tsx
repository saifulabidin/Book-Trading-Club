import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
  autoHideDuration?: number;
}

const ErrorAlert = ({ 
  message, 
  title, 
  onDismiss, 
  variant = 'error',
  autoHideDuration = 6000
}: ErrorAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          text: 'text-amber-800 dark:text-amber-200',
          icon: 'text-amber-400 dark:text-amber-300',
          hover: 'hover:bg-amber-100 dark:hover:bg-amber-800/50',
          ring: 'focus:ring-amber-500',
          border: 'border-amber-400 dark:border-amber-600',
          progress: 'bg-amber-300 dark:bg-amber-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-400 dark:text-blue-300',
          hover: 'hover:bg-blue-100 dark:hover:bg-blue-800/50',
          ring: 'focus:ring-blue-500',
          border: 'border-blue-400 dark:border-blue-600',
          progress: 'bg-blue-300 dark:bg-blue-600'
        };
      case 'error':
      default:
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-400 dark:text-red-300',
          hover: 'hover:bg-red-100 dark:hover:bg-red-800/50',
          ring: 'focus:ring-red-500',
          border: 'border-red-400 dark:border-red-600',
          progress: 'bg-red-300 dark:bg-red-600'
        };
    }
  };

  const colors = getColors();

  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return (
          <svg className={`h-5 w-5 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
        );
      case 'info':
        return (
          <svg className={`h-5 w-5 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
        );
      case 'error':
      default:
        return (
          <svg className={`h-5 w-5 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  useEffect(() => {
    // Reset timeout if message changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (onDismiss && autoHideDuration > 0) {
      startDismissTimer();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, onDismiss, autoHideDuration]);

  const startDismissTimer = () => {
    if (isHovering) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, autoHideDuration);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (onDismiss && autoHideDuration > 0) {
      startDismissTimer();
    }
  };

  // Format message if it appears to be an error object converted to string
  const formatErrorMessage = (msg: string) => {
    // Check if message looks like Error: something
    if (/^(Error|TypeError|ReferenceError|SyntaxError):.+/i.test(msg)) {
      // Extract just the message part after the colon
      return msg.replace(/^(Error|TypeError|ReferenceError|SyntaxError):\s*/i, '');
    }
    return msg;
  };

  const formattedMessage = formatErrorMessage(message);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          role="alert"
          aria-live="assertive"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`rounded-md ${colors.bg} p-4 mb-4 transition-colors duration-300 border-l-4 ${colors.border} shadow-sm`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3">
              {title && (
                <h3 className={`text-sm font-medium ${colors.text} mb-1`}>{title}</h3>
              )}
              <div className={`text-sm ${colors.text}`}>
                {formattedMessage}
              </div>
            </div>
            {onDismiss && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(onDismiss, 200); // Wait for animation
                    }}
                    className={`inline-flex rounded-md p-1.5 ${colors.icon} ${colors.hover} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring} dark:focus:ring-offset-gray-900`}
                    aria-label="Dismiss"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {onDismiss && autoHideDuration > 0 && (
            <motion.div 
              className={`h-1 ${colors.progress} rounded-full mt-3 origin-left`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: autoHideDuration / 1000 }}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorAlert;