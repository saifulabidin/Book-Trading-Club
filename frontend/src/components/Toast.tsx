import { useEffect, useState, useRef, forwardRef, ForwardedRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  title?: string;
  id: string;
}

const Toast = forwardRef(({ 
  message, 
  type, 
  onClose, 
  duration = 5000,
  title,
  id 
}: ToastProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const startCloseTimer = () => {
    if (isHovering) return;
    
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      window.setTimeout(onClose, 300); // Wait for exit animation to complete
    }, duration);
  };

  useEffect(() => {
    startCloseTimer();
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, onClose]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    startCloseTimer();
  };

  const colors = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-400 dark:text-green-300',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-400 dark:border-green-600',
      progress: 'bg-green-400 dark:bg-green-500'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-400 dark:text-red-300',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-400 dark:border-red-600',
      progress: 'bg-red-400 dark:bg-red-500'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-400 dark:text-blue-300',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-400 dark:border-blue-600',
      progress: 'bg-blue-400 dark:bg-blue-500'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-400 dark:text-amber-300',
      text: 'text-amber-800 dark:text-amber-200',
      border: 'border-amber-400 dark:border-amber-600',
      progress: 'bg-amber-400 dark:bg-amber-500'
    }
  };

  const variants = {
    initial: { opacity: 0, y: -20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: 'easeOut' } }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          layout
          key={id}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          className={`max-w-xs sm:max-w-sm w-full ${colors[type].bg} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${colors[type].border}`}
          role="alert"
          aria-live="polite"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${colors[type].icon}`}>
                {getIcon()}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                {title && (
                  <p className={`text-sm font-medium ${colors[type].text} mb-1`}>
                    {title}
                  </p>
                )}
                <p className={`text-sm ${colors[type].text}`}>{message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => {
                    setIsVisible(false);
                    window.setTimeout(onClose, 300);
                  }}
                  className={`rounded-md inline-flex p-1.5 ${colors[type].icon} hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-200`}
                  aria-label="Close notification"
                >
                  <span className="sr-only">Close</span>
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
          </div>
          
          {/* Progress bar */}
          {!isHovering && (
            <motion.div 
              className={`h-1 ${colors[type].progress} rounded-b-sm`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Add display name for better debugging
Toast.displayName = 'Toast';

export default Toast;