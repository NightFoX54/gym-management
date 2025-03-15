import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/AiAssistantButton.css';
import AiAssistant from './AiAssistant';
import armImage from '../assets/images/arm.png';
import dumbbellImage from '../assets/images/dumbbell.png';

const AiAssistantButton = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleAssistant = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      // Start animation
      setIsAnimating(true);
      
      // Open assistant after animation completes
      setTimeout(() => {
        setIsOpen(true);
        setIsAnimating(false);
      }, 1500); // Match this with the animation duration
    }
  };

  return (
    <>
      <div className={`ai-assistant-button-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <button 
          className={`ai-assistant-toggle ${isAnimating ? 'animating' : ''} ${isOpen ? 'active' : ''}`} 
          onClick={toggleAssistant}
          aria-label="Open AI Fitness Assistant"
        >
          {isAnimating ? (
            <div className="arm-animation-container">
              <motion.div 
                className="arm-image-container"
                initial={{ rotate: 20 }}
                animate={{ rotate: -20 }}
                transition={{ 
                  duration: 1.5,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut" 
                }}
              >
                <img src={armImage} alt="Arm" className="arm-image" />
                <motion.div 
                  className="dumbbell-image-container"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -40 }}
                  transition={{ 
                    duration: 1.5,
                    times: [0, 0.3, 0.7, 1],
                    ease: "easeInOut" 
                  }}
                >
                  <img src={dumbbellImage} alt="Dumbbell" className="dumbbell-image" />
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <div className="button-icon">
              <i className="fas fa-robot"></i>
              <span>AI Fitness Assistant</span>
            </div>
          )}
        </button>
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