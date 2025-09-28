import { WS_API_URL } from '../config/API_URL';

type AppState = {
  auth?: {
    user?: { currentHackathonId?: string } | null;
    token?: string | null;
  };
  [key: string]: unknown;
};

type ReduxLikeStore = {
  dispatch: (action: { type: string; payload?: unknown }) => void;
  getState: () => AppState | unknown;
};

class WebSocketService {
  store: ReduxLikeStore;
  socket: WebSocket | null = null;
  reconnectInterval: number = 1000;
  maxReconnectInterval: number = 30000;
  reconnectAttempts: number = 0;
  pingInterval: ReturnType<typeof setInterval> | null = null;
  messageQueue: Array<unknown> = [];
  isConnected: boolean = false;

  constructor(store: ReduxLikeStore) {
    this.store = store;
  }

  connect(token?: string) {
    if (!token) return;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${WS_API_URL}?token=${encodeURIComponent(token)}`;
      this.socket = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnection();
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.store.dispatch({ type: 'websocket/setConnectionStatus', payload: true });

      // Process any queued messages and start heartbeat
      this.processMessageQueue();
      this.startHeartbeat();

      // Auto-subscribe to user's current hackathon if available
      try {
        const maybeState = this.store.getState();
        const state = (maybeState as AppState) || undefined;
        const currentHackathonId = state?.auth?.user?.currentHackathonId;
        if (currentHackathonId) {
          console.log(`Subscribing to hackathon ${currentHackathonId} on websocket open`);
          this.sendMessage({ type: 'hackathon.subscribe', hackathonId: currentHackathonId } as Record<string, unknown>);
        }
      } catch (err) {
        console.warn('Error auto-subscribing to hackathon on websocket open', err);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      this.isConnected = false;
      this.store.dispatch({ type: 'websocket/setConnectionStatus', payload: false });
      this.stopHeartbeat();
      this.handleReconnection();
    };

    this.socket.onerror = (errorEvent) => {
      // errorEvent may be an Event, not necessarily an Error
      let message: string;
      try {
        if (errorEvent instanceof Error) message = errorEvent.message;
        else {
          const ev = errorEvent as unknown as { message?: string } | undefined;
          if (ev && typeof ev.message === 'string') message = ev.message;
          else message = String(errorEvent);
        }
      } catch (e) {
        message = String(errorEvent);
      }

      console.error('WebSocket error:', message);
      this.store.dispatch({ type: 'websocket/setError', payload: message });
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as Record<string, unknown> | null;
        if (parsed) this.handleIncomingMessage(parsed);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  handleIncomingMessage(message: unknown) {
    const msg = (message as Record<string, unknown>) || {};
    const type = typeof msg.type === 'string' ? (msg.type as string) : undefined;
    const payload = Object.keys(msg).length ? { ...msg } : undefined;

    switch (type) {
      case 'connection.established':
        this.store.dispatch({ type: 'websocket/connectionEstablished', payload });
        break;

      case 'team.message':
        this.store.dispatch({ type: 'team/webSocketTeamMessageReceived', payload });
        break;

      case 'team.typing':
        this.store.dispatch({ type: 'websocket/typingIndicator', payload });
        break;

      case 'notifications.unread':
        this.store.dispatch({ type: 'websocket/unreadNotifications', payload });
        break;

      case 'notification':
        this.store.dispatch({ type: 'websocket/newNotification', payload });
        break;

      case 'notifications.marked_read':
        this.store.dispatch({ type: 'websocket/notificationsRead', payload });
        break;

      case 'presence.update':
        this.store.dispatch({ type: 'team/webSocketPresenceUpdateReceived', payload });
        break;

      case 'hackathon.timer':
        this.store.dispatch({ type: 'websocket/hackathonTimer', payload });
        break;

      case 'hackathon.subscribed':
        this.store.dispatch({ type: 'websocket/hackathonSubscribed', payload });
        break;

      case 'hackathon.started':
        this.store.dispatch({ type: 'websocket/hackathonStarted', payload });
        break;

      case 'hackathon.ended':
        // payload expected to contain hackathonId and optionally other metadata
        this.store.dispatch({ type: 'websocket/hackathonEnded', payload });
        break;

      case 'team.created':
        this.store.dispatch({ type: 'websocket/teamCreated', payload });
        break;

      case 'team.updated':
        this.store.dispatch({ type: 'websocket/teamUpdated', payload });
        break;

      case 'error':
        this.store.dispatch({ type: 'websocket/error', payload });
        break;

      default:
        console.warn('Unhandled WebSocket message type:', type);
    }
  }

  sendMessage(message: unknown) {
    try {
      const payload = message as Record<string, unknown>;
      if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(payload));
      } else {
        this.messageQueue.push(payload);
      }
    } catch (err) {
      console.warn('Failed to queue/send WS message', err);
    }
  }

  processMessageQueue() {
    if (!this.socket) return;
    while (this.messageQueue.length > 0 && this.socket.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (!message) break;
      try {
        this.socket.send(JSON.stringify(message));
      } catch (err) {
        console.warn('Failed to send queued message', err);
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.isConnected) this.sendMessage({ type: 'presence.ping' } as Record<string, unknown>);
    }, 25000);
  }

  stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  handleReconnection() {
    const maybeState = this.store.getState();
    const state = (maybeState as AppState) || undefined;
    const token = state?.auth?.token;
    if (token && this.reconnectAttempts < 10) {
      const delay = Math.min(
        this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts),
        this.maxReconnectInterval,
      );

      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(String(token));
      }, delay);
    }
  }

  disconnect() {
    this.stopHeartbeat();
    this.isConnected = false;
    this.reconnectAttempts = 0;

    if (this.socket) {
      try {
        this.socket.close(1000, 'User initiated disconnect');
      } catch (err) {
        // ignore
      }
      this.socket = null;
    }

    this.store.dispatch({ type: 'websocket/setConnectionStatus', payload: false });
  }

  // Specific message sending methods
  sendTeamMessage(teamId: string, text: string) {
    this.sendMessage({ type: 'team.sendMessage', teamId, text } as Record<string, unknown>);
  }

  sendTypingIndicator(teamId: string, isTyping: boolean) {
    this.sendMessage({ type: 'team.typing', teamId, isTyping } as Record<string, unknown>);
  }

  markNotificationsRead(notificationIds: string[]) {
    this.sendMessage({ type: 'notifications.markRead', notificationIds } as Record<string, unknown>);
  }

  subscribeToHackathon(hackathonId: string) {
    this.sendMessage({ type: 'hackathon.subscribe', hackathonId } as Record<string, unknown>);
  }
}

let webSocketServiceInstance: WebSocketService | null = null;

export const getWebSocketService = (store: ReduxLikeStore) => {
  if (!webSocketServiceInstance) webSocketServiceInstance = new WebSocketService(store);
  return webSocketServiceInstance;
};

export const initWebSocketService = (store: ReduxLikeStore) => getWebSocketService(store);
