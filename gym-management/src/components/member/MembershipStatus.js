import React, { useState } from 'react';
import { FaCalendar, FaClock, FaCheckCircle, FaArrowLeft, FaTimes, FaCreditCard, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/MembershipStatus.css';

const MembershipStatus = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const membershipInfo = {
    status: 'Active',
    type: 'Premium Membership',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    remainingDays: 245,
    features: [
      'Access to all gym equipment',
      'Group fitness classes',
      'Personal trainer consultation',
      'Locker room access',
      'Nutrition guidance'
    ]
  };

  const renewalPlans = [
    {
      id: '1month',
      name: '1 Month',
      price: '299 TL',
      description: 'Basic monthly membership'
    },
    {
      id: '6months',
      name: '6 Months',
      price: '1499 TL',
      description: 'Save 15% on 6-month membership'
    },
    {
      id: '12months',
      name: '12 Months',
      price: '2599 TL',
      description: 'Save 25% on annual membership'
    }
  ];

  const handleRenewal = () => {
    setShowRenewalModal(true);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleConfirmRenewal = () => {
    if (!selectedPlan) {
      alert('Lütfen bir plan seçin');
      return;
    }
    // Burada ödeme işlemi ve üyelik yenileme API çağrısı yapılacak
    alert('Üyelik yenileme işleminiz başarıyla tamamlandı!');
    setShowRenewalModal(false);
    setSelectedPlan('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`membership-status-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="back-button" onClick={() => navigate('/member')}>
        <FaArrowLeft />
        <span>Back to Dashboard</span>
      </button>
      
      <div className="dark-mode-toggle-container">
        <button 
          className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
          onClick={toggleDarkMode}
        >
          <FaSun className="toggle-icon sun" />
          <div className="toggle-circle"></div>
          <FaMoon className="toggle-icon moon" />
        </button>
      </div>

      <div className="membership-status-content">
        <h2>Membership Status</h2>
        
        <div className="status-card">
          <div className="status-header">
            <div className="status-badge">
              <FaCheckCircle />
              <span>{membershipInfo.status}</span>
            </div>
            <h3>{membershipInfo.type}</h3>
          </div>

          <div className="date-info">
            <div className="date-item">
              <FaCalendar />
              <div>
                <label>Start Date</label>
                <p>{new Date(membershipInfo.startDate).toLocaleDateString('en-US')}</p>
              </div>
            </div>
            <div className="date-item">
              <FaCalendar />
              <div>
                <label>End Date</label>
                <p>{new Date(membershipInfo.endDate).toLocaleDateString('en-US')}</p>
              </div>
            </div>
            <div className="date-item">
              <FaClock />
              <div>
                <label>Days Remaining</label>
                <p>{membershipInfo.remainingDays} days</p>
              </div>
            </div>
          </div>

          <div className="features-section">
            <h4>Membership Features</h4>
            <ul className="features-list">
              {membershipInfo.features.map((feature, index) => (
                <li key={index}>
                  <FaCheckCircle />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="renew-button" onClick={handleRenewal}>
            Renew Membership
          </button>
        </div>
      </div>

      {showRenewalModal && (
        <div className="renewal-modal-overlay">
          <div className="renewal-modal">
            <div className="modal-header">
              <h3>Renew Your Membership</h3>
              <button className="close-button" onClick={() => setShowRenewalModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="plans-grid">
                {renewalPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <div className="plan-header">
                      <h4>{plan.name}</h4>
                      <div className="plan-price">{plan.price}</div>
                    </div>
                    <p className="plan-description">{plan.description}</p>
                    {selectedPlan === plan.id && (
                      <div className="selected-badge">
                        <FaCheckCircle />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="payment-section">
                <div className="payment-header">
                  <FaCreditCard />
                  <h4>Payment Details</h4>
                </div>
                <div className="payment-form">
                  <input type="text" placeholder="Card Number" />
                  <div className="card-details">
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVC" />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowRenewalModal(false)}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
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