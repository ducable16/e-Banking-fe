import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

// Định nghĩa interface cho dữ liệu form
interface FormData {
  username: string;
  email: string;
  phone: string;
  identityNumber: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Định nghĩa interface cho errors
interface FormErrors {
  [key: string]: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    identityNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep1 = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại gồm 10 chữ số';
    }
    
    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = 'Vui lòng nhập số CMND/CCCD';
    } else if (!/^[0-9]{9}$|^[0-9]{12}$/.test(formData.identityNumber)) {
      newErrors.identityNumber = 'CMND/CCCD không hợp lệ (9 hoặc 12 số)';
    }
    
    return newErrors;
  };

  const validateStep2 = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = 'Vui lòng nhập mã OTP';
    } else if (!/^[0-9]{6}$/.test(formData.otp)) {
      newErrors.otp = 'Mã OTP gồm 6 chữ số';
    }
    
    return newErrors;
  };

  const validateStep3 = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    return newErrors;
  };

  const sendOtp = (): void => {
    const validationErrors = validateStep1();
    
    if (Object.keys(validationErrors).length === 0) {
      // Giả lập gửi OTP
      console.log('Gửi OTP đến:', formData.email, formData.phone);
      setOtpSent(true);
      setStep(2);
    } else {
      setErrors(validationErrors);
    }
  };

  const verifyOtp = (): void => {
    const validationErrors = validateStep2();
    
    if (Object.keys(validationErrors).length === 0) {
      // Giả lập xác minh OTP
      console.log('Xác minh OTP:', formData.otp);
      setStep(3);
    } else {
      setErrors(validationErrors);
    }
  };

  const resetPassword = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validationErrors = validateStep3();
    
    if (Object.keys(validationErrors).length === 0) {
      // Giả lập đặt lại mật khẩu
      console.log('Đặt lại mật khẩu:', formData.newPassword);
      // Sau khi thành công, chuyển hướng về trang đăng nhập
      alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
      navigate('/login');
    } else {
      setErrors(validationErrors);
    }
  };

  const goToLogin = (): void => {
    navigate('/login');
  };

  const resendOtp = (): void => {
    console.log('Gửi lại OTP đến:', formData.email, formData.phone);
    // Hiển thị thông báo
    alert('Mã OTP đã được gửi lại thành công!');
  };

  return (
    <div className="modern-forget-container">
      <div className="forget-content">
        <div className="forget-header">
          <h2>SENA Digibank</h2>
          <p>
            {step === 1 && 'Quên mật khẩu - Xác minh danh tính'}
            {step === 2 && 'Quên mật khẩu - Xác nhận mã OTP'}
            {step === 3 && 'Quên mật khẩu - Tạo mật khẩu mới'}
          </p>
        </div>
        
        <form onSubmit={resetPassword} className="modern-forget-form">
          {step === 1 && (
            // Bước 1: Nhập thông tin cá nhân
            <>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email đăng ký"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Số điện thoại đăng ký"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="identityNumber"
                  name="identityNumber"
                  placeholder="CMND/CCCD"
                  value={formData.identityNumber}
                  onChange={handleChange}
                  maxLength={12}
                />
                {errors.identityNumber && <div className="error-message">{errors.identityNumber}</div>}
              </div>
              
              <button type="button" onClick={sendOtp} className="forget-button">
                Tiếp tục
              </button>
            </>
          )}
          
          {step === 2 && (
            // Bước 2: Xác nhận OTP
            <>
              <div className="otp-message">
                Mã xác thực OTP đã được gửi đến email và số điện thoại của bạn.
                Vui lòng kiểm tra và nhập mã OTP để tiếp tục.
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Nhập mã OTP (6 chữ số)"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                />
                {errors.otp && <div className="error-message">{errors.otp}</div>}
              </div>
              
              <div className="otp-actions">
                <button type="button" onClick={verifyOtp} className="forget-button">
                  Xác nhận OTP
                </button>
                
                <div className="resend-otp">
                  Chưa nhận được mã? <a onClick={resendOtp} style={{cursor: 'pointer'}}>Gửi lại</a>
                </div>
              </div>
            </>
          )}
          
          {step === 3 && (
            // Bước 3: Tạo mật khẩu mới
            <>
              <div className="form-group">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Mật khẩu mới"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="password-input"
                  maxLength={30}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                ></span>
                {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
              </div>
              
              <div className="form-group">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="password-input"
                  maxLength={30}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></span>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
              
              <div className="password-guidance">
                <p>Mật khẩu mới phải đáp ứng các yêu cầu sau:</p>
                <ul>
                  <li>Ít nhất 8 ký tự</li>
                  <li>Có ít nhất 1 chữ cái thường (a-z)</li>
                  <li>Có ít nhất 1 chữ cái hoa (A-Z)</li>
                  <li>Có ít nhất 1 chữ số (0-9)</li>
                  <li>Có ít nhất 1 ký tự đặc biệt (@$!%*?&)</li>
                </ul>
              </div>
              
              <button type="submit" className="forget-button">
                Đặt lại mật khẩu
              </button>
            </>
          )}
          
          <div className="login-redirect">
            Đã nhớ mật khẩu? <a onClick={goToLogin} style={{cursor: 'pointer'}}>Đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Đổi tên từ ForgetPassword sang ForgotPassword để đồng nhất
export default ForgotPassword;