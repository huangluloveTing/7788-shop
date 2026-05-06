import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';
import { adminApi } from '../../api/adminApi';
import type { Category } from '../../types';
import toast from 'react-hot-toast';
import styles from './AdminCategoryListPage.module.css';

export default function AdminCategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const fetchData = async () => {
    try { setCategories(await categoryApi.list()); } catch { /* */ }
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setName(''); setSortOrder('0'); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setSortOrder(String(c.sortOrder)); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, sortOrder: Number(sortOrder) };
    try {
      if (editing) {
        await adminApi.updateCategory(editing.id, data);
        toast.success('Category updated');
      } else {
        await adminApi.createCategory(data);
        toast.success('Category created');
      }
      setShowForm(false);
      fetchData();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try { await adminApi.deleteCategory(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Categories</h2>
        <button className={styles.addBtn} onClick={openAdd}>+ Add</button>
      </div>
      <div className={styles.list}>
        {categories.map((c) => (
          <div key={c.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{c.name}</span>
              <span className={styles.itemMeta}>ID: {c.id} | Sort: {c.sortOrder}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => openEdit(c)}>Edit</button>
              <button className={styles.delBtn} onClick={() => handleDelete(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className={styles.modalInner}>
            <h3 style={{ marginBottom: '16px' }}>{editing ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Name</label>
                <input style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', outline: 'none' }}
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Sort Order</label>
                <input type="number" style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', outline: 'none' }}
                  value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-white)' }}
                  onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius)' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
