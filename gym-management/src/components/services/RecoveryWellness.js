import React from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';

function RecoveryWellness({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Recovery & Wellness</h1>
          <p>Comprehensive recovery facilities for optimal performance</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Premium Recovery & Wellness Center</h2>
            <p>Our state-of-the-art recovery and wellness facilities are designed to help you recover faster, prevent injuries, and maintain peak physical condition.</p>
            
            <div className="facilities-section">
              <h3>Our Facilities</h3>
              <div className="equipment-grid">
                <div className="equipment-card">
                  <h4>Sauna</h4>
                  <ul>
                    <li>Traditional dry sauna</li>
                    <li>Infrared sauna therapy</li>
                    <li>Temperature-controlled environment</li>
                    <li>Health monitoring</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Steam Room</h4>
                  <ul>
                    <li>Eucalyptus-infused steam</li>
                    <li>Humidity-controlled environment</li>
                    <li>Therapeutic lighting</li>
                    <li>Immersive relaxation</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Massage Therapy</h4>
                  <ul>
                    <li>Sports massage</li>
                    <li>Deep tissue massage</li>
                    <li>Myofascial release</li>
                    <li>Recovery-focused techniques</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Stretching Area</h4>
                  <ul>
                    <li>Assisted stretching services</li>
                    <li>Foam rolling stations</li>
                    <li>Dedicated flexibility zones</li>
                    <li>Mobility tools</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="service-benefits">
              <h3>Benefits of Recovery & Wellness</h3>
              <ul>
                <li>Faster muscle recovery after workouts</li>
                <li>Reduced muscle soreness and fatigue</li>
                <li>Improved circulation and flexibility</li>
                <li>Stress reduction and relaxation</li>
                <li>Enhanced sleep quality</li>
                <li>Reduced risk of injury</li>
              </ul>
            </div>

            <div className="wellness-programs">
              <h3>Wellness Programs</h3>
              <div className="program-grid">
                <div className="program-card">
                  <h4>Recovery Sessions</h4>
                  <p>Guided recovery sessions with our wellness specialists</p>
                  <ul>
                    <li>Post-workout protocols</li>
                    <li>Heat therapy guidance</li>
                    <li>Breathing techniques</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Wellness Workshops</h4>
                  <p>Educational sessions on recovery and wellness topics</p>
                  <ul>
                    <li>Sleep optimization</li>
                    <li>Stress management</li>
                    <li>Self-massage techniques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Enhance Your Recovery Experience</h2>
            <p>Join GymFlex and gain access to our premium recovery and wellness facilities designed to help you perform better, recover faster, and feel your best every day.</p>
            <button className="consultation-btn" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoveryWellness; 