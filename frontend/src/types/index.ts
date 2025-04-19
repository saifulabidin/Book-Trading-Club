import { BOOK_CATEGORIES, BOOK_CONDITIONS, TRADE_STATUS, NOTIFICATION_TYPES } from '../utils/constants';

export type BookCategory = typeof BOOK_CATEGORIES[number];
export type BookCondition = typeof BOOK_CONDITIONS[number];
export type TradeStatus = typeof TRADE_STATUS[keyof typeof TRADE_STATUS];
export type NotificationType = typeof NOTIFICATION_TYPES[number];

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  location?: string;
  books: string[];
  githubUsername?: string;
  githubPhotoUrl?: string;
  avatarUrl?: string;
  favorites?: string[];
  wishlist?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  condition: BookCondition;
  owner: string | User;
  isAvailable: boolean;
  image?: string;
  isbn?: string;
  genre?: string[];
  publishedYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  _id: string;
  initiator: string | User;
  receiver: string | User;
  bookOffered: string | Book;
  bookRequested: string | Book;
  status: TradeStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  isRead: boolean;
  relatedId?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  location?: string;
  fullName?: string;
  token: string;
}

export interface SearchFilters {
  query?: string;
  category?: string[];
  condition?: BookCondition[];
  page?: number;
  limit?: number;
}