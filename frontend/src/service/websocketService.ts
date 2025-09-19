import {API_URL, WS_API_URL} from "../config/API_URL"
class WebSocketService {
  constructor(store) {
    this.store = store;
    this.socket = null;
    this.reconnectInterval = 1000;
    this.maxReconnectInterval = 30000;
    this.reconnectAttempts = 0;
    this.pingInterval = null;
    this.messageQueue = [];
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${WS_API_URL}?token=${token}`;
      this.socket = new WebSocket(wsUrl);

      this.setupEventHandlers();
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      this.handleReconnection();
    }
  }

  setupEventHandlers() {
    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.store.dispatch({
        type: "websocket/setConnectionStatus",
        payload: true,
      });

      // Process any queued messages
      this.processMessageQueue();

      // Start heartbeat
      this.startHeartbeat();
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      this.isConnected = false;
      this.store.dispatch({
        type: "websocket/setConnectionStatus",
        payload: false,
      });
      this.stopHeartbeat();
      this.handleReconnection();
    };

    this.socket.onerror = (error) => {
      console.log(error)
      console.error("WebSocket error:", error);
      this.store.dispatch({
        type: "websocket/setError",
        payload: error.message,
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }

  handleIncomingMessage(message) {
    const { type, ...payload } = message;

    switch (type) {
      case "connection.established":
        this.store.dispatch({
          type: "websocket/connectionEstablished",
          payload,
        });
        break;

      case "team.message":
        this.store.dispatch({ type: "websocket/teamMessage", payload });
        break;

      case "team.typing":
        this.store.dispatch({ type: "websocket/typingIndicator", payload });
        break;

      case "notifications.unread":
        this.store.dispatch({ type: "websocket/unreadNotifications", payload });
        break;

      case "notification":
        this.store.dispatch({ type: "websocket/newNotification", payload });
        break;

      case "notifications.marked_read":
        this.store.dispatch({ type: "websocket/notificationsRead", payload });
        break;

      case "presence.update":
        this.store.dispatch({ type: "websocket/presenceUpdate", payload });
        break;

      case "hackathon.timer":
        this.store.dispatch({ type: "websocket/hackathonTimer", payload });
        break;

      case "hackathon.subscribed":
        this.store.dispatch({ type: "websocket/hackathonSubscribed", payload });
        break;

      case "hackathon.started":
        this.store.dispatch({ type: "websocket/hackathonStarted", payload });
        break;

      case "hackathon.ended":
        this.store.dispatch({ type: "websocket/hackathonEnded", payload });
        break;

      case "team.created":
        this.store.dispatch({ type: "websocket/teamCreated", payload });
        break;

      case "team.updated":
        this.store.dispatch({ type: "websocket/teamUpdated", payload });
        break;

      case "error":
        this.store.dispatch({ type: "websocket/error", payload });
        break;

      default:
        console.warn("Unhandled WebSocket message type:", type);
    }
  }

  sendMessage(message) {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      // Queue message for later delivery
      this.messageQueue.push(message);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  startHeartbeat() {
    this.pingInterval = setInterval(() => {
      if (this.isConnected) {
        this.sendMessage({ type: "presence.ping" });
      }
    }, 25000); // Send ping every 25 seconds
  }

  stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  handleReconnection() {
    const token = this.store.getState().auth?.token;

    if (token && this.reconnectAttempts < 10) {
      const delay = Math.min(
        this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts),
        this.maxReconnectInterval
      );

      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(token);
      }, delay);
    }
  }

  disconnect() {
    this.stopHeartbeat();
    this.isConnected = false;
    this.reconnectAttempts = 0;

    if (this.socket) {
      this.socket.close(1000, "User initiated disconnect");
      this.socket = null;
    }

    this.store.dispatch({
      type: "websocket/setConnectionStatus",
      payload: false,
    });
  }

  // Specific message sending methods
  sendTeamMessage(teamId, text) {
    this.sendMessage({
      type: "team.sendMessage",
      teamId,
      text,
    });
  }

  sendTypingIndicator(teamId, isTyping) {
    this.sendMessage({
      type: "team.typing",
      teamId,
      isTyping,
    });
  }

  markNotificationsRead(notificationIds) {
    this.sendMessage({
      type: "notifications.markRead",
      notificationIds,
    });
  }

  subscribeToHackathon(hackathonId) {
    this.sendMessage({
      type: "hackathon.subscribe",
      hackathonId,
    });
  }
}

// Singleton instance
let webSocketServiceInstance = null;

export const getWebSocketService = (store) => {
  if (!webSocketServiceInstance) {
    webSocketServiceInstance = new WebSocketService(store);
  }
  return webSocketServiceInstance;
};

export const initWebSocketService = (store) => {
  return getWebSocketService(store);
};
