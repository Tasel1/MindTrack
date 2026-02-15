import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const entryService = {
  // Create a new mood entry
  createEntry: async (entryData) => {
    try {
      const response = await api.post('/entries', entryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create entry');
    }
  },

  // Get user's mood entries
  getUserEntries: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.offset) params.append('offset', options.offset);
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);

      const response = await api.get(`/entries?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to get entries');
    }
  },

  // Get a specific mood entry
  getEntryById: async (entryId) => {
    try {
      const response = await api.get(`/entries/${entryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to get entry');
    }
  },

  // Update a mood entry
  updateEntry: async (entryId, entryData) => {
    try {
      const response = await api.put(`/entries/${entryId}`, entryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update entry');
    }
  },

  // Delete a mood entry
  deleteEntry: async (entryId) => {
    try {
      const response = await api.delete(`/entries/${entryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete entry');
    }
  },

  // Get mood trends
  getMoodTrends: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.period) params.append('period', options.period);
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);

      const response = await api.get(`/entries/trends?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to get mood trends');
    }
  },

  // Get calendar data
  getCalendarData: async (year, month) => {
    try {
      const params = new URLSearchParams();
      params.append('year', year);
      params.append('month', month);

      const response = await api.get(`/entries/calendar?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to get calendar data');
    }
  }
};

export { entryService };