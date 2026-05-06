export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const orderStatusMap: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: '待支付', color: '#f59e0b' },
  PENDING_SHIPPING: { label: '待发货', color: '#3b82f6' },
  SHIPPED: { label: '已发货', color: '#8b5cf6' },
  DELIVERED: { label: '已送达', color: '#22c55e' },
  CANCELLED: { label: '已取消', color: '#9ca3af' },
};

export function getGuestCart(): { productId: number; quantity: number }[] {
  try {
    return JSON.parse(localStorage.getItem('guestCart') || '[]');
  } catch {
    return [];
  }
}

export function addToGuestCart(productId: number, quantity: number) {
  const items = getGuestCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }
  localStorage.setItem('guestCart', JSON.stringify(items));
}
