import { useEffect, useState, useRef, forwardRef, ForwardedRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Available toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast component props
 */
interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Message to display */
  message: string;
  /** Visual style of the toast */
  type: ToastType;
  /** Function to call when toast is dismissed */
  onClose: () => void;
  /** Duration in milliseconds before auto-dismiss (default: 5000) */
  duration?: number;
  /** Optional title/header for the toast */
  title?: string;
}

/**
 * Style configurations for different toast types
 */
const toastStyleConfig: Record<ToastType, {
  bg: string;
  icon: string;
  text: string;
  border: string;
  progress: string;
}> = {
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

/**
 * Animation variants for toast notifications
 */
const toastAnimationVariants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 25 
    } 
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    transition: { 
      duration: 0.2, 
      ease: 'easeOut' 
    } 
  }
};

/**
 * Toast notification component with auto-dismiss functionality
 * Supports mouse interaction (pause on hover), keyboard navigation,
 * and screen reader announcements
 */
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
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isPaused = isHovering || isFocused;

  /**
   * Start or restart the auto-dismiss timer
   */
  const startCloseTimer = () => {
    if (isPaused) return;
    
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before removing from DOM
      window.setTimeout(onClose, 300);
    }, duration);
  };

  // Set up the close timer on mount and clean up on unmount
  useEffect(() => {
    startCloseTimer();
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [duration, isPaused]);

  // Event handlers for mouse interactions
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    startCloseTimer();
  };

  // Event handlers for keyboard focus
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    startCloseTimer();
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Delete') {
      setIsVisible(false);
      window.setTimeout(onClose, 300);
    }
  };

  // Get style configuration for current type
  const styles = toastStyleConfig[type];

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
          variants={toastAnimationVariants}
          className={`max-w-xs sm:max-w-sm w-full ${styles.bg} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${styles.border}`}
          role="status"
          aria-live={type === 'error' ? 'assertive' : 'polite'}
          data-toast-id={id}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${styles.icon}`}>
                <ToastIconByType type={type} />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                {title && (
                  <p className={`text-sm font-medium ${styles.text} mb-1`}>
                    {title}
                  </p>
                )}
                <p className={`text-sm ${styles.text}`}>{message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => {
                    setIsVisible(false);
                    window.setTimeout(onClose, 300);
                  }}
                  className={`rounded-md inline-flex p-1.5 ${styles.icon} hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-200`}
                  aria-label="Close notification"
                >
                  <span className="sr-only">Close</span>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress bar that pauses on hover/focus */}
          {!isPaused && (
            <motion.div 
              className={`h-1 ${styles.progress} rounded-b-sm`}
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

/**
 * Toast icon component based on toast type
 */
const ToastIconByType = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

/**
 * Close icon SVG
 */
const CloseIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Add display name for better debugging
Toast.displayName = 'Toast';

export default Toast;