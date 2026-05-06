import { Link } from 'react-router-dom';

const style = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' },
  card: { background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center' as const },
  title: { fontSize: '24px', fontWeight: 600, marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: 'var(--color-text-secondary)' },
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Welcome to the PetShop admin panel</p>
      <div style={style.grid}>
        <Link to="/admin/products" style={style.card}>
          <div style={style.title}>Products</div>
          <div style={style.subtitle}>Manage products</div>
        </Link>
        <Link to="/admin/categories" style={style.card}>
          <div style={style.title}>Categories</div>
          <div style={style.subtitle}>Manage categories</div>
        </Link>
        <Link to="/admin/orders" style={style.card}>
          <div style={style.title}>Orders</div>
          <div style={style.subtitle}>Manage orders</div>
        </Link>
        <Link to="/admin/users" style={style.card}>
          <div style={style.title}>Users</div>
          <div style={style.subtitle}>Manage users</div>
        </Link>
      </div>
    </div>
  );
}
