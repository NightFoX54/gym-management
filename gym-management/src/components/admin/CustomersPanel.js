import React, { useState } from 'react';
import '../../styles/AdminPanels.css';
import { DeleteOutlined } from '@ant-design/icons';
import { FaCrown, FaGem, FaAward } from 'react-icons/fa';

const CustomersPanel = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Nurettin Enes',
      surname: 'Karakulak',
      hasMembership: true,
      membershipExpiry: '2024-06-15',
      planType: 'Premium Plan',
      email: 'nurettin.enes@example.com',
      phone: '+90 555 123 4567'
    },
    {
      id: 2,
      name: 'Berkay Mustafa',
      surname: 'Arıkan',
      hasMembership: true,
      membershipExpiry: '2024-05-20',
      planType: 'Basic Plan',
      email: 'berkay.mustafa@example.com',
      phone: '+90 555 234 5678'
    },
    {
      id: 3,
      name: 'Meriç',
      surname: 'Ütkü',
      hasMembership: false,
      membershipExpiry: null,
      planType: null,
      email: 'meric.utku@example.com',
      phone: '+90 555 345 6789'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    surname: '',
    hasMembership: false,
    membershipExpiry: '',
    planType: '',
    email: '',
    phone: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Plan seçenekleri
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

  const handleAddCustomer = (e) => {
    e.preventDefault();
    setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
    setShowAddForm(false);
    setNewCustomer({ 
      name: '', 
      surname: '', 
      hasMembership: false, 
      membershipExpiry: '',
      planType: '',
      email: '',
      phone: ''
    });
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
    // If customer has active membership but no plan type, don't allow the save
    if (updatedData.hasMembership && !updatedData.planType) {
      alert("Please select a plan type for customers with active membership.");
      return;
    }
    
    // If customer has active membership but no expiry date, don't allow the save
    if (updatedData.hasMembership && !updatedData.membershipExpiry) {
      alert("Please set an expiry date for customers with active membership.");
      return;
    }
    
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updatedData } : customer
    ));
    setEditingCustomer(null);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
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
            <button onClick={() => setShowAddForm(true)} className="add-button">
              Add Customer
            </button>
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
              <th>Name</th>
              <th>Surname</th>
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
                className={
                  isEditing && !editingCustomer 
                    ? 'selectable-row' 
                    : isDeleting 
                      ? 'deletable-row' 
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
                          name: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingCustomer.surname}
                        onChange={(e) => setEditingCustomer({
                          ...editingCustomer,
                          surname: e.target.value
                        })}
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
                      />
                    </td>
                    <td>
                      <select
                        value={editingCustomer.hasMembership}
                        onChange={(e) => {
                          const isActive = e.target.value === 'true';
                          
                          // If membership is being activated, set defaults
                          if (isActive) {
                            // Default plan if none selected
                            const planType = editingCustomer.planType || planOptions[0];
                            
                            // Default expiry date (30 days from now) if none set
                            let expiryDate = editingCustomer.membershipExpiry;
                            if (!expiryDate) {
                              const today = new Date();
                              const thirtyDaysLater = new Date(today);
                              thirtyDaysLater.setDate(today.getDate() + 30);
                              expiryDate = thirtyDaysLater.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                            }
                            
                            setEditingCustomer({
                              ...editingCustomer,
                              hasMembership: isActive,
                              planType: planType,
                              membershipExpiry: expiryDate
                            });
                          } else {
                            setEditingCustomer({
                              ...editingCustomer,
                              hasMembership: isActive
                            });
                          }
                        }}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={editingCustomer.planType || ''}
                        onChange={(e) => setEditingCustomer({
                          ...editingCustomer,
                          planType: e.target.value
                        })}
                        disabled={!editingCustomer.hasMembership}
                      >
                        {editingCustomer.hasMembership ? (
                          <>
                            {!editingCustomer.planType && 
                              <option value="" disabled>Select a Plan</option>
                            }
                            {planOptions.map(plan => (
                              <option key={plan} value={plan}>
                                {plan}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option value="">Select a Plan</option>
                        )}
                      </select>
                    </td>
                    <td>
                      <div className="edit-actions">
                        <input
                          type="date"
                          value={editingCustomer.membershipExpiry || ''}
                          onChange={(e) => setEditingCustomer({
                            ...editingCustomer,
                            membershipExpiry: e.target.value
                          })}
                          disabled={!editingCustomer.hasMembership}
                          style={{
                            borderColor: editingCustomer.hasMembership && !editingCustomer.membershipExpiry ? '#e74c3c' : '',
                            boxShadow: editingCustomer.hasMembership && !editingCustomer.membershipExpiry ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : ''
                          }}
                        />
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
                  </>
                )}
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
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="customer-name">Name</label>
                  <input
                    id="customer-name"
                    type="text"
                    placeholder="Enter first name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="customer-surname">Surname</label>
                  <input
                    id="customer-surname"
                    type="text"
                    placeholder="Enter last name"
                    value={newCustomer.surname}
                    onChange={(e) => setNewCustomer({...newCustomer, surname: e.target.value})}
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
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({
                      ...newCustomer, 
                      phone: validatePhoneInput(e.target.value, newCustomer.phone)
                    })}
                    required
                  />
                  <small className="input-hint">Only numbers and a plus sign at the beginning are allowed</small>
                </div>

                <div className="form-grid-full">
                  <div className="form-section">
                    <h4>Membership Details</h4>
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
                    
                    {newCustomer.hasMembership && (
                      <div className="form-grid">
                        <div className="input-group">
                          <label htmlFor="plan-type">Membership Plan</label>
                          <select
                            id="plan-type"
                            value={newCustomer.planType}
                            onChange={(e) => setNewCustomer({...newCustomer, planType: e.target.value})}
                            required
                          >
                            <option value="">Select a Plan</option>
                            {planOptions.map(plan => (
                              <option key={plan} value={plan}>
                                {plan}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="input-group">
                          <label htmlFor="expiry-date">Expiry Date</label>
                          <input
                            id="expiry-date"
                            type="date"
                            value={newCustomer.membershipExpiry}
                            onChange={(e) => setNewCustomer({...newCustomer, membershipExpiry: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    )}
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