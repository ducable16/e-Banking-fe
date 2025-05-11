import React, { useState } from 'react';
import './Transfer.css';
import axiosInstance from '../../services/AxiosInstance';

interface TransferFormProps {
  onBack: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onBack }) => {
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!receiverAccount || !amount) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Số tiền không hợp lệ.');
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post('/transfer', {
        toAccount: receiverAccount,
        amount: Number(amount),
        description,
      });
      setSuccess('Chuyển tiền thành công!');
      setReceiverAccount('');
      setAmount('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Chuyển tiền thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-content">
      {/* <h2>Chuyển tiền</h2> */}
      <form className="transfer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Số tài khoản nhận *</label>
          <input
            type="text"
            value={receiverAccount}
            onChange={e => setReceiverAccount(e.target.value)}
            placeholder="Nhập số tài khoản người nhận"
            required
          />
        </div>
        <div className="form-group">
          <label>Số tiền *</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Nhập số tiền"
            min={1}
            required
          />
        </div>
        <div className="form-group">
          <label>Nội dung chuyển khoản</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Nội dung (không bắt buộc)"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button className="transfer-btn" type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Xác nhận chuyển tiền'}
        </button>
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          Quay lại trang chủ
        </button>
      </form>
    </div>
  );
};

export default TransferForm; 