import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';

function NutritionCounseling({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const nutritionOptions = [
    {
      name: "Personalized Meal Planning",
      description: "Custom meal plans designed for your specific nutritional needs, preferences, and goals.",
      icon: "fas fa-utensils"
    },
    {
      name: "Dietary Analysis",
      description: "Comprehensive analysis of your current eating habits with actionable improvements.",
      icon: "fas fa-chart-pie"
    },
    {
      name: "Weight Management",
      description: "Science-based strategies for sustainable weight loss, gain, or maintenance.",
      icon: "fas fa-weight"
    },
    {
      name: "Supplement Guidance",
      description: "Expert advice on supplements that actually work for your specific fitness and health goals.",
      icon: "fas fa-pills"
    },
    {
      name: "Food Journal Reviews",
      description: "Regular reviews of your food journal with feedback and adjustments to optimize results.",
      icon: "fas fa-book"
    },
    {
      name: "Nutrition Workshops",
      description: "Educational workshops on nutrition fundamentals and meal preparation techniques.",
      icon: "fas fa-chalkboard-teacher"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Nutrition Counseling</h1>
          <p>Expert guidance for optimal nutrition and health</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Transform Your Diet, Transform Your Life</h2>
            <p>
              Our nutrition counseling services provide personalized guidance to help you make informed 
              dietary choices that support your fitness goals and overall health. Whether you're looking 
              to lose weight, build muscle, improve athletic performance, or address specific health concerns, 
              our certified nutritionists will develop a customized plan that works for your lifestyle.
            </p>
            
            <div className="service-benefits">
              <h3>Benefits of Nutrition Counseling</h3>
              <ul>
                <li>Personalized meal plans tailored to your specific goals</li>
                <li>Strategic nutrition timing for optimal workout performance</li>
                <li>Education on proper macronutrient and micronutrient balance</li>
                <li>Weight management support based on scientific principles</li>
                <li>Improved energy levels and recovery time</li>
                <li>Long-term sustainable eating habits</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Our Nutrition Services</h2>
            <div className="options-grid">
              {nutritionOptions.map((option, index) => (
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
            <h3>Nutrition Service Access</h3>
            <div className="pricing-card featured" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <h4>Nutrition Counseling Experience</h4>
              <p className="price">Starting from ₺200/session</p>
              <ul>
                <li>Personalized nutritional assessment and analysis</li>
                <li>Custom meal planning and dietary guidance</li>
                <li>Expert certified nutritionists</li>
                <li>Weight management strategies</li>
                <li>Supplement recommendations</li>
                <li>Ongoing support and follow-up</li>
              </ul>
              <p className="package-note">* Basic nutrition consultation included with Elite (₺2000/mo) membership. Premium members (₺1300/mo) receive 50% discount on all nutrition services. Individual sessions and packages available.</p>
              <button className="book-now-btn">Book Consultation</button>
            </div>
          </div>

          <div className="booking-section">
            <h2>Ready to Transform Your Body?</h2>
            <p>Become a member today and start your journey to a healthier, happier you.</p>
            <button className="consultation-btn" onClick={() => navigate('/signup')}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionCounseling; 