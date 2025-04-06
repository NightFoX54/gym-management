import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';

function CardioZone({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  // Only scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle dark mode class on body element
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const cardioOptions = [
    {
      name: "Treadmills",
      description: "Premium treadmills with incline options, interactive displays, and workout tracking.",
      icon: "fas fa-running"
    },
    {
      name: "Ellipticals",
      description: "Low-impact elliptical machines for full-body cardio with customizable resistance levels.",
      icon: "fas fa-water"
    },
    {
      name: "Stationary Bikes",
      description: "Upright and recumbent bikes with digital displays and interactive workout programs.",
      icon: "fas fa-bicycle"
    },
    {
      name: "Stair Climbers",
      description: "Step machines that simulate climbing stairs for intense lower-body conditioning.",
      icon: "fas fa-sort-amount-up"
    },
    {
      name: "Rowing Machines",
      description: "Full-body workout machines that engage multiple muscle groups while improving cardiovascular fitness.",
      icon: "fas fa-ship"
    },
    {
      name: "Cardio Cinema",
      description: "Dedicated cardio room with large-screen entertainment for an engaging workout experience.",
      icon: "fas fa-film"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Cardio Zone</h1>
          <p>State-of-the-art cardiovascular training equipment</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Elevate Your Heart Rate, Enhance Your Health</h2>
            <p>
              Our expansive cardio zone features the latest cardiovascular equipment to help you burn calories, 
              improve endurance, and strengthen your heart. Whether you're a beginner looking to build stamina 
              or an experienced athlete training for competition, our diverse range of cardio machines provides 
              options for every fitness level and goal.
            </p>
            
            <div className="service-benefits">
              <h3>Benefits of Cardio Training</h3>
              <ul>
                <li>Improves heart health and circulatory system</li>
                <li>Burns calories and aids in weight management</li>
                <li>Reduces stress and elevates mood</li>
                <li>Increases lung capacity and oxygen utilization</li>
                <li>Boosts energy levels and improves sleep quality</li>
                <li>Enhances overall athletic performance</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Our Cardio Equipment</h2>
            <div className="options-grid">
              {cardioOptions.map((option, index) => (
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
            <h3>Cardio Zone Access</h3>
            <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <h4>Cardio Training Experience</h4>
              <p className="price">Starting from ₺150/day pass</p>
              <ul>
                <li>Full access to all cardio equipment</li>
                <li>High-tech performance tracking</li>
                <li>Multiple workout options for all fitness levels</li>
                <li>Entertainment systems on premium machines</li>
                <li>Spacious, well-ventilated workout area</li>
                <li>Instructor assistance upon request</li>
              </ul>
              <p className="package-note">* Unlimited access to the Cardio Zone included with all membership plans. Premium (₺1300/mo) and Elite (₺2000/mo) members get priority booking for popular machines during peak hours. Day passes and weekly passes available for non-members.</p>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Boost Your Cardiovascular Fitness?</h2>
            <p>Join our gym today and get access to our comprehensive cardio facilities.</p>
            <button className="consultation-btn" onClick={() => navigate('/signup')}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardioZone; 