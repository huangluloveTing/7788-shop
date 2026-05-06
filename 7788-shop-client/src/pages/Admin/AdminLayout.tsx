import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? styles.active : '';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>PetShop Admin</div>
        <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
        <Link to="/admin/products" className={isActive('/admin/products')}>Products</Link>
        <Link to="/admin/categories" className={isActive('/admin/categories')}>Categories</Link>
        <Link to="/admin/orders" className={isActive('/admin/orders')}>Orders</Link>
        <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
      </aside>
      <div className={styles.main}>
        <div className={styles.topBar}>
          <span>{user?.username}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
