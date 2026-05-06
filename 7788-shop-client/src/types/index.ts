// Product
export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  mainImage: string;
  salesCount: number;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
}

// Category
export interface Category {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  sortOrder: number;
}

// User
export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
}

// Address
export interface Address {
  id: number;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: number;
}

// Cart
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

export interface GuestCartItem {
  productId: number;
  quantity: number;
}

// Order
export type OrderStatus = 'PENDING_PAYMENT' | 'PENDING_SHIPPING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  username?: string;
  totalAmount: number;
  status: OrderStatus;
  addressSnapshot: Address;
  items: OrderItem[];
  paymentTime?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Query params
export interface ProductQuery {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'default' | 'price-asc' | 'price-desc' | 'sales';
  page?: number;
  pageSize?: number;
}
