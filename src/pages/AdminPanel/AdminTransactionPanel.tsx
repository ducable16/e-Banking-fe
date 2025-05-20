import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import './AdminPanel.css';

interface Transaction {
  transactionId: string;
  sender: { 
    fullName: string; 
    account: string;
    email: string;
  };
  receiver: { 
    fullName: string; 
    account: string;
    email: string;
  };
  amount: number;
  note: string;
  createdAt: string;
}

const AdminTransactionPanel: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'sender' | 'receiver'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [searchAccount, setSearchAccount] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'account'>('email');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!fromDate && !toDate) {
        try {
          setLoading(true);
          const res = await axiosInstance.get('/admin/all-transactions');
          setTransactions(res.data || []);
        } catch (err: any) {
          setError('Không thể tải danh sách giao dịch.');
        } finally {
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        const res = await axiosInstance.post('/transactions/filter', {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined
        });
        setTransactions(res.data || []);
      } catch (err: any) {
        setError('Không thể tải danh sách giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [fromDate, toDate]);

  const filtered = transactions.filter(tx => {
    const txDate = new Date(tx.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    let inRange = true;
    if (from && txDate < from) inRange = false;
    if (to && txDate > to) inRange = false;
    let match = true;
    if (searchType === 'email' && search) {
      if (searchMode === 'all') {
        match = tx.sender.email?.includes(search) || tx.receiver.email?.includes(search);
      } else if (searchMode === 'sender') {
        match = tx.sender.email?.includes(search);
      } else if (searchMode === 'receiver') {
        match = tx.receiver.email?.includes(search);
      }
    }
    if (searchType === 'account' && searchAccount) {
      match = match && (tx.sender.account.includes(searchAccount) || tx.receiver.account.includes(searchAccount));
    }
    return match && inRange;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setSearchMode('all');
    setSearchAccount('');
    setSearchType('email');
    setShowFilter(false);
  };

  const handleSearchTypeChange = (type: 'email' | 'account') => {
    setSearchType(type);
    if (type === 'email') {
      setSearchAccount('');
    } else {
      setSearch('');
    }
  };

  return (
    <div className="admin-panel-content">
      <h2 className="admin-panel-title">Quản lý giao dịch</h2>
      <div style={{position: 'relative', marginBottom: 18}}>
        <button 
          className="admin-btn" 
          onClick={() => setShowFilter(!showFilter)}
          style={{display: 'flex', alignItems: 'center', gap: 8}}
        >
          <span>🔍 Bộ lọc tìm kiếm</span>
          <span>{showFilter ? '▲' : '▼'}</span>
        </button>
        
        {showFilter && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            marginTop: '8px'
          }}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              <div>
                <label style={{display: 'block', marginBottom: 8, color: '#666'}}>Loại tìm kiếm</label>
                <div style={{display: 'flex', gap: 8}}>
                  <button 
                    className={`admin-btn${searchMode === 'all' ? ' add' : ''}`}
                    onClick={() => setSearchMode('all')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`admin-btn${searchMode === 'sender' ? ' add' : ''}`}
                    onClick={() => setSearchMode('sender')}
                  >
                    Người gửi
                  </button>
                  <button 
                    className={`admin-btn${searchMode === 'receiver' ? ' add' : ''}`}
                    onClick={() => setSearchMode('receiver')}
                  >
                    Người nhận
                  </button>
                </div>
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: 8, color: '#666'}}>Chọn loại tìm kiếm</label>
                <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
                  <button 
                    className={`admin-btn${searchType === 'email' ? ' add' : ''}`}
                    onClick={() => handleSearchTypeChange('email')}
                  >
                    Tìm theo email
                  </button>
                  <button 
                    className={`admin-btn${searchType === 'account' ? ' add' : ''}`}
                    onClick={() => handleSearchTypeChange('account')}
                  >
                    Tìm theo số tài khoản
                  </button>
                </div>
              </div>
              
              <div>
                {searchType === 'email' ? (
                  <div>
                    <label style={{display: 'block', marginBottom: 8, color: '#666'}}>Tìm kiếm theo email</label>
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Nhập email để tìm kiếm..."
                      style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1c4e9'}}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{display: 'block', marginBottom: 8, color: '#666'}}>Tìm kiếm theo số tài khoản</label>
                    <input
                      type="text"
                      value={searchAccount}
                      onChange={e => setSearchAccount(e.target.value)}
                      placeholder="Nhập số tài khoản..."
                      style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1c4e9'}}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: 8, color: '#666'}}>Khoảng thời gian</label>
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    style={{flex: 1, padding: 8, borderRadius: 6, border: '1px solid #d1c4e9'}}
                  />
                  <span>đến</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    style={{flex: 1, padding: 8, borderRadius: 6, border: '1px solid #d1c4e9'}}
                  />
                </div>
              </div>
              
              <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
                <button className="admin-btn" onClick={handleResetFilter}>
                  Đặt lại
                </button>
                <button className="admin-btn add" onClick={handleApplyFilter}>
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}
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
              <th>Nội dung</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(tx => (
              <tr key={tx.transactionId}>
                <td>{tx.transactionId}</td>
                <td>{tx.sender.fullName} ({tx.sender.account})</td>
                <td>{tx.receiver.fullName} ({tx.receiver.account})</td>
                <td>{tx.amount.toLocaleString('vi-VN')} VND</td>
                <td>{tx.note}</td>
                <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Phân trang */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            padding: '10px'
          }}>
            <button
              className="admin-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              ←
            </button>
            
            {/* Hiển thị các nút trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`admin-btn${currentPage === page ? ' add' : ''}`}
                onClick={() => handlePageChange(page)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              className="admin-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              →
            </button>
            
            <span style={{ marginLeft: '16px', color: '#666' }}>
              Trang {currentPage} / {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionPanel; 