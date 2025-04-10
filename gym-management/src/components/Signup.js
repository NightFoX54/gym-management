import React, { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState({
    phone: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [cardErrors, setCardErrors] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Fetch membership plans from the backend
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/membership-management/plans');
        
        if (response.data && response.data.length > 0) {
          setPlans(response.data);
        } else {
          // Fallback to default plans if no data is returned
          setPlans([
            {
              id: 1,
              planName: 'Basic Plan',
              planPrice: 800,
              guestPassCount: 2,
              monthlyPtSessions: 0,
              groupClassCount: 0,
              marketDiscount: 0
            },
            {
              id: 2,
              planName: 'Premium Plan',
              planPrice: 1300,
              guestPassCount: 4,
              monthlyPtSessions: 1, 
              groupClassCount: -1, // Unlimited
              marketDiscount: 5
            },
            {
              id: 3,
              planName: 'Elite Plan',
              planPrice: 2000,
              guestPassCount: -1, // Unlimited
              monthlyPtSessions: 2,
              groupClassCount: -1, // Unlimited
              marketDiscount: 10
            }
          ]);
        }
        setLoadError(null);
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        setLoadError('Failed to load membership plans. Using default values.');
        // Set default plans as fallback
        setPlans([
          {
            id: 1,
            planName: 'Basic Plan',
            planPrice: 800,
            guestPassCount: 2,
            monthlyPtSessions: 0,
            groupClassCount: 0,
            marketDiscount: 0
          },
          {
            id: 2,
            planName: 'Premium Plan',
            planPrice: 1300,
            guestPassCount: 4,
            monthlyPtSessions: 1,
            groupClassCount: -1, // Unlimited
            marketDiscount: 5
          },
          {
            id: 3,
            planName: 'Elite Plan',
            planPrice: 2000,
            guestPassCount: -1, // Unlimited
            monthlyPtSessions: 2,
            groupClassCount: -1, // Unlimited
            marketDiscount: 10
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Allow only numbers and + at the beginning
      const phoneRegex = /^\+?\d*$/;
      if (!phoneRegex.test(value)) {
        return;
      }
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      setErrors(prevState => ({
        ...prevState,
        phone: ''
      }));
    } else if (name === 'confirmPassword') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      // Check if passwords match
      if (value !== formData.password) {
        setErrors(prevState => ({
          ...prevState,
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        setErrors(prevState => ({
          ...prevState,
          confirmPassword: ''
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Always reset submission error when any field changes
    setSubmissionError(null);
    
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
      
      // Validate card number
      setCardErrors(prev => ({
        ...prev,
        cardNumber: formattedValue.replace(/\s/g, '').length < 16 ? 'Card number must be 16 digits' : ''
      }));
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .substring(0, 4);
      
      // Insert slash after first 2 digits if there are at least 2 digits
      const finalValue = formattedValue.length >= 2 
        ? formattedValue.substring(0, 2) + '/' + formattedValue.substring(2)
        : formattedValue;
      
      setCardDetails(prevState => ({
        ...prevState,
        [name]: finalValue
      }));
      
      // Validate expiry date
      setCardErrors(prev => ({
        ...prev,
        expiryDate: formattedValue.length < 4 ? 'Expiry date must be in MM/YY format' : ''
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
      
      // Validate CVV
      setCardErrors(prev => ({
        ...prev,
        cvv: formattedValue.length < 3 ? 'CVV must be 3-4 digits' : ''
      }));
      return;
    }
    
    // For card holder name
    setCardDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Validate card holder
    if (name === 'cardHolder') {
      setCardErrors(prev => ({
        ...prev,
        cardHolder: !value.trim() ? 'Cardholder name is required' : ''
      }));
    }
  };

  const validateCardDetails = () => {
    const errors = {
      cardHolder: !cardDetails.cardHolder.trim() ? 'Cardholder name is required' : '',
      cardNumber: cardDetails.cardNumber.replace(/\s/g, '').length < 16 ? 'Card number must be 16 digits' : '',
      expiryDate: cardDetails.expiryDate.replace('/', '').length < 4 ? 'Expiry date must be in MM/YY format' : '',
      cvv: cardDetails.cvv.length < 3 ? 'CVV must be 3-4 digits' : ''
    };
    
    setCardErrors(errors);
    
    // Return true if there are no errors
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if passwords match before proceeding
    if (formData.password !== formData.confirmPassword) {
      setErrors(prevState => ({
        ...prevState,
        confirmPassword: 'Passwords do not match'
      }));
      return;
    }
    
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
    // First validate card details
    if (!validateCardDetails()) {
      setSubmissionError('Please complete all payment information correctly');
      return;
    }
    
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
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''), 
        cardHolderName: cardDetails.cardHolder,
        expiryDate: cardDetails.expiryDate,
        cvv: parseInt(cardDetails.cvv, 10) // Convert to integer as backend expects numeric CVV
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
      
      // Provide user-friendly error message
      if (error.response?.data?.message?.includes("intCompact") || error.response?.data?.message?.includes("subtrahend is null")) {
        setSubmissionError('Please complete all payment information correctly');
      } else {
        setSubmissionError(error.response?.data?.message || 'An error occurred during registration. Please check your information and try again.');
      }
      
      // Reset submission state so user can try again
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated to get features based on plan data from backend
  const getPlanFeatures = (plan) => {
    const features = [
      'Access to gym equipment',
      'Locker room access',
      'Basic fitness assessment'
    ];
    
    // Add guest passes feature
    if (plan.guestPassCount === -1) {
      features.push('Unlimited guest passes');
    } else if (plan.guestPassCount > 0) {
      features.push(`${plan.guestPassCount} Guest passes per month`);
    }
    
    // Add personal training sessions if available
    if (plan.monthlyPtSessions > 0) {
      features.push(`${plan.monthlyPtSessions} Personal training sessions/month`);
    }
    
    // Add group classes if available
    if (plan.groupClassCount === -1) {
      features.push('Unlimited group classes');
    } else if (plan.groupClassCount > 0) {
      features.push(`${plan.groupClassCount} Group classes per month`);
    }
    
    // Add market discount if available
    if (plan.marketDiscount > 0) {
      features.push(`${plan.marketDiscount}% Discount on market products`);
    }
    
    // Add priority booking for Elite plan
    if (plan.id === 3) {
      features.push('Priority class booking');
      features.push('Access to spa facilities');
    }
    
    // Add nutrition guidance for Premium and Elite plans
    if (plan.id === 2 || plan.id === 3) {
      features.push('Nutrition guidance');
    }
    
    return features;
  };

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

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="plans-container">
            <h2>Choose Your Membership Plan</h2>
            {loadError && <div className="error-message">{loadError}</div>}
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
            {isLoading ? (
              <div className="loading-container">
                <p>Loading membership plans...</p>
              </div>
            ) : (
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
                      {plan.planName}
                    </h3>
                    <div className="price">
                      <span className="amount">₺{calculatePrice(plan.planPrice, selectedDuration)}</span>
                      <span className="duration">/{selectedDuration}</span>
                    </div>
                    <div className="monthly-price">
                      (₺{Math.round(calculatePrice(plan.planPrice, selectedDuration) / 
                        (selectedDuration === 'monthly' ? 1 : 
                        selectedDuration === '3months' ? 3 : 
                        selectedDuration === '6months' ? 6 : 12))} /month)
                    </div>
                    <ul className="features-list">
                      {getPlanFeatures(plan).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <div className="plan-button-container">
                      <button className="select-plan-btn">Select Plan</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
                  <p className="plan-name">{selectedPlan.planName}</p>
                </div>
                <p className="plan-price">
                  ₺{calculatePrice(selectedPlan.planPrice, selectedDuration)}/{selectedDuration}
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
                      {cardErrors.cardHolder && <span className="error-message">{cardErrors.cardHolder}</span>}
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
                      {cardErrors.cardNumber && <span className="error-message">{cardErrors.cardNumber}</span>}
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
                        {cardErrors.expiryDate && <span className="error-message">{cardErrors.expiryDate}</span>}
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
                        {cardErrors.cvv && <span className="error-message">{cardErrors.cvv}</span>}
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
            {submissionError && <div className="error-message submission-error">{submissionError}</div>}
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
