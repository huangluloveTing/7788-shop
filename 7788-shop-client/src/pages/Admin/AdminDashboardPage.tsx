import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/admin/products',
    label: 'Products',
    desc: 'Manage product listings, inventory, and pricing',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    to: '/admin/categories',
    label: 'Categories',
    desc: 'Organize products with categories',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    desc: 'View and manage customer orders',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    to: '/admin/users',
    label: 'Users',
    desc: 'Manage registered users',
    color: '#22c55e',
    bg: '#f0fdf4',
  },
];

const cardStyle: React.CSSProperties = {
  padding: 28,
  borderRadius: 12,
  background: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  textDecoration: 'none',
  display: 'block',
  transition: 'box-shadow 0.2s, transform 0.2s',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        Dashboard
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28 }}>
        Welcome to the PetShop admin panel
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.transform = '';
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 700,
                color: card.color,
                marginBottom: 16,
              }}
            >
              {card.label.charAt(0)}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
              {card.label}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
