import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';

function StrengthTraining({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  // Only scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle dark mode class on body element
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const strengthOptions = [
    {
      name: "Free Weights Area",
      description: "Comprehensive range of dumbbells, barbells, and weight plates for unlimited exercise variety.",
      icon: "fas fa-dumbbell"
    },
    {
      name: "Weight Machines",
      description: "State-of-the-art resistance machines targeting specific muscle groups with adjustable settings.",
      icon: "fas fa-cogs"
    },
    {
      name: "Power Racks",
      description: "Multiple power racks and squat stations for safe and effective compound lifting.",
      icon: "fas fa-archway"
    },
    {
      name: "Functional Training",
      description: "Dedicated space with kettlebells, medicine balls, battle ropes and more for dynamic workouts.",
      icon: "fas fa-dice-d20"
    },
    {
      name: "Olympic Lifting Platform",
      description: "Specialized platforms with bumper plates for Olympic lifts and deadlifting.",
      icon: "fas fa-medal"
    },
    {
      name: "Strength Accessories",
      description: "Wide range of accessories including resistance bands, weighted vests, and grip strengtheners.",
      icon: "fas fa-tools"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Strength Training</h1>
          <p>Build muscle, increase power, and enhance functional strength</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Transform Your Body, Amplify Your Strength</h2>
            <p>
              Our comprehensive strength training facilities are designed to help members of all fitness levels 
              build muscle, increase power, and improve overall physical performance. With a vast selection of 
              free weights, machines, and functional training equipment, you'll have everything you need to achieve 
              your strength goals in one place.
            </p>
            
            <div className="service-benefits">
              <h3>Benefits of Strength Training</h3>
              <ul>
                <li>Increases muscle mass and metabolic rate</li>
                <li>Improves bone density and joint stability</li>
                <li>Enhances functional strength for daily activities</li>
                <li>Reduces risk of injury through improved body mechanics</li>
                <li>Boosts confidence and body composition</li>
                <li>Complements cardiovascular exercise for complete fitness</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Our Strength Equipment</h2>
            <div className="options-grid">
              {strengthOptions.map((option, index) => (
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
            <h3>Strength Training Access</h3>
            <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <h4>Strength Training Experience</h4>
              <p className="price">Starting from $150/day pass</p>
              <ul>
                <li>Access to all strength training equipment</li>
                <li>Free weight and machine zones</li>
                <li>Olympic lifting platforms</li>
                <li>Functional training area</li>
                <li>Specialized strength accessories</li>
                <li>Workout guidance from floor staff</li>
              </ul>
              <p className="package-note">* Full access to strength training facilities included with all membership plans. Premium ($1300/mo) and Elite ($2000/mo) members receive complimentary form check sessions and personalized equipment recommendations. Day passes available for non-members.</p>
              <button className="book-now-btn">View Hours</button>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Build Serious Strength?</h2>
            <p>Join our gym today and get access to our comprehensive strength training facilities.</p>
            <button className="consultation-btn" onClick={() => navigate('/signup')}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrengthTraining; 