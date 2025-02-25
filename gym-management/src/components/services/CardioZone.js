import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';

function CardioZone({ isDarkMode, setIsDarkMode }) {
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
          <h1>Cardio Zone</h1>
          <p>Elevate your heart rate and boost your endurance</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Complete Cardio Fitness Center</h2>
            <p>Our cardio zone features the latest equipment and technology to help you achieve your cardiovascular fitness goals.</p>
            
            <div className="equipment-section">
              <h3>Available Equipment</h3>
              <div className="equipment-grid">
                <div className="equipment-card">
                  <h4>Treadmills</h4>
                  <ul>
                    <li>20 Premium treadmills</li>
                    <li>HD entertainment screens</li>
                    <li>Incline up to 15%</li>
                    <li>Speed up to 14 mph</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Ellipticals</h4>
                  <ul>
                    <li>15 Cross trainers</li>
                    <li>Adjustable resistance</li>
                    <li>Heart rate monitoring</li>
                    <li>Virtual trails</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Stationary Bikes</h4>
                  <ul>
                    <li>Upright bikes</li>
                    <li>Recumbent bikes</li>
                    <li>Spin bikes</li>
                    <li>Virtual cycling</li>
                  </ul>
                </div>
                <div className="equipment-card">
                  <h4>Other Equipment</h4>
                  <ul>
                    <li>Stair climbers</li>
                    <li>Rowing machines</li>
                    <li>Air bikes</li>
                    <li>Jacob's ladders</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="service-benefits">
              <h3>Benefits of Cardio Training</h3>
              <ul>
                <li>Improved heart health</li>
                <li>Weight management</li>
                <li>Increased stamina</li>
                <li>Better mood and energy levels</li>
                <li>Reduced stress</li>
                <li>Enhanced sleep quality</li>
              </ul>
            </div>

            <div className="cardio-programs">
              <h3>Cardio Programs</h3>
              <div className="program-grid">
                <div className="program-card">
                  <h4>Beginner Cardio</h4>
                  <p>Start your cardio journey safely and effectively</p>
                  <ul>
                    <li>Equipment orientation</li>
                    <li>Heart rate zones training</li>
                    <li>Basic interval training</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>HIIT Training</h4>
                  <p>High-intensity interval training for maximum results</p>
                  <ul>
                    <li>Guided HIIT sessions</li>
                    <li>Performance tracking</li>
                    <li>Varied workouts</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Endurance Training</h4>
                  <p>Build stamina and endurance</p>
                  <ul>
                    <li>Long-distance training</li>
                    <li>Race preparation</li>
                    <li>Recovery techniques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Start Your Cardio Journey Today</h2>
            <p>Join GymFlex and discover a new level of cardiovascular fitness. Get access to premium equipment, 
            expert guidance, and a supportive community to help you achieve your fitness goals.</p>
            <button className="consultation-btn" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardioZone; 