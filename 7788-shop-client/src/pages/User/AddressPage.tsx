import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../api/userApi';
import type { Address } from '../../types';
import styles from './AddressPage.module.css';

const EMPTY_FORM = {
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
};

export default function AddressPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getAddresses();
      setAddresses(data);
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>My Addresses</h1>
        <div className={styles.loginPrompt}>
          <p>Please <Link to="/login">login</Link> to manage your addresses.</p>
        </div>
      </div>
    );
  }

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({
      receiverName: addr.receiverName,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      district: addr.district,
      detail: addr.detail,
      isDefault: addr.isDefault === 1,
    });
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.receiverName || !form.phone || !form.province || !form.city || !form.district || !form.detail) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        receiverName: form.receiverName,
        phone: form.phone,
        province: form.province,
        city: form.city,
        district: form.district,
        detail: form.detail,
        isDefault: form.isDefault ? 1 : 0,
      };
      if (editing) {
        await userApi.updateAddress(editing.id, payload);
        toast.success('Address updated');
      } else {
        await userApi.createAddress(payload as any);
        toast.success('Address added');
      }
      closeModal();
      fetchAddresses();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await userApi.deleteAddress(id);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await userApi.setDefaultAddress(id);
      toast.success('Default address updated');
      fetchAddresses();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to set default address');
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Addresses</h1>
        <button className={styles.addBtn} onClick={openAdd}>
          + Add Address
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className={styles.empty}>
          <p>No saved addresses yet. Add one to get started!</p>
        </div>
      ) : (
        <div className={styles.addressList}>
          {addresses.map((addr) => (
            <div key={addr.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span>
                  <span className={styles.cardName}>{addr.receiverName}</span>
                  <span className={styles.cardPhone}>{addr.phone}</span>
                  {addr.isDefault === 1 && (
                    <span className={styles.defaultBadge}>Default</span>
                  )}
                </span>
              </div>
              <div className={styles.cardAddr}>
                {addr.province} {addr.city} {addr.district} {addr.detail}
              </div>
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => openEdit(addr)}>
                  Edit
                </button>
                <button className={styles.delBtn} onClick={() => handleDelete(addr.id)}>
                  Delete
                </button>
                {addr.isDefault !== 1 && (
                  <button className={styles.defaultBtn} onClick={() => handleSetDefault(addr.id)}>
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={styles.modal} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modalInner}>
            <h2 className={styles.modalTitle}>{editing ? 'Edit Address' : 'Add Address'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Receiver Name *</label>
                <input
                  value={form.receiverName}
                  onChange={(e) => updateField('receiverName', e.target.value)}
                  required
                  placeholder="Enter receiver name"
                />
              </div>
              <div className={styles.field}>
                <label>Phone *</label>
                <input
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  required
                  placeholder="Enter phone number"
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Province *</label>
                  <input
                    value={form.province}
                    onChange={(e) => updateField('province', e.target.value)}
                    required
                    placeholder="e.g. Guangdong"
                  />
                </div>
                <div className={styles.field}>
                  <label>City *</label>
                  <input
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    required
                    placeholder="e.g. Shenzhen"
                  />
                </div>
                <div className={styles.field}>
                  <label>District *</label>
                  <input
                    value={form.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    required
                    placeholder="e.g. Nanshan"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Detail Address *</label>
                <input
                  value={form.detail}
                  onChange={(e) => updateField('detail', e.target.value)}
                  required
                  placeholder="Street, building, apt number"
                />
              </div>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => updateField('isDefault', e.target.checked)}
                />
                Set as default address
              </label>
              <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
