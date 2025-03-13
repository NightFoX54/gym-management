import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';

function RecoveryWellness({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  // Only scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle dark mode class on body element
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const recoveryOptions = [
    {
      name: "Sauna",
      description: "Traditional dry sauna to help relax muscles, improve circulation and promote recovery.",
      icon: "fas fa-hot-tub"
    },
    {
      name: "Steam Room",
      description: "Humid heat therapy to cleanse pores, improve respiratory function, and relieve muscle tension.",
      icon: "fas fa-cloud"
    },
    {
      name: "Massage Therapy",
      description: "Professional massage services targeting specific muscle groups to speed up recovery.",
      icon: "fas fa-hands"
    },
    {
      name: "Stretching Area",
      description: "Dedicated space with equipment for proper pre and post-workout stretching routines.",
      icon: "fas fa-child"
    },
    {
      name: "Cold Plunge Pool",
      description: "Ice bath therapy to reduce inflammation and accelerate recovery after intense workouts.",
      icon: "fas fa-snowflake"
    },
    {
      name: "Relaxation Lounge",
      description: "Quiet space designed for mindfulness, meditation, and mental recovery between workouts.",
      icon: "fas fa-couch"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Recovery & Wellness</h1>
          <p>Comprehensive recovery solutions for peak performance</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Optimize Your Recovery, Maximize Your Results</h2>
            <p>
              Recovery is a crucial but often overlooked component of fitness success. Our state-of-the-art 
              recovery and wellness amenities are designed to help you recover faster, prevent injury, and 
              maintain optimal performance. We offer a range of therapeutic services and facilities to help 
              you feel your best and get the most out of every workout.
            </p>
            
            <div className="service-benefits">
              <h3>Benefits of Recovery & Wellness</h3>
              <ul>
                <li>Reduced muscle soreness and improved recovery time</li>
                <li>Increased blood flow and muscle repair</li>
                <li>Stress reduction and improved sleep quality</li>
                <li>Enhanced mobility and flexibility</li>
                <li>Decreased risk of injuries</li>
                <li>Improved mental well-being and relaxation</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Our Recovery Facilities</h2>
            <div className="options-grid">
              {recoveryOptions.map((option, index) => (
                <div className="option-card" key={index}>
                  <div className="option-icon">
                    <i className={option.icon}></i>
                  </div>
                  <h3>{option.name}</h3>
                  <p>{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pricing-section">
            <h3>Recovery & Wellness Access</h3>
            <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <h4>Recovery & Wellness Experience</h4>
              <p className="price">Starting from ₺100/session</p>
              <ul>
                <li>Access to all recovery facilities</li>
                <li>Professional therapeutic treatments</li>
                <li>State-of-the-art recovery equipment</li>
                <li>Sauna and steam room access</li>
                <li>Cold plunge pool therapy</li>
                <li>Dedicated stretching and relaxation areas</li>
              </ul>
              <p className="package-note">* Basic recovery facilities included with all memberships. Premium members (₺1300/mo) receive 4 specialized recovery sessions monthly. Unlimited access to all recovery amenities included with Elite (₺2000/mo) membership. Day passes and treatment packages available.</p>
            </div>
          </div>

          <div className="booking-section">
            <h2>Experience Our Recovery & Wellness Facilities</h2>
            <p>Elevate your training with proper recovery techniques.</p>
            <button className="consultation-btn" onClick={() => navigate('/signup')}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoveryWellness; 