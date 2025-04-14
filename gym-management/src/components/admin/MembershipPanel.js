import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import { message } from 'antd';
import { FaUserFriends, FaUsers, FaEdit } from 'react-icons/fa';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const MembershipPanel = () => {
  // States for membership plans
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  // States for general prices
  const [generalPrices, setGeneralPrices] = useState([]);
  const [editingPrice, setEditingPrice] = useState(null);

  // New states for edit mode (from CustomersPanel)
  const [isEditing, setIsEditing] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchMembershipPlans();
    fetchGeneralPrices();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Define price badge component
  const PriceBadge = ({ amount }) => {
    const value = parseFloat(amount);
    
    let colorClass = 'medium-price';
    if (value >= 1500) colorClass = 'high-price';
    if (value <= 500) colorClass = 'low-price';
    
    return (
      <div className={`price-badge ${colorClass}`}>
        {formatCurrency(amount)}
      </div>
    );
  };

  // Fetch membership plans from API
  const fetchMembershipPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/membership-management/plans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembershipPlans(data);
      } else {
        message.error('Failed to fetch membership plans');
      }
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      message.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Fetch general prices from API
  const fetchGeneralPrices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/membership-management/general-prices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneralPrices(data);
      } else {
        message.error('Failed to fetch general prices');
      }
    } catch (error) {
      console.error('Error fetching general prices:', error);
      message.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // New edit system from CustomersPanel
  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditingPlan(null);
    setEditingPrice(null);
  };

  const handleSelectPlan = (plan) => {
    if (isEditing && !editingPlan) {
      setEditingPlan({...plan});
    }
  };

  const handleSelectPrice = (price) => {
    if (isEditing && !editingPrice) {
      setEditingPrice({...price});
    }
  };

  // Handle save plan (using the new edit system)
  const handleSavePlan = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/membership-management/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const updatedPlan = await response.json();
        setMembershipPlans(membershipPlans.map(plan => 
          plan.id === updatedPlan.id ? updatedPlan : plan
        ));
        setEditingPlan(null);
        message.success('Membership plan updated successfully');
      } else {
        message.error('Failed to update membership plan');
      }
    } catch (error) {
      console.error('Error updating membership plan:', error);
      message.error('Error connecting to server');
    }
  };

  // Handle save price (using the new edit system)
  const handleSavePrice = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/membership-management/general-prices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const updatedPrice = await response.json();
        setGeneralPrices(generalPrices.map(price => 
          price.id === updatedPrice.id ? updatedPrice : price
        ));
        setEditingPrice(null);
        message.success('Service price updated successfully');
      } else {
        message.error('Failed to update service price');
      }
    } catch (error) {
      console.error('Error updating service price:', error);
      message.error('Error connecting to server');
    }
  };

  // Format service name with icon
  const formatServiceName = (name) => {
    if (name === 'personal training') {
      return (
        <div className="service-name">
          <FaUserFriends className="service-icon" />
          <span>Personal Training</span>
        </div>
      );
    } else if (name === 'group classes') {
      return (
        <div className="service-name">
          <FaUsers className="service-icon" />
          <span>Group Classes</span>
        </div>
      );
    }
    return name;
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Membership Management</h2>
        <div className="search-and-actions">
          <div className="button-group">
            <button 
              onClick={handleEditClick} 
              className={`edit-button ${isEditing ? 'active' : ''}`}
            >
              ✎
            </button>
          </div>
        </div>
        <p className="subtitle">Configure membership plan prices and service rates</p>
      </div>
      
      {isEditing && (
        <div className="edit-mode-banner">
          <span className="edit-icon">✏️</span>
          <span className="edit-text">Edit Mode: Click on any row to edit information.</span>
        </div>
      )}

      {/* Membership Plans Section */}
      <div className="table-section">
        <div className="section-header">
          <h3>Membership Plans</h3>
          <div className="section-description">
            <p>Manage your gym's membership plans and their features</p>
            <small>Changes to prices will apply to new memberships only</small>
          </div>
        </div>
        
        <div className="table-responsive">
          {loading ? (
            <div className="loading-cell">
              <div className="loading-indicator">Loading data...</div>
            </div>
          ) : membershipPlans.length === 0 ? (
            <div className="empty-table-message">
              No membership plans found.
            </div>
          ) : (
            <div className={isEditing ? 'edit-mode-container' : ''}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Price</th>
                    <th>PT Sessions</th>
                    <th>Market Discount (%)</th>
                    {editingPlan && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {membershipPlans.map(plan => (
                    <tr 
                      key={plan.id} 
                      onClick={() => handleSelectPlan(plan)}
                      className={
                        isEditing && !editingPlan
                          ? 'selectable-row' 
                          : ''
                      }
                    >
                      {editingPlan?.id === plan.id ? (
                        // Edit mode using CustomersPanel approach
                        <>
                          <td className="plan-name">{plan.planName}</td>
                          <td>
                            <div className="input-with-icon">
                              <span className="currency-icon">₺</span>
                              <input
                                type="number"
                                step="0.01"
                                className="price-input"
                                value={editingPlan.planPrice}
                                onChange={(e) => setEditingPlan({
                                  ...editingPlan,
                                  planPrice: parseFloat(e.target.value)
                                })}
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="numeric-input"
                              value={editingPlan.monthlyPtSessions}
                              onChange={(e) => setEditingPlan({
                                ...editingPlan,
                                monthlyPtSessions: parseInt(e.target.value, 10)
                              })}
                            />
                          </td>
                          <td>
                            <div className="input-with-icon">
                              <input
                                type="number"
                                className="numeric-input percentage-input"
                                value={editingPlan.marketDiscount}
                                onChange={(e) => setEditingPlan({
                                  ...editingPlan,
                                  marketDiscount: parseInt(e.target.value, 10)
                                })}
                              />
                              <span className="percentage-icon">%</span>
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSavePlan(plan.id, editingPlan);
                                }}
                                className="save-button"
                              >
                                Save
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPlan(null);
                                }}
                                className="cancel-button"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View mode 
                        <>
                          <td className="plan-name">{plan.planName}</td>
                          <td><PriceBadge amount={plan.planPrice} /></td>
                          <td><span className="session-count">{plan.monthlyPtSessions}</span></td>
                          <td><span className="discount-badge">{plan.marketDiscount}%</span></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* General Prices Section */}
      <div className="table-section mt-5">
        <div className="section-header">
          <h3>General Prices</h3>
          <div className="section-description">
            <p>Manage individual service prices for personal training and group classes</p>
            <small>These rates apply to non-membership customers or additional services</small>
          </div>
        </div>
        
        <div className="table-responsive">
          {loading ? (
            <div className="loading-cell">
              <div className="loading-indicator">Loading data...</div>
            </div>
          ) : generalPrices.length === 0 ? (
            <div className="empty-table-message">
              No service prices found.
            </div>
          ) : (
            <div className={isEditing ? 'edit-mode-container' : ''}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Price</th>
                    {editingPrice && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {generalPrices.map(price => (
                    <tr 
                      key={price.id} 
                      onClick={() => handleSelectPrice(price)}
                      className={
                        isEditing && !editingPrice
                          ? 'selectable-row' 
                          : ''
                      }
                    >
                      {editingPrice?.id === price.id ? (
                        // Edit mode using CustomersPanel approach
                        <>
                          <td>{formatServiceName(price.name)}</td>
                          <td>
                            <div className="input-with-icon">
                              <span className="currency-icon">₺</span>
                              <input
                                type="number"
                                step="0.01"
                                className="price-input"
                                value={editingPrice.price}
                                onChange={(e) => setEditingPrice({
                                  ...editingPrice,
                                  price: parseFloat(e.target.value)
                                })}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSavePrice(price.id, editingPrice);
                                }}
                                className="save-button"
                              >
                                Save
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPrice(null);
                                }}
                                className="cancel-button"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View mode 
                        <>
                          <td>{formatServiceName(price.name)}</td>
                          <td><PriceBadge amount={price.price} /></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .panel-container {
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .dark-mode .panel-container {
          background: #2c2c2c;
          color: #f5f6fa;
        }
        
        .panel-header {
          margin-bottom: 2.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        
        .dark-mode .panel-header {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        
        .panel-header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .dark-mode .panel-header h2 {
          color: #f5f6fa;
        }
        
        .subtitle {
          color: #7f8c8d;
          font-size: 1.1rem;
        }
        
        .dark-mode .subtitle {
          color: #bdc3c7;
        }

        .search-and-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 1rem;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .edit-button {
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
          color: #ffffff;
        }

        .edit-button:hover {
          background-color: #e0e0e0;
          transform: translateY(-2px);
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }

        .edit-button.active {
          background-color: #1890ff;
          color: white;
        }

        .edit-mode-banner {
          display: flex;
          align-items: center;
          background-color: #e8f5e9;
          padding: 10px 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .edit-icon {
          margin-right: 10px;
          font-size: 18px;
        }

        .edit-text {
          color: #2e7d32;
        }

        .selectable-row {
          cursor: pointer;
        }

        .selectable-row:hover {
          background-color: #f1f8ff;
        }
        
        .table-section {
          margin-bottom: 3rem;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .dark-mode .table-section {
          background: #222222;
          color: #f5f6fa;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .dark-mode .section-header {
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        
        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }
        
        .dark-mode .section-header h3 {
          color: #ecf0f1;
        }
        
        .section-description {
          text-align: right;
          flex: 1;
          margin-left: 1rem;
        }
        
        .section-description p {
          margin: 0;
          color: #7f8c8d;
          font-size: 1rem;
        }
        
        .section-description small {
          color: #95a5a6;
          font-size: 0.9rem;
          font-style: italic;
        }
        
        .dark-mode .section-description p {
          color: #bdc3c7;
        }
        
        .dark-mode .section-description small {
          color: #95a5a6;
        }
        
        .table-responsive {
          overflow-x: auto;
          margin-top: 1rem;
        }
        
        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        
        .data-table th {
          text-align: left;
          padding: 1rem;
          font-weight: 600;
          color: #34495e;
          border-bottom: 2px solid #eee;
          background-color: #f9f9f9;
        }
        
        .dark-mode .data-table th {
          color: #ecf0f1;
          border-bottom-color: #4b5563;
          background-color: #2c3e50;
        }
        
        .data-table td {
          padding: 1.2rem 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #eee;
        }
        
        .dark-mode .data-table td {
          border-bottom-color: #4b5563;
        }
        
        .data-table tr:last-child td {
          border-bottom: none;
        }
        
        .data-table tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .dark-mode .data-table tr:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
        
        .price-badge {
          display: inline-block;
          padding: 0.45rem 0.7rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .high-price {
          background-color: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        
        .medium-price {
          background-color: rgba(243, 156, 18, 0.1);
          color: #f39c12;
        }
        
        .low-price {
          background-color: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }
        
        .dark-mode .high-price {
          background-color: rgba(231, 76, 60, 0.2);
        }
        
        .dark-mode .medium-price {
          background-color: rgba(243, 156, 18, 0.2);
        }
        
        .dark-mode .low-price {
          background-color: rgba(46, 204, 113, 0.2);
        }
        
        .plan-name {
          font-weight: 600;
          font-size: 1.05rem;
        }
        
        .service-name {
          display: flex;
          align-items: center;
          font-weight: 500;
          font-size: 1.05rem;
        }
        
        .service-icon {
          margin-top: 1.5rem;
          margin-right: 0.5rem;
          color: #ff4757;
          font-size: 1.2rem;
        }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .currency-icon {
          position: absolute;
          left: 12px;
          color: #6c757d;
        }
        
        .percentage-icon {
          position: absolute;
          right: 12px;
          color: #6c757d;
        }
        
        .price-input {
          padding: 8px 12px 8px 28px !important;
          border: 1px solid #ced4da;
          border-radius: 4px;
          width: 150px;
          font-size: 0.95rem;
        }
        
        .percentage-input {
          padding-right: 28px !important;
        }
        
        .numeric-input {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          width: 80px;
          text-align: center;
          font-size: 0.95rem;
        }
        
        .dark-mode .price-input,
        .dark-mode .numeric-input {
          background-color: #333;
          color: #fff;
          border-color: #555;
        }
        
        .empty-table-message {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #6c757d;
          font-style: italic;
          font-size: 1.05rem;
        }
        
        .loading-cell {
          text-align: center;
        }
        
        .loading-indicator {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
          font-weight: 500;
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        .session-count {
          display: inline-block;
          min-width: 40px;
          text-align: center;
          padding: 0.45rem 0.7rem;
          background-color: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .discount-badge {
          display: inline-block;
          min-width: 40px;
          text-align: center;
          padding: 0.45rem 0.7rem;
          background-color: rgba(155, 89, 182, 0.1);
          color: #9b59b6;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .dark-mode .session-count {
          background-color: rgba(52, 152, 219, 0.2);
        }
        
        .dark-mode .discount-badge {
          background-color: rgba(155, 89, 182, 0.2);
        }
        
        .mt-5 {
          margin-top: 2.5rem;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .save-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          background-color: #2ecc71;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .save-button:hover {
          background-color: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
        
        .cancel-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .cancel-button:hover {
          background-color:rgb(167, 52, 39) !important;
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MembershipPanel; 