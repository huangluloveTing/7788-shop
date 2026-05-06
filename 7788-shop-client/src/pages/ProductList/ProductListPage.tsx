import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import type { Category, Product, ProductQuery } from '../../types';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import styles from './ProductListPage.module.css';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read query from URL
  const query: ProductQuery = {
    keyword: searchParams.get('keyword') || undefined,
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as ProductQuery['sortBy']) || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: 12,
  };

  // Fetch categories once on mount
  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  // Fetch products when query changes
  const fetchProducts = useCallback(async (q: ProductQuery) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productApi.list(q);
      setProducts(result.records);
      setTotal(result.total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(query);
  }, [fetchProducts, query]);

  const handleQueryChange = (newQuery: ProductQuery) => {
    const params: Record<string, string> = {};
    if (newQuery.keyword) params.keyword = newQuery.keyword;
    if (newQuery.categoryId) params.categoryId = String(newQuery.categoryId);
    if (newQuery.minPrice) params.minPrice = String(newQuery.minPrice);
    if (newQuery.maxPrice) params.maxPrice = String(newQuery.maxPrice);
    if (newQuery.sortBy && newQuery.sortBy !== 'default') params.sortBy = newQuery.sortBy;
    if (newQuery.page && newQuery.page > 1) params.page = String(newQuery.page);
    setSearchParams(params, { replace: true });
  };

  const totalPages = Math.ceil(total / (query.pageSize || 12));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All Products</h1>

      <ProductFilter
        categories={categories}
        query={query}
        onChange={handleQueryChange}
      />

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : products.length === 0 ? (
        <div className={styles.loading}>No products found</div>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={!query.page || query.page <= 1}
                onClick={() => handleQueryChange({ ...query, page: (query.page || 1) - 1 })}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {query.page || 1} / {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                disabled={(query.page || 1) >= totalPages}
                onClick={() => handleQueryChange({ ...query, page: (query.page || 1) + 1 })}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
