import React, { useState } from 'react';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const plans = [
    {
      id: 1,
      name: 'Basic Plan',
      price: 800,
      duration: 'Monthly',
      features: [
        'Access to gym equipment',
        'Locker room access',
        'Basic fitness assessment',
        '2 Guest passes per month'
      ]
    },
    {
      id: 2,
      name: 'Premium Plan',
      price: 1300,
      duration: 'Monthly',
      features: [
        'All Basic Plan features',
        'Unlimited group classes',
        'Personal trainer consultation',
        'Nutrition guidance',
        '4 Guest passes per month'
      ]
    },
    {
      id: 3,
      name: 'Elite Plan',
      price: 2000,
      duration: 'Monthly',
      features: [
        'All Premium Plan features',
        '2 Personal training sessions/month',
        'Access to spa facilities',
        'Priority class booking',
        'Unlimited guest passes'
      ]
    }
  ];

  const durations = [
    { value: 'monthly', label: 'Monthly', discount: 0 },
    { value: '3months', label: '3 Months', discount: 0.10 },
    { value: '6months', label: '6 Months', discount: 0.20 },
    { value: '1year', label: '1 Year', discount: 0.28 }
  ];

  const calculatePrice = (basePrice, duration) => {
    const durationMultiplier = {
      'monthly': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12
    };
    
    const multiplier = durationMultiplier[duration];
    const discount = durations.find(d => d.value === duration).discount;
    const totalPrice = basePrice * multiplier * (1 - discount);
    return Math.round(totalPrice);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleProgressClick = (clickedStep) => {
    if (clickedStep <= step) {
      setStep(clickedStep);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="plans-container">
            <h2>Choose Your Membership Plan</h2>
            <div className="duration-selector">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  className={`duration-btn ${selectedDuration === duration.value ? 'selected' : ''}`}
                  onClick={() => setSelectedDuration(duration.value)}
                >
                  {duration.label}
                  {duration.discount > 0 && ` (-${(duration.discount * 100).toFixed(0)}%)`}
                </button>
              ))}
            </div>
            <div className="plans-grid">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="amount">₺{calculatePrice(plan.price, selectedDuration)}</span>
                    <span className="duration">/{selectedDuration}</span>
                  </div>
                  <div className="monthly-price">
                    (₺{Math.round(calculatePrice(plan.price, selectedDuration) / 
                      (selectedDuration === 'monthly' ? 1 : 
                       selectedDuration === '3months' ? 3 : 
                       selectedDuration === '6months' ? 6 : 12))} /month)
                  </div>
                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className="plan-button-container">
                    <button className="select-plan-btn">Select Plan</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="personal-info-container">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="next-btn">Proceed to Payment</button>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="payment-container">
            <h2>Payment Information</h2>
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="plan-details">
                <p className="plan-name">{selectedPlan.name}</p>
                <p className="plan-price">
                  ₺{calculatePrice(selectedPlan.price, selectedDuration)}/{selectedDuration}
                </p>
              </div>
              {/* Add payment form here */}
              <form className="payment-form">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn">Complete Purchase</button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div className="back-arrow" onClick={handleBackClick}>
        ← Back
      </div>
      <div className="progress-bar1">
        <div 
          className={`progress-step1 ${step >= 1 ? 'active' : ''}`}
          onClick={() => handleProgressClick(1)}
          style={{ cursor: 'pointer' }}
        >
          1. Select Plan
        </div>
        <div 
          className={`progress-step1 ${step >= 2 ? 'active' : ''}`}
          onClick={() => handleProgressClick(2)}
          style={{ cursor: 'pointer' }}
        >
          2. Personal Info
        </div>
        <div 
          className={`progress-step1 ${step >= 3 ? 'active' : ''}`}
          onClick={() => handleProgressClick(3)}
          style={{ cursor: 'pointer' }}
        >
          3. Payment
        </div>
      </div>
      {renderStep()}
    </div>
  );
}

export default Signup; 