import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import styles from './Header.module.css';

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const totalCount = useCartStore((s) => s.totalCount);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo}>
          Pet<span>Shop</span>
        </Link>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            placeholder="Search pet products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>Search</button>
        </form>

        <nav className={styles.nav}>
          <Link to="/products" className={styles.navLink}>Products</Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className={styles.navLink}>Orders</Link>
              <Link to="/cart" className={styles.cartLink}>
                Cart
                {totalCount > 0 && <span className={styles.cartBadge}>{totalCount}</span>}
              </Link>
              <div className={styles.userMenu}>
                <button
                  className={styles.userBtn}
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                >
                  {user?.nickname || user?.username}
                </button>
                {showDropdown && (
                  <div className={styles.dropdown}>
                    <Link to="/profile">Profile</Link>
                    <Link to="/addresses">Addresses</Link>
                    <Link to="/orders">Orders</Link>
                    {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/cart" className={styles.cartLink}>
                Cart
                {totalCount > 0 && <span className={styles.cartBadge}>{totalCount}</span>}
              </Link>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Link to="/register" className={styles.navLink}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
