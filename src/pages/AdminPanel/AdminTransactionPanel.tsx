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
  const [searchType, setSearchType] = useState<'ALL' | 'SENDER' | 'RECEIVER'>('ALL');
  const [showFilter, setShowFilter] = useState(false);
  const [searchAccount, setSearchAccount] = useState('');
  const [keywordType, setKeywordType] = useState<'EMAIL' | 'ACCOUNT'>('EMAIL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/all-transactions');
        setTransactions(res.data || []);
      } catch (err: any) {
        setError('Không thể tải danh sách giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []); // Chỉ gọi API khi component mount

  const filtered = transactions;

  // Tính toán phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hàm tạo mảng các trang cần hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3; // Số trang hiển thị tối đa mỗi bên
    
    if (totalPages <= maxVisiblePages * 2 + 1) {
      // Nếu tổng số trang ít, hiển thị tất cả
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Luôn hiển thị trang đầu
    pageNumbers.push(1);
    
    // Tính toán các trang ở giữa
    let startPage = Math.max(2, currentPage - maxVisiblePages);
    let endPage = Math.min(totalPages - 1, currentPage + maxVisiblePages);
    
    // Điều chỉnh để luôn hiển thị đủ số trang
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Luôn hiển thị trang cuối
    pageNumbers.push(totalPages);
    
    return pageNumbers;
  };

  const handleResetFilter = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/all-transactions');
      setTransactions(res.data || []);
      setSearch('');
      setFromDate('');
      setToDate('');
      setSearchType('ALL');
      setSearchAccount('');
      setKeywordType('EMAIL');
      setShowFilter(false);
      setCurrentPage(1); // Reset về trang 1 khi reset filter
    } catch (err: any) {
      setError('Không thể tải danh sách giao dịch.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = async () => {
    try {
      setLoading(true);
      const filterData = {
        searchType: searchType,
        keywordType: keywordType,
        keyword: keywordType === 'EMAIL' ? search : searchAccount,
        startDate: fromDate || undefined,
        endDate: toDate || undefined
      };
      
      const res = await axiosInstance.post('/admin/transaction/filter', filterData);
      setTransactions(res.data || []);
      setShowFilter(false);
      setCurrentPage(1); // Reset về trang 1 khi áp dụng filter mới
    } catch (err: any) {
      setError('Không thể tải danh sách giao dịch.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordTypeChange = (type: 'EMAIL' | 'ACCOUNT') => {
    setKeywordType(type);
    if (type === 'EMAIL') {
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
                    className={`admin-btn${searchType === 'ALL' ? ' add' : ''}`}
                    onClick={() => setSearchType('ALL')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`admin-btn${searchType === 'SENDER' ? ' add' : ''}`}
                    onClick={() => setSearchType('SENDER')}
                  >
                    Người gửi
                  </button>
                  <button 
                    className={`admin-btn${searchType === 'RECEIVER' ? ' add' : ''}`}
                    onClick={() => setSearchType('RECEIVER')}
                  >
                    Người nhận
                  </button>
                </div>
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: 8, color: '#666'}}>Chọn loại tìm kiếm</label>
                <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
                  <button 
                    className={`admin-btn${keywordType === 'EMAIL' ? ' add' : ''}`}
                    onClick={() => handleKeywordTypeChange('EMAIL')}
                  >
                    Tìm theo email
                  </button>
                  <button 
                    className={`admin-btn${keywordType === 'ACCOUNT' ? ' add' : ''}`}
                    onClick={() => handleKeywordTypeChange('ACCOUNT')}
                  >
                    Tìm theo số tài khoản
                  </button>
                </div>
              </div>
              
              <div>
                {keywordType === 'EMAIL' ? (
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
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`admin-btn${currentPage === page ? ' add' : ''}`}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: typeof page === 'number' ? 'pointer' : 'default',
                  backgroundColor: typeof page === 'number' && currentPage === page ? '#8cde4a' : 'transparent',
                  color: typeof page === 'number' && currentPage === page ? '#232946' : '#666'
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