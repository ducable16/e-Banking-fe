import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate, useLocation } from 'react-router-dom';

import MonthlyBarChart from '../../components/MonthlyBarChart';

import searchIcon from '../../assets/icons/searchIcon.png';

import homeIcon from '../../assets/icons/home/homeIcon.png';
import transferIcon from '../../assets/icons/home/transferIcon.png';
import billIcon from '../../assets/icons/home/billIcon.png';
import topupIcon from '../../assets/icons/home/topupIcon.png';
import cardIcon from '../../assets/icons/home/cardIcon.png';
import creditIcon from '../../assets/icons/home/creditIcon.png';
import savingIcon from '../../assets/icons/home/savingIcon.png';
import insuranceIcon from '../../assets/icons/home/insuranceIcon.png';
import investmentIcon from '../../assets/icons/home/investmentIcon.png';
import budgetIcon from '../../assets/icons/home/budgetIcon.png';
import utilityIcon from '../../assets/icons/home/utilityIcon.png';
import adminIcon from '../../assets/icons/utilityIcon.png';

// Thêm import ảnh thẻ
import CreditCard from '../../components/CreditCard';

import contactIcon from '../../assets/icons/contactIcon.png';
import locationIcon from '../../assets/icons/locationIcon.png';
import emailIcon from '../../assets/icons/emailIcon.png';

import copyIcon from '../../assets/icons/copyIcon.png';
import showIcon from '../../assets/icons/showIcon.png'; // Icon hiển thị số dư
import hideIcon from '../../assets/icons/hideIcon.png'; // Icon ẩn số dư

import logoutIcon from '../../assets/icons/logoutIcon.png'; // Icon đăng xuất

import banner from '../../assets/icons/home/banner.jpg'; // Icon đăng xuất

import axiosInstance from '../../services/AxiosInstance';
import TransferForm from '../Transfer/Transfer';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import Settings from '../Settings/Settings';



