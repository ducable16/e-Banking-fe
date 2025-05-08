import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

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


// Thêm import ảnh thẻ
import card_1 from '../../assets/images/card_1.png';
import CreditCard from '../../components/CreditCard';

import contactIcon from '../../assets/icons/contactIcon.png';
import locationIcon from '../../assets/icons/locationIcon.png';
import emailIcon from '../../assets/icons/emailIcon.png';

import copyIcon from '../../assets/icons/copyIcon.png';
import showIcon from '../../assets/icons/showIcon.png'; // Icon hiển thị số dư
import hideIcon from '../../assets/icons/hideIcon.png'; // Icon ẩn số dư

import logoutIcon from '../../assets/icons/logoutIcon.png'; // Icon đăng xuất

import banner from '../../assets/icons/home/banner.jpg'; // Icon đăng xuất



const Home: React.FC = () => {
  const navigate = useNavigate();
  const [accountBalance, setAccountBalance] = useState<string>('***');
  const [showBalance, setShowBalance] = useState<boolean>(false);

  // Mock data
  const accountNumber = '1047610982';
  const monthlyTarget = 100; // % hoàn thành
  const userName = 'Nguyễn Văn A'; // Tên người dùng giả định

  // Trong component Home
  const [monthlyData, setMonthlyData] = useState([
    { month: 'T12', income: 850000, expense: 650000 },
    { month: 'T1', income: 900000, expense: 700000 },
    { month: 'T2', income: 800000, expense: 650000 },
    { month: 'T3', income: 950000, expense: 820000 },
    { month: 'T4', income: 870000, expense: 700000 },
    { month: 'T5', income: 1100000, expense: 750000 }
  ]);

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
    // Giả định dữ liệu số dư
    if (!showBalance) {
      setAccountBalance('10,000,000');
    } else {
      setAccountBalance('***');
    }
  };

  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ localStorage hoặc sessionStorage nếu có
    localStorage.removeItem('token');
    // Chuyển hướng về trang đăng nhập
    navigate('/landing');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber);
    // Có thể thêm một notification nhỏ hoặc thay đổi icon tạm thời để thông báo đã sao chép
  };

  const cardInfo = {
    cardNumber: '1234567890123456',
    cardholderName: userName,
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
            <li className="menu-item">
              <span className="icon">
                <img src={homeIcon} alt="Trang chủ" className="custom-icon" />
              </span>
              <span className="text">Trang chủ</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={transferIcon} alt="Chuyển tiền" className="custom-icon" />
              </span>
              <span className="text">Chuyển tiền</span>
            </li>
            <li className="menu-item">
              <span className="icon">
                <img src={billIcon} alt="Hóa đơn" className="custom-icon" />
              </span>
              <span className="text">Hóa đơn</span>
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
            <li className="menu-item">
              <span className="icon">
                <img src={utilityIcon} alt="Tiện ích" className="custom-icon" />
              </span>
              <span className="text">Tiện ích</span>
            </li>
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
          <div className="welcome">Xin chào, {userName}</div>
          <div className="header-actions">
            <button className="btn-logout" onClick={handleLogout}>
              <img src={logoutIcon} alt="Đăng xuất" className="header-icon" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Banner chào mừng - đơn giản hóa chỉ giữ lại hình nền */}
        <div className="banner">
          <img src={banner} alt="Banner chào mừng" />
          <div className="banner-content">
            <div className="banner-text">
              <h3>Chúc Quý khách một ngày mới tốt lành!</h3>  
            </div>
          </div>
        </div>

         

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
                <button className="action-btn">
                  <span>Lịch sử giao dịch</span>
                </button>
                <button className="action-btn">
                  <span>Tài khoản & Thẻ</span>
                </button>
              </div>
              <button className="open-account-btn">Mở tài khoản số chọn</button>
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
              <h1>Chi tiêu so với tháng 04</h1>
              {/* Hiển thị phần trăm động dựa trên sự so sánh */}
              {(() => {
                // Lấy dữ liệu tháng hiện tại và tháng trước
                // const currentMonthData = monthlyData[monthlyData.length - 1];
                // const currentMonthData = monthlyData[monthlyData.length - 2];
                // giả sử
                const currentMonthData = monthlyData.find(item => item.month === 'T5');
                const previousMonthData = monthlyData.find(item => item.month === 'T4');
                
                if (!currentMonthData || !previousMonthData) {
                  return <div className="target-indicator">Dữ liệu không khả dụng</div>;
                }
                // Tính tỉ lệ chi tiêu so với tháng trước
                const ratio = Math.round((currentMonthData.expense / previousMonthData.expense) * 100);
                
                // Xác định hướng mũi tên và màu sắc
                const isIncrease = currentMonthData.expense > previousMonthData.expense;
                const arrowDirection = isIncrease ? '↑' : '↓';
                const colorClass = isIncrease ? 'increase' : 'decrease';
                
                return (
                  <div className={`target-indicator ${colorClass}`}>
                    <span className="arrow">{arrowDirection}</span>
                    <span className="percentage">{ratio} %</span>
                  </div>
                );
              })()}
            </div>
              <MonthlyBarChart data={monthlyData} />
            
            
            
            <button className="manage-finance-btn">Quản lý tài chính cá nhân</button>
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
      </div>
    </div>
  );
};

export default Home;