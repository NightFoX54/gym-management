import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';

function GroupClasses({ isDarkMode, setIsDarkMode }) {
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
          <h1>Group Classes</h1>
          <p>Get fit together with our energetic group sessions</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Experience the Energy of Group Fitness</h2>
            <p>Join our dynamic group classes led by expert instructors. Whether you're a beginner or advanced fitness enthusiast, our varied class schedule has something for everyone.</p>
            
            <div className="class-schedule">
              <h3>Weekly Class Schedule</h3>
              <div className="schedule-grid">
                <div className="schedule-card">
                  <h4>Morning Classes</h4>
                  <ul>
                    <li>6:00 AM - Power Yoga</li>
                    <li>7:30 AM - HIIT</li>
                    <li>9:00 AM - Zumba</li>
                    <li>10:30 AM - Spinning</li>
                  </ul>
                </div>
                <div className="schedule-card">
                  <h4>Evening Classes</h4>
                  <ul>
                    <li>4:00 PM - Body Pump</li>
                    <li>5:30 PM - Boxing</li>
                    <li>7:00 PM - Pilates</li>
                    <li>8:30 PM - Yoga Flow</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="class-types">
              <h3>Our Classes</h3>
              <div className="class-grid">
                <div className="class-card">
                  <h4>Yoga</h4>
                  <p>Find your balance and flexibility through various yoga styles</p>
                </div>
                <div className="class-card">
                  <h4>HIIT</h4>
                  <p>High-intensity interval training for maximum calorie burn</p>
                </div>
                <div className="class-card">
                  <h4>Zumba</h4>
                  <p>Dance your way to fitness with Latin-inspired moves</p>
                </div>
                <div className="class-card">
                  <h4>Spinning</h4>
                  <p>Indoor cycling workouts set to energetic music</p>
                </div>
              </div>
            </div>

            <div className="service-benefits">
              <h3>Benefits of Group Classes</h3>
              <ul>
                <li>Motivating group environment</li>
                <li>Professional instruction</li>
                <li>Varied workout routines</li>
                <li>Social interaction</li>
                <li>Scheduled commitment</li>
                <li>Safe and effective workouts</li>
              </ul>
            </div>

            <div className="pricing-section">
              <h3>Class Access</h3>
              <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <h4>Group Classes Experience</h4>
                <p className="price">Starting from $20/class</p>
                <ul>
                  <li>Access to all group fitness classes</li>
                  <li>Professional certified instructors</li>
                  <li>State-of-the-art studio facilities</li>
                  <li>All equipment provided</li>
                  <li>Flexible class schedule</li>
                  <li>Free unlimited classes with Premium & Elite memberships</li>
                </ul>
                <p className="package-note">* Unlimited group classes are included with Premium ($49.99/mo) and Elite ($79.99/mo) membership plans. Drop-in and class pack options available.</p>
                <button className="book-now-btn">View Schedule</button>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Join a Class?</h2>
            <p>Experience our energetic group classes with a free trial class after becoming a member</p>
            <button className="consultation-btn" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupClasses; 