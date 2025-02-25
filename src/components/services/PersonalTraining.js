import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';

function PersonalTraining({ isDarkMode, setIsDarkMode }) {
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
    <div className={isDarkModeState ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkModeState} setIsDarkMode={setIsDarkModeState} />

      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Personal Training</h1>
          <p>Transform your fitness journey with expert guidance</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Why Choose Personal Training?</h2>
            <p>Our certified personal trainers are dedicated to helping you achieve your fitness goals through customized workout plans and one-on-one attention.</p>
            
            <div className="trainer-profiles">
              <h3>Meet Our Trainers</h3>
              <div className="trainer-grid">
                <div className="trainer-card">
                  <img src="trainer1.jpg" alt="Trainer" className="trainer-img" />
                  <h4>John Doe</h4>
                  <p>Specializes in strength training and weight loss</p>
                </div>
                <div className="trainer-card">
                  <img src="trainer2.jpg" alt="Trainer" className="trainer-img" />
                  <h4>Jane Smith</h4>
                  <p>Expert in functional fitness and rehabilitation</p>
                </div>
              </div>
            </div>

            <div className="service-benefits">
              <h3>Benefits</h3>
              <ul>
                <li>Personalized workout plans tailored to your goals</li>
                <li>Expert guidance on proper form and technique</li>
                <li>Regular progress tracking and adjustments</li>
                <li>Nutritional advice and meal planning</li>
                <li>Flexible scheduling to fit your lifestyle</li>
                <li>Motivation and accountability</li>
              </ul>
            </div>

            <div className="pricing-section">
              <h3>Training Packages</h3>
              <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <h4>Personalized Training Experience</h4>
                <p className="price">Starting from $49/session</p>
                <ul>
                  <li>One-on-one personal training sessions</li>
                  <li>Customized workout plans</li>
                  <li>Nutritional guidance</li>
                  <li>Progress tracking</li>
                  <li>Flexible scheduling</li>
                </ul>
                <p className="package-note">* Package prices vary based on frequency, duration and trainer. Contact us for a personalized quote.</p>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Get Started?</h2>
            <p>Schedule your free consultation with one of our expert trainers after becoming a member</p>
            <button className="consultation-btn" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalTraining; 