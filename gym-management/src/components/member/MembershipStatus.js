import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCreditCard, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaSun, FaMoon, FaSync } from 'react-icons/fa';
import '../../styles/MembershipStatus.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';

const MembershipStatus = ({ isDarkMode, setIsDarkMode }) => {
  const [membership, setMembership] = useState({
    status: 'active',
    type: 'Premium',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    paymentStatus: 'paid',
    nextPayment: '2025-01-01',
    price: '199.99',
    benefits: [
      'Unlimited Gym Access',
      'Personal Trainer Sessions',
      'Group Classes',
      'Locker Access',
      'Spa Access'
    ]
  });

  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const navigate = useNavigate();

  const renewalPlans = [
    {
      id: '1month',
      name: '1 Month',
      price: '199.99',
      description: 'Basic monthly membership'
    },
    {
      id: '6months',
      name: '6 Months',
      price: '999.99',
      description: 'Save 15% on 6-month membership'
    },
    {
      id: '12months',
      name: '12 Months',
      price: '1799.99',
      description: 'Save 25% on annual membership'
    }
  ];

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

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

  const handleConfirmRenewal = () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }
    // Here payment process and membership renewal API call will be made
    alert('Your membership renewal has been completed successfully!');
    setShowRenewalModal(false);
    setSelectedPlan('');
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
                <p>{new Date(membership.startDate).toLocaleDateString('en-US')}</p>
              </div>
            </div>

            <div className="detail-item-membershipstatus">
              <FaCalendarAlt className="detail-icon-membershipstatus" />
              <div className="detail-content-membershipstatus">
                <label>End Date</label>
                <p>{new Date(membership.endDate).toLocaleDateString('en-US')}</p>
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
                <p>{new Date(membership.nextPayment).toLocaleDateString('en-US')}</p>
              </div>
            </div>

            <div className="detail-item-membershipstatus">
              <FaCreditCard className="detail-icon-membershipstatus" />
              <div className="detail-content-membershipstatus">
                <label>Price</label>
                <p>${membership.price}/month</p>
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
                    </div>
                    <div className="plan-content-membershipstatus">
                      <div className="plan-price-membershipstatus">${plan.price}</div>
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
                disabled={!selectedPlan}
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipStatus; 
