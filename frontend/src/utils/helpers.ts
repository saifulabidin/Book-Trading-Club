import { Trade, User, Notification } from '../types';

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
    USER_TRADES: '/trades/user',
    MARK_SEEN: '/trades/mark-seen',
    COMPLETE: (id: string) => `/trades/${id}/complete`
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    BY_USERNAME: (username: string) => `/users/${username}`
  }
};

/**
 * Extracts an error message from various error formats
 * 
 * @param error - Error object or message
 * @param fallbackMessage - Default message if extraction fails
 * @returns Extracted error message
 */
export function extractErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return fallbackMessage;
}

/**
 * Extracts an ID from an entity that could be an ID string or an object with _id
 * 
 * @param entity - Entity that could be an ID string or object
 * @returns Extracted ID
 */
export function extractEntityId(entity: string | User | { _id: string }): string {
  if (typeof entity === 'string') {
    return entity;
  }
  
  return entity._id;
}

/**
 * Creates a notification object for trades
 * 
 * @param params - Notification parameters
 * @returns Created notification object
 */
export function createTradeNotification(params: {
  userId: string;
  type: Notification['type'];
  message: string;
  relatedId?: string;
}): Notification {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    type: params.type,
    message: params.message,
    createdAt: new Date().toISOString(),
    isRead: false,
    relatedId: params.relatedId
  };
}

/**
 * Calculates the number of unseen trades
 * 
 * @param trades - List of trades
 * @param currentUserId - ID of the current user
 * @returns Count of unseen trades
 */
export function calculateUnseenTradesCount(trades: Trade[], currentUserId: string): number {
  return trades.filter(trade => shouldMarkTradeAsSeen(trade, currentUserId)).length;
}

/**
 * Determines if a trade should be marked as seen
 * 
 * @param trade - Trade to check
 * @param currentUserId - ID of current user
 * @returns Whether the trade should be marked as seen
 */
export function shouldMarkTradeAsSeen(trade: Trade, currentUserId?: string): boolean {
  if (!currentUserId) return false;
  
  const receiverId = extractEntityId(trade.receiver);
  
  return (
    trade.status === 'pending' && 
    !trade.isSeen && 
    receiverId === currentUserId
  );
}
