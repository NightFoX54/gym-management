import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Navbar.css';

function Navbar({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Set isScrolled to true if we're not on the homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true);
    } else {
      setIsScrolled(window.pageYOffset > 20);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
      
      // Only update isScrolled based on scroll position when on homepage
      if (location.pathname === '/') {
        setIsScrolled(currentScrollPos > 20);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, location.pathname]);

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
    <nav className={`navbar ${!visible ? 'hidden' : ''} ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
      <motion.div 
        className="logo"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ cursor: 'pointer' }}
      >
        <span className="logo-part">Gym</span>
        <motion.span 
          className="logo-fade"
          initial={{ opacity: 0.5, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Flex
        </motion.span>
      </motion.div>
      <div className="nav-links">
        <motion.a 
          href="/"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Home</span>
        </motion.a>
        <motion.a 
          href="/#about" 
          onClick={handleAboutClick}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>About</span>
        </motion.a>
        <motion.a 
          href="/services"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Services</span>
        </motion.a>
        <motion.a 
          href="/contact"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Contact</span>
        </motion.a>
        <motion.button 
          className={`dark-mode-toggle-main ${isDarkMode ? 'active' : ''}`} 
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.i 
            className="fas fa-sun toggle-icon-main" 
            animate={{ 
              opacity: isDarkMode ? 0.5 : 1,
              scale: isDarkMode ? 0.8 : 1 
            }}
          />
          <div className="toggle-circle-main" />
          <motion.i 
            className="fas fa-moon toggle-icon-main"
            animate={{ 
              opacity: isDarkMode ? 1 : 0.5,
              scale: isDarkMode ? 1 : 0.8 
            }}
          />
        </motion.button>
        <motion.button 
          className="login-btn"
          onClick={() => navigate('/login')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Login</span>
        </motion.button>
      </div>
    </nav>
  );
}

export default Navbar;