import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/orderApi';
import { formatPrice, formatDate, orderStatusMap } from '../../utils';
import type { Order } from '../../types';
import styles from './OrderListPage.module.css';

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { key: 'PENDING_SHIPPING', label: 'Pending Shipping' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize };
      if (status) params.status = status;
      const result = await orderApi.list(params);
      setOrders(result.records);
      setTotal(result.total);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePay = async (orderId: number) => {
    try {
      await orderApi.pay(orderId);
      toast.success('Payment successful');
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.message || 'Payment failed');
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.cancel(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel order');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Orders</h1>

      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${status === tab.key ? styles.tabActive : ''}`}
            onClick={() => handleStatusChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <p>No orders found.</p>
          <Link to="/products" className={styles.emptyLink}>Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className={styles.orderList}>
            {orders.map((order) => {
              const statusInfo = orderStatusMap[order.status] || { label: order.status, color: '#9ca3af' };
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderNo}>
                      Order: <span>{order.orderNo}</span>
                    </div>
                    <span className={styles.statusBadge} style={{ background: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.slice(0, 5).map((item) => (
                      <img
                        key={item.id}
                        src={item.productImage}
                        alt={item.productName}
                        className={styles.orderItemThumb}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="%23d1d5db"><rect width="56" height="56"/></svg>';
                        }}
                      />
                    ))}
                    {order.items.length > 5 && (
                      <span style={{ fontSize: 12, color: '#9ca3af', alignSelf: 'center' }}>
                        +{order.items.length - 5} more
                      </span>
                    )}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.orderMeta}>
                      {formatDate(order.createdAt)} | {order.items.length} item(s)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className={styles.orderTotal}>{formatPrice(order.totalAmount)}</span>
                      <div className={styles.orderActions}>
                        {order.status === 'PENDING_PAYMENT' && (
                          <>
                            <button className={`${styles.actionBtn} ${styles.payBtn}`} onClick={() => handlePay(order.id)}>
                              Pay Now
                            </button>
                            <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => handleCancel(order.id)}>
                              Cancel
                            </button>
                          </>
                        )}
                        <Link to={`/orders/${order.id}`} className={`${styles.actionBtn} ${styles.detailBtn}`}>
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                &gt;
              </button>
              <span className={styles.pageInfo}>
                {page} / {totalPages} ({total} total)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
