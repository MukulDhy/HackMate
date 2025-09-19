// teamSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { teamService, Team, Message as APIMessage } from '../../service/teamService';
import { useUser } from '../../hooks/authHook';
 // Your user hook

// Update interfaces to match backend models
interface TeamMember {
  id: string;
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
}

interface TeamState {
  team: Team | null;
  teamName: string;
  members: TeamMember[];
  messages: Message[];
  currentUser: string;
  isLoading: boolean;
  error: string | null;
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
      return response.data;
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
  async (messageData: { teamId: string; text: string; messageType?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { team: TeamState };
      const senderId = state.team.currentUser;
      
      const response = await teamService.sendMessage({
        ...messageData,
        senderId,
      });
      
      return response.data;
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
    addLocalMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'status'>>) => {
      const newMessage: Message = {
        ...action.payload,
        id: `temp-${Date.now()}`, // Temporary ID for optimistic UI update
        status: 'sent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      state.messages.push(newMessage);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'sent' | 'delivered' | 'seen' }>
    ) => {
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
    updateMemberStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'active' | 'away' | 'offline' }>
    ) => {
      const { id, status } = action.payload;
      const member = state.members.find(m => m.id === id);
      if (member) {
        member.status = status;
      }
    },
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
        
        // Map team members from API response
        state.members = action.payload.teamMember.map((member: any) => ({
          id: member._id || member.id,
          name: member.name,
          role: '', // You might need to adjust this based on your data structure
          status: 'active', // Default status
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
          status: 'delivered', // Assuming messages from server are delivered
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
        // Replace temporary message with the one from server
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
        } else {
          // If no temporary message found, add the new one
          state.messages.push({
            id: newMessage._id,
            teamId: newMessage.teamId,
            senderId: newMessage.senderId,
            text: newMessage.text,
            messageType: newMessage.messageType,
            time: new Date(newMessage.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered',
            createdAt: newMessage.createdAt,
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
        // You might want to mark the temporary message as failed
      });
  },
});

export const {
  setMembers,
  addMember,
  addLocalMessage,
  updateMessageStatus,
  setCurrentUser,
  clearMessages,
  updateMemberStatus,
} = teamSlice.actions;

export default teamSlice.reducer;