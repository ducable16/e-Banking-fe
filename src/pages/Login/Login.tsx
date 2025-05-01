import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Định nghĩa interface cho dữ liệu đăng nhập
interface Credentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');
    
    if (!credentials.username || !credentials.password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    
    // Xử lý đăng nhập ở đây
    // Gọi API đăng nhập thay vì in ra console
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
              type="text"
              id="username"
              name="username"
              placeholder="Tên đăng nhập"
              value={credentials.username}
              onChange={handleChange}
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
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            ></span>
          </div>
          
          <button type="submit" className="login-button">Đăng nhập</button>
          
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