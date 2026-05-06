import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { productApi } from '../../api/productApi';
import type { Product } from '../../types';
import { formatPrice } from '../../utils';
import toast from 'react-hot-toast';
import styles from './AdminProductListPage.module.css';

export default function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchProducts = async () => {
    try {
      const data = await productApi.list({ page, pageSize });
      setProducts(data.records);
      setTotal(data.total);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Products</h2>
        <Link to="/admin/products/new" className={styles.addBtn}>+ Add Product</Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sales</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.mainImage && <img src={p.mainImage} alt="" className={styles.thumb} />}</td>
              <td>{p.name}</td>
              <td>{p.categoryName}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.stock}</td>
              <td>{p.salesCount}</td>
              <td>
                <div className={styles.actions}>
                  <Link to={`/admin/products/${p.id}/edit`} className={styles.editBtn}>Edit</Link>
                  <button className={styles.delBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </td>
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
