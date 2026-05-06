import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { userApi } from '../../api/userApi';
import { orderApi } from '../../api/orderApi';
import { formatPrice } from '../../utils';
import type { Address } from '../../types';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { items, totalCount, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    userApi
      .getAddresses()
      .then((data) => {
        setAddresses(data);
        const defaultAddr = data.find((a) => a.isDefault === 1);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      })
      .catch(() => toast.error('Failed to load addresses'))
      .finally(() => setLoadingAddresses(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.loginPrompt}>
          <p>Please <Link to="/login">login</Link> to proceed with checkout.</p>
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.loading}>
          <p>Your cart is empty.</p>
          <Link to="/products" style={{ color: '#3b82f6' }}>Browse Products</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    setSubmitting(true);
    try {
      const order = await orderApi.create(selectedAddressId);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>

      {/* Order Summary */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>
        <div className={styles.summaryItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.summaryItem}>
              <img
                src={item.productImage}
                alt={item.productName}
                className={styles.summaryThumb}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="%23d1d5db"><rect width="48" height="48"/></svg>';
                }}
              />
              <span className={styles.summaryName}>{item.productName}</span>
              <span className={styles.summaryQty}>x{item.quantity}</span>
              <span className={styles.summarySubtotal}>
                {formatPrice(item.productPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div className={styles.summaryTotal}>
            Total ({totalCount} items):{' '}
            <span className={styles.summaryTotalAmount}>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Shipping Address</h2>
        {loadingAddresses ? (
          <div className={styles.loading}>Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className={styles.emptyAddresses}>
            <p>No saved addresses.</p>
            <Link to="/addresses" className={styles.addAddressLink}>
              + Add New Address
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.addressList}>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.addressCardSelected : ''}`}
                >
                  <input
                    type="radio"
                    name="address"
                    className={styles.radio}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div className={styles.addressContent}>
                    <div className={styles.addressName}>
                      {addr.receiverName}
                      <span className={styles.addressPhone}>{addr.phone}</span>
                      {addr.isDefault === 1 && (
                        <span className={styles.defaultBadge}>Default</span>
                      )}
                    </div>
                    <div className={styles.addressDetail}>
                      {addr.province} {addr.city} {addr.district} {addr.detail}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <Link to="/addresses" className={styles.addAddressLink}>
              + Add New Address
            </Link>
          </>
        )}
      </div>

      {/* Place Order */}
      <div className={styles.placeOrderSection}>
        <button
          className={styles.placeOrderBtn}
          disabled={submitting || !selectedAddressId || addresses.length === 0}
          onClick={handlePlaceOrder}
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
