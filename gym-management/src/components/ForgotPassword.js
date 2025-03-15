import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import '../styles/ForgotPassword.css';

function ForgotPassword({ isDarkMode = false, setIsDarkMode = () => {} }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // API call will be implemented here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      
      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email.'
      });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`forgot-password-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="forgot-password-card">
        <div className="card-header">
          <button 
            className="back-button"
            onClick={() => navigate('/login')}
          >
            <FaArrowLeft />
          </button>
          <h2>Forgot Password</h2>
        </div>

        <p className="instruction-text">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="login-link">
          Remember your password?{' '}
          <span onClick={() => navigate('/login')}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 