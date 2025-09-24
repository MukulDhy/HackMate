import { Hackathon, HackathonFilters, HackathonResponse } from '@/types/hackathon';
import { api } from './api';

// Cache implementation
const HACKATHON_CACHE_KEY = 'hackathons_cache';
const CACHE_DURATION = 1000; // 1 second
// const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

interface CacheData {
  timestamp: number;
  data: HackathonResponse;
  filters: HackathonFilters;
}

const getCachedHackathons = (filters: HackathonFilters): HackathonResponse | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(HACKATHON_CACHE_KEY);
    if (!cached) return null;
    
    const cacheData: CacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION;
    const isSameFilters = JSON.stringify(cacheData.filters) === JSON.stringify(filters);
    
    return !isExpired && isSameFilters ? cacheData.data : null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

const setCachedHackathons = (data: HackathonResponse, filters: HackathonFilters) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data,
      filters
    };
    
    localStorage.setItem(HACKATHON_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};

export const hackathonService = {
  async getHackathons(filters: HackathonFilters): Promise<HackathonResponse> {
    // Check cache first
    const cached = getCachedHackathons(filters);
    if (cached) {
      return cached;
    }
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.mode) queryParams.append('mode', filters.mode);
    if (filters.tags && filters.tags.length > 0) queryParams.append('tags', filters.tags.join(','));
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    
    try {
      const response = await api.get(`/api/hackathons?${queryParams.toString()}`);
      const data: HackathonResponse = response.data;
      
      // Cache the response
      setCachedHackathons(data, filters);
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hackathons');
    }
  },
  
  async getHackathonById(id: string): Promise<Hackathon> {
    try {
      const response = await api.get(`/hackathons/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hackathon');
    }
  },

  async joinHackathon(id : string) : Promise<Hackathon>{
     try {
      const response = await api.post(`/api/hackathons/${id}/join`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hackathon');
    }
  },
  async leaveHackathon(id : string) : Promise<Hackathon>{
     try {
      const response = await api.post(`/api/hackathons/${id}/leave`);
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hackathon');
    }
  },

  // Get single hackathon
  getById: async (id: string): Promise<Hackathon> => {
    const response = await api.get(`/api/hackathons/${id}`);
    return response.data.data;
  },


};