import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './TransactionHistory.css';

interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  note: string;
  createdAt: string;
  status: string;
  senderId: string;
  receiverId: string;
  sender?: { fullName?: string };
  receiver?: { fullName?: string };
}

interface TransactionHistoryProps {
  onBack: () => void;
}

const getDefaultDates = () => {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  const start = lastMonth.toISOString().slice(0, 10);
  return { start, end };
};

const getMinStartDate = () => {
  const today = new Date();
  const min = new Date(today);
  min.setMonth(today.getMonth() - 6);
  return min.toISOString().slice(0, 10);
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(getDefaultDates().start);
  const [endDate, setEndDate] = useState(getDefaultDates().end);
  const [userId, setUserId] = useState<string>('');

  const minStartDate = getMinStartDate();
  const maxEndDate = getDefaultDates().end;

  // Lấy userId từ profile
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axiosInstance.get('/user/profile');
        setUserId(res.data?.userId?.toString() || '');
      } catch {
        setUserId('');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axiosInstance.post('/user/transactions', {
          userId,
          startDate,
          endDate
        });
        const txs: Transaction[] = res.data || [];
        setTransactions(txs);
      } catch (err: any) {
        setError(err.message || 'Không thể tải lịch sử giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId, startDate, endDate]);

  // Đảm bảo endDate >= startDate và startDate >= minStartDate
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    if (value > endDate) setEndDate(value);
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    if (value < startDate) setStartDate(value);
  };

  return (
    <div className="transaction-history-content">
      <h2 className="transaction-history-title">Lịch sử giao dịch</h2>
      <div className="transaction-history-filter">
        <label>
          Từ ngày:
          <input
            type="date"
            value={startDate}
            min={minStartDate}
            max={maxEndDate}
            onChange={handleStartDateChange}
          />
        </label>
        <label>
          Đến ngày:
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={maxEndDate}
            onChange={handleEndDateChange}
          />
        </label>
      </div>
      {loading && <div className="transaction-history-loading">Đang tải...</div>}
      {error && <div className="transaction-history-error">{error}</div>}
      {!loading && !error && (
        <div className="transaction-history-list">
          {transactions.length === 0 ? (
            <div className="transaction-history-empty">Không có giao dịch nào.</div>
          ) : (
            transactions.map(tx => (
              <div className="transaction-history-item" key={tx.id}>
                <div className="tx-row">
                  <span className="tx-label">Từ:</span>
                  <span className="tx-value">{tx.sender?.fullName || tx.fromAccount || tx.senderId}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Đến:</span>
                  <span className="tx-value">{tx.receiver?.fullName || tx.toAccount || tx.receiverId}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Số tiền:</span>
                  <span className="tx-value tx-amount">{tx.amount.toLocaleString()} VND</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Nội dung:</span>
                  <span className="tx-value">{tx.note}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Thời gian:</span>
                  <span className="tx-value">{new Date(tx.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Trạng thái:</span>
                  <span className={`tx-value tx-status ${tx.status === 'SUCCESS' ? 'success' : 'fail'}`}>{tx.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <button className="transaction-history-back-btn" onClick={onBack}>Quay lại trang chủ</button>
    </div>
  );
};

export default TransactionHistory; 