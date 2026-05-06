import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import type { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate, orderStatusMap } from '../../utils';
import toast from 'react-hot-toast';
import styles from './AdminOrderListPage.module.css';

export default function AdminOrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    try {
      const data = await adminApi.listOrders({ page, pageSize: 10 });
      setOrders(data.records);
      setTotal(data.total);
    } catch { /* */ }
  };
  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const statusOptions: OrderStatus[] = ['PENDING_PAYMENT', 'PENDING_SHIPPING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const totalPages = Math.ceil(total / 10);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Orders</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order No</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td><Link to={`/orders/${o.id}`} className={styles.viewLink}>{o.orderNo}</Link></td>
              <td>{o.username || o.userId}</td>
              <td>{formatPrice(o.totalAmount)}</td>
              <td>
                <select className={styles.statusSelect} value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{orderStatusMap[s]?.label || s}</option>
                  ))}
                </select>
                <span style={{
                  display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                  background: orderStatusMap[o.status]?.color || '#999', marginLeft: '6px',
                }} />
              </td>
              <td>{formatDate(o.createdAt)}</td>
              <td><Link to={`/orders/${o.id}`} className={styles.viewLink}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span style={{ fontSize: '13px', padding: '6px 12px' }}>Page {page} / {totalPages || 1}</span>
        <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
