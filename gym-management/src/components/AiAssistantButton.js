import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/AiAssistantButton.css';
import AiAssistant from './AiAssistant';
import armImage from '../assets/images/arm.png';
import dumbbellImage from '../assets/images/dumbbell.png';

const AiAssistantButton = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(
    localStorage.getItem('aiAssistantInteracted') === 'true'
  );
  const buttonRef = useRef(null);

  // Add pulse effect to attract attention if user hasn't interacted yet
  useEffect(() => {
    if (!hasInteracted) {
      // Initial pulse after 3 seconds
      const initialTimer = setTimeout(() => {
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 3000);
      }, 3000);
      
      // Then pulse every 45 seconds
      const interval = setInterval(() => {
        if (!isOpen && !isAnimating) {
          setPulseEffect(true);
          setTimeout(() => setPulseEffect(false), 3000);
        }
      }, 45000);
      
      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    }
  }, [isOpen, isAnimating, hasInteracted]);
  
  // Handle clicks outside the assistant to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && 
          !event.target.closest('.ai-assistant-container') && 
          !event.target.closest('.ai-assistant-toggle')) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleAssistant = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem('aiAssistantInteracted', 'true');
    }
    
    if (isOpen) {
      setIsOpen(false);
    } else {
      // Start animation
      setIsAnimating(true);
      
      // Add animation effect to button
      if (buttonRef.current) {
        buttonRef.current.classList.add('clicked');
        setTimeout(() => {
          if (buttonRef.current) {
            buttonRef.current.classList.remove('clicked');
          }
        }, 500);
      }
      
      // Open assistant after animation completes
      setTimeout(() => {
        setIsOpen(true);
        setIsAnimating(false);
      }, 1500); // Match this with the animation duration
    }
  };

  // Button text variants for smooth text animation
  const buttonTextVariants = {
    initial: { 
      opacity: 0, 
      width: 0 
    },
    visible: { 
      opacity: 1, 
      width: "auto",
      transition: { 
        opacity: { duration: 0.3 }, 
        width: { duration: 0.4 } 
      }
    },
    exit: {
      opacity: 0,
      width: 0,
      transition: { 
        opacity: { duration: 0.2 }, 
        width: { duration: 0.3 } 
      }
    }
  };

  return (
    <>
      <div className={`ai-assistant-button-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <motion.button 
          ref={buttonRef}
          className={`ai-assistant-toggle ${isAnimating ? 'animating' : ''} ${isOpen ? 'active' : ''} ${pulseEffect ? 'pulse' : ''}`} 
          onClick={toggleAssistant}
          aria-label="Open AI Fitness Assistant"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: `linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)`,
            boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)'
          }}
        >
          {isAnimating ? (
            <div className="arm-animation-container">
              <motion.div 
                className="arm-image-container"
                initial={{ rotate: 20 }}
                animate={{ 
                  rotate: [-10, 20, -10, 20, -10],
                  y: [0, -2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "easeInOut" 
                }}
              >
                <img src={armImage} alt="Arm" className="arm-image" />
                <motion.div 
                  className="dumbbell-image-container"
                  initial={{ rotate: 0 }}
                  animate={{ 
                    rotate: [-20, -40, -20, -40, -20],
                    scale: [1, 1.05, 1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    times: [0, 0.25, 0.5, 0.75, 1],
                    ease: "easeInOut" 
                  }}
                >
                  <img src={dumbbellImage} alt="Dumbbell" className="dumbbell-image" />
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <div className="button-icon">
              <motion.i 
                className="fas fa-robot"
                animate={isHovered ? { rotate: [0, -15, 15, -5, 0], scale: [1, 1.1, 1.1, 1.05, 1] } : {}}
                transition={{ duration: 0.6 }}
              />
              <AnimatePresence initial={false}>
                {(isHovered || isOpen) && (
                  <motion.span
                    key="button-text"
                    initial="initial"
                    animate="visible"
                    exit="exit"
                    variants={buttonTextVariants}
                  >
                    AI Fitness Assistant
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.button>
      </div>
      
      <AiAssistant 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default AiAssistantButton;