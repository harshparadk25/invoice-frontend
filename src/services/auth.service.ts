import api from './api';
import type { IAuthResponse, IUser } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; whatsappNumber?: string }): Promise<IAuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<IAuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async me(): Promise<{ success: boolean; user: IUser }> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<IAuthResponse> {
    const res = await api.post('/auth/refresh-token', { refreshToken });
    return res.data;
  },
};
