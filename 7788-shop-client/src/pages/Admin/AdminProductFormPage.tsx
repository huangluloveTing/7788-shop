import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { fileApi } from '../../api/fileApi';
import type { Category } from '../../types';
import toast from 'react-hot-toast';
import styles from './AdminProductFormPage.module.css';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    categoryId: 1, name: '', description: '', price: '', stock: '', mainImage: '', images: [] as string[],
  });

  useEffect(() => {
    categoryApi.list().then(setCategories);
    if (isEdit) {
      productApi.detail(Number(id)).then((p) => {
        setForm({
          categoryId: p.categoryId,
          name: p.name,
          description: p.description || '',
          price: String(p.price),
          stock: String(p.stock),
          mainImage: p.mainImage || '',
          images: p.images?.map((i) => i.imageUrl) || [],
        });
      });
    }
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileApi.upload(file);
      setForm({ ...form, images: [...form.images, url] });
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      categoryId: Number(form.categoryId),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      mainImage: form.mainImage || form.images[0] || '',
      images: form.images,
    };
    try {
      if (isEdit) {
        await adminApi.updateProduct(Number(id), data);
        toast.success('Product updated');
      } else {
        await adminApi.createProduct(data);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch { toast.error('Failed to save product'); }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Category *</label>
          <select value={form.categoryId} onChange={(e) => setForm({...form, categoryId: Number(e.target.value)})}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Name *</label>
          <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        </div>
        <div className={styles.field}>
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: '14px' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Price *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Stock *</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required />
          </div>
        </div>
        <div className={styles.field}>
          <label>Main Image URL</label>
          <input value={form.mainImage} onChange={(e) => setForm({...form, mainImage: e.target.value})} placeholder="https://..." />
        </div>
        <div className={styles.field}>
          <label>Product Images</label>
          <div className={styles.imageList}>
            {form.images.map((url, i) => (
              <div key={i} className={styles.imgWrap}>
                <img src={url} alt="" className={styles.imageItem} />
                <button type="button" className={styles.removeImg} onClick={() => setForm({...form, images: form.images.filter((_, j) => j !== i)})}>x</button>
              </div>
            ))}
          </div>
          <button type="button" className={styles.addImgBtn} onClick={() => setForm({...form, images: [...form.images, '']})}>+ Add Image URL</button>
          <div style={{ marginTop: '8px' }}>
            <input type="file" accept="image/*" onChange={handleUpload} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>Or upload image</span>
          </div>
          {form.images.map((url, i) => url === '' && (
            <input key={`input-${i}`} style={{ marginTop: '4px', padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', width: '100%', fontSize: '13px' }}
              placeholder="Image URL" value={url}
              onChange={(e) => {
                const newImages = [...form.images];
                newImages[i] = e.target.value;
                setForm({...form, images: newImages});
              }} />
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/products')}>Cancel</button>
          <button type="submit" className={styles.submitBtn}>{isEdit ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
