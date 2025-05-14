import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './AdminPanel.css';
import '../Home/Home.css';
import adminIcon from '../../assets/icons/utilityIcon.png'; // Dùng icon utility tạm thời

interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/user/all');
        setUsers(res.data || []);
      } catch (err: any) {
        setError('Không thể tải danh sách user.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="banking-app">
      {/* Sidebar giống Home */}
      <div className="sidebar">
        <div className="logo">
          <h2>SENA Digibank</h2>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li className="menu-item active">
              <span className="icon">
                <img src={adminIcon} alt="Quản lý" className="custom-icon" />
              </span>
              <span className="text">Quản lý</span>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <div className="welcome">Xin chào, Admin</div>
        </header>
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
                  <th>Role</th>
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
                    <td>{user.role}</td>
                    <td>
                      <button className="admin-btn edit">Sửa</button>
                      <button className="admin-btn delete">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="admin-btn add">+ Thêm người dùng</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 