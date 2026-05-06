import api from './axios';
import type { Address } from '../types';

export const userApi = {
  getProfile: () => api.get('/user/profile'),

  updateProfile: (data: { nickname?: string; email?: string; phone?: string }) =>
    api.put('/user/profile', data),

  getAddresses: (): Promise<Address[]> => api.get('/user/addresses'),

  createAddress: (data: Omit<Address, 'id'>): Promise<Address> =>
    api.post('/user/addresses', data),

  updateAddress: (id: number, data: Partial<Address>): Promise<void> =>
    api.put(`/user/addresses/${id}`, data),

  deleteAddress: (id: number): Promise<void> =>
    api.delete(`/user/addresses/${id}`),

  setDefaultAddress: (id: number): Promise<void> =>
    api.put(`/user/addresses/${id}/default`),
};
