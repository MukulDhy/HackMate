import { useEffect } from 'react';
import { webSocketService } from '@/store';
import { useWebSocket } from '@/hooks/websocketHooks';
import { useAuth } from '@/hooks/authHook';

const WebSocketManager = () => {
  const { isAuthenticated, user } = useAuth();
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (isAuthenticated && user?.token ) {
      webSocketService.connect(user.token);
    } else {
      webSocketService.disconnect();
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated, user?.token]);

  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated && user?.token && !isConnected) {
        webSocketService.connect(user.token);
      }
    };

    const handleOffline = () => {
      webSocketService.disconnect();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, user?.token, isConnected]);

  return null; // 👈 empty component
};

export default WebSocketManager;
