import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './AdminPanel.css';

interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalBalance: number;
  activeUsers: number;
  lockedUsers: number;
  recentTransactions: {
    transactionId: string;
    sender: { fullName: string; account: string };
    receiver: { fullName: string; account: string };
    amount: number;
    createdAt: string;
  }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/dashboard-stats');
        setStats(res.data);
      } catch (err: any) {
        setError('Không thể tải thông tin tổng quan.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-panel-loading">Đang tải...</div>;
  if (error) return <div className="admin-panel-error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="admin-panel-content">
      <h2 className="admin-panel-title">Tổng quan hệ thống</h2>

      {/* Thống kê tổng quan */}
      <div className="dashboard-stats" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="stat-card" style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Tổng số người dùng</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4B3FE4' }}>{stats.totalUsers}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {stats.activeUsers} đang hoạt động / {stats.lockedUsers} đã khóa
          </div>
        </div>

        <div className="stat-card" style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Tổng số giao dịch</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4B3FE4' }}>{stats.totalTransactions}</div>
        </div>

        <div className="stat-card" style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Tổng số dư</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4B3FE4' }}>
            {stats.totalBalance.toLocaleString('vi-VN')} VND
          </div>
        </div>
      </div>

      {/* Giao dịch gần đây */}
      <div className="recent-transactions" style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>Giao dịch gần đây</h3>
        <div className="admin-panel-table-wrapper">
          <table className="admin-panel-table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Người gửi</th>
                <th>Người nhận</th>
                <th>Số tiền</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map(tx => (
                <tr key={tx.transactionId}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.sender.fullName} ({tx.sender.account})</td>
                  <td>{tx.receiver.fullName} ({tx.receiver.account})</td>
                  <td>{tx.amount.toLocaleString('vi-VN')} VND</td>
                  <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 