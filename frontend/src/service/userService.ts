// src/services/userService.ts
import { api } from './api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export const userService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put(`/users/${userData.id}`, userData);
    return response.data;
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};