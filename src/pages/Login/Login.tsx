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
        navigate('/home');
      } else {
        setError('Đăng nhập thành công nhưng không nhận được accessToken!');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      <div className="login-content">
        <div className="login-header">
          <h2>SENA Digibank</h2>
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