import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
      setIsScrolled(currentScrollPos > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className={`navbar ${!visible ? 'hidden' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">GymFlex</div>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/#about" onClick={handleAboutClick}>About</a>
        <a href="/services">Services</a>
        <a href="/market">Market</a>
        <a href="/contact">Contact</a>
        <button 
          className={`dark-mode-toggle-main ${isDarkMode ? 'active' : ''}`} 
          onClick={toggleDarkMode}
        >
          <i className="fas fa-sun toggle-icon-main" style={{ marginLeft: '2px' }}></i>
          <div className="toggle-circle-main"></div>
          <i className="fas fa-moon toggle-icon-main" style={{ marginRight: '2px' }}></i>
        </button>
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </nav>
  );
}

export default Navbar;