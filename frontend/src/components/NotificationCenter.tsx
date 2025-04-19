import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS, WS_BASE_URL } from '../utils/constants';

interface TradeNotification {
  type: 'trade_request' | 'trade_accepted' | 'trade_rejected';
  message: string;
  tradeId?: string;
}

const NotificationCenter = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (!token) return;

    const ws = new WebSocket(`${WS_BASE_URL}/notifications`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ token }));
    };

    ws.onmessage = (event) => {
      const notification: TradeNotification = JSON.parse(event.data);
      
      switch (notification.type) {
        case 'trade_request':
          toast((t) => (
            <div onClick={() => {
              navigate(`/trades/${notification.tradeId}`);
              toast.dismiss(t.id);
            }} className="cursor-pointer">
              {notification.message}
            </div>
          ), { duration: 8000 });
          break;
        case 'trade_accepted':
          toast.success(notification.message);
          break;
        case 'trade_rejected':
          toast.error(notification.message);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Failed to connect to notification service');
    };

    // Reconnection logic
    ws.onclose = () => {
      setTimeout(() => {
        // Check if token is still valid before attempting to reconnect
        const currentToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        if (currentToken) {
          console.log('WebSocket disconnected. Attempting to reconnect...');
          // Component will re-render and attempt to reconnect
        }
      }, 5000);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [navigate]);

  return null;
};

export default NotificationCenter;