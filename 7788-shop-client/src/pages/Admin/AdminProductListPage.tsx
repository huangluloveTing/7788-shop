import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { productApi } from '../../api/productApi';
import { formatPrice } from '../../utils';
import type { Product } from '../../types';
import toast from 'react-hot-toast';
import styles from './AdminProductListPage.module.css';

export default function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.list({ page, pageSize });
      setProducts(data.records);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete product');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Products</h2>
        <Link to="/admin/products/new" className={styles.addBtn}>
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>No products found.</div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
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
                    <td>
                      {p.mainImage ? (
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className={styles.thumb}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      {!p.mainImage && <span className={styles.thumbPlaceholder}>No img</span>}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.categoryName}</td>
                    <td className={styles.price}>{formatPrice(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>{p.salesCount}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/products/${p.id}/edit`} className={styles.editBtn}>
                          Edit
                        </Link>
                        <button className={styles.delBtn} onClick={() => handleDelete(p.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
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
                Next
              </button>
              <span className={styles.pageInfo}>
                {total} total
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
