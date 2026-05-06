import api from './axios';
import type { Product, Category, Order, PageResult } from '../types';

export const adminApi = {
  // Products
  createProduct: (data: any): Promise<Product> => api.post('/admin/products', data),
  updateProduct: (id: number, data: any): Promise<void> => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: number): Promise<void> => api.delete(`/admin/products/${id}`),

  // Categories
  createCategory: (data: any): Promise<Category> => api.post('/admin/categories', data),
  updateCategory: (id: number, data: any): Promise<void> => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: number): Promise<void> => api.delete(`/admin/categories/${id}`),

  // Orders
  listOrders: (params?: any): Promise<PageResult<Order>> => api.get('/admin/orders', { params }),
  getOrderDetail: (id: number): Promise<Order> => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: number, status: string): Promise<void> =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // Users
  listUsers: (params?: any): Promise<PageResult<any>> => api.get('/admin/users', { params }),
};
