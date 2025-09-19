// services/teamService.ts
import {api} from './api'; // Your configured axios instance

export interface Team {
  _id: string;
  name: string;
  hackathonId: string;
  teamMember: any[]; // Array of user objects
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  teamId: string;
  senderId: string;
  text: string;
  messageType?: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'seen';
}

export const teamService = {
  // Get team by user ID and hackathon ID
  getUserTeamByHackathon: async (userId: string, hackathonId: string) => {
    const response = await api.get(`/teams/user/${userId}/hackathon/${hackathonId}`);
    return response.data;
  },

  // Get team messages
  getTeamMessages: async (teamId: string, page = 1, limit = 50) => {
    const response = await api.get(`/messages/team/${teamId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Send a new message
  sendMessage: async (messageData: {
    teamId: string;
    senderId: string;
    text: string;
    messageType?: string;
  }) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Update message status
  updateMessageStatus: async (messageId: string, status: 'sent' | 'delivered' | 'seen') => {
    const response = await api.patch(`/messages/${messageId}/status`, { status });
    return response.data;
  },
};