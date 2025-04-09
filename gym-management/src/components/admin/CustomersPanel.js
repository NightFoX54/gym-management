import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import '../../styles/AdminPanels.css';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FaCrown, FaGem, FaAward } from 'react-icons/fa';
import { Button } from 'antd';

const CustomersPanel = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    hasMembership: false,
    planId: null,
    durationMonths: 1,
    startDate: new Date().toISOString().split('T')[0],
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Plan seçenekleri
  const planOptions = ['Basic Plan', 'Premium Plan', 'Elite Plan'];

  // Plan ID mapping (to convert from plan name to ID)
  const planIdMap = {
    'Basic Plan': 1,
    'Premium Plan': 2,
    'Elite Plan': 3
  };

  // Get plan icon based on plan type
  const getPlanIcon = (planType) => {
    if (!planType) return null;
    
    switch(planType) {
      case 'Premium Plan':
        return <FaCrown style={{ color: '#ffc107', marginRight: '6px' }} />;
      case 'Basic Plan':
        return <FaGem style={{ color: '#6c757d', marginRight: '6px' }} />;
      case 'Elite Plan':
        return <FaAward style={{ color: '#00b4d8', marginRight: '6px' }} />;
      default:
        return null;
    }
  };

  // Phone number validation function
  const validatePhoneInput = (value, previousValue) => {
    // If empty, return empty
    if (!value) return '';
    
    // Allow only + at the beginning and numbers
    const regex = /^(\+)?[0-9\s]*$/;
    
    if (!regex.test(value)) {
      return previousValue;
    }
    
    return value;
  };

  // Card number formatter - adds spaces after every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Expiry date formatter - enforces MM/YY format
  const formatExpiryDate = (value) => {
    // Remove non-digits and slashes
    const cleaned = value.replace(/[^\d/]/g, '');
    
    if (cleaned.length <= 2) {
      return cleaned;
    }
    
    // Apply format MM/YY
    if (cleaned.includes('/')) {
      const [month, year] = cleaned.split('/');
      return `${month.slice(0, 2)}/${year.slice(0, 2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
  };

  // Validate month (1-12)
  const validateMonth = (month) => {
    const num = parseInt(month, 10);
    return num > 0 && num <= 12;
  };

  // Fetch customers from backend on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the correct API endpoint
        const response = await axios.get('http://localhost:8080/api/users/customers');
        setCustomers(response.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError('Failed to load customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array means this runs once on mount

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // If membership is not active, set related fields to null
      const dataToSend = {...newCustomer};
      if (!dataToSend.hasMembership) {
        dataToSend.planId = null;
        dataToSend.durationMonths = null;
        dataToSend.startDate = null;
      }
      
      // Make API call to register user
      const response = await axios.post('http://localhost:8080/api/auth/signup', dataToSend);
      
      if (response.data.success) {
        // If successful, add to local state (or just refetch)
        // Fetch customers to refresh the list
        const refreshResponse = await axios.get('http://localhost:8080/api/users/customers');
        setCustomers(refreshResponse.data);
        
        // Show success message
        alert(`Customer ${newCustomer.firstName} ${newCustomer.lastName} added successfully!`);
        setShowAddForm(false);
        
        // Reset form with hasMembership
        setNewCustomer({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          hasMembership: false,
          planId: null,
          durationMonths: 1,
          startDate: new Date().toISOString().split('T')[0],
          cardHolderName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: ''
        });
      } else {
        // Handle error from API (e.g., email already exists)
        alert(`Error: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      alert(`Failed to add customer. ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setIsDeleting(false);
    setEditingCustomer(null);
  };

  const handleDeleteClick = () => {
    setIsDeleting(!isDeleting);
    setIsEditing(false);
    setEditingCustomer(null);
    setCustomerToDelete(null);
  };

  const handleSelectCustomer = (customer) => {
    if (isEditing && !editingCustomer) {
      setEditingCustomer({...customer});
    } else if (isDeleting) {
      setCustomerToDelete(customer);
      setShowConfirmDialog(true);
    }
  };

  const handleSaveEdit = (id, updatedData) => {
    // TODO: Add API call to backend to update customer
    console.warn("Edit customer functionality needs backend integration.");
    // Temporarily update local state
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updatedData } : customer
    ));
    setEditingCustomer(null);
  };

  const handleDeleteConfirm = () => {
    // TODO: Add API call to backend to delete customer
    console.warn("Delete customer functionality needs backend integration.");
    if (customerToDelete) {
      // Temporarily remove from local state
      setCustomers(customers.filter(customer => customer.id !== customerToDelete.id));
      setCustomerToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setCustomerToDelete(null);
    setShowConfirmDialog(false);
  };

  const StatusBadge = ({ isActive }) => (
    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    // Use firstName and lastName from CustomerDTO
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Display loading or error message
  if (loading) {
    return <div className="panel-container loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="panel-container error">Error: {error}</div>;
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Customers</h2>
        <div className="search-and-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="button-group">
            <button 
              onClick={handleDeleteClick} 
              className={`delete-button ${isDeleting ? 'active' : ''}`}
            >
              <DeleteOutlined />
            </button>
            <button 
              onClick={handleEditClick} 
              className={`edit-button ${isEditing ? 'active' : ''}`}
            >
              ✎
            </button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddForm(true)}
              className="ant-btn-primary"
            >
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-mode-banner">
          <span className="edit-icon">✏️</span>
          <span className="edit-text">Edit Mode: Click on any customer row to edit their information.</span>
        </div>
      )}

      {isDeleting && (
        <div className="delete-mode-banner">
          <span className="delete-icon">🗑️</span>
          <span className="delete-text">Delete Mode: Click on any customer row to delete them.</span>
        </div>
      )}

      <div className={
        isEditing 
          ? 'edit-mode-container' 
          : isDeleting 
            ? 'delete-mode-container' 
            : ''
      }>
        <table className="data-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership Status</th>
              <th>Plan Type</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                onClick={() => handleSelectCustomer(customer)}
                className={`${isEditing && !editingCustomer ? 'editable-row' : ''} ${isDeleting ? 'deletable-row' : ''}`}
              >
                <td>{isEditing && editingCustomer?.id === customer.id ? <input type="text" value={editingCustomer.firstName} onChange={(e) => setEditingCustomer({...editingCustomer, firstName: e.target.value})} /> : customer.firstName}</td>
                <td>{isEditing && editingCustomer?.id === customer.id ? <input type="text" value={editingCustomer.lastName} onChange={(e) => setEditingCustomer({...editingCustomer, lastName: e.target.value})} /> : customer.lastName}</td>
                <td>{isEditing && editingCustomer?.id === customer.id ? <input type="email" value={editingCustomer.email} onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})} /> : customer.email}</td>
                <td>{isEditing && editingCustomer?.id === customer.id ? <input type="text" value={editingCustomer.phoneNumber || ''} onChange={(e) => setEditingCustomer({...editingCustomer, phoneNumber: validatePhoneInput(e.target.value, editingCustomer.phoneNumber)})} /> : customer.phoneNumber}</td>
                <td><StatusBadge isActive={customer.isMembershipActive} /></td>
                <td>
                  {getPlanIcon(customer.membershipPlanName)}
                  {customer.membershipPlanName || 'N/A'}
                </td>
                <td>{customer.membershipEndDate ? format(new Date(customer.membershipEndDate), 'yyyy-MM-dd') : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="form-section">
                <h4>Personal Information</h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="customer-firstName">First Name</label>
                    <input
                      id="customer-firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="customer-lastName">Last Name</label>
                    <input
                      id="customer-lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="customer-email">Email</label>
                    <input
                      id="customer-email"
                      type="email"
                      placeholder="example@domain.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="customer-phone">Phone Number</label>
                    <input
                      id="customer-phone"
                      type="text"
                      placeholder="+90 555 123 4567"
                      value={newCustomer.phoneNumber}
                      onChange={(e) => setNewCustomer({
                        ...newCustomer, 
                        phoneNumber: validatePhoneInput(e.target.value, newCustomer.phoneNumber)
                      })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="customer-password">Password</label>
                    <input
                      id="customer-password"
                      type="password"
                      placeholder="Enter password"
                      value={newCustomer.password}
                      onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h4>Membership Details</h4>
                <div className="form-grid-full">
                  <div className="checkbox-group">
                    <label className="custom-checkbox">
                      <input
                        id="has-membership"
                        type="checkbox"
                        checked={newCustomer.hasMembership}
                        onChange={(e) => setNewCustomer({...newCustomer, hasMembership: e.target.checked})}
                      />
                      <span className="checkmark"></span>
                      <span className="custom-checkbox-label">Active Membership</span>
                    </label>
                  </div>
                </div>
                
                {newCustomer.hasMembership && (
                  <div className="form-grid">
                    <div className="input-group">
                      <label htmlFor="membership-plan">Membership Plan</label>
                      <select
                        id="membership-plan"
                        value={newCustomer.planId || ''}
                        onChange={(e) => {
                          const planId = e.target.value ? parseInt(e.target.value) : null;
                          setNewCustomer({...newCustomer, planId: planId})
                        }}
                        required={newCustomer.hasMembership}
                      >
                        <option value="">Select a Plan</option>
                        <option value="1">Basic Plan</option>
                        <option value="2">Premium Plan</option>
                        <option value="3">Elite Plan</option>
                      </select>
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="membership-duration">Duration (Months)</label>
                      <select
                        id="membership-duration"
                        value={newCustomer.durationMonths}
                        onChange={(e) => setNewCustomer({...newCustomer, durationMonths: parseInt(e.target.value)})}
                        required={newCustomer.hasMembership}
                      >
                        <option value="1">1 Month</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                      </select>
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="membership-start">Start Date</label>
                      <input
                        id="membership-start"
                        type="date"
                        value={newCustomer.startDate}
                        onChange={(e) => setNewCustomer({...newCustomer, startDate: e.target.value})}
                        required={newCustomer.hasMembership}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="form-section">
                <h4>Payment Information</h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="card-holder">Card Holder Name</label>
                    <input
                      id="card-holder"
                      type="text"
                      placeholder="Name on card"
                      value={newCustomer.cardHolderName}
                      onChange={(e) => setNewCustomer({...newCustomer, cardHolderName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="card-number">Card Number</label>
                    <input
                      id="card-number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={newCustomer.cardNumber}
                      onChange={(e) => {
                        const formattedValue = formatCardNumber(e.target.value);
                        setNewCustomer({...newCustomer, cardNumber: formattedValue})
                      }}
                      maxLength="19" // 16 digits + 3 spaces
                      required
                    />
                    <small className="input-hint">16 digits, spaces will be added automatically</small>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="card-expiry">Expiry Date (MM/YY)</label>
                    <input
                      id="card-expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={newCustomer.expiryDate}
                      onChange={(e) => {
                        // Auto-format to MM/YY
                        const rawValue = e.target.value;
                        
                        // If backspace was pressed, just trim the value
                        if (rawValue.length < newCustomer.expiryDate.length) {
                          setNewCustomer({...newCustomer, expiryDate: rawValue});
                          return;
                        }
                        
                        // Apply formatting
                        let formattedValue = rawValue.replace(/[^\d/]/g, '');
                        
                        // Insert slash after month if not exists
                        if (formattedValue.length === 2 && !formattedValue.includes('/')) {
                          formattedValue += '/';
                        } else if (formattedValue.length > 2) {
                          // Ensure format is MM/YY even if user types without slash
                          if (!formattedValue.includes('/')) {
                            formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2)}`;
                          }
                          
                          // Split and validate parts
                          const [month, year] = formattedValue.split('/');
                          
                          // Ensure month is valid (1-12)
                          if (month.length === 2 && !validateMonth(month)) {
                            return; // Don't update if invalid month
                          }
                          
                          // Restrict to MM/YY format
                          formattedValue = `${month.slice(0, 2)}/${year ? year.slice(0, 2) : ''}`;
                        }
                        
                        setNewCustomer({...newCustomer, expiryDate: formattedValue});
                      }}
                      maxLength="5" // MM/YY = 5 chars
                      required
                    />
                    <small className="input-hint">Format: MM/YY (e.g., 12/25)</small>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="card-cvv">CVV</label>
                    <input
                      id="card-cvv"
                      type="text"
                      placeholder="123"
                      value={newCustomer.cvv}
                      onChange={(e) => {
                        // Only allow 3 digits
                        const cvv = e.target.value.replace(/\D/g, '').substring(0, 3);
                        setNewCustomer({...newCustomer, cvv: cvv ? parseInt(cvv) : ''});
                      }}
                      maxLength="3"
                      required
                      inputMode="numeric" // Opens numeric keyboard on mobile
                      pattern="[0-9]{3}" // HTML5 validation for 3 digits
                    />
                    <small className="input-hint">3 digits from the back of your card</small>
                  </div>
                </div>
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-button">Cancel</button>
                <button type="submit" className="add-button">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <div className="confirmation-content">
              <div className="warning-icon">⚠️</div>
              <p>Are you sure you want to delete the customer:</p>
              <div className="highlighted-name">{customerToDelete?.name} {customerToDelete?.surname}</div>
              <p className="warning-text">This action cannot be undone!</p>
            </div>
            <div className="modal-buttons">
              <button onClick={handleDeleteCancel} className="cancel-button">Cancel</button>
              <button onClick={handleDeleteConfirm} className="delete-confirm-button">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPanel; 