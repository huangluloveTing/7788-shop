import api from './axios';
import type { Product, ProductQuery, PageResult } from '../types';

export const productApi = {
  list: (params: ProductQuery): Promise<PageResult<Product>> =>
    api.get('/products', { params }),

  detail: (id: number): Promise<Product> =>
    api.get(`/products/${id}`),
};
