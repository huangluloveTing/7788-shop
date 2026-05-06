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
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    mainImage: '',
    images: [] as string[],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => toast.error('Failed to load categories'));

    if (isEdit) {
      setLoading(true);
      productApi
        .detail(Number(id))
        .then((p) => {
          setForm({
            categoryId: String(p.categoryId),
            name: p.name,
            description: p.description || '',
            price: String(p.price),
            stock: String(p.stock),
            mainImage: p.mainImage || '',
            images: p.images?.map((i) => i.imageUrl) || [],
          });
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileApi.upload(file);
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.categoryId || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      categoryId: Number(form.categoryId),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      mainImage: form.mainImage || form.images[0] || '',
      images: form.images,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await adminApi.updateProduct(Number(id), data);
        toast.success('Product updated');
      } else {
        await adminApi.createProduct(data);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <h2 className={styles.title}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
        <div className={styles.loading}>Loading product data...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Product Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter product description"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>
          <div className={styles.field}>
            <label>Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              placeholder="0"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Main Image URL</label>
          <input
            value={form.mainImage}
            onChange={(e) => setForm({ ...form, mainImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={styles.imageSection}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
            Product Images
          </label>

          {form.images.length > 0 && (
            <div className={styles.imageList}>
              {form.images.map((url, i) => (
                <div key={i} className={styles.imageItem}>
                  <img
                    src={url}
                    alt={`Product image ${i + 1}`}
                    className={styles.imagePreview}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23d1d5db"><rect width="100" height="100"/></svg>';
                    }}
                  />
                  <button
                    type="button"
                    className={styles.removeImgBtn}
                    onClick={() => removeImage(i)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.urlInputRow}>
            <input
              className={styles.urlInput}
              placeholder="Enter image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
            />
            <button type="button" className={styles.addImgBtn} onClick={addImageUrl}>
              + Add URL
            </button>
          </div>

          <div className={styles.uploadRow}>
            <label className={styles.uploadLabel}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
            </label>
            <span>or upload from your device</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
