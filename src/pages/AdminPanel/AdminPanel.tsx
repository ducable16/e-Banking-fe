import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './AdminPanel.css';
import '../Home/Home.css';
import adminIcon from '../../assets/icons/utilityIcon.png'; // Dùng icon utility tạm thời
import { useNavigate, useLocation } from 'react-router-dom';
import AdminTransactionPanel from './AdminTransactionPanel';
import AdminFinancePanel from './AdminFinancePanel';
import AdminDashboard from './AdminDashboard';

interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  status?: string;
  account?: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<User & { password?: string }>({
    userId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'user' | 'transaction' | 'finance'>('dashboard');
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/all-users');
        setUsers(res.data || []);
      } catch (err: any) {
        setError('Không thể tải danh sách user.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleLock = async (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (!user) return;
    try {
      if (user.status === 'LOCKED') {
        await axiosInstance.put(`/admin/user/unlock/${userId}`);
        setUsers(prev => prev.map(u =>
          u.userId === userId ? { ...u, status: 'ACTIVE' } : u
        ));
      } else {
        await axiosInstance.put(`/admin/user/lock/${userId}`);
        setUsers(prev => prev.map(u =>
          u.userId === userId ? { ...u, status: 'LOCKED' } : u
        ));
      }
    } catch (err) {
      alert('Cập nhật trạng thái user thất bại!');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ ...user });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editForm) return;
    // Chỉ lấy các trường cần thiết
    const updateData = {
      userId: editForm.userId,
      fullName: editForm.fullName,
      email: editForm.email,
      phoneNumber: editForm.phoneNumber,
      address: editForm.address,
      role: editForm.role,
    };
    try {
      await axiosInstance.put('/admin/user-profile', updateData);
      setUsers(prev => prev.map(user =>
        user.userId === editForm.userId ? { ...user, ...updateData } : user
      ));
      setEditingUser(null);
      setEditForm(null);
    } catch (err) {
      alert('Cập nhật người dùng thất bại!');
    }
  };

  const handleEditCancel = () => {
    setEditingUser(null);
    setEditForm(null);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSave = async () => {
    if (!addForm.fullName || !addForm.email || !addForm.phoneNumber) return;
    try {
      // Chỉ gửi các trường cần thiết, không gửi userId
      const addData = {
        fullName: addForm.fullName,
        email: addForm.email,
        phoneNumber: addForm.phoneNumber,
        address: addForm.address,
        role: addForm.role,
        status: addForm.status,
        password: addForm.password,
      };
      const res = await axiosInstance.post('/admin/add-user', addData);
      const newUser = res.data || { ...addForm, userId: Date.now().toString() };
      setUsers(prev => [newUser, ...prev]);
      setShowAddForm(false);
      setAddForm({
        userId: '', fullName: '', email: '', phoneNumber: '', address: '', role: 'CUSTOMER', status: 'ACTIVE', password: ''
      });
    } catch (err) {
      alert('Thêm người dùng thất bại!');
    }
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
    setAddForm({
      userId: '', fullName: '', email: '', phoneNumber: '', address: '', role: 'CUSTOMER', status: 'ACTIVE', password: ''
    });
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await axiosInstance.delete(`/admin/user/${userId}`);
      setUsers(prev => prev.filter(user => user.userId !== userId));
    } catch (err) {
      alert('Xóa người dùng thất bại!');
    }
  };

  const handleResetPassword = (userId: string) => {
    setResetPasswordUserId(userId);
    setResetPasswordValue('');
    setResetPasswordError('');
    setResetPasswordSuccess('');
  };

  const handleResetPasswordSubmit = async () => {
    if (!resetPasswordUserId || !resetPasswordValue) {
      setResetPasswordError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    try {
      setLoading(true);
      setResetPasswordError('');
      setResetPasswordSuccess('');
      await axiosInstance.post('/admin/change-password', {
        userId: resetPasswordUserId,
        password: resetPasswordValue
      });
      setResetPasswordSuccess('Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        setResetPasswordUserId(null);
        setResetPasswordValue('');
        setResetPasswordError('');
        setResetPasswordSuccess('');
      }, 1200);
    } catch (err: any) {
      setResetPasswordError(err.message || 'Đặt lại mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="banking-app">
      {/* Sidebar giống Home */}
      <div className="sidebar">
        <div className="logo">
          <h2>HUST Digibank</h2>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li className={`menu-item${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span className="icon">
                <img src={adminIcon} alt="Tổng quan" className="custom-icon" />
              </span>
              <span className="text">Tổng quan</span>
            </li>
            <li className={`menu-item${activeTab === 'user' ? ' active' : ''}`} onClick={() => setActiveTab('user')}>
              <span className="icon">
                <img src={adminIcon} alt="Quản lý người dùng" className="custom-icon" />
              </span>
              <span className="text">Quản lý người dùng</span>
            </li>
            <li className={`menu-item${activeTab === 'transaction' ? ' active' : ''}`} onClick={() => setActiveTab('transaction')}>
              <span className="icon">
                <img src={adminIcon} alt="Quản lý giao dịch" className="custom-icon" />
              </span>
              <span className="text">Quản lý giao dịch</span>
            </li>
            <li className={`menu-item${activeTab === 'finance' ? ' active' : ''}`} onClick={() => setActiveTab('finance')}>
              <span className="icon">
                <img src={adminIcon} alt="Quản lý tài chính" className="custom-icon" />
              </span>
              <span className="text">Quản lý tài chính</span>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <div className="welcome">Xin chào, Admin</div>
          <button className="admin-btn add" style={{marginLeft: 24}} onClick={() => navigate('/home')}>Quay về trang chủ</button>
        </header>
        {activeTab === 'dashboard' ? (
          <AdminDashboard />
        ) : activeTab === 'transaction' ? (
          <AdminTransactionPanel />
        ) : activeTab === 'finance' ? (
          <AdminFinancePanel />
        ) : (
          <div className="admin-panel-content">
            <h2 className="admin-panel-title">Quản lý người dùng</h2>
            {loading && <div className="admin-panel-loading">Đang tải...</div>}
            {error && <div className="admin-panel-error">{error}</div>}
            <div className="admin-panel-table-wrapper">
              <table className="admin-panel-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Account</th>
                    <th>Role</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.userId}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.address}</td>
                      <td>{user.account || '---'}</td>
                      <td>{user.role}</td>
                      <td>{user.status || '---'}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn edit" onClick={() => handleEdit(user)}>Sửa</button>
                          <button className="admin-btn delete" onClick={() => handleDelete(user.userId)}>Xóa</button>
                          <button className="admin-btn add" onClick={() => handleResetPassword(user.userId)}>Reset MK</button>
                          <button className={`admin-btn lock${user.status === 'LOCKED' ? ' unlock' : ''}`} onClick={() => handleToggleLock(user.userId)}>
                            {user.status === 'LOCKED' ? 'Mở khóa' : 'Khóa'}
                          </button>
                          {resetPasswordUserId === user.userId && (
                            <div style={{marginTop: 8, background: '#fff', border: '1px solid #d1c4e9', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(75,41,150,0.08)'}}>
                              <div style={{marginBottom: 8, fontWeight: 500, color: '#4b2996'}}>Nhập mật khẩu mới:</div>
                              <input
                                type="password"
                                value={resetPasswordValue}
                                onChange={e => setResetPasswordValue(e.target.value)}
                                style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1c4e9', marginBottom: 8}}
                                placeholder="Mật khẩu mới"
                              />
                              {resetPasswordError && <div style={{color: '#d9534f', marginBottom: 8}}>{resetPasswordError}</div>}
                              {resetPasswordSuccess && <div style={{color: '#4b2996', marginBottom: 8}}>{resetPasswordSuccess}</div>}
                              <div style={{display: 'flex', gap: 8}}>
                                <button className="admin-btn add" onClick={handleResetPasswordSubmit}>Xác nhận</button>
                                <button className="admin-btn delete" onClick={() => { setResetPasswordUserId(null); setResetPasswordValue(''); setResetPasswordError(''); setResetPasswordSuccess(''); }}>Hủy</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Form chỉnh sửa user nằm ngay dưới bảng */}
              {editingUser && editForm && (
                <div className="edit-user-form">
                  <h3>Chỉnh sửa người dùng</h3>
                  <div className="edit-row">
                    <label>Họ tên:</label>
                    <input name="fullName" value={editForm.fullName} onChange={handleEditChange} />
                  </div>
                  <div className="edit-row">
                    <label>Email:</label>
                    <input name="email" value={editForm.email} onChange={handleEditChange} />
                  </div>
                  <div className="edit-row">
                    <label>SĐT:</label>
                    <input name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditChange} />
                  </div>
                  <div className="edit-row">
                    <label>Địa chỉ:</label>
                    <input name="address" value={editForm.address} onChange={handleEditChange} />
                  </div>
                  <div className="edit-row">
                    <label>Role:</label>
                    <select name="role" value={editForm.role} onChange={handleEditChange}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button className="admin-btn add" onClick={handleEditSave}>Lưu</button>
                    <button className="admin-btn delete" onClick={handleEditCancel}>Hủy</button>
                  </div>
                </div>
              )}
              {/* Form thêm user mới nằm ngay dưới bảng */}
              {showAddForm && (
                <div className="edit-user-form">
                  <h3>Thêm người dùng mới</h3>
                  <div className="edit-row">
                    <label>Họ tên:</label>
                    <input name="fullName" value={addForm.fullName} onChange={handleAddChange} />
                  </div>
                  <div className="edit-row">
                    <label>Email:</label>
                    <input name="email" value={addForm.email} onChange={handleAddChange} />
                  </div>
                  <div className="edit-row">
                    <label>SĐT:</label>
                    <input name="phoneNumber" value={addForm.phoneNumber} onChange={handleAddChange} />
                  </div>
                  <div className="edit-row">
                    <label>Địa chỉ:</label>
                    <input name="address" value={addForm.address} onChange={handleAddChange} />
                  </div>
                  <div className="edit-row">
                    <label>Mật khẩu:</label>
                    <input name="password" type="password" value={addForm.password || ''} onChange={handleAddChange} />
                  </div>
                  <div className="edit-row">
                    <label>Role:</label>
                    <select name="role" value={addForm.role} onChange={handleAddChange}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </div>
                  <div className="edit-row">
                    <label>Trạng thái:</label>
                    <select name="status" value={addForm.status || ''} onChange={handleAddChange}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="LOCKED">LOCKED</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button className="admin-btn add" onClick={handleAddSave}>Lưu</button>
                    <button className="admin-btn delete" onClick={handleAddCancel}>Hủy</button>
                  </div>
                </div>
              )}
            </div>
            <button className="admin-btn add" onClick={() => setShowAddForm(true)}>+ Thêm người dùng</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 