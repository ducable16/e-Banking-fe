import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const goToRegister = (): void => {
    navigate('/register');
  };
  
  const goToLogin = (): void => {
    navigate('/login');
  };

  const goToServices = (): void => {
    navigate('/services');
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>SENA Digibank</h1>
          <h2>Ngân hàng số thông minh cho tương lai của bạn</h2>
          <p>Trải nghiệm dịch vụ ngân hàng hiện đại, an toàn và tiện lợi mọi lúc, mọi nơi</p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={goToRegister}>Đăng ký ngay</button>
            <button className="secondary-button" onClick={goToLogin}>Đăng nhập</button>
          </div>
        </div>
        <div className="hero-image">
          {/* Bạn có thể thêm hình ảnh ở đây */}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Dịch vụ nổi bật</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-exchange"></i>
            </div>
            <h3>Chuyển tiền nhanh chóng</h3>
            <p>Chuyển tiền 24/7 miễn phí đến mọi ngân hàng trong nước</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-shield"></i>
            </div>
            <h3>Bảo mật tuyệt đối</h3>
            <p>Công nghệ bảo mật đa lớp với xác thực sinh trắc học</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-piggy-bank"></i>
            </div>
            <h3>Tiết kiệm trực tuyến</h3>
            <p>Mở tài khoản tiết kiệm với lãi suất hấp dẫn chỉ với vài thao tác</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-credit-card"></i>
            </div>
            <h3>Thanh toán dễ dàng</h3>
            <p>Thanh toán hóa đơn, mua sắm trực tuyến với ưu đãi độc quyền</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us-section">
        <h2>Tại sao chọn SENA Digibank?</h2>
        <div className="why-us-content">
          <div className="why-us-text">
            <div className="why-us-item">
              <h3>Tiện lợi tối đa</h3>
              <p>Giao dịch mọi lúc, mọi nơi thông qua ứng dụng di động hoặc website</p>
            </div>
            <div className="why-us-item">
              <h3>Phí giao dịch thấp</h3>
              <p>Tiết kiệm chi phí với các loại phí thấp hơn ngân hàng truyền thống</p>
            </div>
            <div className="why-us-item">
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc</p>
            </div>
          </div>
          <div className="why-us-image">
            {/* Bạn có thể thêm hình ảnh ở đây */}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Khách hàng nói gì về chúng tôi</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"SENA Digibank giúp tôi quản lý tài chính dễ dàng. Giao diện đơn giản, dễ sử dụng và luôn cập nhật công nghệ mới!"</p>
            </div>
            <div className="testimonial-author">
              <p><strong>Nguyễn Văn A</strong></p>
              <p>Khách hàng từ 2023</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Tôi đặc biệt hài lòng với tính năng bảo mật và khả năng phản hồi nhanh của dịch vụ khách hàng. Thực sự đáng tin cậy!"</p>
            </div>
            <div className="testimonial-author">
              <p><strong>Trần Thị B</strong></p>
              <p>Khách hàng từ 2022</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Chuyển tiền quốc tế với SENA rất thuận tiện và tỷ giá hối đoái cạnh tranh. Tôi sẽ tiếp tục sử dụng dịch vụ này."</p>
            </div>
            <div className="testimonial-author">
              <p><strong>Lê Văn C</strong></p>
              <p>Khách hàng từ 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng trải nghiệm ngân hàng số thế hệ mới?</h2>
          <p>Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt dành cho khách hàng mới</p>
          <div className="cta-buttons">
            <button className="primary-button" onClick={goToRegister}>Đăng ký tài khoản</button>
            <button className="outline-button" onClick={goToServices}>Tìm hiểu thêm</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>SENA Digibank</h3>
            <p>Ngân hàng số cho người Việt</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Dịch vụ</h4>
              <ul>
                <li><a href="#">Tài khoản thanh toán</a></li>
                <li><a href="#">Tiết kiệm trực tuyến</a></li>
                <li><a href="#">Vay cá nhân</a></li>
                <li><a href="#">Thẻ tín dụng</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><a href="#">Câu hỏi thường gặp</a></li>
                <li><a href="#">Liên hệ</a></li>
                <li><a href="#">Phản hồi</a></li>
                <li><a href="#">Bảo mật</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Pháp lý</h4>
              <ul>
                <li><a href="#">Điều khoản sử dụng</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
                <li><a href="#">Biểu phí</a></li>
                <li><a href="#">Thông tin pháp lý</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SENA Digibank. Tất cả các quyền được bảo lưu.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fa fa-facebook"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fa fa-linkedin"></i></a>
            <a href="#" aria-label="Twitter"><i className="fa fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fa fa-instagram"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;