const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountBalance, setAccountBalance] = useState<string>('***');
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [showTransferForm, setShowTransferForm] = useState<boolean>(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>('home');

  // Trong component Home
  const [monthlyData, setMonthlyData] = useState([
    { month: 'T12', income: 850000, expense: 650000 },
    { month: 'T1', income: 900000, expense: 700000 },
    { month: 'T2', income: 800000, expense: 650000 },
    { month: 'T3', income: 950000, expense: 820000 },
    { month: 'T4', income: 870000, expense: 700000 },
    { month: 'T5', income: 1100000, expense: 750000 }
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await axiosInstance.get('/user/profile') as any;
        const profile = response.data;
        setAccountNumber(profile.account || '');
        setAccountBalance(showBalance ? (profile.balance?.toLocaleString?.() || '0') : '***');
        setFullName(profile.fullName || '');
        setUserRole(profile.role || '');
      } catch (err) {
        setAccountNumber('Không xác định');
        setAccountBalance('***');
        setFullName('Không xác định');
        setUserRole('');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBalance]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axiosInstance.get('/transaction/summary/last-12-months') as any;
        const res = response.data;
        // Map dữ liệu trả về thành format cho MonthlyBarChart
        const data = Array.isArray(res)
          ? res.map((item: any) => ({
              month: 'T' + (new Date(item.month).getMonth() + 1),
              income: item.totalReceived,
              expense: item.totalSent,
            }))
          : [];
        console.log('monthlyData:', data);
        setMonthlyData(data);
      } catch (err) {
        // fallback: giữ nguyên dữ liệu cũ nếu lỗi
      }
    };
    fetchMonthlyData();
  }, []);

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
    // Khi showBalance thay đổi, useEffect sẽ tự gọi lại fetchProfile để cập nhật số dư
  };

  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ localStorage hoặc sessionStorage nếu có
    localStorage.removeItem('token');
    // Chuyển hướng về trang login
    navigate('/login');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber);
    // Có thể thêm một notification nhỏ hoặc thay đổi icon tạm thời để thông báo đã sao chép
  };

  const cardInfo = {
    cardNumber: '1234567890123456',
    cardholderName: fullName,
    expiryDate: '05/28',
    cardType: 'VISA' as const,
    promotion: 'Miễn lãi 45 ngày'
  };



  return (
    <div className="banking-app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2>SENA Digibank</h2>
        </div>
        <div className="search-bar">
          <img src={searchIcon} className="search-icon" alt="Search" />
          <input type="text" placeholder="Tìm kiếm chức năng" />
        </div>
        <nav className="sidebar-menu">
          <ul>
            {/* Ba mục đầu tiên */}
            <li className={`menu-item${activeMenu === 'home' ? ' active' : ''}`} onClick={() => { setActiveMenu('home'); setShowSettings(false); setShowTransferForm(false); setShowTransactionHistory(false); }} style={{cursor: 'pointer'}}>
              <span className="icon">
                <img src={homeIcon} alt="Trang chủ" className="custom-icon" />
              </span>
              <span className="text">Trang chủ</span>
            </li>
            <li className={`menu-item${activeMenu === 'transfer' ? ' active' : ''}`} onClick={() => { setActiveMenu('transfer'); setShowTransferForm(true); setShowTransactionHistory(false); setShowSettings(false); }} style={{cursor: 'pointer'}}>
              <span className="icon">
                <img src={transferIcon} alt="Chuyển tiền" className="custom-icon" />
              </span>
              <span className="text">Chuyển tiền</span>
            </li>
            <li className={`menu-item${activeMenu === 'history' ? ' active' : ''}`} onClick={() => { setActiveMenu('history'); setShowTransactionHistory(true); setShowTransferForm(false); setShowSettings(false); }} style={{cursor: 'pointer'}}>
              <span className="icon">
                <img src={billIcon} alt="Lịch sử giao dịch" className="custom-icon" />
              </span>
              <span className="text">Lịch sử giao dịch</span>
            </li>
            
            {/* Các mục menu với icon PNG thay thế emoji */}
            <li className="menu-item">
              <span className="icon">
                <img src={topupIcon} alt="Nạp tiền" className="custom-icon" />
              </span>
              <span className="text">Nạp tiền</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={cardIcon} alt="Dịch vụ thẻ" className="custom-icon" />
              </span>
              <span className="text">Dịch vụ thẻ</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={creditIcon} alt="Tín dụng" className="custom-icon" />
              </span>
              <span className="text">Tín dụng</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={savingIcon} alt="Tiết kiệm" className="custom-icon" />
              </span>
              <span className="text">Tiết kiệm</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={insuranceIcon} alt="Bảo hiểm" className="custom-icon" />
              </span>
              <span className="text">Bảo hiểm</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={investmentIcon} alt="Đầu tư" className="custom-icon" />
              </span>
              <span className="text">Đầu tư</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={budgetIcon} alt="Ngân sách nhà nước" className="custom-icon" />
              </span>
              <span className="text">Ngân sách nhà nước</span>
            </li>
            <li className={`menu-item${activeMenu === 'settings' ? ' active' : ''}`} onClick={() => { setActiveMenu('settings'); setShowSettings(true); setShowTransferForm(false); setShowTransactionHistory(false); }} style={{cursor: 'pointer'}}>
              <span className="icon">
                <img src={utilityIcon} alt="Cài đặt" className="custom-icon" />
              </span>
              <span className="text">Cài đặt</span>
            </li>
            {userRole === 'ADMIN' && (
              <li className={`menu-item${activeMenu === 'admin' ? ' active' : ''}`} onClick={() => { setActiveMenu('admin'); navigate('/admin'); }} style={{cursor: 'pointer'}}>
                <span className="icon">
                  <img src={adminIcon} alt="Quản lý" className="custom-icon" />
                </span>
                <span className="text">Quản lý</span>
              </li>
            )}
          </ul>
        </nav>
        <div className="support-section">
          <div className="support-item">
            <span className="icon">
              <img src={contactIcon} alt="Hotline" className="support-icon" />
            </span>
            <span className="text">1900 545 413</span>
          </div>
          <div className="support-item">
            <span className="icon">
              <img src={locationIcon} alt="ATM/Chi nhánh" className="support-icon" />
            </span>
            <span className="text">ATM/Chi nhánh</span>
          </div>
          <div className="support-item">
            <span className="icon">
              <img src={emailIcon} alt="Yêu cầu hỗ trợ" className="support-icon" />
            </span>
            <span className="text">Yêu cầu hỗ trợ</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header - đã cập nhật */}
        <header className="app-header">
          <div className="welcome">Xin chào, {fullName}</div>
          <div className="header-actions">
            <button className="btn-logout" onClick={handleLogout}>
              <img src={logoutIcon} alt="Đăng xuất" className="header-icon" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Banner chào mừng - đơn giản hóa chỉ giữ lại hình nền */}
        {!showTransferForm && !showTransactionHistory && !showSettings && (
          <div className="banner">
            <img src={banner} alt="Banner chào mừng" />
            <div className="banner-content">
              <div className="banner-text">
                <h3>Chúc Quý khách một ngày mới tốt lành!</h3>  
              </div>
            </div>
          </div>
        )}

        {/* Main content: chuyển tiền, lịch sử giao dịch hoặc dashboard */}
        {showTransferForm ? (
          <div className="transfer-form-center"><TransferForm onBack={() => setShowTransferForm(false)} /></div>
        ) : showTransactionHistory ? (
          <div className="transfer-form-center"><TransactionHistory onBack={() => setShowTransactionHistory(false)} /></div>
        ) : showSettings ? (
          <div className="transfer-form-center"><Settings /></div>
        ) : (
        <>
        {/* Dashboard Grid - Đã loại bỏ phần reward */}
        <div className="dashboard-grid">
          {/* Account Information - Giữ nguyên */}
          <section className="account-info">
            <h2>Tài khoản thanh toán</h2>
            <div className="account-card">
              <div className="account-details">
                <div className="account-row">
                  <span>Số tài khoản</span>
                  <span>
                    {accountNumber} 
                    <button className="copy-btn" onClick={copyToClipboard}>
                      <img src={copyIcon} alt="Copy" className="action-icon" />
                    </button>
                  </span>
                </div>
                <div className="account-row">
                  <span>Số dư</span>
                  <span className="balance">
                    {accountBalance} VND 
                    <button className="toggle-btn" onClick={toggleShowBalance}>
                      <img 
                        src={showBalance ? showIcon : hideIcon} 
                        alt={showBalance ? "Ẩn số dư" : "Hiện số dư"} 
                        className="action-icon"
                      />
                    </button>
                  </span>
                </div>
              </div>
              <div className="account-actions">
              </div>
              <div className="card-section">
                <h3>Thẻ ghi nợ/Thẻ tín dụng</h3>
                
                {/* Sử dụng component CreditCard */}
                <CreditCard 
                  cardNumber={cardInfo.cardNumber}
                  cardholderName={cardInfo.cardholderName}
                  expiryDate={cardInfo.expiryDate}
                  cardType={cardInfo.cardType}
                  promotion={cardInfo.promotion}
                  isHiddenNumber={true}
                  useRandomGradient={true} // Bật tính năng gradient ngẫu nhiên
                />
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="statistics-section">
            {/* Header với tiêu đề và phần trăm nằm trên cùng một hàng */}
            <div className="stats-header">
              {/* Tính toán tháng hiện tại và tháng trước từ dữ liệu */}
              {(() => {
                if (monthlyData.length < 2) {
                  return <>
                    <h1>Chi tiêu so với tháng trước</h1>
                    <div className="target-indicator">Dữ liệu không khả dụng</div>
                  </>;
                }
                const currentMonthData = monthlyData[monthlyData.length - 1];
                const previousMonthData = monthlyData[monthlyData.length - 2];
                const prevMonthLabel = previousMonthData.month;
                const currentTotal = currentMonthData.income + currentMonthData.expense;
                const previousTotal = previousMonthData.income + previousMonthData.expense;
                const ratio = previousTotal > 0 ? Math.round((currentTotal / previousTotal) * 100) : 100;
                const isIncrease = currentTotal > previousTotal;
                const arrowDirection = isIncrease ? '↑' : '↓';
                const colorClass = isIncrease ? 'increase' : 'decrease';
                return <>
                  <h1 style={{display: 'inline-block', marginRight: 24}}>Chi tiêu so với {prevMonthLabel}</h1>
                  <div className={`target-indicator ${colorClass}`} style={{marginLeft: 32}}>
                    <span className="arrow">{arrowDirection}</span>
                    <span className="percentage">{ratio} %</span>
                  </div>
                </>;
              })()}
            </div>
              <MonthlyBarChart data={monthlyData} />
            
            
            
          </section>

        </div>
        {/* Latest Updates */}
        <section className="latest-updates">
          <div className="section-header">
            <h2>Mới nhất trên VCB Digibank</h2>
            <button className="view-all-btn">Xem tất cả ưu đãi →</button>
          </div>
          <div className="promotions-slider">
            {/* Các thẻ quảng cáo/ưu đãi sẽ đặt ở đây */}
            <div className="promo-card">
              <div className="promo-tag">mới</div>
              {/* Nội dung khuyến mãi */}
            </div>
          </div>
        </section>

        {/* Update Time */}
        <div className="update-time">
          <span>Cập nhật: 19.54 - 31/05/2025</span>
          <button className="refresh-btn">🔄</button>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Home;