import api from './axios';
import type { Category } from '../types';

export const categoryApi = {
  list: (): Promise<Category[]> => api.get('/categories'),
};
