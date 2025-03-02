import React from 'react';
import Navbar from '../Navbar';
import { FaDumbbell, FaClipboardCheck, FaChartLine, FaHandHoldingHeart, FaRunning, FaHeartbeat } from 'react-icons/fa';
import '../../styles/ServiceDetail.css';

function PersonalTraining({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={`service-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-hero">
        <div 
          className="hero-background" 
          style={{ backgroundImage: "url('/images/personal-training-bg.jpg')" }}
        ></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Personal Training</h1>
          <p>Achieve your fitness goals with dedicated one-on-one coaching from our expert trainers</p>
          <button className="hero-btn" onClick={() => document.querySelector('.overview-card').scrollIntoView({ behavior: 'smooth' })}>
            Learn More
          </button>
        </div>
      </div>
      
      <div className="service-content">
        <div className="content-container">
          <div className="overview-card">
            <h2 className="section-title">Your Fitness Journey, Personalized</h2>
            <p className="overview-text">
              Our personal training programs are designed to help you achieve your specific fitness goals through customized workout plans, 
              expert guidance, and consistent support. Whether you're looking to lose weight, build muscle, improve athletic performance, 
              or enhance your overall health, our certified trainers will create a program tailored exclusively to your needs.
            </p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <FaClipboardCheck className="feature-icon" />
                <h3 className="feature-title">Initial Assessment</h3>
                <p className="feature-text">
                  We begin with a comprehensive fitness assessment to understand your current level, goals, and any limitations.
                </p>
                <ul className="feature-list">
                  <li>Body composition analysis</li>
                  <li>Fitness level assessment</li>
                  <li>Movement pattern screening</li>
                  <li>Goal setting consultation</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <FaDumbbell className="feature-icon" />
                <h3 className="feature-title">Customized Training</h3>
                <p className="feature-text">
                  Your trainer will design workout programs specifically for you, adjusting as you progress.
                </p>
                <ul className="feature-list">
                  <li>Tailored exercise selection</li>
                  <li>Progressive overload planning</li>
                  <li>Technique correction</li>
                  <li>Workout variety</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <FaChartLine className="feature-icon" />
                <h3 className="feature-title">Progress Tracking</h3>
                <p className="feature-text">
                  We continuously monitor your progress and make adjustments to ensure you keep moving toward your goals.
                </p>
                <ul className="feature-list">
                  <li>Regular reassessments</li>
                  <li>Performance metrics</li>
                  <li>Digital progress tracking</li>
                  <li>Goal achievement celebration</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="benefits-section">
            <h2 className="benefits-title">Benefits of Personal Training</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <FaHeartbeat className="benefit-icon" />
                <h3 className="benefit-title">Improved Health</h3>
                <p className="benefit-text">Enhance cardiovascular health, strength, and overall wellness through expert guidance.</p>
              </div>
              
              <div className="benefit-item">
                <FaRunning className="benefit-icon" />
                <h3 className="benefit-title">Enhanced Performance</h3>
                <p className="benefit-text">Reach new personal bests and improve athletic abilities with customized training.</p>
              </div>
              
              <div className="benefit-item">
                <FaHandHoldingHeart className="benefit-icon" />
                <h3 className="benefit-title">Injury Prevention</h3>
                <p className="benefit-text">Learn proper form and technique to prevent injuries and train safely long-term.</p>
              </div>
            </div>
          </div>
          
          <div className="testimonials-section">
            <h2 className="section-title">Success Stories</h2>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "Working with my personal trainer at GymFlex completely transformed my approach to fitness. 
                  I've lost 30 pounds and gained so much strength and confidence!"
                </p>
                <div className="testimonial-author">
                  <img src="/images/testimonial-1.jpg" alt="Sarah" className="author-image" />
                  <div className="author-info">
                    <h4>Sarah Johnson</h4>
                    <p>Member for 8 months</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "After years of trying different programs, personal training at GymFlex finally helped me 
                  achieve the results I wanted. My trainer understands exactly what I need."
                </p>
                <div className="testimonial-author">
                  <img src="/images/testimonial-2.jpg" alt="Michael" className="author-image" />
                  <div className="author-info">
                    <h4>Michael Chen</h4>
                    <p>Member for 1 year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <h2 className="cta-title">Start Your Personal Training Journey</h2>
            <p className="cta-text">
              Take the first step toward a stronger, healthier you with our expert personal trainers. 
              Whether you're a beginner or looking to break through a plateau, we're here to help you succeed.
            </p>
            <button className="cta-btn" onClick={() => window.location.href='/signup'}>
              Schedule a Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalTraining; 