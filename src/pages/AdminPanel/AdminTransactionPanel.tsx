import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './AdminPanel.css';

interface Transaction {
  transactionId: string;
  sender: string;
  receiver: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

const AdminTransactionPanel: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/transactions');
        setTransactions(res.data || []);
      } catch (err: any) {
        setError('Không thể tải danh sách giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filtered = transactions.filter(tx =>
    (!search || tx.transactionId.includes(search) || tx.sender.includes(search) || tx.receiver.includes(search)) &&
    (!filterStatus || tx.status === filterStatus)
  );

  return (
    <div className="admin-panel-content">
      <h2 className="admin-panel-title">Quản lý giao dịch</h2>
      <div style={{display: 'flex', gap: 16, marginBottom: 18}}>
        <input
          placeholder="Tìm kiếm mã GD, người gửi, người nhận..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{padding: 8, borderRadius: 6, border: '1px solid #d1c4e9', minWidth: 220}}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{padding: 8, borderRadius: 6, border: '1px solid #d1c4e9'}}>
          <option value="">Tất cả trạng thái</option>
          <option value="SUCCESS">Thành công</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="FAILED">Thất bại</option>
        </select>
      </div>
      {loading && <div className="admin-panel-loading">Đang tải...</div>}
      {error && <div className="admin-panel-error">{error}</div>}
      <div className="admin-panel-table-wrapper">
        <table className="admin-panel-table">
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Người gửi</th>
              <th>Người nhận</th>
              <th>Số tiền</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.transactionId}>
                <td>{tx.transactionId}</td>
                <td>{tx.sender}</td>
                <td>{tx.receiver}</td>
                <td>{tx.amount.toLocaleString('vi-VN')} VND</td>
                <td>{tx.type}</td>
                <td>{tx.status}</td>
                <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                <td>
                  <button className="admin-btn edit">Chi tiết</button>
                  <button className="admin-btn delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactionPanel; 