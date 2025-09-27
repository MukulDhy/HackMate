// teamSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { teamService, Team, Message as APIMessage } from '../../service/teamService';
import { webSocketService } from "../index";

// Interfaces
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  status: 'active' | 'away' | 'offline';
  avatar: string;
  email?: string;
  skills?: string[];
  experience?: string;
}

interface Message {
  id: string;
  teamId: string;
  senderId: string;
  text: string;
  messageType?: string;
  time: string;
  status: 'sent' | 'delivered' | 'seen';
  createdAt?: string;
  isOptimistic?: boolean;
}

interface TeamState {
  team: Team | null;
  teamName: string;
  members: TeamMember[];
  messages: Message[];
  currentUser: string;
  isLoading: boolean;
  error: string | null;

  typingIndicators: string[];
  onlineUsers: string[];
  lastActivity: string | null;
  
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const initialState: TeamState = {
  team: null,
  teamName: '',
  members: [],
  messages: [],
  currentUser: '',
  isLoading: false,
  error: null,
  typingIndicators: [],
  onlineUsers: [],
  lastActivity: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalMessages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

// Async thunks
export const fetchUserTeam = createAsyncThunk(
  'team/fetchUserTeam',
  async ({ userId, hackathonId }: { userId: string; hackathonId: string }, { rejectWithValue }) => {
    try {
      const response = await teamService.getUserTeamByHackathon(userId, hackathonId);
      return { ...response.data, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team');
    }
  }
);

export const fetchTeamMessages = createAsyncThunk(
  'team/fetchTeamMessages',
  async ({ teamId, page = 1 }: { teamId: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await teamService.getTeamMessages(teamId, page);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'team/sendMessage',
  async (messageData: { teamId: string; text: string; messageType?: string }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as { team: TeamState };
      const senderId = state.team.currentUser;
      
      // Add optimistic message first
      const tempMessageId = `temp-${Date.now()}`;
      dispatch(addOptimisticMessage({
        id: tempMessageId,
        teamId: messageData.teamId,
        senderId,
        text: messageData.text,
        messageType: messageData.messageType,
        time: new Date().toISOString(),
        isOptimistic: true,
      }));

      if (webSocketService.isConnected) {
        webSocketService.sendTeamMessage(messageData.teamId, messageData.text, messageData.messageType);
        
        // Return the optimistic message data for immediate update
        return {
          _id: tempMessageId,
          teamId: messageData.teamId,
          senderId,
          text: messageData.text,
          messageType: messageData.messageType,
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        };
      } else {
        // Fallback to REST API
        const response = await teamService.sendMessage({
          ...messageData,
          senderId,
        });
        return response.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.members = action.payload;
    },
    addMember: (state, action: PayloadAction<TeamMember>) => {
      state.members.push(action.payload);
    },
    addOptimisticMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ id: string; status: 'sent' | 'delivered' | 'seen' }>) => {
      const { id, status } = action.payload;
      const message = state.messages.find(m => m.id === id);
      if (message) {
        message.status = status;
      }
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateMemberStatus: (state, action: PayloadAction<{ id: string; status: 'active' | 'away' | 'offline' }>) => {
      const { id, status } = action.payload;
      const member = state.members.find(m => m._id === id);
      if (member) {
        member.status = status;
      }
    },
    
    webSocketTeamMessageReceived: (state, action: PayloadAction<any>) => {
      const { teamId, message } = action.payload;
     
      if (state.team && state.team._id === teamId) {
        const newMessage: Message = {
          id: message._id || message.id,
          teamId: teamId,
          senderId: message?.sender?._id || '',
          text: message.text,
          messageType: "text",
          time: new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
          createdAt: message.createdAt,
        };

        // Replace optimistic message or add new one
        const optimisticIndex = state.messages.findIndex(m => m.isOptimistic && m.text === message.text);
        if (optimisticIndex !== -1) {
          state.messages[optimisticIndex] = newMessage;
        } else {
          state.messages.push(newMessage);
        }
      }
      state.lastActivity = new Date().toISOString();
    },
    webSocketTypingIndicatorReceived: (state, action: PayloadAction<any>) => {
      const { teamId, userId, isTyping, timestamp } = action.payload;
      
      if (state.team && state.team._id === teamId) {
        if (isTyping) {
          state.typingIndicators[userId] = timestamp;
        } else {
          delete state.typingIndicators[userId];
        }
      }
      state.lastActivity = new Date().toISOString();
    },
    webSocketPresenceUpdateReceived: (state, action: PayloadAction<any>) => {
      const { userId, lastSeen, teamId } = action.payload;
      
      if (state.team && state.team._id === teamId) {
        state.onlineUsers[userId] = lastSeen;
        
        // Update member status based on last seen
        const member = state.members.find(m => m._id === userId);
        if (member) {
          const lastSeenTime = new Date(lastSeen).getTime();
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          
          if (lastSeenTime > fiveMinutesAgo) {
            member.status = 'active';
          } else {
            member.status = 'away';
          }
        }
      }
      state.lastActivity = new Date().toISOString();
    },
    webSocketTeamUpdated: (state, action: PayloadAction<any>) => {
      // Handle team updates from WebSocket
      if (state.team && state.team._id === action.payload.teamId) {
        state.team = { ...state.team, ...action.payload.teamData };
        state.teamName = action.payload.teamData.name || state.teamName;
      }
      state.lastActivity = new Date().toISOString();
    },
    sendTypingIndicator: (state, action: PayloadAction<{ teamId: string; isTyping: boolean }>) => {
      if (webSocketService.isConnected) {
        webSocketService.sendTypingIndicator(action.payload.teamId, action.payload.isTyping);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user team
      .addCase(fetchUserTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.team = action.payload;
        state.teamName = action.payload.name;
        state.currentUser = action.payload.userId;
        
        // Map team members from API response
        state.members = action.payload.teamMember.map((member: any) => ({
          _id: member._id || member.id,
          name: member.name,
          role: member.role || '',
          status: 'active',
          avatar: member.avatar || member.name.charAt(0),
          email: member.email,
          skills: member.skills,
          experience: member.experience,
        }));
      })
      .addCase(fetchUserTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch team messages
      .addCase(fetchTeamMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, pagination } = action.payload;
        
        // Map API messages to local format
        state.messages = messages.map((msg: APIMessage) => ({
          id: msg._id,
          teamId: msg.teamId,
          senderId: msg.senderId,
          text: msg.text,
          messageType: msg.messageType,
          time: new Date(msg.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
          createdAt: msg.createdAt,
        }));
        
        state.pagination = pagination;
      })
      .addCase(fetchTeamMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        // If message was sent via REST API (not WebSocket), update it
        if (!action.payload.isOptimistic) {
          const newMessage = action.payload;
          const index = state.messages.findIndex(m => m.id.startsWith('temp-'));
          
          if (index !== -1) {
            state.messages[index] = {
              id: newMessage._id,
              teamId: newMessage.teamId,
              senderId: newMessage.senderId,
              text: newMessage.text,
              messageType: newMessage.messageType,
              time: new Date(newMessage.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'delivered',
              createdAt: newMessage.createdAt,
            };
          }
        }
        // If message was sent via WebSocket, it will be handled by webSocketTeamMessageReceived
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
        // Mark optimistic message as failed
        const failedMessage = state.messages.find(m => m.isOptimistic);
        if (failedMessage) {
          failedMessage.status = 'sent'; // Or create a 'failed' status
        }
      });
  },
});

export const {
  setMembers,
  addMember,
  addOptimisticMessage,
  updateMessageStatus,
  setCurrentUser,
  clearMessages,
  updateMemberStatus,
  webSocketTeamMessageReceived,
  webSocketTypingIndicatorReceived,
  webSocketPresenceUpdateReceived,
  webSocketTeamUpdated,
  sendTypingIndicator,
} = teamSlice.actions;

export default teamSlice.reducer;
