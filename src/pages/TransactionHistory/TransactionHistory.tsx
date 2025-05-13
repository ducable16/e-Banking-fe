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
}

interface TransactionHistoryProps {
  onBack: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/transaction/history');
        setTransactions(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Không thể tải lịch sử giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="transaction-history-content">
      <h2 className="transaction-history-title">Lịch sử giao dịch</h2>
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
                  <span className="tx-value">{tx.fromAccount}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Đến:</span>
                  <span className="tx-value">{tx.toAccount}</span>
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