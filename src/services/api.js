import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.HEALTH);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const scoreTransaction = async (transactionData) => {
  try {
    const response = await api.post(API_ENDPOINTS.SCORE, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error scoring transaction:', error);
    throw error;
  }
};

export default api;