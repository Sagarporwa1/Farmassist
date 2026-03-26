// API Service to Connect Frontend with Backend
import { Platform } from 'react-native';

// Update this IP address to match your local machine's IP address (IPv4)
// When running on physical device, use the local IP instead of localhost
// IP fetched from ipconfig: 172.25.216.177
const BASE_URL = 'http://172.25.216.177:5000/api';

export const api = {
  // Health Check
  checkHealth: async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Mandi Prices
  getMandiPrices: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${BASE_URL}/mandi-prices${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch mandi prices:', error);
      throw error;
    }
  },

  // Predictions (e.g., crop disease, soil analysis)
  getPredictions: async (commodity) => {
    try {
      const response = await fetch(`${BASE_URL}/predictions/${commodity}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to get predictions:', error);
      throw error;
    }
  },

  // Stocks
  getStocks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/stocks`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
      throw error;
    }
  },

  addStock: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to add stock:', error);
      throw error;
    }
  },

  // Residue Pickups
  getResidueRequests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/residue/requests`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch residue requests:', error);
      throw error;
    }
  },

  addResiduePickup: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/residue/pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to add residue pickup:', error);
      throw error;
    }
  }
};

export default api;
