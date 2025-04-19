import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useKeyPress from '../hooks/useKeyPress';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastManager } from './ToastContainer';

interface KeyboardShortcutsProps {
  disableInInputs?: boolean;
}

/**
 * Component to handle global keyboard shortcuts with visual feedback
 */
const KeyboardShortcuts = ({ disableInInputs = true }: KeyboardShortcutsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showShortcutOverlay, setShowShortcutOverlay] = useState(false);
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  // Check if focus is in an input, textarea, or other form element
  const isInInput = () => {
    if (!disableInInputs) return false;
    
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement ||
           activeElement instanceof HTMLTextAreaElement ||
           activeElement instanceof HTMLSelectElement ||
           activeElement?.getAttribute('contenteditable') === 'true';
  };

  // Helper to track active shortcuts for visual feedback
  const processShortcut = (name: string, callback: () => void) => {
    if (!isInInput()) {
      setActiveShortcut(name);
      callback();
      
      // Clear the active shortcut after animation time
      setTimeout(() => {
        setActiveShortcut(null);
      }, 500);
    }
  };

  // Navigation shortcuts
  const isHomeShortcut = useKeyPress('h', { alt: true });
  const isAddBookShortcut = useKeyPress('a', { alt: true });
  const isTradesShortcut = useKeyPress('t', { alt: true });
  const isSettingsShortcut = useKeyPress('s', { alt: true });
  const isDarkModeToggle = useKeyPress('d', { alt: true });
  const isHelpShortcut = useKeyPress('?', { shift: true });
  const isEscapePressed = useKeyPress('Escape');
  
  // Handle shortcuts overlay
  useEffect(() => {
    if (isHelpShortcut && !isInInput()) {
      setShowShortcutOverlay(prev => !prev);
    }
  }, [isHelpShortcut]);

  useEffect(() => {
    if (isEscapePressed) {
      setShowShortcutOverlay(false);
    }
  }, [isEscapePressed]);
  
  // Handle navigation shortcuts
  useEffect(() => {
    if (isHomeShortcut) {
      processShortcut('home', () => {
        if (location.pathname !== '/') {
          navigate('/');
          ToastManager.info('Navigated to Home', 'Keyboard Shortcut');
        }
      });
    }
  }, [isHomeShortcut, navigate, location.pathname]);

  useEffect(() => {
    if (isAddBookShortcut) {
      processShortcut('addBook', () => {
        if (location.pathname !== '/add-book') {
          navigate('/add-book');
          ToastManager.info('Navigated to Add Book', 'Keyboard Shortcut');
        }
      });
    }
  }, [isAddBookShortcut, navigate, location.pathname]);
  
  useEffect(() => {
    if (isTradesShortcut) {
      processShortcut('trades', () => {
        if (location.pathname !== '/trades') {
          navigate('/trades');
          ToastManager.info('Navigated to Trades', 'Keyboard Shortcut');
        }
      });
    }
  }, [isTradesShortcut, navigate, location.pathname]);
  
  useEffect(() => {
    if (isSettingsShortcut) {
      processShortcut('settings', () => {
        if (location.pathname !== '/settings') {
          navigate('/settings');
          ToastManager.info('Navigated to Settings', 'Keyboard Shortcut');
        }
      });
    }
  }, [isSettingsShortcut, navigate, location.pathname]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkModeToggle) {
      processShortcut('darkMode', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
          ToastManager.info('Switched to Light Mode', 'Theme Changed');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          ToastManager.info('Switched to Dark Mode', 'Theme Changed');
        }
      });
    }
  }, [isDarkModeToggle]);

  // Keyboard shortcuts help overlay
  const shortcuts = [
    { key: 'Alt + H', description: 'Go to Home page' },
    { key: 'Alt + A', description: 'Add a new book' },
    { key: 'Alt + T', description: 'View trades' },
    { key: 'Alt + S', description: 'Open settings' },
    { key: 'Alt + D', description: 'Toggle dark/light mode' },
    { key: 'Shift + ?', description: 'Show/hide keyboard shortcuts' },
    { key: 'Esc', description: 'Close dialogs or overlays' },
  ];

  return (
    <>
      <AnimatePresence>
        {showShortcutOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowShortcutOverlay(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-shortcuts-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 m-4"
              onClick={e => e.stopPropagation()}
            >
              <h2 
                id="keyboard-shortcuts-title"
                className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-1h12a1 1 0 011 1v2H3V5a1 1 0 011-1zm1 5a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm0 3a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm5-3a1 1 0 110 2h1a1 1 0 110-2h-1zm-1 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm7-3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-1 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Keyboard Shortcuts
              </h2>
              <div className="space-y-3">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex justify-between items-center">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 font-mono">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual feedback for active shortcut */}
      <AnimatePresence>
        {activeShortcut && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg"
            role="status"
            aria-live="polite"
          >
            Shortcut activated: {activeShortcut}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
