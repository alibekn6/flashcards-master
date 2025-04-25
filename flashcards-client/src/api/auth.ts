import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  async register(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      console.log('Register response:', response.data);
      const token =
        response.data.token?.accessToken ||
        response.data.access_token ||
        response.data.accessToken ||
        response.data.token;
      if (!token) {
        throw new Error('No access token returned. Response: ' + JSON.stringify(response.data));
      }
      localStorage.setItem('token', token);
      return response.data;
    } catch (err: any) {
      console.error('Register error:', err.response?.data, err.message);
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log('Login response:', response.data);
      const token =
        response.data.token?.accessToken ||
        response.data.access_token ||
        response.data.accessToken ||
        response.data.token;
      if (!token) {
        throw new Error('No access token returned. Response: ' + JSON.stringify(response.data));
      }
      localStorage.setItem('token', token);
      return response.data;
    } catch (err: any) {
      console.error('Login error:', err.response?.data, err.message);
      throw new Error(err.response?.data?.message || 'Login failed: Invalid credentials');
    }
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('User response:', response.data);
    return response.data;
  },
};