import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCreditCard, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaSun, FaMoon, FaSync, FaSpinner } from 'react-icons/fa';
import '../../styles/MembershipStatus.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  // Fetch membership data
  useEffect(() => {
    const fetchMembershipData = async () => {
      if (!userId) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/members/${userId}/membership`);

        if (!response.ok) {
          throw new Error(`Failed to fetch membership: ${response.status}`);
        }

        const data = await response.json();
        console.log("Membership data:", data);

        // Update membership state with real data
        setMembership({
          status: data.isFrozen ? 'frozen' : (new Date(data.endDate) > new Date() ? 'active' : 'expired'),
          type: data.planName,
          startDate: data.startDate,
          endDate: data.endDate,
          paymentStatus: data.paymentStatus || 'paid',
          nextPayment: data.nextPaymentDate || data.endDate,
          price: data.price.toString(),
          benefits: data.benefits || [
            'Unlimited Gym Access',
            'Personal Trainer Sessions',
            'Group Classes',
            'Locker Access',
            'Spa Access'
          ]
        });

        // Calculate renewal plan prices based on current membership price
        const basePrice = parseFloat(data.price);
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

  const handleConfirmRenewal = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the selected plan details
      const plan = renewalPlans.find(p => p.id === selectedPlan);
      
      // Prepare renewal data
      const renewalData = {
        userId: userId,
        planId: selectedPlan,
        duration: selectedPlan === '1month' ? 1 : 
                  (selectedPlan === '3months' ? 3 : 
                  (selectedPlan === '6months' ? 6 : 12)),
        price: plan.price
      };
      
      // Call the API to renew membership
      const response = await fetch(`http://localhost:8080/api/members/${userId}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(renewalData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to renew membership: ${response.status}`);
      }
      
      // Refresh membership data
      const updatedResponse = await fetch(`http://localhost:8080/api/members/${userId}/membership`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setMembership({
          status: updatedData.isFrozen ? 'frozen' : (new Date(updatedData.endDate) > new Date() ? 'active' : 'expired'),
          type: updatedData.planName,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate,
          paymentStatus: updatedData.paymentStatus || 'paid',
          nextPayment: updatedData.nextPaymentDate || updatedData.endDate,
          price: updatedData.price.toString(),
          benefits: updatedData.benefits || [
            'Unlimited Gym Access',
            'Personal Trainer Sessions',
            'Group Classes',
            'Locker Access',
            'Spa Access'
          ]
        });
      }
      
      setShowRenewalModal(false);
      setSelectedPlan('');
    } catch (err) {
      console.error("Error renewing membership:", err);
      setError("Failed to renew membership");
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency with Turkish Lira symbol
  const formatCurrency = (amount) => {
    return `₺${amount}`;
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
            className={`dark-mode-toggle-membershipstatus ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <FaSun className="toggle-icon-membershipstatus sun-membershipstatus" />
            <div className="toggle-circle-membershipstatus"></div>
            <FaMoon className="toggle-icon-membershipstatus moon-membershipstatus" />
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
                  {membership.benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item-membershipstatus">
                      <FaCheckCircle className="benefit-icon-membershipstatus" />
                      <span>{benefit}</span>
                    </div>
                  ))}
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
              <button className="close-button-membershipstatus" onClick={() => setShowRenewalModal(false)}>
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
                  <input type="text" placeholder="Card Number" />
                  <div className="card-details-membershipstatus">
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVC" />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer-membershipstatus">
              <button className="cancel-button-membershipstatus" onClick={() => setShowRenewalModal(false)}>
                Cancel
              </button>
              <button 
                className="confirm-button-membershipstatus" 
                onClick={handleConfirmRenewal}
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
    </div>
  );
};

export default MembershipStatus; 
