import api from './axios';
import type { Order, PageResult } from '../types';

export const orderApi = {
  create: (addressId: number): Promise<Order> =>
    api.post('/orders', { addressId }),

  list: (params?: { status?: string; page?: number; pageSize?: number }): Promise<PageResult<Order>> =>
    api.get('/orders', { params }),

  detail: (id: number): Promise<Order> => api.get(`/orders/${id}`),

  pay: (id: number): Promise<void> => api.put(`/orders/${id}/pay`),

  cancel: (id: number): Promise<void> => api.put(`/orders/${id}/cancel`),
};
