import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './Settings.css';

interface Profile {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/user/profile');
        setProfile(res.data);
        setForm(res.data);
      } catch (err: any) {
        setError('Không thể tải thông tin cá nhân.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const updateData = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address
      };
      await axiosInstance.put('/user/profile', updateData);
      setProfile({ ...profile!, ...updateData });
      setEditMode(false);
      setSuccess('Cập nhật thành công!');
    } catch (err: any) {
      setError('Cập nhật thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản?')) return;
    try {
      setLoading(true);
      setError('');
      await axiosInstance.delete(`/user/${profile.userId}`);
      setSuccess('Tài khoản đã được xóa.');
      // Có thể redirect hoặc logout ở đây
    } catch (err: any) {
      setError('Xóa tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!profile) return;
    if (!oldPassword || !newPassword) {
      setChangePasswordError('Vui lòng nhập đầy đủ mật khẩu cũ và mới.');
      return;
    }
    try {
      setLoading(true);
      setChangePasswordError('');
      setChangePasswordSuccess('');
      await axiosInstance.post('/user/change-password', {
        userId: profile.userId,
        oldPassword,
        newPassword
      });
      setChangePasswordSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setChangePasswordError(err.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="settings-content">Đang tải...</div>;
  if (error) return <div className="settings-content error-message">{error}</div>;

  return (
    <div className="settings-content">
      <h2 className="settings-title">Cài đặt tài khoản</h2>
      {success && <div className="success-message">{success}</div>}
      {changePasswordError && <div className="error-message">{changePasswordError}</div>}
      {changePasswordSuccess && <div className="success-message">{changePasswordSuccess}</div>}
      <div className="settings-main-grid">
        {!editMode ? (
          <div className="profile-view">
            <div className="profile-info-table">
              <div className="profile-row"><span>Họ tên:</span> <span>{profile?.fullName}</span></div>
              <div className="profile-row"><span>Email:</span> <span>{profile?.email}</span></div>
              <div className="profile-row"><span>Số điện thoại:</span> <span>{profile?.phoneNumber}</span></div>
              <div className="profile-row"><span>Địa chỉ:</span> <span>{profile?.address}</span></div>
            </div>
            <div className="settings-actions">
              <button className="settings-btn" onClick={() => setEditMode(true)}>Sửa</button>
              <button className="settings-btn" onClick={() => setShowChangePasswordForm(true)}>Đổi mật khẩu</button>
              <button className="settings-btn delete" onClick={handleDelete}>Xóa tài khoản</button>
            </div>
            {showChangePasswordForm && (
              <div className="change-password-card">
                <div className="profile-row"><span>Mật khẩu cũ:</span>
                  <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="profile-row"><span>Mật khẩu mới:</span>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="settings-actions small">
                  <button className="settings-btn" onClick={handleChangePassword}>Xác nhận</button>
                  <button className="settings-btn" onClick={() => { setShowChangePasswordForm(false); setOldPassword(''); setNewPassword(''); }}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-edit">
            <div className="profile-info-table">
              <div className="profile-row"><span>Họ tên:</span> <input name="fullName" value={form?.fullName || ''} onChange={handleChange} /></div>
              <div className="profile-row"><span>Email:</span> <input name="email" value={form?.email || ''} disabled style={{ background: '#eee', color: '#888' }} /></div>
              <div className="profile-row"><span>Số điện thoại:</span> <input name="phoneNumber" value={form?.phoneNumber || ''} onChange={handleChange} /></div>
              <div className="profile-row"><span>Địa chỉ:</span> <input name="address" value={form?.address || ''} onChange={handleChange} /></div>
            </div>
            <div className="settings-actions">
              <button className="settings-btn" onClick={handleSave}>Lưu</button>
              <button className="settings-btn" onClick={() => { setEditMode(false); setForm(profile); }}>Hủy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 