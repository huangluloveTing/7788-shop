import { create } from 'zustand';
import { authApi } from '../api/authApi';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; password: string; email?: string; phone?: string; nickname?: string }) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (username, password) => {
    const data = await authApi.login(username, password);
    localStorage.setItem('token', data.token);
    set({
      user: { id: data.userId, username: data.username, role: data.role } as User,
      token: data.token,
      isAuthenticated: true,
    });
  },

  register: async (form) => {
    await authApi.register(form);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guestCart');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },

  fetchProfile: async () => {
    try {
      const { userApi } = await import('../api/userApi');
      const profile = await userApi.getProfile();
      set({ user: profile as unknown as User });
    } catch {
      // ignore
    }
  },
}));
