// src/services/authService.ts
import { api } from './api';
import { User } from '../store/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends Omit<User, 'id'> {
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
     try {
    const response = await api.post('/api/user/login', credentials);
    return response.data;
  }  catch (error: any) {
      // Extract meaningful error information
      if (error.response?.data) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.errors || null,
          errorCode: error.response.data.errorCode
        };
      } else if (error.request) {
        throw { message: 'Network error: Could not connect to server' };
      } else {
        throw { message: error.message || 'Login failed' };
      }
    }
  },
  async register(userData: { name: string; email: string; password: string }) {
    try {
      const response = await api.post('/api/user/register', userData);
      return response.data;
    } catch (error: any) {
      // Extract meaningful error information
      if (error.response?.data) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.errors || null,
          errorCode: error.response.data.errorCode
        };
      } else if (error.request) {
        throw { message: 'Network error: Could not connect to server' };
      } else {
        throw { message: error.message || 'Registration failed' };
      }
    }
  },
  async googleLogin(userData: { email: string; displayName: string; photoURL?: string; email_verified: boolean }) {
    try {
      console.log("Google login data:", userData);
      const response = await api.post('/api/user/google', userData);
      console.log("Reached/////");
      return response.data;
    } catch (error: any) {
      // Extract meaningful error information
      if (error.response?.data) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.errors || null,
          errorCode: error.response.data.errorCode
        };
      } else if (error.request) {
        throw { message: 'Network error: Could not connect to server' };
      } else {
        throw { message: error.message || 'Google failed | Please Login after sometimes' };
      }
    }
  },

  async logout(): Promise<void> {
    await api.post('/api/user/logout');
  },

  async verifyToken(token: string): Promise<AuthResponse> {
     try {
    const response = await api.get('/api/user/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
     } catch (error: any) {
      // Extract meaningful error information
      if (error.response?.data) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.errors || null,
          errorCode: error.response.data.errorCode
        };
      } else if (error.request) {
        throw { message: 'Network error: Could not connect to server' };
      } else {
        throw { message: error.message || 'Verification Token failed' };
      }
    }
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};