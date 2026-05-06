import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Layout from '../components/common/Layout';
import AdminLayout from '../pages/Admin/AdminLayout';
import HomePage from '../pages/Home/HomePage';
import ProductListPage from '../pages/ProductList/ProductListPage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import CartPage from '../pages/Cart/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import OrderListPage from '../pages/Orders/OrderListPage';
import OrderDetailPage from '../pages/Orders/OrderDetailPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProfilePage from '../pages/User/ProfilePage';
import AddressPage from '../pages/User/AddressPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import AdminProductListPage from '../pages/Admin/AdminProductListPage';
import AdminProductFormPage from '../pages/Admin/AdminProductFormPage';
import AdminCategoryListPage from '../pages/Admin/AdminCategoryListPage';
import AdminOrderListPage from '../pages/Admin/AdminOrderListPage';
import AdminUserListPage from '../pages/Admin/AdminUserListPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      {
        element: <AuthGuard><Layout /></AuthGuard>,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <OrderListPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'addresses', element: <AddressPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminGuard><AdminLayout /></AdminGuard>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductListPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/:id/edit', element: <AdminProductFormPage /> },
      { path: 'categories', element: <AdminCategoryListPage /> },
      { path: 'orders', element: <AdminOrderListPage /> },
      { path: 'users', element: <AdminUserListPage /> },
    ],
  },
]);

export default router;
