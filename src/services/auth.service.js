import api from '../api';
import { saveToken } from '../tokenManager';

export const authService = {
  async register(email, password, displayName = 'Новый Пользователь') {
    const response = await api.post('/auth/register', { email, password, displayName });
    if (response.data?.token) {
      saveToken(response.data.token, response.data.refreshToken, response.data.expiresIn);
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      saveToken(response.data.token, response.data.refreshToken, response.data.expiresIn);
    }
    return response.data;
  },

  async loginWithGoogle(idToken) {
    const response = await api.post('/auth/google', { idToken });
    if (response.data?.token) {
      saveToken(response.data.token, response.data.refreshToken, response.data.expiresIn);
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(updates) {
    const response = await api.put('/auth/me', updates);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
    window.location.href = '/login';
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};