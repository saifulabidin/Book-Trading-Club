import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_BASE_URL } from '../utils/constants';

/**
 * WebSocket message structure that matches backend format
 */
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
}

/**
 * WebSocket connection options
 */
export interface WebSocketOptions {
  /** Base URL endpoint */
  url?: string;
  /** Path to connect to */
  path?: string;
  /** Auth token for secure connections */
  token?: string | null;
  /** Auto reconnect on disconnect */
  autoReconnect?: boolean;
  /** Reconnection delay in ms */
  reconnectDelay?: number;
  /** Callback when connection opens */
  onOpen?: (event: Event) => void;
  /** Callback when connection closes */
  onClose?: (event: CloseEvent) => void;
  /** Callback when connection error occurs */
  onError?: (event: Event) => void;
}

/**
 * Custom hook for WebSocket connections with automatic reconnection
 *
 * @param options - WebSocket connection configuration
 * @param messageHandler - Function to handle incoming messages
 * @returns WebSocket connection status and methods
 */
export function useWebSocket<T = any>(
  options: WebSocketOptions,
  messageHandler?: (data: WebSocketMessage<T>) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  
  const {
    url = WS_BASE_URL,
    path = '',
    token,
    autoReconnect = true,
    reconnectDelay = 5000,
    onOpen,
    onClose,
    onError
  } = options;
  
  /**
   * Creates and configures a new WebSocket connection
   */
  const connect = useCallback(() => {
    // Don't attempt connection without token if it's required
    if (!token && path.includes('notifications')) return;
    
    try {
      // Build the WebSocket URL
      const fullUrl = `${url}${path}`;
      
      const ws = new WebSocket(fullUrl);
      wsRef.current = ws;
      
      // Connection opened
      ws.onopen = (event) => {
        setIsConnected(true);
        setError(null);
        
        // Send auth token if provided
        if (token) {
          ws.send(JSON.stringify({ token }));
        }
        
        if (onOpen) onOpen(event);
      };
      
      // Message received
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage<T>;
          if (messageHandler) {
            messageHandler(data);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
      
      // Connection closed
      ws.onclose = (event) => {
        setIsConnected(false);
        
        if (onClose) onClose(event);
        
        // Attempt to reconnect if enabled
        if (autoReconnect) {
          reconnectTimerRef.current = window.setTimeout(() => {
            console.log('WebSocket reconnecting...');
            connect();
          }, reconnectDelay);
        }
      };
      
      // Connection error
      ws.onerror = (event) => {
        setError(new Error('WebSocket connection error'));
        
        if (onError) onError(event);
      };
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to create WebSocket connection');
      setError(errorObj);
      
      if (autoReconnect) {
        reconnectTimerRef.current = window.setTimeout(connect, reconnectDelay);
      }
    }
  }, [url, path, token, autoReconnect, reconnectDelay, onOpen, onClose, onError, messageHandler]);
  
  // Set up the connection and cleanup on unmount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      
      if (wsRef.current) {
        // Prevent reconnection attempts during cleanup
        const ws = wsRef.current;
        ws.onclose = null;
        
        // Close connection if it's open
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      }
    };
  }, [connect]);
  
  /**
   * Manually send a message through the WebSocket
   * 
   * @param data - Message data to send (will be JSON stringified)
   * @returns Success status of send operation
   */
  const sendMessage = useCallback((data: any): boolean => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }
    
    try {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Error sending WebSocket message:', err);
      return false;
    }
  }, []);
  
  /**
   * Manually reconnect the WebSocket
   */
  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setTimeout(connect, 0);
  }, [connect]);
  
  return {
    isConnected,
    error,
    sendMessage,
    reconnect,
    ws: wsRef.current
  };
}
