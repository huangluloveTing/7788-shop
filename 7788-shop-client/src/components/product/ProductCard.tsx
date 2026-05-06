import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={product.mainImage}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <span className={styles.categoryBadge}>{product.categoryName}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.sales}>{product.salesCount} sold</span>
        </div>
      </div>
    </Link>
  );
}
