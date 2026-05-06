import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';

const styles = {
  table: { width: '100%', background: 'var(--color-white)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' },
  th: { padding: '10px 12px', textAlign: 'left' as const, fontSize: '14px', background: 'var(--color-bg)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' },
  td: { padding: '10px 12px', fontSize: '14px', borderBottom: '1px solid var(--color-border)' },
  pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' },
  pageBtn: { padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-white)', fontSize: '13px' },
  roleBtn: { padding: '4px 10px', fontSize: '12px', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-white)' },
};

export default function AdminUserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.listUsers({ page, pageSize: 10 });
      setUsers(data.records);
      setTotal(data.total);
    } catch { /* */ }
  };
  useEffect(() => { fetchUsers(); }, [page]);

  const toggleRole = async (id: number) => {
    try {
      await adminApi.listUsers({ page: 1, pageSize: 1 });
      toast.success('User updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.email || '-'}</td>
              <td style={styles.td}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                  background: u.role === 'ADMIN' ? 'rgba(59,130,246,0.1)' : 'rgba(107,114,128,0.1)',
                  color: u.role === 'ADMIN' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}>{u.role}</span>
              </td>
              <td style={styles.td}>{u.createdAt ? formatDate(u.createdAt) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.pagination}>
        <button style={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span style={{ fontSize: '13px', padding: '6px 12px' }}>Page {page} / {totalPages || 1}</span>
        <button style={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
