import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

// Import các icon hoặc hình ảnh cần thiết
// Ví dụ: import { FaHome, FaMoneyBill, FaCreditCard, ... } from 'react-icons/fa';

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



import contactIcon from '../../assets/icons/contactIcon.png';
import locationIcon from '../../assets/icons/locationIcon.png';
import emailIcon from '../../assets/icons/emailIcon.png';

import logoutIcon from '../../assets/icons/logoutIcon.png'; // Icon đăng xuất

import banner from '../../assets/icons/home/banner.jpg'; // Icon đăng xuất

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [accountBalance, setAccountBalance] = useState<string>('***');
  const [showBalance, setShowBalance] = useState<boolean>(false);

  // Mock data
  const accountNumber = '1047610982';
  const rewardPoints = 1000;
  const monthlyTarget = 100; // % hoàn thành
  const userName = 'Nguyễn Văn A'; // Tên người dùng giả định

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
        {/* Header */}
        <header className="app-header">
          <div className="welcome">Xin chào, {userName}</div>
          <div className="header-actions">
            <button className="btn-logout" onClick={handleLogout}>
              <img src={logoutIcon} alt="Đăng xuất" className="header-icon" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Banner chào mừng */}
        <div className="banner">
          <img src={banner}/>
          <div className="banner-content">
            <div className="banner-text">
              <h3>Chúc Quý khách một ngày mới tốt lành!</h3>
              <p>TRẦN KHẮC HỒNG ĐỨC</p>
            </div>
            <div className="banner-image">
              <img src="/assets/images/emoji-cool.png" alt="Cool Emoji" width="120" />
            </div>
          </div>
          <button className="btn-customize">
            <span className="icon-customize"></span>
            Tùy chỉnh
          </button>
        </div>

        {/* Favorite Functions */}
        <section className="favorite-functions">
          <h2>Chức năng ưa thích</h2>
          <div className="functions-grid">
            <div className="function-card">
              <div className="function-icon">📱</div>
              <div className="function-name">Nạp Data 4G/5G</div>
            </div>
            <div className="function-card">
              <div className="function-icon">💸</div>
              <div className="function-name">Chuyển tiền trong nước</div>
            </div>
            <div className="function-card">
              <div className="function-icon">👥</div>
              <div className="function-name">Quản lý nhóm</div>
            </div>
            <div className="function-card">
              <div className="function-icon">💰</div>
              <div className="function-name">Nạp tiền ví điện tử</div>
            </div>
            <div className="function-card">
              <div className="function-icon">📱</div>
              <div className="function-name">Nạp tiền điện thoại</div>
            </div>
            <div className="function-card">
              <div className="function-icon">🔑</div>
              <div className="function-name">Mở tài khoản chứng khoán</div>
            </div>
          </div>
        </section>

        {/* Account Information */}
        <div className="dashboard-grid">
          <section className="account-info">
            <h2>Tài khoản thanh toán</h2>
            <div className="account-card">
              <h3>Tài khoản mặc định</h3>
              <div className="account-details">
                <div className="account-row">
                  <span>Số tài khoản</span>
                  <span>{accountNumber} <button className="copy-btn">📋</button></span>
                </div>
                <div className="account-row">
                  <span>Số dư</span>
                  <span className="balance">
                    {accountBalance} VND 
                    <button className="toggle-btn" onClick={toggleShowBalance}>
                      👁️
                    </button>
                  </span>
                </div>
              </div>
              <div className="account-actions">
                <button className="action-btn">
                  <span className="icon">📜</span>
                  <span>Lịch sử giao dịch</span>
                </button>
                <button className="action-btn">
                  <span className="icon">💳</span>
                  <span>Tài khoản & Thẻ</span>
                </button>
              </div>
              <button className="open-account-btn">Mở tài khoản số chọn</button>
              <div className="card-section">
                <h3>Thẻ ghi nợ/Thẻ tín dụng</h3>
                <div className="credit-card">
                  {/* Hình ảnh thẻ tín dụng */}
                  <div className="card-info">
                    <span className="card-type">VISA</span>
                    <span className="card-expiry">Miễn lãi 45 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="statistics-section">
            <h2>Chỉ tiêu so với tháng 04</h2>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${monthlyTarget}%` }}></div>
            </div>
            <div className="target-percentage">
              <span>↑ {monthlyTarget} %</span>
            </div>
            <div className="months-grid">
              <span>T12</span>
              <span>T1</span>
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
            </div>
            <button className="manage-finance-btn">Quản lý tài chính cá nhân</button>
          </section>

          {/* Rewards Section */}
          <section className="rewards-section">
            <h2>VCB Rewards</h2>
            <div className="reward-box">
              <div className="reward-header">
                <span className="reward-icon">🎁</span>
                <div className="reward-info">
                  <span>Điểm tích lũy</span>
                  <span className="points-amount">1,000</span>
                </div>
              </div>
              <button className="redeem-points-btn">Đổi điểm ngay</button>
            </div>
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