import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/orderApi';
import { formatPrice, formatDate, orderStatusMap } from '../../utils';
import type { Order } from '../../types';
import styles from './OrderDetailPage.module.css';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await orderApi.detail(Number(id));
      setOrder(data);
    } catch {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePay = async () => {
    if (!order) return;
    try {
      await orderApi.pay(order.id);
      toast.success('Payment successful');
      fetchOrder();
    } catch (err: any) {
      toast.error(err?.message || 'Payment failed');
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.cancel(order.id);
      toast.success('Order cancelled');
      fetchOrder();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error || 'Order not found'}</div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/orders" style={{ color: '#3b82f6' }}>Back to Orders</Link>
        </div>
      </div>
    );
  }

  const statusInfo = orderStatusMap[order.status] || { label: order.status, color: '#9ca3af' };

  return (
    <div className={styles.page}>
      <Link to="/orders" className={styles.backLink}>
        &larr; Back to Orders
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Order Detail</h1>
        <span className={styles.statusBadge} style={{ background: statusInfo.color }}>
          {statusInfo.label}
        </span>
      </div>

      {/* Order Info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Order Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order No</span>
            <span className={styles.infoValue}>{order.orderNo}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Created</span>
            <span className={styles.infoValue}>{formatDate(order.createdAt)}</span>
          </div>
          {order.paymentTime && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Payment Time</span>
              <span className={styles.infoValue}>{formatDate(order.paymentTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Shipping Address</h2>
        <div className={styles.addressBox}>
          <div>
            <span className={styles.addressName}>{order.addressSnapshot.receiverName}</span>
            <span className={styles.addressPhone}>{order.addressSnapshot.phone}</span>
          </div>
          <div className={styles.addressText}>
            {order.addressSnapshot.province} {order.addressSnapshot.city}{' '}
            {order.addressSnapshot.district} {order.addressSnapshot.detail}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Order Items</h2>
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.itemCell}>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className={styles.itemThumb}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="%23d1d5db"><rect width="48" height="48"/></svg>';
                      }}
                    />
                    <Link to={`/products/${item.productId}`} className={styles.itemName}>
                      {item.productName}
                    </Link>
                  </div>
                </td>
                <td className={styles.itemPrice}>{formatPrice(item.price)}</td>
                <td className={styles.itemQty}>x{item.quantity}</td>
                <td className={styles.itemSubtotal}>{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price Summary */}
      <div className={styles.priceSummary}>
        <div className={styles.priceBox}>
          <div className={styles.priceRow}>
            <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </div>
          <div className={styles.priceTotal}>{formatPrice(order.totalAmount)}</div>
        </div>
      </div>

      {/* Actions */}
      {order.status === 'PENDING_PAYMENT' && (
        <div className={styles.actions}>
          <button className={styles.payBtn} onClick={handlePay}>
            Pay Now
          </button>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
