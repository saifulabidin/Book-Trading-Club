/**
 * API configuration and endpoints
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

/**
 * API endpoints organized by resource
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/login'
  },
  BOOKS: {
    LIST: '/books',
    CREATE: '/books',
    UPDATE: (id: string) => `/books/${id}`,
    DELETE: (id: string) => `/books/${id}`,
    SEARCH: '/books/search'
  },
  TRADES: {
    LIST: '/trades',
    CREATE: '/trades',
    UPDATE: (id: string) => `/trades/${id}`,
    USER_TRADES: '/trades', // Fixed: Changed from '/trades/user' to '/trades'
    MARK_SEEN: '/trades/mark-seen',
    COMPLETE: (id: string) => `/trades/${id}/complete`
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    BY_USERNAME: (username: string) => `/users/${username}`
  }
} as const;

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  ADD_BOOK: '/add-book',
  BOOK_DETAILS: '/books/:id',
  TRADES: '/trades',
  TRADE_DETAILS: '/trades/:id',
  SETTINGS: '/settings',
  USER_BOOKS: '/user/:username/books'
} as const;

/**
 * Book categories
 */
export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Thriller',
  'Horror',
  'Biography',
  'History',
  'Science',
  'Technology',
  'Business',
  'Self-Help',
  'Children',
  'Young Adult',
  'Poetry',
  'Drama',
  'Comics',
  'Other'
] as const;

// Export book category type for TypeScript
export type BookCategory = typeof BOOK_CATEGORIES[number];

/**
 * Book condition options
 */
export const BOOK_CONDITIONS = [
  'New',
  'Like New',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
] as const;

// Export book condition type for TypeScript
export type BookCondition = typeof BOOK_CONDITIONS[number];

/**
 * Default fallback book cover image
 */
export const DEFAULT_BOOK_IMAGE = '/default-book-cover.jpg';

/**
 * Notification types for WebSocket and in-app notifications
 */
export const NOTIFICATION_TYPES = [
  'trade_request',
  'trade_accepted',
  'trade_rejected',
  'trade_completed',
  'system'
] as const;

/**
 * Trade status constants
 */
export const TRADE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

/**
 * Standard error messages
 */
export const ERROR_MESSAGES = {
  DEFAULT: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check the form for errors.',
  SERVER: 'Server error. Please try again later.',
  WEBSOCKET: 'Lost connection to real-time updates. Reconnecting...'
} as const;

/**
 * Keyboard shortcut mappings
 */
export const KEYBOARD_SHORTCUTS = {
  SEARCH: '/',
  HOME: 'h',
  ADD_BOOK: 'a',
  TRADES: 't',
  SETTINGS: 's',
  CLOSE: 'Escape',
  DARK_MODE_TOGGLE: 'd'
} as const;

/**
 * Pagination settings
 */
export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  MAX_PAGES_SHOWN: 5
} as const;

/**
 * Local storage key names
 */
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
} as const;

/**
 * Application theme options
 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

/**
 * Application-wide validation constraints
 */
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8
  },
  BOOK_TITLE: {
    MAX_LENGTH: 100
  },
  BOOK_DESCRIPTION: {
    MAX_LENGTH: 1000
  }
} as const;