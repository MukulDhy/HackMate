// src/store/slices/websocketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isConnected: false,
    connectWs: false,
    error: null,
    notifications: [],
    teamMessages: {},
    typingIndicators: {},
    onlineUsers: {},
    lastActivity: null,
    // id of hackathon that just ended and requires feedback popup
    pendingFeedbackHackathonId: null,
};

// Helper function to safely update nested state
const updateTeamMessages = (state, teamId, message) => {
    if (!state.teamMessages[teamId]) {
        state.teamMessages[teamId] = [];
    }

    // Keep only the last 100 messages per team to prevent memory issues
    if (state.teamMessages[teamId].length >= 100) {
        state.teamMessages[teamId].shift();
    }

    state.teamMessages[teamId].push(message);
};

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
            if (action.payload) {
                state.error = null;
            }
            state.lastActivity = new Date().toISOString();
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.lastActivity = new Date().toISOString();
        },
        connectionEstablished: (state) => {
            state.isConnected = true;
            state.error = null;
            state.lastActivity = new Date().toISOString();
        },
        teamMessage: (state, action) => {
            const { teamId, message } = action.payload;
            updateTeamMessages(state, teamId, message);
            state.lastActivity = new Date().toISOString();
        },
        typingIndicator: (state, action) => {
            const { teamId, userId, isTyping, timestamp } = action.payload;

            if (!state.typingIndicators[teamId]) {
                state.typingIndicators[teamId] = {};
            }

            if (isTyping) {
                state.typingIndicators[teamId][userId] = timestamp;
            } else {
                delete state.typingIndicators[teamId][userId];
            }
            state.lastActivity = new Date().toISOString();
        },
        unreadNotifications: (state, action) => {
            state.notifications = action.payload.notifications;
            state.lastActivity = new Date().toISOString();
        },
        newNotification: (state, action) => {
            // Add new notification to the beginning of the array
            state.notifications.unshift(action.payload.notification);

            // Keep only the last 50 notifications
            if (state.notifications.length > 50) {
                state.notifications.pop();
            }
            state.lastActivity = new Date().toISOString();
        },
        notificationsRead: (state, action) => {
            const { notificationIds } = action.payload;
            state.notifications = state.notifications.map((notification) =>
                notificationIds.includes(notification.id)
                    ? { ...notification, read: true }
                    : notification,
            );
            state.lastActivity = new Date().toISOString();
        },
        presenceUpdate: (state, action) => {
            const { userId, lastSeen, teamId } = action.payload;

            if (!state.onlineUsers[teamId]) {
                state.onlineUsers[teamId] = {};
            }

            state.onlineUsers[teamId][userId] = lastSeen;
            state.lastActivity = new Date().toISOString();
        },
        // hackathonTimer: (state, action) => {
        //   const { hackathonId, ...timerData } = action.payload;
        //   state.hackathonTimers[hackathonId] = {
        //     ...timerData,
        //     lastUpdated: new Date().toISOString(),
        //   };
        //   state.lastActivity = new Date().toISOString();
        // },
        // hackathonSubscribed: (state, action) => {
        //   const { hackathonId } = action.payload;
        //   state.subscribedHackathons[hackathonId] = true;
        //   state.lastActivity = new Date().toISOString();
        // },
        // hackathonStarted: (state, action) => {
        //   const { hackathonId, timestamp } = action.payload;
        //   if (state.hackathonTimers[hackathonId]) {
        //     state.hackathonTimers[hackathonId].status = "running";
        //     state.hackathonTimers[hackathonId].hasStarted = true;
        //   }
        //   state.lastActivity = new Date().toISOString();
        // },
        hackathonEnded: (state, action) => {
            // payload expected to be { hackathonId: string | null }
            state.pendingFeedbackHackathonId =
                action.payload?.hackathonId ?? null;
            state.lastActivity = new Date().toISOString();
        },
        // teamCreated: (state, action) => {
        //   // Handle team created event
        //   state.lastActivity = new Date().toISOString();
        // },
        teamUpdated: (state, action) => {
            // Handle team updated event
            state.lastActivity = new Date().toISOString();
        },
        clearMessages: (state, action) => {
            const { teamId } = action.payload;
            if (teamId && state.teamMessages[teamId]) {
                state.teamMessages[teamId] = [];
            }
            state.lastActivity = new Date().toISOString();
        },
        clearError: (state) => {
            state.error = null;
            state.lastActivity = new Date().toISOString();
        },
        changeConnect: (state, action) => {
            const { changeStatus } = action.payload;
            state.connectWs = changeStatus;
        },
        resetWebSocketState: () => initialState,
    },
});

export const {
    setConnectionStatus,
    setError,
    connectionEstablished,
    teamMessage,
    typingIndicator,
    unreadNotifications,
    newNotification,
    notificationsRead,
    presenceUpdate,
    // hackathonTimer,
    // hackathonSubscribed,
    // hackathonStarted,
    hackathonEnded,
    // teamCreated,
    teamUpdated,
    clearMessages,
    changeConnect,
    clearError,
    resetWebSocketState,
} = websocketSlice.actions;

export default websocketSlice.reducer;
