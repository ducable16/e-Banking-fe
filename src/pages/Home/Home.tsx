import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Định nghĩa interface cho dữ liệu form
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  identityNumber: string;
  address: string;
}

// Định nghĩa interface cho errors
interface FormErrors {
  [key: string]: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    identityNumber: '',
    address: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 6) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 6 ký tự';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ liên lạc';
    }
    
    return newErrors;
  };

  const nextStep = (): void => {
    const validationErrors = validateStep1();
    
    if (Object.keys(validationErrors).length === 0) {
      setStep(2);
    } else {
      setErrors(validationErrors);
    }
  };

  const prevStep = (): void => {
    setStep(1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const validationErrors = validateStep2();
    
    if (Object.keys(validationErrors).length === 0) {
      // Xử lý đăng ký
      console.log('Đăng ký với thông tin:', formData);
      // Gửi dữ liệu đến API
    } else {
      setErrors(validationErrors);
    }
  };
  
  const goToLogin = (): void => {
    navigate('/login');
  };

  return (
    <div className="modern-register-container">
      <div className="register-content">
        <div className="register-header">
          <h2>SENA Digibank</h2>
          <p>{step === 1 ? 'Đăng ký tài khoản - Thông tin cá nhân' : 'Đăng ký tài khoản - Tạo tài khoản'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="modern-register-form">
          {step === 1 ? (
            // Step 1: Thông tin cá nhân
            <>
              <div className="form-group">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="error-message">{errors.fullName}</div>}
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
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
                  placeholder="Số điện thoại"
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
              
              <button type="button" onClick={nextStep} className="register-button">
                Tiếp tục
              </button>
            </>
          ) : (
            // Step 2: Tạo tài khoản
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="password-input"
                  maxLength={30}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                ></span>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              
              <div className="form-group">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
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
              
              <div className="form-group">
                <textarea
                  id="address"
                  name="address"
                  placeholder="Địa chỉ liên lạc"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                ></textarea>
                {errors.address && <div className="error-message">{errors.address}</div>}
              </div>
              
              <div className="button-group">
                <button type="button" onClick={prevStep} className="back-button">
                  Quay lại
                </button>
                <button type="submit" className="register-button">
                  Đăng ký
                </button>
              </div>
            </>
          )}
          
          <div className="login-redirect">
            Đã có tài khoản? <a onClick={goToLogin} style={{cursor: 'pointer'}}>Đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;