import { create } from 'zustand';
import { cartApi } from '../api/cartApi';
import type { CartItem, GuestCartItem } from '../types';

interface CartState {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncGuestCart: () => Promise<void>;
  recalcTotals: (items: CartItem[]) => void;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalCount: 0,
  totalPrice: 0,
  isLoading: false,

  recalcTotals: (items: CartItem[]) => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    set({ items, totalCount, totalPrice });
  },

  setItems: (items: CartItem[]) => {
    get().recalcTotals(items);
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const items = await cartApi.list();
      get().recalcTotals(items);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    await cartApi.add(productId, quantity);
    await get().fetchCart();
  },

  updateQuantity: async (id, quantity) => {
    await cartApi.updateQuantity(id, quantity);
    await get().fetchCart();
  },

  removeItem: async (id) => {
    await cartApi.remove(id);
    await get().fetchCart();
  },

  clearCart: async () => {
    await cartApi.clear();
    get().recalcTotals([]);
  },

  syncGuestCart: async () => {
    const guestJson = localStorage.getItem('guestCart');
    if (!guestJson) return;
    try {
      const guestItems: GuestCartItem[] = JSON.parse(guestJson);
      if (guestItems.length > 0) {
        await cartApi.merge(guestItems);
        localStorage.removeItem('guestCart');
        await get().fetchCart();
      }
    } catch {
      // ignore
    }
  },
}));
