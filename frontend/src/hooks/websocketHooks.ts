// src/hooks/useWebSocket.js
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { webSocketService } from '../store/index';
import {
  setConnectionStatus,
  setError,
  clearError,
} from '../store/slices/websocketSlice';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { isConnected, error,connectWs } = useSelector((state) => state.websocket);
  const token = useSelector((state) => state?.auth.token);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (token) {
      try {
        webSocketService.connect(token);
      } catch (err) {
        dispatch(setError(err.message));
      }
    }
  }, [token, dispatch]);

  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  // Send team message
  const sendTeamMessage = useCallback((teamId, text) => {
    webSocketService.sendTeamMessage(teamId, text);
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback((teamId, isTyping) => {
    webSocketService.sendTypingIndicator(teamId, isTyping);
  }, []);

  // Mark notifications as read
  const markNotificationsRead = useCallback((notificationIds) => {
    webSocketService.markNotificationsRead(notificationIds);
  }, []);

  // Subscribe to hackathon
  const subscribeToHackathon = useCallback((hackathonId) => {
    webSocketService.subscribeToHackathon(hackathonId);
  }, []);

  // Clear error
  const clearWebSocketError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-connect on mount and when token changes
  useEffect(() => {
    if (token && !isConnected) {
      connect();
    }

    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [token, isConnected, connect, disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendTeamMessage,
    sendTypingIndicator,
    markNotificationsRead,
    subscribeToHackathon,
    clearWebSocketError,
  };
};

// Hook for team messages
export const useTeamMessages = (teamId) => {
  const messages = useSelector((state) => 
    state.websocket.teamMessages[teamId] || []
  );
  const typingIndicators = useSelector((state) => 
    state.websocket.typingIndicators[teamId] || {}
  );

  return { messages, typingIndicators };
};

// Hook for notifications
export const useNotifications = () => {
  const notifications = useSelector((state) => state.websocket.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return { notifications, unreadCount };
};

// Hook for hackathon timer
export const useHackathonTimer = (hackathonId) => {
  const timer = useSelector((state) => 
    state.websocket.hackathonTimers[hackathonId] || {}
  );
  
  return timer;
};

// Hook for online users
export const useOnlineUsers = (teamId) => {
  const onlineUsers = useSelector((state) => 
    state.websocket.onlineUsers[teamId] || {}
  );
  
  return onlineUsers;
};