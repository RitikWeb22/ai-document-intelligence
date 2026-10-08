import { create } from 'zustand';
import { authApi } from '../services/index.js';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('documind_user') || 'null'),
  token: localStorage.getItem('documind_token') || null,
  isAuthenticated: !!localStorage.getItem('documind_token'),
  loading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('documind_user', JSON.stringify(user));
    localStorage.setItem('documind_token', token);
    set({ user, token, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem('documind_user');
    localStorage.removeItem('documind_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },


  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { user, accessToken } = res.data;
        localStorage.setItem('documind_user', JSON.stringify(user));
        localStorage.setItem('documind_token', accessToken);
        set({ user, token: accessToken, isAuthenticated: true, loading: false });
        return true;
      }
    } catch (err) {
      set({ error: err.message || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success && res.data) {
        const { user, accessToken } = res.data;
        localStorage.setItem('documind_user', JSON.stringify(user));
        localStorage.setItem('documind_token', accessToken);
        set({ user, token: accessToken, isAuthenticated: true, loading: false });
        return true;
      }
    } catch (err) {
      set({ error: err.message || 'Registration failed', loading: false });
      return false;
    }
  }
}));
