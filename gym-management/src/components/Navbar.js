import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="navbar">
      <div className="logo">GymFlex</div>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="#about">About</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
        <button 
          className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
          onClick={toggleDarkMode}
        >
          <i className="fas fa-sun toggle-icon" style={{ marginLeft: '2px' }}></i>
          <div className="toggle-circle"></div>
          <i className="fas fa-moon toggle-icon" style={{ marginRight: '2px' }}></i>
        </button>
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </nav>
  );
}

export default Navbar; 