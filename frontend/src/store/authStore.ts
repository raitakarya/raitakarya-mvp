import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<void>;
  signup: (data: { phone: string; name: string; email?: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (phone: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authApi.login({ phone, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Login failed', isLoading: false });
      throw error;
    }
  },

  signup: async (signupData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authApi.signup(signupData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Signup failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await authApi.getMe();
      set({ user: data.user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to load user', isLoading: false });
      localStorage.removeItem('token');
      set({ token: null });
    }
  },

  clearError: () => set({ error: null }),
}));
