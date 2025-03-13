import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';

function PersonalTraining({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  // Only scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle dark mode class on body element
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const trainingOptions = [
    {
      name: "One-on-One Training",
      description: "Personalized workouts with dedicated attention from an expert trainer focused on your specific goals.",
      icon: "fas fa-user-friends"
    },
    {
      name: "Fitness Assessment",
      description: "Comprehensive evaluation of your current fitness level, body composition, and performance metrics.",
      icon: "fas fa-clipboard-check"
    },
    {
      name: "Goal-Specific Programs",
      description: "Customized training plans for weight loss, muscle gain, athletic performance, or specific events.",
      icon: "fas fa-bullseye"
    },
    {
      name: "Injury Rehabilitation",
      description: "Specialized training to help recover from injuries and prevent future problems.",
      icon: "fas fa-heartbeat"
    },
    {
      name: "Nutrition Guidance",
      description: "Expert advice on dietary habits to complement your training and maximize results.",
      icon: "fas fa-apple-alt"
    },
    {
      name: "Progress Tracking",
      description: "Regular assessments and adjustments to ensure continuous improvement and goal achievement.",
      icon: "fas fa-chart-line"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Personal Training</h1>
          <p>Expert guidance for accelerated fitness results</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Achieve More with Expert Guidance</h2>
            <p>
              Our certified personal trainers are dedicated to helping you reach your fitness goals faster and more 
              effectively than training alone. Whether you're new to exercise, looking to break through a plateau, 
              or preparing for a specific event, our trainers will create a customized program tailored to your 
              unique needs, preferences, and abilities.
            </p>
            
            <div className="service-benefits">
              <h3>Benefits of Personal Training</h3>
              <ul>
                <li>Custom workout programs designed specifically for your goals</li>
                <li>Proper technique instruction to maximize results and prevent injury</li>
                <li>Accountability and motivation to maintain consistency</li>
                <li>Progressive programming that evolves as you improve</li>
                <li>Efficient workouts that make the most of your available time</li>
                <li>Expert guidance on nutrition and recovery strategies</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Our Training Services</h2>
            <div className="options-grid">
              {trainingOptions.map((option, index) => (
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
            <h3>Personal Training Options</h3>
            <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <h4>Personal Training Experience</h4>
              <p className="price">Starting from ₺300/session</p>
              <ul>
                <li>One-on-one sessions with certified trainers</li>
                <li>Customized workout programming</li>
                <li>Regular fitness assessments</li>
                <li>Nutritional guidance and support</li>
                <li>Flexible scheduling options</li>
                <li>Access to exclusive training areas</li>
              </ul>
              <p className="package-note">* Discounted personal training packages available for all members. Premium members (₺1300/mo) receive personal trainer consultation. Elite members (₺2000/mo) receive 2 complimentary sessions per month. Training packages of 5, 10, or 20 sessions available with progressive discounts.</p>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Take Your Fitness to the Next Level?</h2>
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

export default PersonalTraining; 