import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  // Thêm các trường khác nếu cần
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
  });
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(1); // Bước 1: Form đăng ký, Bước 2: Xác thực OTP
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setOtp(e.target.value);
  };

  const goToLogin = (): void => {
    navigate('/');
  };

  const validateForm = (): boolean => {
    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    // Kiểm tra các trường bắt buộc
    if (!formData.username || !formData.password || !formData.email || !formData.fullName) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    
    return true;
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Gọi API đăng ký và gửi OTP
      const response = await fetch('http://your-api-url/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký không thành công');
      }
      
      // Đăng ký thành công, chuyển sang bước xác thực OTP
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (!otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }
    
    try {
      setLoading(true);
      
      // Gọi API xác thực OTP
      const response = await fetch('http://your-api-url/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Mã OTP không hợp lệ');
      }
      
      // Xác thực thành công, chuyển hướng đến trang đăng nhập
      navigate('/', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực OTP không thành công');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Gọi API gửi lại OTP
      const response = await fetch('http://your-api-url/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi lại OTP');
      }
      
      alert('Mã OTP mới đã được gửi tới email của bạn');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-register-container">
      <div className="register-content">
        <div className="register-header">
          <h2>SENA Digibank</h2>
          <p>{step === 1 ? 'Đăng ký tài khoản mới' : 'Xác thực tài khoản'}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleSubmitForm} className="modern-register-form">
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="button-group">
              <button 
                type="button" 
                className="back-button" 
                onClick={goToLogin}
              >
                Quay lại
              </button>
              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </div>
            
            <div className="login-redirect">
              Đã có tài khoản? <a onClick={goToLogin} style={{cursor: 'pointer'}}>Đăng nhập ngay</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitOtp} className="modern-register-form">
            <div className="otp-instruction">
              Chúng tôi đã gửi một mã xác thực đến email <strong>{formData.email}</strong>. Vui lòng kiểm tra hộp thư đến và nhập mã xác thực dưới đây.
            </div>
            
            <div className="form-group otp-input-group">
              <input
                type="text"
                name="otp"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                required
                className="otp-input"
              />
            </div>
            
            <div className="button-group">
              <button 
                type="button" 
                className="back-button" 
                onClick={() => setStep(1)}
              >
                Quay lại
              </button>
              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
            
            <div className="resend-otp">
              Không nhận được mã? <a onClick={resendOtp} style={{cursor: 'pointer'}}>Gửi lại mã xác thực</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;