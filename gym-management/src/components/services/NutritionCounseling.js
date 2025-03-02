import React from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';

function NutritionCounseling({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Nutrition Counseling</h1>
          <p>Expert guidance for optimal nutrition and wellness</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Personalized Nutrition Solutions</h2>
            <p>Our nutrition counseling services are designed to complement your fitness journey and help you achieve your health goals through proper nutrition guidance.</p>
            
            <div className="service-benefits">
              <h3>Benefits of Nutrition Counseling</h3>
              <ul>
                <li>Personalized nutrition plans tailored to your goals</li>
                <li>Scientific approach to food and nutrition</li>
                <li>Better energy levels throughout the day</li>
                <li>Improved workout performance and recovery</li>
                <li>Long-term sustainable eating habits</li>
                <li>Weight management support</li>
              </ul>
            </div>

            <div className="program-section">
              <h3>Our Nutrition Programs</h3>
              <div className="program-grid">
                <div className="program-card">
                  <h4>Initial Assessment</h4>
                  <p>Comprehensive evaluation of your current nutrition habits, health history, and goals</p>
                  <ul>
                    <li>Body composition analysis</li>
                    <li>Dietary habits review</li>
                    <li>Goal setting session</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Customized Meal Planning</h4>
                  <p>Detailed meal plans designed specifically for your needs and preferences</p>
                  <ul>
                    <li>Calorie and macro calculation</li>
                    <li>Food preference accommodation</li>
                    <li>Grocery shopping guides</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Ongoing Support</h4>
                  <p>Regular check-ins to monitor progress and adjust your nutrition strategy</p>
                  <ul>
                    <li>Bi-weekly progress reviews</li>
                    <li>Plan adjustments as needed</li>
                    <li>Accountability coaching</li>
                  </ul>
                </div>
                <div className="program-card">
                  <h4>Specialty Nutrition</h4>
                  <p>Specialized guidance for specific needs and goals</p>
                  <ul>
                    <li>Sports performance nutrition</li>
                    <li>Plant-based diet planning</li>
                    <li>Competition preparation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="consultation-section">
              <h3>Our Nutrition Experts</h3>
              <p>Our team of registered dietitians and nutritionists are certified professionals with extensive experience in sports nutrition and wellness. They work closely with our training staff to ensure your nutrition and fitness plans are perfectly aligned.</p>
            </div>
          </div>

          <div className="booking-section">
            <h2>Start Your Nutrition Journey Today</h2>
            <p>Join GymFlex and get access to expert nutrition guidance that will transform your relationship with food and help you achieve your fitness and health goals.</p>
            <button className="consultation-btn" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionCounseling; 