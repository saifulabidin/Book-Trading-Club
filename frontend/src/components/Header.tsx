import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/bookStore';
import AuthButton from './AuthButton';
import DarkModeToggle from './DarkModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navigation item type definition
 */
interface NavItem {
  to: string;
  label: string;
  badge?: number;
}

/**
 * Main application header component
 * Provides navigation, auth controls, and theme toggling
 */
const Header = () => {
  const { currentUser, unseenTradesCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation items based on authentication state
  const navItems: NavItem[] = currentUser 
    ? [
        { to: '/', label: 'Browse Books' },
        { to: '/add-book', label: 'Add Book' },
        { to: '/trades', label: 'Trades', badge: unseenTradesCount },
        { to: '/settings', label: 'Settings' }
      ] 
    : [
        { to: '/', label: 'Browse Books' }
      ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                Book Trading Club
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <DesktopNavigation navItems={navItems} />

          {/* Mobile menu button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        navItems={navItems}
        onNavItemClick={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

/**
 * Desktop navigation component
 */
const DesktopNavigation = ({ navItems }: { navItems: NavItem[] }) => (
  <nav className="hidden md:flex items-center space-x-4">
    {navItems.map(item => (
      <NavLink key={item.to} item={item} />
    ))}
    <DarkModeToggle />
    <AuthButton />
  </nav>
);

/**
 * Mobile menu toggle button
 */
const MobileMenuButton = ({ 
  isOpen, 
  onToggle 
}: { 
  isOpen: boolean; 
  onToggle: () => void 
}) => (
  <div className="md:hidden flex items-center gap-2">
    <DarkModeToggle />
    <button
      onClick={onToggle}
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      {!isOpen ? (
        <MenuIcon />
      ) : (
        <CloseIcon />
      )}
    </button>
  </div>
);

/**
 * Mobile navigation component with animation
 */
const MobileNavigation = ({ 
  isOpen, 
  navItems,
  onNavItemClick
}: { 
  isOpen: boolean; 
  navItems: NavItem[];
  onNavItemClick: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
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
              onClick={onNavItemClick}
            >
              {item.label}
              {renderBadge(item, true)}
            </Link>
          ))}
          <div className="px-3 py-2">
            <AuthButton />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * Individual navigation link with optional badge
 */
const NavLink = ({ item }: { item: NavItem }) => (
  <Link
    to={item.to}
    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative"
  >
    {item.label}
    {renderBadge(item)}
  </Link>
);

/**
 * Helper to render notification badge
 */
const renderBadge = (item: NavItem, isMobile = false) => {
  if (!item.badge || item.badge <= 0) return null;
  
  return isMobile ? (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
      {item.badge}
    </span>
  ) : (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {item.badge}
    </span>
  );
};

/**
 * Menu icon SVG
 */
const MenuIcon = () => (
  <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

/**
 * Close icon SVG
 */
const CloseIcon = () => (
  <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Header;