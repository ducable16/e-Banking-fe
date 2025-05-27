import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../../services/AxiosInstance';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp + password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
    setSuccess('');
  };
  const handleChangeOtp = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setError('');
    setSuccess('');
  };
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Vui lòng nhập email đăng ký.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ.');
      return;
    }
    try {
      setLoading(true);
      await publicRequest.post('/auth/forgot-password', { email });
      setSuccess('Mã OTP đã được gửi tới email của bạn.');
      setStep(2);
    } catch (err: any) {
      if (err?.errorCode === 'USER_NOT_FOUND' || (err?.message && /không tồn tại|not found/i.test(err.message))) {
        setError('Tài khoản không tồn tại');
      } else {
        setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP.');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    try {
      setLoading(true);
      await publicRequest.post('/auth/reset-password', { email, otp, password });
      setSuccess('Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (err?.errorCode === 'OTP_INVALID' || (err?.message && /otp|mã/i.test(err.message))) {
        setError('Mã OTP không đúng hoặc đã hết hạn.');
      } else {
        setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="modern-forget-container">
      <div className="forget-content">
        <div className="forget-header">
          <h2>HUST Digibank</h2>
          <p>Quên mật khẩu</p>
        </div>
        {step === 1 ? (
          <form onSubmit={handleSubmitEmail} className="modern-forget-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email đăng ký"
                value={email}
                onChange={handleChangeEmail}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message" style={{ color: '#8cde4a', textAlign: 'center', marginBottom: 12 }}>{success}</div>}
            <button type="submit" className="forget-button" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
            <div className="login-redirect">
              Đã nhớ mật khẩu? <a onClick={goToLogin} style={{cursor: 'pointer'}}>Đăng nhập</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitReset} className="modern-forget-form">
            <div className="form-group">
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={handleChangeOtp}
                required
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={handleChangePassword}
                required
                minLength={6}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              ></span>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message" style={{ color: '#8cde4a', textAlign: 'center', marginBottom: 12 }}>{success}</div>}
            <button type="submit" className="forget-button" disabled={loading}>
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
            <div className="login-redirect">
              Đã nhớ mật khẩu? <a onClick={goToLogin} style={{cursor: 'pointer'}}>Đăng nhập</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;