import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import '../styles/ResetPassword.css';

function ResetPassword({ isDarkMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (!urlToken) {
      setMessage({ type: 'error', text: 'Invalid reset link. Please request a new password reset.' });
      setIsTokenChecked(true);
      return;
    }
    
    setToken(urlToken);
    
    // Validate the token
    async function validateToken() {
      try {
        const response = await fetch(`http://localhost:8080/api/password/validate-token?token=${urlToken}`);
        const data = await response.json();
        
        setIsValidToken(data.valid);
        setIsTokenChecked(true);
        
        if (!data.valid) {
          setMessage({ 
            type: 'error', 
            text: 'This password reset link has expired or is invalid. Please request a new one.' 
          });
        }
      } catch (error) {
        setIsValidToken(false);
        setIsTokenChecked(true);
        setMessage({ 
          type: 'error', 
          text: 'An error occurred while validating your reset link. Please try again.' 
        });
      }
    }
    
    validateToken();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('http://localhost:8080/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Your password has been updated successfully!'
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'An error occurred. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenChecked) {
    return (
      <div className={`reset-password-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="reset-password-card">
          <div className="loading-spinner"></div>
          <p>Validating your reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`reset-password-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="reset-password-card">
        <div className="card-header">
          <button 
            className="back-button"
            onClick={() => navigate('/login')}
          >
            <FaArrowLeft />
          </button>
          <h2>Reset Password</h2>
        </div>
        
        {!isValidToken ? (
          <div className="invalid-token-message">
            {message.text}
            <button 
              className="request-new-link-button"
              onClick={() => navigate('/forgot-password')}
            >
              Request New Reset Link
            </button>
          </div>
        ) : (
          <>
            <p className="instruction-text">
              Please enter your new password below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword; 