import React, { useState } from 'react';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGem, FaCrown, FaAward, FaCreditCard } from 'react-icons/fa';
import api from '../services/api';
import { setAuthUser } from '../utils/auth';

function Signup({ isDarkMode = false, setIsDarkMode = () => {} }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

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

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .substring(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setCardDetails(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .substring(0, 4)
        .replace(/(.{2})/, '$1/');
      
      setCardDetails(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
      return;
    }
    
    // Limit CVV to 3 or 4 digits
    if (name === 'cvv') {
      const formattedValue = value
        .replace(/\D/g, '')
        .substring(0, 4);
      
      setCardDetails(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
      return;
    }
    
    // For card holder name
    setCardDetails(prevState => ({
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const completeSignup = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    console.log('Starting signup process...');
    console.log('Selected plan:', selectedPlan);
    console.log('Selected duration:', selectedDuration);
    console.log('Form data:', formData);
    console.log('Card details:', cardDetails);
    
    try {
      // Calculate duration months from selectedDuration
      let durationMonths = 1; // default monthly
      switch(selectedDuration) {
        case '3months': durationMonths = 3; break;
        case '6months': durationMonths = 6; break;
        case '1year': durationMonths = 12; break;
        default: durationMonths = 1;
      }
      
      // Create request payload
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        planId: selectedPlan.id,
        durationMonths: durationMonths,
        startDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        paymentMethod: "CREDIT_CARD",
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''), // Last 4 digits
        cardHolderName: cardDetails.cardHolder,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv
      };
      
      console.log('Sending signup data:', signupData);
      
      // Call the API
      const response = await api.post('/auth/signup', signupData);
      
      console.log('API response:', response);
      
      if (response.data.success) {
        // Create user data structure expected by your auth system
        const userData = {
          id: response.data.userId,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token || `USER_${response.data.userId}`, // Temporary token if not provided
          membershipInfo: {
            id: response.data.membershipId,
            plan: response.data.membershipPlan,
            endDate: response.data.membershipEndDate
          }
        };
        
        // Use the auth utility to set the user
        setAuthUser(userData);
        
        // Redirect to member dashboard
        navigate('/member');
      } else {
        setSubmissionError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmissionError(error.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
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
                  <h3>
                    {plan.id === 1 && <FaGem className="plan-icon" />}
                    {plan.id === 2 && <FaCrown className="plan-icon" />}
                    {plan.id === 3 && <FaAward className="plan-icon" />}
                    {plan.name}
                  </h3>
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
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password-visibility" 
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password-visibility" 
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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
                <div className="plan-name-container">
                  {selectedPlan.id === 1 && <FaGem className="plan-icon" />}
                  {selectedPlan.id === 2 && <FaCrown className="plan-icon" />}
                  {selectedPlan.id === 3 && <FaAward className="plan-icon" />}
                  <p className="plan-name">{selectedPlan.name}</p>
                </div>
                <p className="plan-price">
                  ₺{calculatePrice(selectedPlan.price, selectedDuration)}/{selectedDuration}
                </p>
              </div>
              
              <div className="payment-flex-container">
                <div className="payment-form-container">
                  <form className="payment-form">
                    <div className="form-group">
                      <label htmlFor="cardHolder">Card Holder Name</label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="Name on Card"
                        value={cardDetails.cardHolder}
                        onChange={handleCardInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardInputChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleCardInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          onFocus={() => document.querySelector('.credit-card').classList.add('flipped')}
                          onBlur={() => document.querySelector('.credit-card').classList.remove('flipped')}
                          required
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="submit-btn" 
                      onClick={completeSignup}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                    </button>
                  </form>
                </div>
                
                <div className="credit-card-preview">
                  <div className={`credit-card ${cardDetails.cvv.length > 0 ? 'flipped' : ''}`}>
                    <div className="credit-card-front">
                      <div className="card-chip"></div>
                      <div className="card-logo"><FaCreditCard /></div>
                      <div className="card-number">
                        {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-info">
                        <div className="card-holder">
                          <span>Card Holder</span>
                          <div>{cardDetails.cardHolder || 'FULL NAME'}</div>
                        </div>
                        <div className="card-expiry">
                          <span>Expires</span>
                          <div>{cardDetails.expiryDate || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="credit-card-back">
                      <div className="card-stripe"></div>
                      <div className="card-cvv">
                        <span>CVV</span>
                        <div className="cvv-band">{cardDetails.cvv || '•••'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {submissionError && <div className="error-message">{submissionError}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`signup-container ${isDarkMode ? 'dark-mode' : ''}`}>
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