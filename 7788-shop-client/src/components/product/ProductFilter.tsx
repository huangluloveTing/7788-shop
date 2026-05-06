import type { Category, ProductQuery } from '../../types';
import styles from './ProductFilter.module.css';

interface ProductFilterProps {
  categories: Category[];
  query: ProductQuery;
  onChange: (q: ProductQuery) => void;
}

export default function ProductFilter({ categories, query, onChange }: ProductFilterProps) {
  const handleCategoryClick = (categoryId: number | undefined) => {
    onChange({ ...query, categoryId, page: 1 });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const num = value === '' ? undefined : Number(value);
    onChange({ ...query, [field]: num, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...query, sortBy: e.target.value as ProductQuery['sortBy'], page: 1 });
  };

  const handleClear = () => {
    onChange({ page: 1, pageSize: query.pageSize });
  };

  const hasFilters = query.categoryId || query.minPrice || query.maxPrice || query.sortBy;

  return (
    <div className={styles.filter}>
      {/* Category buttons */}
      <div className={styles.section}>
        <div className={styles.label}>Categories</div>
        <div className={styles.categories}>
          <button
            className={`${styles.categoryBtn} ${!query.categoryId ? styles.categoryBtnActive : ''}`}
            onClick={() => handleCategoryClick(undefined)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${query.categoryId === cat.id ? styles.categoryBtnActive : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className={styles.section}>
        <div className={styles.label}>Price Range</div>
        <div className={styles.priceRow}>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="Min"
            value={query.minPrice ?? ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
          />
          <span className={styles.priceSep}>-</span>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="Max"
            value={query.maxPrice ?? ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Sort + Clear */}
      <div className={styles.section}>
        <div className={styles.sortRow}>
          <select className={styles.sortSelect} value={query.sortBy || 'default'} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="sales">Best Selling</option>
          </select>

          {hasFilters && (
            <button className={styles.clearBtn} onClick={handleClear}>
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
