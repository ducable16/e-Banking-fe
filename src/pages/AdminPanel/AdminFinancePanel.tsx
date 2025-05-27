import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './AdminPanel.css';

interface User {
  userId: string;
  fullName: string;
  email: string;
  account: string;
  balance: number;
}

const AdminFinancePanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [showSubtractMoneyForm, setShowSubtractMoneyForm] = useState(false);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/all-users');
        setUsers(res.data || []);
      } catch (err: any) {
        setError('Không thể tải danh sách người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleMoneyOperation = async () => {
    if (!selectedUser || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Vui lòng chọn người dùng và nhập số tiền hợp lệ!');
      return;
    }

    if (operationType === 'subtract') {
      if (Number(amount) > selectedUser.balance) {
        alert('Số tiền trừ không được lớn hơn số dư hiện tại!');
        return;
      }
    }
    if (operationType === 'add') {
      if (Number(amount) > 100_000_000_000) {
        alert('Số tiền thêm không được vượt quá 100 tỷ!');
        return;
      }
    }

    try {
      setLoading(true);
      await axiosInstance.post('/admin/user/topup', {
        userId: selectedUser.userId,
        amount: operationType === 'add' ? Number(amount) : -Number(amount)
      });

      // Cập nhật lại danh sách user
      const res = await axiosInstance.get('/admin/all-users');
      setUsers(res.data || []);
      
      // Reset form
      setSelectedUser(null);
      setAmount('');
      setNote('');
      setShowAddMoneyForm(false);
      setShowSubtractMoneyForm(false);
      
      alert(`${operationType === 'add' ? 'Thêm' : 'Trừ'} tiền thành công!`);
    } catch (err: any) {
      setError(`Không thể ${operationType === 'add' ? 'thêm' : 'trừ'} tiền cho người dùng.`);
    } finally {
      setLoading(false);
    }
  };

  // Format số tiền nhập
  const formatAmount = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    if (!num) return '';
    return parseInt(num, 10).toLocaleString('vi-VN');
  };

  // Xử lý nhập số tiền, chỉ cho nhập số và format lại
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setAmount(raw);
  };

  return (
    <div className="admin-panel-content">
      <h2 className="admin-panel-title">Quản lý tài chính</h2>
      
      {loading && <div className="admin-panel-loading">Đang tải...</div>}
      {error && <div className="admin-panel-error">{error}</div>}

      <div className="admin-panel-table-wrapper">
        <table className="admin-panel-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số tài khoản</th>
              <th>Số dư</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.account}</td>
                <td>{user.balance?.toLocaleString('vi-VN')} VND</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      className="admin-btn add"
                      onClick={() => {
                        setSelectedUser(user);
                        setOperationType('add');
                        setShowAddMoneyForm(true);
                      }}
                    >
                      Thêm tiền
                    </button>
                    <button 
                      className="admin-btn delete"
                      onClick={() => {
                        setSelectedUser(user);
                        setOperationType('subtract');
                        setShowSubtractMoneyForm(true);
                      }}
                    >
                      Trừ tiền
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form thêm/trừ tiền */}
      {(showAddMoneyForm || showSubtractMoneyForm) && selectedUser && (
        <div className="edit-user-form" style={{marginTop: 20}}>
          <h3>{operationType === 'add' ? 'Thêm' : 'Trừ'} tiền cho {selectedUser.fullName}</h3>
          <div className="edit-row">
            <label>Số tiền (VND):</label>
            <input
              type="text"
              value={formatAmount(amount)}
              onChange={handleAmountChange}
              placeholder={`Nhập số tiền cần ${operationType === 'add' ? 'thêm' : 'trừ'}`}
              inputMode="numeric"
            />
          </div>
          <div className="edit-row">
            <label>Ghi chú:</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Nhập ghi chú (không bắt buộc)"
            />
          </div>
          <div className="edit-actions">
            <button className={`admin-btn ${operationType === 'add' ? 'add' : 'delete'}`} onClick={handleMoneyOperation}>
              Xác nhận
            </button>
            <button 
              className="admin-btn delete" 
              onClick={() => {
                setShowAddMoneyForm(false);
                setShowSubtractMoneyForm(false);
                setSelectedUser(null);
                setAmount('');
                setNote('');
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinancePanel; 