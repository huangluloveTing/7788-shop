import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.layout}>
      {/* Mobile Overlay */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTitle}>
          Pet<span>Shop</span> Admin
        </div>
        <nav className={styles.sidebarNav}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>&#9783;</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>&#9776;</span>
            Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>&#9776;</span>
            Categories
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>&#9776;</span>
            Orders
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>&#9776;</span>
            Users
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
              &#9776;
            </button>
            <span className={styles.topBarTitle}>Admin Panel</span>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.adminName}>
              {user?.nickname || user?.username || 'Admin'}
            </span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
