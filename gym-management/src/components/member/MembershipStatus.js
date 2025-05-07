import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCreditCard, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaSun, FaMoon, FaSync, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import '../../styles/MembershipStatus.css';
import '../../styles/Navbar.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';
import withChatAndNotifications from './withChatAndNotifications';
import { motion } from 'framer-motion';

const MembershipStatus = ({ isDarkMode, setIsDarkMode }) => {
  // Get user info from localStorage
  const userInfoString = localStorage.getItem('user');
  const userInfo = JSON.parse(userInfoString || '{}');
  const userId = userInfo.id;

  const [membership, setMembership] = useState({
    status: 'Loading...',
    type: 'Loading...',
    startDate: '',
    endDate: '',
    paymentStatus: 'Loading...',
    nextPayment: '',
    price: '',
    benefits: []
  });

  const [renewalPlans, setRenewalPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Add these states for payment form
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Add a separate state for renewal form errors
  const [renewalError, setRenewalError] = useState('');

  // Add this state for card holder's name
  const [cardHolderName, setCardHolderName] = useState('');

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  // Add this function to generate the benefits based on plan data
  const generateBenefits = (planData) => {
    if (!planData) return [];
    
    const features = [
      'Access to gym equipment',
      'Locker room access',
      'Basic fitness assessment'
    ];
    
    // Determine plan details based on plan name if specific values aren't provided
    let guestPasses = planData.guestPassCount;
    let ptSessions = planData.monthlyPtSessions;
    let groupClasses = planData.groupClassCount;
    let marketDiscount = planData.marketDiscount;
    
    // If these values aren't provided, set default values based on plan type
    if (planData.planName && (!guestPasses || !ptSessions || !groupClasses || !marketDiscount)) {
      if (planData.planName.includes('Elite')) {
        guestPasses = guestPasses || -1; // Unlimited
        ptSessions = ptSessions || 2;
        groupClasses = groupClasses || -1; // Unlimited
        marketDiscount = marketDiscount || 10;
      } else if (planData.planName.includes('Premium')) {
        guestPasses = guestPasses || 4;
        ptSessions = ptSessions || 1;
        groupClasses = groupClasses || -1; // Unlimited
        marketDiscount = marketDiscount || 5;
      } else { // Basic plan
        guestPasses = guestPasses || 2;
        ptSessions = ptSessions || 0;
        groupClasses = groupClasses || 0;
        marketDiscount = marketDiscount || 0;
      }
    }
    
    // Add guest passes feature
    if (guestPasses === -1) {
      features.push('Unlimited guest passes');
    } else if (guestPasses > 0) {
      features.push(`${guestPasses} Guest passes per month`);
    }
    
    // Add personal training sessions if available
    if (ptSessions > 0) {
      features.push(`${ptSessions} Personal training sessions/month`);
    }
    
    // Add group classes if available
    if (groupClasses === -1) {
      features.push('Unlimited group classes');
    } else if (groupClasses > 0) {
      features.push(`${groupClasses} Group classes per month`);
    }
    
    // Add market discount if available
    if (marketDiscount > 0) {
      features.push(`${marketDiscount}% Discount on market products`);
    }
    
    // Add premium features based on plan type
    if (planData.planType === 'ELITE' || planData.planName?.includes('Elite')) {
      features.push('Priority class booking');
      features.push('Access to spa facilities');
      features.push('Nutrition guidance');
    } else if (planData.planType === 'PREMIUM' || planData.planName?.includes('Premium')) {
      features.push('Nutrition guidance');
    }
    
    return features;
  };

  // Fetch membership data
  useEffect(() => {
    const fetchMembershipData = async () => {
      if (!userId) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        // First fetch the user's membership
        const membershipResponse = await fetch(`http://localhost:8080/api/members/${userId}/membership`);

        if (!membershipResponse.ok) {
          throw new Error(`Failed to fetch membership: ${membershipResponse.status}`);
        }

        const membershipData = await membershipResponse.json();
        console.log("Membership data:", membershipData);

        // Now fetch all membership plans to get the full details
        const plansResponse = await fetch('http://localhost:8080/api/membership-management/plans');
        
        if (!plansResponse.ok) {
          throw new Error(`Failed to fetch membership plans: ${plansResponse.status}`);
        }
        
        const plansData = await plansResponse.json();
        console.log("All membership plans:", plansData);
        
        // Find the matching plan for this user
        const userPlan = plansData.find(plan => 
          plan.planName === membershipData.planName ||
          plan.id === membershipData.planId
        );
        
        console.log("User's full plan details:", userPlan);

        // If we found the plan, use its data to generate benefits
        const planData = userPlan || {
          planName: membershipData.planName,
          planType: membershipData.planType,
          guestPassCount: membershipData.guestPassCount,
          monthlyPtSessions: membershipData.monthlyPtSessions,
          groupClassCount: membershipData.groupClassCount,
          marketDiscount: membershipData.marketDiscount
        };
        
        // Generate benefits based on the plan data
        const generatedBenefits = generateBenefits(planData);
        console.log("Generated benefits:", generatedBenefits);

        // Update membership state with real data and generated benefits
        // Check if data.benefits exists AND has length before using it
        const benefitsToUse = (membershipData.benefits && membershipData.benefits.length > 0) ? 
                              membershipData.benefits : generatedBenefits;
        
        setMembership({
          status: membershipData.isFrozen ? 'frozen' : (new Date(membershipData.endDate) > new Date() ? 'active' : 'expired'),
          type: membershipData.planName,
          startDate: membershipData.startDate,
          endDate: membershipData.endDate,
          paymentStatus: membershipData.paymentStatus || 'paid',
          nextPayment: membershipData.nextPaymentDate || membershipData.endDate,
          price: membershipData.price.toString(),
          benefits: benefitsToUse
        });

        // Calculate renewal plan prices based on current membership price
        const basePrice = parseFloat(membershipData.price);
        if (!isNaN(basePrice)) {
          setRenewalPlans([
            {
              id: '1month',
              name: '1 Month',
              price: basePrice.toFixed(2), // No discount for 1 month
              originalPrice: basePrice.toFixed(2),
              discount: '0%',
              description: 'Standard monthly membership'
            },
            {
              id: '3months',
              name: '3 Months',
              price: (basePrice * 3 * 0.9).toFixed(2), // 10% discount
              originalPrice: (basePrice * 3).toFixed(2),
              discount: '10%',
              description: 'Save 10% on 3-month membership'
            },
            {
              id: '6months',
              name: '6 Months',
              price: (basePrice * 6 * 0.8).toFixed(2), // 20% discount
              originalPrice: (basePrice * 6).toFixed(2),
              discount: '20%',
              description: 'Save 20% on 6-month membership'
            },
            {
              id: '12months',
              name: '12 Months',
              price: (basePrice * 12 * 0.72).toFixed(2), // 28% discount
              originalPrice: (basePrice * 12).toFixed(2),
              discount: '28%',
              description: 'Save 28% on annual membership'
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching membership data:", err);
        setError("Failed to load membership data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipData();
  }, [userId]);

  const toggleDarkModeMember = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#2ecc71';
      case 'expired':
        return '#e74c3c';
      case 'pending':
        return '#f1c40f';
      case 'frozen':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#2ecc71';
      case 'pending':
        return '#f1c40f';
      case 'failed':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const handleRenewal = () => {
    setShowRenewalModal(true);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleRenewalConfirm = async () => {
    // Clear any previous errors
    setRenewalError('');
    
    // 1. Validate plan selection
    if (!selectedPlan) {
      setRenewalError("Please select a renewal plan");
      return; // Stop execution here
    }
    
    // 1.5 Validate card holder name
    if (!cardHolderName.trim()) {
      setRenewalError("Please enter the card holder's name");
      return;
    }
    
    // 2. Validate card number (should be 16 digits, or 19 chars with spaces)
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length !== 16) {
      setRenewalError("Please enter a valid 16-digit card number");
      return; // Stop execution here
    }
    
    // 3. Validate expiry date (should be in MM/YY format)
    if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
      setRenewalError("Please enter a valid expiry date (MM/YY)");
      return; // Stop execution here
    }
    
    // 4. Parse month and year to validate further
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
    
    // 5. Check if month is valid (1-12)
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setRenewalError("Please enter a valid month (01-12)");
      return; // Stop execution here
    }
    
    // 6. Check if expiry date is in the future
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < new Date().getMonth() + 1)) {
      setRenewalError("Your card has expired. Please use a valid card");
      return; // Stop execution here
    }
    
    // 7. Validate CVC (should be 3 or 4 digits)
    if (cvc.length < 3 || cvc.length > 4 || !/^\d+$/.test(cvc)) {
      setRenewalError("Please enter a valid CVC code (3 or 4 digits)");
      return; // Stop execution here
    }

    // All validations passed, now proceed with the API call
    try {
      setIsLoading(true);
      
      // Get duration months from selected plan
      const planDuration = {
        '1month': 1,
        '3months': 3,
        '6months': 6,
        '12months': 12
      };
      
      const durationMonths = planDuration[selectedPlan];
      
      // Call the renewal endpoint
      const response = await fetch(`http://localhost:8080/api/members/${userId}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          durationMonths: durationMonths,
          paymentDetails: {
            cardHolderName: cardHolderName,
            cardNumber: cleanedCardNumber.slice(-4), // Only send last 4 digits for security
            expiryDate: expiryDate,
            cvc: "***" // Don't send actual CVC for security
          }
        }),
      });

      // Check for API errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to renew membership: ${response.status}`);
      }

      const data = await response.json();
      console.log("Renewal response:", data);

      // Only update membership state if API call was successful
      setMembership(prevState => ({
        ...prevState,
        endDate: data.endDate,
        status: 'active',
        paymentStatus: 'paid',
        nextPayment: data.endDate
      }));

      // Reset form fields
      setCardHolderName('');
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
      
      // Show success message
      setSuccessMessage(`Your membership has been renewed until ${new Date(data.endDate).toLocaleDateString()}. Thank you!`);
      setShowRenewalModal(false);
      setShowSuccessModal(true);
      
      // Reset selected plan
      setSelectedPlan('');
    } catch (err) {
      console.error("Error renewing membership:", err);
      setRenewalError(err.message || "Failed to renew membership. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency with Turkish Lira symbol
  const formatCurrency = (amount) => {
    return `₺${amount}`;
  };

  // Add these formatter functions
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    // Format as XXXX XXXX XXXX XXXX
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 4 digits (MM/YY)
    const limited = cleaned.slice(0, 4);
    
    // Format as MM/YY
    if (limited.length > 2) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    return limited;
  };

  const formatCvc = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 4 digits (some cards have 4-digit CVC)
    return cleaned.slice(0, 4);
  };

  // Add this formatter function for card holder name
  const formatCardHolderName = (value) => {
    // Only allow letters, spaces, hyphens, apostrophes and Turkish characters
    const nameRegex = /^[A-Za-züöçşğıÜÖÇŞĞİ\s\-']*$/;
    if (!nameRegex.test(value)) {
      return cardHolderName; // Return previous valid value if new input is invalid
    }
    return value;
  };

  // Add these handlers
  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvcChange = (e) => {
    setCvc(formatCvc(e.target.value));
  };

  // Update the handler function for card holder name
  const handleCardHolderNameChange = (e) => {
    const formattedName = formatCardHolderName(e.target.value);
    setCardHolderName(formattedName);
  };

  return (
    <div className={`membership-status-container-membershipstatus container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="membership-content-membershipstatus">
        <div className="membership-header-membershipstatus">
          <button className="back-button-membershipstatus" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <button 
            className={`dark-mode-toggle-forum ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <FaSun className="toggle-icon-forum sun-forum" />
            <div className="toggle-circle-forum"></div>
            <FaMoon className="toggle-icon-forum moon-forum" />
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading membership data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            <div className="membership-status-card-membershipstatus card-animate stagger-1">
              <div className="status-header-membershipstatus">
                <h2>Membership Status</h2>
                <div 
                  className="status-badge-membershipstatus"
                  style={{ backgroundColor: getStatusColor(membership.status) }}
                >
                  {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                </div>
              </div>

              <div className="membership-details-membershipstatus">
                <div className="detail-item-membershipstatus">
                  <FaCalendarAlt className="detail-icon-membershipstatus" />
                  <div className="detail-content-membershipstatus">
                    <label>Membership Type</label>
                    <p>{membership.type}</p>
                  </div>
                </div>

                <div className="detail-item-membershipstatus">
                  <FaCalendarAlt className="detail-icon-membershipstatus" />
                  <div className="detail-content-membershipstatus">
                    <label>Start Date</label>
                    <p>{membership.startDate ? new Date(membership.startDate).toLocaleDateString('en-US') : 'N/A'}</p>
                  </div>
                </div>

                <div className="detail-item-membershipstatus">
                  <FaCalendarAlt className="detail-icon-membershipstatus" />
                  <div className="detail-content-membershipstatus">
                    <label>End Date</label>
                    <p>{membership.endDate ? new Date(membership.endDate).toLocaleDateString('en-US') : 'N/A'}</p>
                  </div>
                </div>

                <div className="detail-item-membershipstatus">
                  <FaCreditCard className="detail-icon-membershipstatus" />
                  <div className="detail-content-membershipstatus">
                    <label>Payment Status</label>
                    <div className="payment-status-membershipstatus">
                      <span 
                        className="status-dot-membershipstatus"
                        style={{ backgroundColor: getPaymentStatusColor(membership.paymentStatus) }}
                      ></span>
                      <p>{membership.paymentStatus.charAt(0).toUpperCase() + membership.paymentStatus.slice(1)}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-item-membershipstatus">
                  <FaCreditCard className="detail-icon-membershipstatus" />
                  <div className="detail-content-membershipstatus">
                    <label>Next Payment</label>
                    <p>{membership.nextPayment ? new Date(membership.nextPayment).toLocaleDateString('en-US') : 'N/A'}</p>
                  </div>
                </div>

                <div className="detail-item-membershipstatus">
                  <FaCreditCard className="detail-icon-membershipstatus" />
                  <div className="detail-content-membershipstatus">
                    <label>Price</label>
                    <p>{formatCurrency(membership.price)}/month</p>
                  </div>
                </div>
              </div>

              <div className="benefits-section-membershipstatus card-animate stagger-2">
                <h3>Membership Benefits</h3>
                <div className="benefits-grid-membershipstatus">
                  {Array.isArray(membership.benefits) && membership.benefits.length > 0 ? (
                    membership.benefits.map((benefit, index) => (
                      <div key={index} className="benefit-item-membershipstatus">
                        <FaCheckCircle className="benefit-icon-membershipstatus" />
                        <span>{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-benefits-message">
                      <p>No specific benefits found for your plan.</p>
                    </div>
                  )}
                </div>
              </div>

              <button className="renew-button-membershipstatus card-animate stagger-3" onClick={handleRenewal}>
                <FaSync />
                <span>Renew Membership</span>
              </button>
            </div>
          </>
        )}
      </div>

      {showRenewalModal && (
        <div className="renewal-modal-overlay-membershipstatus">
          <div className="renewal-modal-membershipstatus card-animate">
            <div className="modal-header-membershipstatus">
              <h3>Renew Your Membership</h3>
              <button className="close-button-membershipstatus" onClick={() => {
                setShowRenewalModal(false);
                setRenewalError(''); // Clear any errors when closing
              }}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-content-membershipstatus">
              <div className="plans-grid-membershipstatus">
                {renewalPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`plan-card-membershipstatus ${selectedPlan === plan.id ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <div className="plan-header-membershipstatus">
                      <h4>{plan.name}</h4>
                      <div className="discount-badge">{plan.discount} OFF</div>
                    </div>
                    <div className="plan-content-membershipstatus">
                      <div className="plan-price-membershipstatus">
                        <span className="original-price">{formatCurrency(plan.originalPrice)}</span>
                        <span className="discounted-price">{formatCurrency(plan.price)}</span>
                      </div>
                      <p className="plan-description-membershipstatus">{plan.description}</p>
                    </div>
                    {selectedPlan === plan.id && (
                      <div className="selected-badge-membershipstatus">
                        <FaCheckCircle />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="payment-section-membershipstatus">
                <div className="payment-header-membershipstatus">
                  <FaCreditCard />
                  <h4>Payment Details</h4>
                </div>
                <div className="payment-form-membershipstatus">
                  <div className="form-group-membershipstatus">
                    <label htmlFor="cardHolderName">Card Holder Name <span className="required">*</span></label>
                    <input 
                      id="cardHolderName"
                      type="text" 
                      placeholder="Name on card" 
                      value={cardHolderName}
                      onChange={handleCardHolderNameChange}
                    />
                  </div>
                  <div className="form-group-membershipstatus">
                    <label htmlFor="cardNumber">Card Number <span className="required">*</span></label>
                    <input 
                      id="cardNumber"
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19} // 16 digits + 3 spaces
                    />
                  </div>
                  <div className="card-details-membershipstatus">
                    <div className="form-group-membershipstatus">
                      <label htmlFor="expiryDate">Expiry Date <span className="required">*</span></label>
                      <input 
                        id="expiryDate"
                        type="text" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength={5} // MM/YY format
                      />
                    </div>
                    <div className="form-group-membershipstatus">
                      <label htmlFor="cvc">CVC <span className="required">*</span></label>
                      <input 
                        id="cvc"
                        type="text" 
                        placeholder="CVC" 
                        value={cvc}
                        onChange={handleCvcChange}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {renewalError && (
                <div className="error-message-membershipstatus">
                  <FaExclamationCircle /> {renewalError}
                </div>
              )}
            </div>
            <div className="modal-footer-membershipstatus">
              <button className="cancel-button-membershipstatus" onClick={() => {
                setShowRenewalModal(false);
                setRenewalError(''); // Clear any errors when canceling
              }}>
                Cancel
              </button>
              <button 
                className="confirm-button-membershipstatus" 
                onClick={handleRenewalConfirm}
                disabled={!selectedPlan || isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Processing...
                  </>
                ) : (
                  'Confirm Renewal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal-overlay-membershipstatus">
          <div className="success-modal-membershipstatus card-animate">
            <div className="modal-header-membershipstatus">
              <h3>Renewal Successful</h3>
              <button className="close-button-membershipstatus" onClick={() => setShowSuccessModal(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="modal-content-membershipstatus">
              <div className="success-icon-container-membershipstatus">
                <FaCheckCircle className="success-icon-membershipstatus" />
              </div>
              <p className="success-message-membershipstatus">{successMessage}</p>
            </div>
            <div className="modal-footer-membershipstatus">
              <button className="confirm-button-membershipstatus" onClick={() => setShowSuccessModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withChatAndNotifications(MembershipStatus); 
