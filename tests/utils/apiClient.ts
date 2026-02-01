import axios from 'axios';

const API_BASE_URL = process.env.API_URL || 'https://splitbill-api2.onrender.com/api';

interface AuthTokens {
  user1?: string;
  user2?: string;
  user3?: string;
  [key: string]: string | undefined;
}

const tokens: AuthTokens = {};

export const api = {
  // Auth endpoints
  async register(email: string, password: string, name: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        name,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async login(email: string, password: string, userId: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      tokens[userId] = response.data.token;
      return { success: true, data: response.data, token: response.data.token };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async getUser(userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tokens[userId]}` },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // Group endpoints
  async createGroup(groupName: string, userId: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/groups`,
        { name: groupName },
        { headers: { Authorization: `Bearer ${tokens[userId]}` } }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async getGroups(userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/groups`, {
        headers: { Authorization: `Bearer ${tokens[userId]}` },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async getGroupDetails(groupId: string, userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${tokens[userId]}` },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async addGroupMember(groupId: string, memberEmail: string, userId: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/groups/${groupId}/members`,
        { email: memberEmail },
        { headers: { Authorization: `Bearer ${tokens[userId]}` } }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // Expense endpoints
  async addExpense(
    groupId: string,
    description: string,
    amount: number,
    paidBy: string,
    members: string[],
    userId: string
  ) {
    try {
      // Calculate equal split
      const splitAmount = amount / members.length;
      const splits: { [key: string]: number } = {};
      members.forEach(member => {
        splits[member] = splitAmount;
      });

      const response = await axios.post(
        `${API_BASE_URL}/expenses`,
        {
          groupId,
          description,
          amount,
          splits,
        },
        { headers: { Authorization: `Bearer ${tokens[userId]}` } }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async getExpenses(groupId: string, userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/expenses/group/${groupId}`, {
        headers: { Authorization: `Bearer ${tokens[userId]}` },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // Settlement endpoints
  async getSettlements(groupId: string, userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/settlements/group/${groupId}`, {
        headers: { Authorization: `Bearer ${tokens[userId]}` },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  async recordSettlement(groupId: string, from: string, to: string, amount: number, userId: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settlements`,
        { groupId, from, to, amount },
        { headers: { Authorization: `Bearer ${tokens[userId]}` } }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  getTokens() {
    return tokens;
  },
};

export default api;
