import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Login.css';
import axios from 'axios';

function Login({ isDarkMode = false, setIsDarkMode = () => {} }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.token) {
        const userData = {
          id: response.data.id,
          token: response.data.token,
          role: response.data.role,
          name: response.data.name,
          email: response.data.email,
          rememberMe: rememberMe,
          loginTime: new Date().getTime()
        };

        localStorage.setItem('user', JSON.stringify(userData));

        console.log('Login successful:', response.data);
        navigate(response.data.redirectUrl || '/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="login-box">
        <div className="card-header">
          <button 
            className="back-button"
            onClick={handleBackClick}
          >
            <FaArrowLeft />
          </button>
          <h2>Welcome Back</h2>
        </div>
        
        <p className="login-subtitle">Please enter your details</p>
        
        {error && <div className="login-error-message">{error}</div>}
        
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
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                className="toggle-password-visibility" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <p className="signup-prompt">
            Don't have an account? <a href="/signup">Join Now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login; 