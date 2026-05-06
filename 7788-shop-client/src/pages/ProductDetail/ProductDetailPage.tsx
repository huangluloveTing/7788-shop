import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice, addToGuestCart } from '../../utils';
import type { Product } from '../../types';
import toast from 'react-hot-toast';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await productApi.detail(Number(id));
        if (!cancelled) {
          setProduct(data);
          setActiveImage(0);
          setQuantity(1);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  const allImages = product
    ? [product.mainImage, ...product.images.map((img) => img.imageUrl)]
    : [];

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock < 1) {
      toast.error('This product is out of stock');
      return;
    }
    setAdding(true);
    try {
      if (isAuthenticated) {
        await addItem(product.id, quantity);
      } else {
        addToGuestCart(product.id, quantity);
      }
      toast.success('Added to cart!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add to cart';
      toast.error(message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading product details...</div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>Product not found</p>
          <Link to="/products" className={styles.backLink}>
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className={styles.page}>
      <div className={styles.detail}>
        {/* Image gallery */}
        <div className={styles.gallery}>
          <img
            src={allImages[activeImage] || product.mainImage}
            alt={product.name}
            className={styles.mainImage}
          />
          {allImages.length > 1 && (
            <div className={styles.thumbnailList}>
              {allImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`${product.name} ${idx + 1}`}
                  className={`${styles.thumbnail} ${idx === activeImage ? styles.thumbnailActive : ''}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className={styles.info}>
          <div className={styles.category}>{product.categoryName}</div>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>{formatPrice(product.price)}</div>

          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              Stock:{' '}
              <strong className={inStock ? styles.inStock : styles.outOfStock}>
                {inStock ? `${product.stock} available` : 'Out of Stock'}
              </strong>
            </span>
            <span className={styles.metaItem}>
              Sold: <strong>{product.salesCount}</strong>
            </span>
          </div>

          {/* Quantity selector */}
          <div className={styles.qtyRow}>
            <span className={styles.qtyLabel}>Quantity:</span>
            <button
              className={styles.qtyBtn}
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              disabled={quantity >= product.stock}
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <button
            className={styles.addBtn}
            disabled={!inStock || adding}
            onClick={handleAddToCart}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>

          {/* Description */}
          {product.description && (
            <div className={styles.description}>
              <h3 className={styles.descTitle}>Description</h3>
              <p className={styles.descText}>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
