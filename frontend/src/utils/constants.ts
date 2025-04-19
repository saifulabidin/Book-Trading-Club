export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADD_BOOK: '/add-book',
  BOOK_DETAILS: '/books/:id',
  TRADES: '/trades',
  TRADE_DETAILS: '/trades/:id',
  SETTINGS: '/settings'
} as const;

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
  'Self-Help',
  'Children',
  'Young Adult',
  'Poetry',
  'Comics',
  'Other'
] as const;

export const BOOK_CONDITIONS = [
  'New',
  'Like New',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
] as const;

export const NOTIFICATION_TYPES = [
  'trade_proposal',
  'trade_accepted',
  'trade_rejected',
  'trade_completed',
  'system'
] as const;

export const TRADE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const DEFAULT_BOOK_IMAGE = '/default-book-cover.jpg';

export const CATEGORIES = [
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
  'Poetry',
  'Drama',
  'Children'
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_OUT: '/auth/signout',
    REFRESH_TOKEN: '/auth/refresh'
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
    USER_TRADES: '/trades/user'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_SETTINGS: '/users/settings'
  }
} as const;

export const ERROR_MESSAGES = {
  DEFAULT: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check the form for errors.',
  SERVER: 'Server error. Please try again later.'
} as const;

export const KEYBOARD_SHORTCUTS = {
  SEARCH: '/',
  HOME: 'h',
  ADD_BOOK: 'a',
  TRADES: 't',
  SETTINGS: 's',
  CLOSE: 'Escape'
} as const;

export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  MAX_PAGES_SHOWN: 5
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
} as const;