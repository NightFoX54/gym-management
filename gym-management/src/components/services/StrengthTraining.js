import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';

function StrengthTraining({ isDarkMode, setIsDarkMode }) {
  const [isDarkModeState, setIsDarkModeState] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkModeState(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkModeState);
    document.body.classList.toggle('dark-mode', isDarkModeState);
  }, [isDarkModeState]);

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Strength Training</h1>
          <p>Build strength, muscle, and confidence</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>State-of-the-Art Strength Training Facility</h2>
            <p>Access premium equipment and expert guidance to achieve your strength goals. Whether you're a beginner or an experienced lifter, our facility has everything you need.</p>
            
            <div className="equipment-section">
              <h3>Our Equipment</h3>
              <div className="equipment-grid">
                <div className="equipment-card">
                  <h4>Free Weights Area</h4>
                  <ul>
                    <li>Dumbbells (2-150 lbs)</li>
                    <li>Olympic barbells</li>
                    <li>Specialized bars</li>
                    <li>Weight plates</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Power Racks</h4>
                  <ul>
                    <li>6 Power racks</li>
                    <li>Safety spotters</li>
                    <li>Pull-up bars</li>
                    <li>Band attachments</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Machine Circuit</h4>
                  <ul>
                    <li>Hammer Strength machines</li>
                    <li>Cable machines</li>
                    <li>Smith machines</li>
                    <li>Isolation machines</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Functional Area</h4>
                  <ul>
                    <li>Kettlebells</li>
                    <li>Medicine balls</li>
                    <li>Resistance bands</li>
                    <li>TRX systems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="service-benefits">
              <h3>Benefits of Strength Training</h3>
              <ul>
                <li>Increased muscle mass and strength</li>
                <li>Improved bone density</li>
                <li>Enhanced metabolic rate</li>
                <li>Better functional fitness</li>
                <li>Reduced risk of injury</li>
                <li>Improved posture and balance</li>
              </ul>
            </div>

            <div className="training-programs">
              <h3>Training Programs</h3>
              <div className="program-grid">
                <div className="program-card">
                  <h4>Beginner Program</h4>
                  <p>Learn proper form and basic lifting techniques</p>
                  <ul>
                    <li>Form assessment</li>
                    <li>Basic movement patterns</li>
                    <li>Progressive overload introduction</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Intermediate Program</h4>
                  <p>Advanced techniques and specialized routines</p>
                  <ul>
                    <li>Compound movements</li>
                    <li>Periodization training</li>
                    <li>Nutrition guidance</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Advanced Program</h4>
                  <p>Specialized training for specific goals</p>
                  <ul>
                    <li>Power lifting</li>
                    <li>Olympic lifting</li>
                    <li>Competition prep</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Start Your Strength Journey Today</h2>
            <p>Join GymFlex and get a complimentary strength assessment with our certified trainers. 
            Transform your body, build confidence, and achieve your strength goals with our expert guidance.</p>
            <button className="consultation-btn" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrengthTraining; 