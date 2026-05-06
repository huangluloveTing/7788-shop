import api from './axios';
import type { CartItem, GuestCartItem } from '../types';

export const cartApi = {
  list: (): Promise<CartItem[]> => api.get('/cart'),

  add: (productId: number, quantity: number): Promise<CartItem> =>
    api.post('/cart', { productId, quantity }),

  updateQuantity: (id: number, quantity: number): Promise<void> =>
    api.put(`/cart/${id}`, { quantity }),

  remove: (id: number): Promise<void> => api.delete(`/cart/${id}`),

  clear: (): Promise<void> => api.delete('/cart'),

  merge: (items: GuestCartItem[]): Promise<CartItem[]> =>
    api.post('/cart/merge', items),
};
