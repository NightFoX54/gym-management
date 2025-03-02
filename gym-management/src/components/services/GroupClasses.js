import React from 'react';
import Navbar from '../Navbar';
import { FaUsers, FaCalendarAlt, FaFireAlt, FaMedal, FaLaughBeam, FaBrain } from 'react-icons/fa';
import '../../styles/ServiceDetail.css';

function GroupClasses({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={`service-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-hero">
        <div 
          className="hero-background" 
          style={{ backgroundImage: "url('/images/group-classes-bg.jpg')" }}
        ></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Group Fitness Classes</h1>
          <p>Experience the energy and motivation of working out together in our diverse range of group classes</p>
          <button className="hero-btn" onClick={() => document.querySelector('.overview-card').scrollIntoView({ behavior: 'smooth' })}>
            Explore Classes
          </button>
        </div>
      </div>
      
      <div className="service-content">
        <div className="content-container">
          <div className="overview-card">
            <h2 className="section-title">Fitness is Better Together</h2>
            <p className="overview-text">
              Our group fitness classes blend expert instruction with the motivation and energy of a supportive community. 
              With a diverse range of classes designed for all fitness levels, you'll find the perfect way to challenge yourself, 
              have fun, and achieve results in a supportive atmosphere.
            </p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <FaFireAlt className="feature-icon" />
                <h3 className="feature-title">High-Intensity Classes</h3>
                <p className="feature-text">
                  Challenge yourself with our intense, calorie-burning workouts designed to push your limits.
                </p>
                <ul className="feature-list">
                  <li>HIIT Training</li>
                  <li>Bootcamp</li>
                  <li>Tabata</li>
                  <li>Circuit Training</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <FaBrain className="feature-icon" />
                <h3 className="feature-title">Mind & Body Classes</h3>
                <p className="feature-text">
                  Find balance, flexibility and inner peace with our mindful movement classes.
                </p>
                <ul className="feature-list">
                  <li>Yoga (various styles)</li>
                  <li>Pilates</li>
                  <li>Tai Chi</li>
                  <li>Stretch & Recovery</li>
                </ul>
              </div>
              
              <div className="feature-card">
                <FaUsers className="feature-icon" />
                <h3 className="feature-title">Cardio & Dance</h3>
                <p className="feature-text">
                  Enjoy fun, energetic workouts set to music that will get your heart pumping.
                </p>
                <ul className="feature-list">
                  <li>Zumba</li>
                  <li>Cardio Dance</li>
                  <li>Step Aerobics</li>
                  <li>Spin Classes</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="benefits-section">
            <h2 className="benefits-title">Benefits of Group Fitness</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <FaUsers className="benefit-icon" />
                <h3 className="benefit-title">Community Support</h3>
                <p className="benefit-text">Connect with like-minded individuals who will motivate and inspire you.</p>
              </div>
              
              <div className="benefit-item">
                <FaCalendarAlt className="benefit-icon" />
                <h3 className="benefit-title">Accountability</h3>
                <p className="benefit-text">Scheduled classes help you maintain consistency in your fitness routine.</p>
              </div>
              
              <div className="benefit-item">
                <FaMedal className="benefit-icon" />
                <h3 className="benefit-title">Expert Instruction</h3>
                <p className="benefit-text">Learn proper form and technique from our certified class instructors.</p>
              </div>
              
              <div className="benefit-item">
                <FaLaughBeam className="benefit-icon" />
                <h3 className="benefit-title">Fun Factor</h3>
                <p className="benefit-text">Enjoy workouts that are engaging, varied, and make fitness feel like fun.</p>
              </div>
            </div>
          </div>
          
          <div className="testimonials-section">
            <h2 className="section-title">What Our Members Say</h2>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "The energy in the HIIT classes is incredible! I've never been so motivated to push myself, 
                  and the results speak for themselves. Down 20 pounds and feeling stronger than ever!"
                </p>
                <div className="testimonial-author">
                  <img src="/images/testimonial-3.jpg" alt="Jessica" className="author-image" />
                  <div className="author-info">
                    <h4>Jessica Taylor</h4>
                    <p>HIIT Class Regular</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "As someone who always worked out alone, I was nervous to try group classes. Now I can't imagine 
                  my fitness routine without them! The instructors are amazing and the community is so supportive."
                </p>
                <div className="testimonial-author">
                  <img src="/images/testimonial-4.jpg" alt="Robert" className="author-image" />
                  <div className="author-info">
                    <h4>Robert Pierce</h4>
                    <p>Attends 4 classes weekly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <h2 className="cta-title">Join a Class Today</h2>
            <p className="cta-text">
              Experience the energy, motivation, and results that come with our group fitness classes. 
              Check out our class schedule and find the perfect fit for your fitness goals and preferences.
            </p>
            <button className="cta-btn" onClick={() => window.location.href='/signup'}>
              View Class Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupClasses; 