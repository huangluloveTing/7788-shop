import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../api/userApi';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>My Profile</h1>
        <div className={styles.loginPrompt}>
          <p>Please <Link to="/login">login</Link> to view your profile.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>My Profile</h1>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.updateProfile({ nickname, email, phone });
      await fetchProfile();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const firstChar = (user.nickname || user.username).charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>

      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.avatarSection}>
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{firstChar}</div>
          )}
          <div className={styles.avatarInfo}>
            <span className={styles.avatarName}>{user.nickname || user.username}</span>
            <span className={styles.avatarRole}>
              {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input
            className={`${styles.input} ${styles.inputDisabled}`}
            type="text"
            value={user.username}
            disabled
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Nickname</label>
          <input
            className={styles.input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Phone</label>
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <button className={styles.saveBtn} type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
