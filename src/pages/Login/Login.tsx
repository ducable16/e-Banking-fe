import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { publicRequest } from '../../services/AxiosInstance';
import './Login.css';

// Định nghĩa interface cho dữ liệu đăng nhập
interface Credentials {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  errorCode: string | null;
}

interface LoginData {
  accessToken: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const goToRegister = (): void => {
    navigate('/register');
  };
  
  const goToForgotPassword = (): void => {
    navigate('/forgot-password');
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const res = await publicRequest.post<LoginData>('/auth/login', credentials);
      const data = res.data;
      if (data && data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        // Gọi API lấy profile để lấy role
        try {
          const profileRes = await fetch('http://localhost:8080/user/profile', {
            headers: { 'Authorization': `Bearer ${data.accessToken}` }
          });
          const profileData = await profileRes.json();
          if (profileData && profileData.data && profileData.data.role) {
            localStorage.setItem('role', profileData.data.role.toUpperCase());
          }
        } catch (profileErr) {
          // Nếu lỗi vẫn cho login nhưng không set role
        }
        navigate('/home');
      } else {
        setError('Đăng nhập thành công nhưng không nhận được accessToken!');
      }
    } catch (err: any) {
      if (
        err?.errorCode === 'USER_NOT_FOUND' ||
        err?.errorCode === 'INVALID_CREDENTIALS' ||
        (err?.message && /user not found|not found|mật khẩu|password|sai/i.test(err.message))
      ) {
        setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      } else {
        setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      <div className="login-content">
        <div className="login-header">
          <h2>HUST Digibank</h2>
          <p>Xin kính chào Quý khách</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="modern-login-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={credentials.password}
              maxLength={30}
              onChange={handleChange}
              className="password-input"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            ></span>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
          
          <div className="links-container">
            <a
              className="forgot-link"
              onClick={goToForgotPassword}
              style={{ cursor: 'pointer' }}
            >
              Quên mật khẩu?
            </a>
            
            <div className="register-redirect">
              Chưa có tài khoản? <a onClick={goToRegister} style={{cursor: 'pointer'}}>Đăng ký ngay</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;