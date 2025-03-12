import React, { useState } from 'react';
import '../../styles/AdminPanels.css';

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
    setEditingCustomer(null);
  };

  const handleSelectCustomer = (customer) => {
    if (isEditing && !editingCustomer) {
      setEditingCustomer({...customer});
    }
  };

  const handleSaveEdit = (id, updatedData) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updatedData } : customer
    ));
    setEditingCustomer(null);
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
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                onClick={() => handleSelectCustomer(customer)}
                className={isEditing && !editingCustomer ? 'selectable-row' : ''}
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
                          phone: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <select
                        value={editingCustomer.hasMembership}
                        onChange={(e) => setEditingCustomer({
                          ...editingCustomer,
                          hasMembership: e.target.value === 'true'
                        })}
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
                        <option value="">Select a Plan</option>
                        {planOptions.map(plan => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
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
                    <td>{customer.planType || 'N/A'}</td>
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
              <input
                type="text"
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Surname"
                value={newCustomer.surname}
                onChange={(e) => setNewCustomer({...newCustomer, surname: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                required
              />
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newCustomer.hasMembership}
                    onChange={(e) => setNewCustomer({...newCustomer, hasMembership: e.target.checked})}
                  />
                  Has Membership
                </label>
              </div>
              {newCustomer.hasMembership && (
                <>
                  <div className="form-group">
                    <label>Plan Type</label>
                    <select
                      value={newCustomer.planType}
                      onChange={(e) => setNewCustomer({...newCustomer, planType: e.target.value})}
                      required
                    >
                      <option value="">Select a Plan</option>
                      {planOptions.map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={newCustomer.membershipExpiry}
                      onChange={(e) => setNewCustomer({...newCustomer, membershipExpiry: e.target.value})}
                      required
                    />
                  </div>
                </>
              )}
              <div className="modal-buttons">
                <button type="submit" className="add-button">Add</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPanel; 