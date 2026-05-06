import api from './axios';

export interface LoginData {
  token: string;
  userId: number;
  username: string;
  role: string;
}

export const authApi = {
  login: (username: string, password: string): Promise<LoginData> =>
    api.post('/auth/login', { username, password }),

  register: (data: { username: string; password: string; email?: string; phone?: string; nickname?: string }) =>
    api.post('/auth/register', data),
};
