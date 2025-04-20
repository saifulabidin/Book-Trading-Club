import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { useWebSocket, WebSocketMessage } from '../hooks/useWebSocket';
import { ToastManager } from './ToastContainer';

/**
 * Notification payload structure for trade-related events
 */
interface TradeNotificationPayload {
  message: string;
  tradeId?: string;
}

/**
 * Notification types supported by the system
 */
type NotificationType = 
  | 'trade_request'
  | 'trade_accepted'
  | 'trade_rejected'
  | 'trade_completed'
  | 'system';

/**
 * Component that handles real-time notifications via WebSocket
 * Shows toast notifications for trade events and system messages
 */
const NotificationCenter = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  
  /**
   * Process incoming notification messages from WebSocket
   * Maps notification types to appropriate toast displays
   */
  const handleNotification = useCallback((data: WebSocketMessage<TradeNotificationPayload>) => {
    const { type, payload } = data;
    const { message, tradeId } = payload;
    
    switch (type as NotificationType) {
      case 'trade_request': {
        const toastId = `${type}-${tradeId}`;
        ToastManager.info(message, 'New Trade Request', 8000, toastId);
        
        // Add click handler to navigate to the trade
        if (tradeId) {
          const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`);
          
          if (toastElement) {
            toastElement.addEventListener('click', () => {
              navigate(`/trades/${tradeId}`);
              ToastManager.dismiss(toastId);
            });
          }
        }
        break;
      }
      
      case 'trade_accepted':
        ToastManager.success(message, 'Trade Accepted');
        break;
      
      case 'trade_rejected':
        ToastManager.error(message, 'Trade Rejected');
        break;
      
      case 'trade_completed':
        ToastManager.success(message, 'Trade Completed');
        break;
      
      case 'system':
        ToastManager.info(message, 'System Notification');
        break;
        
      default:
        // Fallback for unknown notification types
        console.warn(`Unhandled notification type: ${type}`);
        ToastManager.info(message, 'Notification');
    }
  }, [navigate]);

  // Set up WebSocket connection with error handling
  const { error } = useWebSocket({
    path: '/notifications',
    token,
    autoReconnect: true,
    onError: () => {
      ToastManager.error(
        'Unable to connect to the notification service. You may miss real-time updates.',
        'Connection Error'
      );
    }
  }, handleNotification);

  // Show error toast if connection fails
  useEffect(() => {
    if (error) {
      console.error('WebSocket error:', error);
      ToastManager.error(
        'Lost connection to notification service. Trying to reconnect...',
        'Connection Error'
      );
    }
  }, [error]);

  // This component doesn't render any UI elements
  return null;
};

export default NotificationCenter;