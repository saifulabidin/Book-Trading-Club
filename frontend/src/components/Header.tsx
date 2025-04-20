import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/bookStore';
import AuthButton from './AuthButton';
import DarkModeToggle from './DarkModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { currentUser, unseenTradesCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = currentUser ? [
    { to: '/', label: 'Browse Books' },
    { to: '/add-book', label: 'Add Book' },
    { to: '/trades', label: 'Trades', badge: unseenTradesCount },
    { to: '/settings', label: 'Settings' }
  ] : [
    { to: '/', label: 'Browse Books' }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                Book Trading Club
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative"
              >
                {item.label}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
            <DarkModeToggle />
            <AuthButton />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 relative"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;