import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { publicRequest } from '../../services/AxiosInstance';

interface RegisterData {
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
  });
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(1); // Bước 1: Nhập email, Bước 2: Xác thực OTP và điền thông tin
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

  const validateEmail = (): boolean => {
    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    return true;
  };

  const validateForm = (): boolean => {
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
    
    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.');
      return false;
    }
    
    // Kiểm tra các trường bắt buộc
    if (!formData.password || !formData.email || !formData.fullName || !formData.phoneNumber || !formData.address) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    
    return true;
  };

  const handleSubmitEmail = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) return;

    try {
      setLoading(true);
      await publicRequest.post('/auth/signup', { email: formData.email });

      alert('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
      setStep(2);
    } catch (err: any) {
      if (err.errorCode == 'EMAIL_EXISTS') {
        setError('Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.');
      } else if (err.status === 429) {
        setError('Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau.');
      } else {
        setError(err.message || 'Không thể gửi mã OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;
    if (!otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...registrationData } = formData;
      await publicRequest.post('/auth/signup-otp', {
        ...registrationData,
        otp,
      });

      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (): Promise<void> => {
    try {
      setLoading(true);

      await publicRequest.post('/auth/signup', {
        email: formData.email,
      });

      alert('Mã OTP mới đã được gửi tới email của bạn');
    } catch (err: any) {
      setError(err.message || 'Không thể gửi lại OTP');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="modern-register-container">
      <div className="register-content">
        <div className="register-header">
          <h2>SENA Digibank</h2>
          <p>{step === 1 ? 'Bắt đầu đăng ký' : 'Hoàn tất đăng ký'}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleSubmitEmail} className="modern-register-form">
            <div className="email-instruction">
              Vui lòng nhập địa chỉ email của bạn để nhận mã xác thực OTP.
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
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
                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
              </button>
            </div>
            
            <div className="login-redirect">
              Đã có tài khoản? <a onClick={goToLogin} style={{cursor: 'pointer'}}>Đăng nhập ngay</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitForm} className="modern-register-form">
            <div className="otp-instruction">
              Chúng tôi đã gửi một mã xác thực đến email <strong>{formData.email}</strong>. 
              Vui lòng nhập mã OTP và điền thông tin đăng ký của bạn.
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
            
            <div className="resend-otp">
              Không nhận được mã? <a onClick={resendOtp} style={{cursor: 'pointer'}}>Gửi lại mã xác thực</a>
            </div>
            
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
            
            {/* Thêm trường số điện thoại */}
            <div className="form-group">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            
            {/* Thêm trường địa chỉ */}
            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
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
                onClick={() => setStep(1)}
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;