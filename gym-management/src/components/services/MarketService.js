import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import '../../styles/ServiceDetail.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Market({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);
  
  // Fetch membership plans
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/api/membership-management/plans');
        setMembershipPlans(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching membership plans:', err);
        setError('Failed to load membership plans.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  // Helper functions to get specific plans
  const getBasicPlan = () => membershipPlans.find(plan => plan.planName.toLowerCase().includes('basic'));
  const getPremiumPlan = () => membershipPlans.find(plan => plan.planName.toLowerCase().includes('premium'));
  const getElitePlan = () => membershipPlans.find(plan => plan.planName.toLowerCase().includes('elite'));

  const marketCategories = [
    {
      name: "Supplements",
      description: "Premium quality supplements including proteins, pre-workouts, vitamins, and recovery products.",
      icon: "fas fa-pills"
    },
    {
      name: "Equipment",
      description: "Home workout essentials, resistance bands, yoga mats, and personal training equipment.",
      icon: "fas fa-dumbbell"
    },
    {
      name: "Clothing",
      description: "Performance wear, workout apparel, shoes, and accessories for both men and women.",
      icon: "fas fa-tshirt"
    },
    {
      name: "Accessories",
      description: "Training accessories including gloves, belts, straps, shakers, and gym bags.",
      icon: "fas fa-shopping-bag"
    },
    {
      name: "Nutrition",
      description: "Healthy snacks, protein bars, energy drinks, and meal replacement options.",
      icon: "fas fa-apple-alt"
    },
    {
      name: "Recovery",
      description: "Foam rollers, massage balls, compression gear, and recovery supplements.",
      icon: "fas fa-heart"
    }
  ];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="service-detail-page">
        <div className="service-detail-header">
          <h1>Fitness Market</h1>
          <p>Your One-Stop Shop for All Fitness Needs</p>
        </div>

        <div className="service-detail-content">
          <div className="service-overview">
            <h2>Quality Products for Your Fitness Journey</h2>
            <p>
              Our fitness market offers a comprehensive selection of high-quality products 
              to support your fitness goals. From premium supplements to workout gear, 
              we ensure you have access to the best products in the industry. Plus, 
              our membership program offers exclusive discounts on all purchases!
            </p>
            
            <div className="service-benefits">
              <h3>Member Benefits</h3>
              <ul>
                {!isLoading && !error && getPremiumPlan() && (
                  <li>Premium Plan Members: {getPremiumPlan().marketDiscount}% discount on all purchases</li>
                )}
                {!isLoading && !error && getElitePlan() && (
                  <li>Elite Plan Members: {getElitePlan().marketDiscount}% discount on all purchases</li>
                )}
                <li>Expert staff guidance on product selection</li>
                <li>Regular new product launches and seasonal sales</li>
                <li>Special pre-order options for upcoming products</li>
                <li>Monthly member-exclusive deals</li>
              </ul>
            </div>
          </div>

          <div className="service-options">
            <h2>Product Categories</h2>
            <div className="options-grid">
              {marketCategories.map((category, index) => (
                <div className="option-card" key={index}>
                  <div className="option-icon">
                    <i className={category.icon}></i>
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pricing-section">
            <h3>Membership Discounts</h3>
            {isLoading ? (
              <p>Loading membership discount information...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <div className="pricing-grid">
                <div className="pricing-card">
                  <h4>Basic Members</h4>
                  <p className="price">
                    {getBasicPlan()?.marketDiscount > 0 
                      ? `${getBasicPlan().marketDiscount}% Off` 
                      : "Regular Prices"}
                  </p>
                  <ul>
                    <li>Access to all products</li>
                    <li>Regular promotional offers</li>
                    <li>Product guidance</li>
                  </ul>
                </div>
                <div className="pricing-card">
                  <h4>Premium Members</h4>
                  <p className="price">
                    {getPremiumPlan() 
                      ? `${getPremiumPlan().marketDiscount}% Off` 
                      : "10% Off"}
                  </p>
                  <ul>
                    <li>{getPremiumPlan() ? `${getPremiumPlan().marketDiscount}% discount on all purchases` : "10% discount on all purchases"}</li>
                    <li>Early access to new products</li>
                    <li>Monthly special deals</li>
                  </ul>
                </div>
                <div className="pricing-card featured">
                  <h4>Elite Members</h4>
                  <p className="price">
                    {getElitePlan() 
                      ? `${getElitePlan().marketDiscount}% Off` 
                      : "15% Off"}
                  </p>
                  <ul>
                    <li>{getElitePlan() ? `${getElitePlan().marketDiscount}% discount on all purchases` : "15% discount on all purchases"}</li>
                    <li>Priority access to new launches</li>
                    <li>Exclusive seasonal offers</li>
                    <li>Personal shopping assistance</li>
                  </ul>
                </div>
              </div>
            )}
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

export default Market; 