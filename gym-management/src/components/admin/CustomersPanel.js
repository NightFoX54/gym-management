import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { FaCrown, FaGem, FaAward } from 'react-icons/fa';
import { Button, message, Modal } from 'antd';
import axios from 'axios';

const CustomersPanel = () => {
  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Plan options and related functions from original code
  const planOptions = ['Basic Plan', 'Premium Plan', 'Elite Plan'];

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

  // Validation functions
  const validateNameInput = (newValue, previousValue) => {
    // Allow letters and Turkish characters, block numbers and special chars
    const regex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/;
    return regex.test(newValue) ? newValue : previousValue;
  };

  // Format name with first letter of each word capitalized
  const formatName = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Enhanced phone number validation and formatting
  const validatePhoneInput = (value, previousValue) => {
    // If empty, return empty
    if (!value) return '';
    
    // Allow only + at the beginning and numbers
    const regex = /^(\+)?[0-9\s]*$/;
    
    if (!regex.test(value)) {
      return previousValue;
    }
    
    // Format: +XX XXX XXX XX XX or 0XXX XXX XX XX
    let formatted = value.replace(/\s/g, ''); // Remove all spaces
    
    if (formatted.startsWith('+')) {
      // International format
      if (formatted.length > 13) {
        formatted = formatted.slice(0, 13);
      }
      // Add spaces for international format
      if (formatted.length > 3) formatted = formatted.slice(0, 3) + ' ' + formatted.slice(3);
      if (formatted.length > 7) formatted = formatted.slice(0, 7) + ' ' + formatted.slice(7);
      if (formatted.length > 11) formatted = formatted.slice(0, 11) + ' ' + formatted.slice(11);
    } else {
      // Local format
      if (formatted.length > 11) {
        formatted = formatted.slice(0, 11);
      }
      // Add spaces for local format
      if (formatted.length > 4) formatted = formatted.slice(0, 4) + ' ' + formatted.slice(4);
      if (formatted.length > 8) formatted = formatted.slice(0, 8) + ' ' + formatted.slice(8);
    }
    
    return formatted;
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch users with role MEMBER
      const response = await axios.get('http://localhost:8080/api/users/role/member');
      
      // Process the response data to match our component's structure
      const customersData = await Promise.all(response.data.map(async (user) => {
        // For each user, fetch their membership details
        let membershipData = { hasMembership: false };
        try {
          const membershipResponse = await axios.get(`http://localhost:8080/api/members/${user.id}/membership`);
          if (membershipResponse.status === 200) {
            membershipData = {
              hasMembership: true,
              membershipExpiry: membershipResponse.data.endDate,
              planType: membershipResponse.data.planName,
              isFrozen: membershipResponse.data.isFrozen
            };
          }
        } catch (error) {
          // If no membership found, leave as default values
          console.log(`No membership found for user ${user.id}`);
        }

        return {
          id: user.id,
          name: user.firstName,
          surname: user.lastName,
          email: user.email,
          phone: user.phoneNumber,
          ...membershipData
        };
      }));

      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      message.error('Failed to load customers data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditingCustomer(null);
  };

  const handleSelectCustomer = (customer) => {
    if (isEditing && !editingCustomer) {
      setEditingCustomer({...customer});
    }
  };

  const handleSaveEdit = async (id, updatedData) => {
    // Validate all fields before saving
    if (!validateNameInput(updatedData.name, '') || !validateNameInput(updatedData.surname, '')) {
      return message.error('Name and surname should contain only letters');
    }
    
    if (!validateEmail(updatedData.email)) {
      return message.error('Please enter a valid email address');
    }
    
    try {
      // Check if email or phone is already in use by another user
      // Skip this check if email/phone hasn't changed from the original
      const originalCustomer = customers.find(c => c.id === id);
      
      if (updatedData.email !== originalCustomer.email || updatedData.phone !== originalCustomer.phone) {
        const validateResponse = await axios.post('http://localhost:8080/api/auth/validate-credentials', {
          email: updatedData.email,
          phoneNumber: updatedData.phone,
          userId: id
        });
        
        // If the email exists and belongs to another user
        if (updatedData.email !== originalCustomer.email) {
          console.log("Updated email:", updatedData.email);
          console.log("Original email:", originalCustomer.email);
          if (validateResponse.data.emailExists) {
            message.error('This email is already in use by another user');
            return;
          }
        }
        
        // If the phone number exists and belongs to another user
        if (updatedData.phone !== originalCustomer.phone) {
          console.log("Updated phone:", updatedData.phone);
          console.log("Original phone:", originalCustomer.phone);
          if (validateResponse.data.phoneExists) {
            message.error('This phone number is already in use by another user');
            return;
          }
        }
      }

      // Format name and surname properly before saving
      const formattedData = {
        ...updatedData,
        name: formatName(updatedData.name),
        surname: formatName(updatedData.surname),
      };

      // Call the API to update customer information
      await axios.put(`http://localhost:8080/api/members/${id}/update`, {
        firstName: formattedData.name,
        lastName: formattedData.surname,
        email: formattedData.email,
        phoneNumber: formattedData.phone
      });

      // Update the local state with formatted data
      setCustomers(customers.map(customer => 
        customer.id === id ? { ...customer, ...formattedData } : customer
      ));

      message.success('Customer information updated successfully');
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error updating customer:', error);
      message.error('Failed to update customer information');
    }
  };

  const showResetPasswordModal = (customerId, e) => {
    if (e) e.stopPropagation();
    setSelectedCustomerId(customerId);
    setResetPasswordModalVisible(true);
  };

  const handleResetPassword = async () => {
    try {
      // Call the API to reset the password
      await axios.post(`http://localhost:8080/api/members/${selectedCustomerId}/reset-password`);
      message.success('Password has been reset to "member123"');
      setResetPasswordModalVisible(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Failed to reset password');
    }
  };

  const handleModalClose = () => {
    setResetPasswordModalVisible(false);
  };

  const StatusBadge = ({ isActive }) => (
    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.name} ${customer.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()));
  });

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
              onClick={handleEditClick} 
              className={`edit-button ${isEditing ? 'active' : ''}`}
            >
              ✎
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-mode-banner">
          <span className="edit-icon">✏️</span>
          <span className="edit-text">Edit Mode: Click on any customer row to edit their information.</span>
        </div>
      )}

      {loading ? (
        <div className="loading-message">Loading customers data...</div>
      ) : (
        <div className={isEditing ? 'edit-mode-container' : ''}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Membership Status</th>
                <th>Plan Type</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table-message">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => handleSelectCustomer(customer)}
                    className={
                      isEditing && !editingCustomer
                        ? 'selectable-row' 
                        : ''
                    }
                  >
                    {editingCustomer?.id === customer.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({
                              ...editingCustomer,
                              name: validateNameInput(e.target.value, editingCustomer.name)
                            })}
                            placeholder="First name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingCustomer.surname}
                            onChange={(e) => setEditingCustomer({
                              ...editingCustomer,
                              surname: validateNameInput(e.target.value, editingCustomer.surname)
                            })}
                            placeholder="Last name"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            value={editingCustomer.email}
                            onChange={(e) => setEditingCustomer({
                              ...editingCustomer,
                              email: e.target.value
                            })}
                            className={editingCustomer.email && !validateEmail(editingCustomer.email) ? 'invalid-input' : ''}
                            placeholder="email@example.com"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingCustomer.phone}
                            onChange={(e) => setEditingCustomer({
                              ...editingCustomer,
                              phone: validatePhoneInput(e.target.value, editingCustomer.phone)
                            })}
                            placeholder="+90 XXX XXX XX XX"
                          />
                        </td>
                        <td>
                          <StatusBadge isActive={customer.hasMembership} />
                        </td>
                        <td>
                          {getPlanIcon(customer.planType)}
                          {customer.planType || 'N/A'}
                        </td>
                        <td>{customer.membershipExpiry || 'N/A'}</td>
                        <td>
                          <Button
                            icon={<LockOutlined />}
                            onClick={(e) => showResetPasswordModal(customer.id, e)}
                            className="reset-password-button"
                          >
                            Reset Password
                          </Button>
                          <div className="action-buttons">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(customer.id, editingCustomer);
                              }}
                              className="save-button"
                            >
                              Save
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCustomer(null);
                              }}
                              className="cancel-button"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{customer.name}</td>
                        <td>{customer.surname}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <StatusBadge isActive={customer.hasMembership} />
                        </td>
                        <td>
                          {getPlanIcon(customer.planType)}
                          {customer.planType || 'N/A'}
                        </td>
                        <td>{customer.membershipExpiry || 'N/A'}</td>
                        <td>
                          <Button
                            icon={<LockOutlined />}
                            onClick={(e) => showResetPasswordModal(customer.id, e)}
                            className="reset-password-button"
                          >
                            Reset Password
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Password Reset Confirmation Modal */}
      {resetPasswordModalVisible && (
        <div className="custom-modal-overlay" onClick={handleModalClose}>
          <div className="custom-modal password-reset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h3>Reset Password Confirmation</h3>
              <button className="close-button" onClick={handleModalClose}>×</button>
            </div>
            <div className="custom-modal-body">
              <div className="warning-icon-container">
                <LockOutlined className="warning-icon" />
              </div>
              <div className="warning-message">
                <strong>Warning:</strong> You are about to reset this customer's password.
              </div>
              <p>The customer will need to use this new password for their next login.</p>
              <p>New password:</p>
              <div className="new-password-box">
                member123
              </div>
              <p>Are you sure you want to proceed with the password reset?</p>
            </div>
            <div className="custom-modal-footer">
              <button className="cancel-button" onClick={handleModalClose}>Cancel</button>
              <button className="confirm-button" onClick={handleResetPassword}>Reset Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPanel; 