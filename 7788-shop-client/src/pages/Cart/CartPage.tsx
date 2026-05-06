import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../utils';
import styles from './CartPage.module.css';

export default function CartPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { items, totalCount, totalPrice, isLoading, updateQuantity, removeItem } = useCartStore();

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <div className={styles.loginPrompt}>
          <p>Please <Link to="/login">login</Link> to use the shopping cart.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <div className={styles.loading}>Loading cart...</div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>&#128722;</div>
          <p className={styles.emptyText}>Your cart is empty. Start shopping for your furry friends!</p>
          <Link to="/products" className={styles.continueLink}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className={styles.productCell}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className={styles.thumbnail}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="%23d1d5db"><rect width="64" height="64"/></svg>';
                    }}
                  />
                  <Link to={`/products/${item.productId}`} className={styles.productName}>
                    {item.productName}
                  </Link>
                </div>
              </td>
              <td>
                <span className={styles.price}>{formatPrice(item.productPrice)}</span>
              </td>
              <td>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.qtyBtn}
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>
                <span className={styles.subtotal}>
                  {formatPrice(item.productPrice * item.quantity)}
                </span>
              </td>
              <td>
                <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.footer}>
        <div className={styles.summary}>
          Total ({totalCount} items): <span className={styles.summaryAmount}>{formatPrice(totalPrice)}</span>
        </div>
        <div className={styles.actions}>
          <Link to="/products" className={styles.continueShopping}>
            Continue Shopping
          </Link>
          <Link to="/checkout" className={styles.checkoutBtn}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
