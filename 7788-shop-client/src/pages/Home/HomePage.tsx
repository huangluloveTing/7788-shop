import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import { productApi } from '../../api/productApi';
import type { Category, Product } from '../../types';
import ProductCard from '../../components/product/ProductCard';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [cats, products] = await Promise.all([
          categoryApi.list(),
          productApi.list({ sortBy: 'sales', pageSize: 8 }),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setHotProducts(products.records);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to PetShop</h1>
        <p className={styles.heroSub}>
          Your one-stop shop for all pet needs. Premium food, toys, accessories, and more — because your best friend deserves the best.
        </p>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.catGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className={styles.catCard}
              >
                <span className={styles.catIcon}>{cat.icon || '🐾'}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Hot Products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hot Products</h2>
        {hotProducts.length === 0 ? (
          <p className={styles.loading}>No products yet</p>
        ) : (
          <div className={styles.productGrid}>
            {hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
