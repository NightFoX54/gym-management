import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../styles/Services.css';
import { useNavigate } from 'react-router-dom';

function Services({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const services = [
    {
      id: 1,
      title: "Personal Training",
      description: "One-on-one training sessions with certified professionals tailored to your specific goals.",
      icon: "fas fa-dumbbell",
      features: [
        "Customized workout plans",
        "Nutrition guidance",
        "Progress tracking",
        "Flexible scheduling"
      ]
    },
    {
      id: 2,
      title: "Group Classes",
      description: "Energetic group sessions led by expert instructors in various fitness disciplines.",
      icon: "fas fa-users",
      features: [
        "Yoga",
        "HIIT",
        "Zumba",
        "Spinning"
      ]
    },
    {
      id: 3,
      title: "Strength Training",
      description: "Access to state-of-the-art equipment and guidance for building strength and muscle.",
      icon: "fas fa-weight-hanging",
      features: [
        "Free weights area",
        "Machine circuits",
        "Power racks",
        "Olympic lifting platforms"
      ]
    },
    {
      id: 4,
      title: "Cardio Zone",
      description: "Modern cardio equipment to help you achieve your cardiovascular fitness goals.",
      icon: "fas fa-running",
      features: [
        "Treadmills",
        "Ellipticals",
        "Stationary bikes",
        "Stair climbers"
      ]
    },
    {
      id: 5,
      title: "Nutrition Counseling",
      description: "Expert guidance on nutrition to complement your fitness journey.",
      icon: "fas fa-apple-alt",
      features: [
        "Meal planning",
        "Dietary analysis",
        "Supplement guidance",
        "Weight management"
      ]
    },
    {
      id: 6,
      title: "Recovery & Wellness",
      description: "Comprehensive recovery facilities to help you maintain peak performance.",
      icon: "fas fa-hot-tub",
      features: [
        "Sauna",
        "Steam room",
        "Massage therapy",
        "Stretching area"
      ]
    },
    {
      id: 7,
      title: "Fitness Market",
      description: "Premium supplements, equipment, and fitness accessories with exclusive member discounts.",
      icon: "fas fa-shopping-cart",
      features: [
        "Premium supplements",
        "Training equipment",
        "Fitness apparel",
        "Member discounts"
      ]
    }
  ];

  const handleLearnMore = (serviceId) => {
    switch(serviceId) {
      case 1:
        navigate('/services/personal-training');
        break;
      case 2:
        navigate('/services/group-classes');
        break;
      case 3:
        navigate('/services/strength-training');
        break;
      case 4:
        navigate('/services/cardio-zone');
        break;
      case 5:
        navigate('/services/nutrition');
        break;
      case 6:
        navigate('/services/recovery');
        break;
      case 7:
        navigate('/services/market');
        break;
      default:
        break;
    }
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="services-page">
        <div className="services-header">
          <h1>Our Services</h1>
          <p>Comprehensive fitness solutions for every goal</p>
        </div>

        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button className="learn-more-btn" onClick={() => handleLearnMore(service.id)}>Learn More</button>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <h2>Ready to Start Your Fitness Journey?</h2>
          <p>Join us today and transform your life through fitness</p>
          <button className="join-now-btn" onClick={() => window.location.href='/signup'}>
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services; 