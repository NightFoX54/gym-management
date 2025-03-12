import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log('Login attempt:', formData);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
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
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
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