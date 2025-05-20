import React from 'react';
import './Transfer.css';

interface SuccessBillProps {
  amount: number;
  toAccount: string;
  receiverName: string;
  note: string;
  transactionTime: string;
  onNewTransfer: () => void;
  transactionId?: string;
}

const SuccessBill: React.FC<SuccessBillProps> = ({
  amount,
  toAccount,
  receiverName,
  note,
  transactionTime,
  onNewTransfer,
  transactionId
}) => {
  return (
    <div className="success-bill-container">
      <div className="success-bill-header">
        <div className="success-bill-check">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="30" fill="#8cde4a" opacity="0.18" />
            <circle cx="30" cy="30" r="24" fill="#8cde4a" />
            <polyline points="20,32 28,40 42,24" fill="none" stroke="#232946" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="success-bill-title">Giao dịch thành công!</div>
        <div className="success-bill-amount">{amount.toLocaleString()} <span className="success-bill-currency">VND</span></div>
        <div className="success-bill-time">{transactionTime}</div>
      </div>
      <div className="success-bill-details">
        <div className="success-bill-row">
          <span>Tài khoản nhận</span>
          <span>{toAccount}</span>
        </div>
        <div className="success-bill-row">
          <span>Tên người nhận</span>
          <span>{receiverName}</span>
        </div>
        {note && (
          <div className="success-bill-row">
            <span>Nội dung</span>
            <span>{note}</span>
          </div>
        )}
        <div className="success-bill-row">
          <span>Thời điểm chuyển khoản</span>
          <span>{transactionTime}</span>
        </div>
        {transactionId && (
          <div className="success-bill-row">
            <span>Mã giao dịch</span>
            <span>{transactionId}</span>
          </div>
        )}
      </div>
      <button className="success-bill-new-btn" onClick={onNewTransfer}>
        Thực hiện giao dịch mới
      </button>
    </div>
  );
};

export default SuccessBill; 