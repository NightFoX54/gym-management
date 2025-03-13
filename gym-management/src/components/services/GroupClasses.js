import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';

function GroupClasses({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  // Only scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle dark mode class on body element
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const classOptions = [
    {
      name: "High-Intensity Interval",
      description: "Fast-paced workouts alternating between intense bursts of exercise and short recovery periods.",
      icon: "fas fa-bolt"
    },
    {
      name: "Yoga & Pilates",
      description: "Mind-body classes focusing on flexibility, core strength, balance, and mental wellbeing.",
      icon: "fas fa-pray"
    },
    {
      name: "Cycling",
      description: "Indoor cycling workouts with motivating music and instructor guidance for all fitness levels.",
      icon: "fas fa-biking"
    },
    {
      name: "Strength & Conditioning",
      description: "Build muscle and improve overall fitness with weights, bodyweight exercises, and functional movements.",
      icon: "fas fa-dumbbell"
    },
    {
      name: "Dance Fitness",
      description: "Fun, energetic classes combining dance moves with fitness exercises for a full-body workout.",
      icon: "fas fa-music"
    },
    {
      name: "Martial Arts & Boxing",
      description: "Learn self-defense techniques while improving strength, coordination, and cardiovascular health.",
      icon: "fas fa-fist-raised"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Group Classes</h1>
          <p>Energizing workouts in a motivating community environment</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Experience the Power of Group Motivation</h2>
            <p>
              Our diverse range of group fitness classes offer something for everyone, regardless of your fitness level 
              or interests. Led by passionate, certified instructors, our classes combine effective workouts with a fun, 
              social atmosphere that keeps you motivated and coming back for more. With multiple class options throughout 
              the day, you can easily find times that fit your schedule.
            </p>
            
            <div className="service-benefits">
              <h3>Benefits of Group Fitness</h3>
              <ul>
                <li>Motivation and accountability from instructors and peers</li>
                <li>Properly structured workouts for maximum effectiveness</li>
                <li>Variety of classes to prevent boredom and plateau</li>
                <li>Social connections and community support</li>
                <li>Expert instruction on proper form and technique</li>
                <li>Scheduled sessions to help establish a consistent routine</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Our Class Offerings</h2>
            <div className="options-grid">
              {classOptions.map((option, index) => (
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
            <h3>Group Class Access</h3>
            <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <h4>Group Fitness Experience</h4>
              <p className="price">Starting from ₺50/class</p>
              <ul>
                <li>Over 40 weekly classes across multiple disciplines</li>
                <li>Expert certified instructors</li>
                <li>State-of-the-art studios with premium equipment</li>
                <li>Classes for all fitness levels from beginner to advanced</li>
                <li>Convenient scheduling from early morning to evening</li>
                <li>Ability to book classes up to 7 days in advance</li>
              </ul>
              <p className="package-note">* Unlimited group classes are included with Premium (₺1300/mo) and Elite (₺2000/mo) membership plans. Basic members (₺800/mo) receive 4 classes per month. Drop-in and class pack options available for non-members.</p>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Experience the Energy of Group Fitness?</h2>
            <p>Join our gym start your fitness journey</p>
            <button className="consultation-btn" onClick={() => navigate('/signup')}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupClasses; 