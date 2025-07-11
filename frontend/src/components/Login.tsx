import React, { useState } from 'react';
import { login, forgotPassword } from '../services/api';
import './Login.css';

interface LoginProps {
  onLogin: (user: { email: string; token: string; role: string; profileImagePath?: string; firstName: string; lastName: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      onLogin({ 
        email: response.email, 
        token: response.token, 
        role: response.role,
        profileImagePath: response.profileImagePath,
        firstName: '',
        lastName: ''
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      if (errorMessage.includes('Validation error:')) {
        setError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    setForgotPasswordMessage('');

    try {
      const response = await forgotPassword(forgotPasswordEmail);
      setForgotPasswordMessage(`${response.message}\n\n${response.note}`);
    } catch (err) {
      setForgotPasswordMessage(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginHolder">
        <div className="loginTitle">Hello</div>
        <div className="loginH2">Sign in to your account</div>
        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="fieldHolder">
            <div className="inputIcon">
              <img src="/images/icons/profile.svg" alt="Email" width={24} height={24} />
            </div>
            <input
              type="text"
              className="formInput"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="fieldHolder">
            <div className="inputIcon">
              <img src="/images/icons/password.svg" alt="Password" width={24} height={24} />
            </div>
            <input
              type="password"
              className="formInput"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="loginButton" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="loginForgot">
          <span onClick={() => setShowForgotPassword(true)}>Forgot password?</span>
        </div>
        {error && <div className={error.includes('Validation error:') ? 'validationError' : 'errorMessage'}>{error}</div>}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Forgot Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div className="fieldHolder">
                <div className="inputIcon">
                  <img src="/images/icons/profile.svg" alt="Email" width={24} height={24} />
                </div>
                <input
                  type="email"
                  className="formInput"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  disabled={isForgotPasswordLoading}
                />
              </div>
              <button type="submit" className="loginButton" disabled={isForgotPasswordLoading}>
                {isForgotPasswordLoading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
            {forgotPasswordMessage && (
              <div className="forgotPasswordMessage">
                {forgotPasswordMessage.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            <button 
              className="closeButton" 
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail('');
                setForgotPasswordMessage('');
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;  