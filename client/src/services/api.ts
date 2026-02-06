import axios from 'axios';

// Determine API URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Production mode
    return import.meta.env.VITE_API_URL || 'https://splitbill-api.onrender.com/api';
  }
  // Development mode - use proxy
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getUser: () => api.get('/auth/me'),
};

export const groupService = {
  createGroup: (name: string) =>
    api.post('/groups', { name }),
  getGroups: () =>
    api.get('/groups'),
  getGroup: (groupId: string) =>
    api.get(`/groups/${groupId}`),
  addMember: (groupId: string, email: string) =>
    api.post(`/groups/${groupId}/members`, { email }),
};

export const expenseService = {
  createExpense: (groupId: string, description: string, amount: number, splits: Record<string, number>) =>
    api.post('/expenses', { groupId, description, amount, splits }),
  getExpenses: (groupId: string) =>
    api.get(`/expenses/group/${groupId}`),
  updateExpense: (expenseId: string, description?: string, amount?: number, splits?: Record<string, number>) =>
    api.put(`/expenses/${expenseId}`, { description, amount, splits }),
  deleteExpense: (expenseId: string) =>
    api.delete(`/expenses/${expenseId}`),
};

export const settlementService = {
  settlePayment: (groupId: string, toUserId: string, amount: number) =>
    api.post('/settlements', { groupId, toUserId, amount }),
  getSettlements: (groupId: string) =>
    api.get(`/settlements/group/${groupId}`),
  calculateBalance: (groupId: string) =>
    api.get(`/settlements/balance/${groupId}`),
};

export default api;
