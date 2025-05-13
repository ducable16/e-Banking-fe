import React, { useState, useEffect } from 'react';
import './Transfer.css';
import axiosInstance from '../../services/AxiosInstance';
import SuccessBill from './SuccessBill';

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
  const [successDetails, setSuccessDetails] = useState<{
    fromAccount: string;
    toAccount: string;
    amount: number;
    note: string;
    receiverName: string;
  } | null>(null);

  // Thông tin tài khoản nguồn
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState<number>(0);
  const [email, setEmail] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // OTP
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);

  // Tra cứu tên người nhận
  const [receiverName, setReceiverName] = useState('');
  const [loadingReceiver, setLoadingReceiver] = useState(false);

  // Lưu tạm thông tin giao dịch
  const [pendingTransaction, setPendingTransaction] = useState<{
    toAccount: string;
    amount: number;
    description: string;
  } | null>(null);

  const [showSuccessBill, setShowSuccessBill] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await axiosInstance.get('/user/profile') as any;
        const profile = response.data;
        setAccount(profile.account || '');
        setBalance(profile.balance || 0);
        setEmail(profile.email || '');
      } catch (err) {
        setAccount('Không xác định');
        setBalance(0);
        setEmail('');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLookupReceiver = async () => {
    setReceiverName('');
    if (!receiverAccount) return;
    try {
      setLoadingReceiver(true);
      const response = await axiosInstance.get(`/user/name?account=${receiverAccount}`) as any;
      const res = response.data;
      setReceiverName(res.fullName || 'Không tìm thấy tên');
    } catch (err) {
      setReceiverName('Không tìm thấy tên');
    } finally {
      setLoadingReceiver(false);
    }
  };

  // Bước 1: Xác nhận thông tin và gửi OTP
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
    if (Number(amount) > balance) {
      setError('Số dư không đủ để thực hiện giao dịch.');
      return;
    }
    if (!receiverName || receiverName === 'Không tìm thấy tên') {
      setError('Không xác định được tài khoản nhận. Vui lòng tra cứu lại.');
      return;
    }
    try {
      setLoading(true);
      setPendingTransaction({
        toAccount: receiverAccount,
        amount: Number(amount),
        description,
      });
      // Gửi request OTP về email
      await axiosInstance.post('/transaction/send-otp', { email });
      setShowOtp(true);
      setSuccess('Mã OTP đã được gửi, vui lòng kiểm tra email để xác nhận.');
    } catch (err: any) {
      setError(err.message || 'Không thể gửi mã OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác nhận OTP và thực hiện giao dịch
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!otp) {
      setError('Vui lòng nhập mã OTP.');
      return;
    }
    if (!pendingTransaction) {
      setError('Không tìm thấy thông tin giao dịch. Vui lòng thực hiện lại.');
      return;
    }
    try {
      setLoadingOtp(true);
      // Gửi xác nhận OTP
      const res = await axiosInstance.post('/transaction/confirm-otp', { email, otp });
      if (res && res.status === 200) {
        // Nếu xác nhận OTP thành công, gửi giao dịch
        await axiosInstance.post('user/transfer', {
          fromAccount: account, // Số tài khoản người gửi
          toAccount: pendingTransaction.toAccount, // Số tài khoản người nhận
          amount: pendingTransaction.amount, // Số tiền
          note: pendingTransaction.description || '', // Nội dung chuyển khoản
        });
        setSuccessDetails({
          fromAccount: account,
          toAccount: pendingTransaction.toAccount,
          amount: pendingTransaction.amount,
          note: pendingTransaction.description || '',
          receiverName: receiverName
        });
        setSuccess('Giao dịch thành công!');
        setShowSuccessBill(true);
        setReceiverAccount('');
        setAmount('');
        setDescription('');
        setOtp('');
        setShowOtp(false);
        setReceiverName('');
        setPendingTransaction(null);
      } else {
        setError('Xác nhận OTP thất bại. Giao dịch đã bị hủy.');
        setPendingTransaction(null);
      }
    } catch (err: any) {
      setError(err.message || 'Xác nhận OTP thất bại. Giao dịch đã bị hủy.');
      setPendingTransaction(null);
    } finally {
      setLoadingOtp(false);
    }
  };

  // Format số tiền có dấu phẩy
  const formatAmount = (value: string) => {
    if (!value) return '';
    const num = value.replace(/,/g, '');
    if (isNaN(Number(num))) return '';
    return Number(num).toLocaleString();
  };

  // Xử lý nhập số tiền, chỉ cho nhập số và tự động format
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(raw)) {
      setAmount(raw);
    }
  };

  // Hàm reset để thực hiện giao dịch mới
  const handleNewTransfer = () => {
    setShowSuccessBill(false);
    setSuccessDetails(null);
    setSuccess('');
    setShowOtp(false);
  };

  // Lấy thời gian hiện tại định dạng đẹp
  const getCurrentTimeString = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${pad(now.getHours())}:${pad(now.getMinutes())} ${weekdays[now.getDay()]} ${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
  };

  if (showSuccessBill && successDetails) {
    return (
      <SuccessBill
        amount={successDetails.amount}
        toAccount={successDetails.toAccount}
        receiverName={successDetails.receiverName}
        note={successDetails.note}
        transactionTime={getCurrentTimeString()}
        onNewTransfer={handleNewTransfer}
      />
    );
  }

  return (
    <div className="transfer-content">
      {/* Box tài khoản nguồn */}
      <div className="source-account-box">
        <div className="source-label">Tài khoản nguồn</div>
        <div className="source-account-row">
          <span className="source-account-number">{loadingProfile ? '...' : account}</span>
        </div>
        <div className="source-balance-label">Số dư</div>
        <div className="source-balance-row">
          <span className="source-balance">{loadingProfile ? '...' : balance.toLocaleString()} <span className="source-balance-unit">VND</span></span>
        </div>
      </div>
      {!showOtp ? (
        <form className="transfer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số tài khoản nhận *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={receiverAccount}
                onChange={e => { setReceiverAccount(e.target.value); setReceiverName(''); }}
                placeholder="Nhập số tài khoản người nhận"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="lookup-btn"
                onClick={handleLookupReceiver}
                disabled={loadingReceiver || !receiverAccount}
              >
                {loadingReceiver ? '...' : 'Tra cứu'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Tên người nhận</label>
            <input
              type="text"
              value={receiverName}
              readOnly
              placeholder="Tên người nhận sẽ hiển thị ở đây"
              style={{ background: '#232946', color: '#8cde4a', fontWeight: 500 }}
            />
          </div>
          <div className="form-group">
            <label>Số tiền *</label>
            <input
              type="text"
              value={formatAmount(amount)}
              onChange={handleAmountChange}
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
          {success && (
            <div className="success-message">
              <div className="success-title">{success}</div>
              {successDetails && (
                <div className="success-details">
                  <div className="success-row">
                    <span>Từ tài khoản:</span>
                    <span>{successDetails.fromAccount}</span>
                  </div>
                  <div className="success-row">
                    <span>Đến tài khoản:</span>
                    <span>{successDetails.toAccount}</span>
                  </div>
                  <div className="success-row">
                    <span>Người nhận:</span>
                    <span>{successDetails.receiverName}</span>
                  </div>
                  <div className="success-row">
                    <span>Số tiền:</span>
                    <span>{successDetails.amount.toLocaleString()} VND</span>
                  </div>
                  {successDetails.note && (
                    <div className="success-row">
                      <span>Nội dung:</span>
                      <span>{successDetails.note}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
      ) : (
        <form className="transfer-form" onSubmit={handleOtpSubmit}>
          <div className="form-group">
            <label>Nhập mã OTP gửi về email</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button className="transfer-btn" type="submit" disabled={loadingOtp}>
            {loadingOtp ? 'Đang xác nhận...' : 'Xác nhận OTP'}
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            Quay lại trang chủ
          </button>
        </form>
      )}
    </div>
  );
};

export default TransferForm; 