import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

function Login({ isDarkMode, setIsDarkMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log('Login attempt:', formData);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="login-box">
        <div className="back-arrow" onClick={handleBackClick}>
          ← Back
        </div>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Please enter your details</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <span 
              className="forgot-password" 
              onClick={handleForgotPassword}
              style={{ cursor: 'pointer' }}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-button">Sign In</button>
          
          <p className="signup-prompt">
            Don't have an account? <a href="/signup">Join Now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login; 