import React, { useState } from 'react';
import '../../styles/AdminPanels.css';

const CustomersPanel = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      hasMembership: true,
      membershipExpiry: '2024-06-15'
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Smith',
      hasMembership: true,
      membershipExpiry: '2024-05-20'
    },
    {
      id: 3,
      name: 'Mike',
      surname: 'Johnson',
      hasMembership: false,
      membershipExpiry: null
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    surname: '',
    hasMembership: false,
    membershipExpiry: ''
  });

  const handleAddCustomer = (e) => {
    e.preventDefault();
    setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
    setShowAddForm(false);
    setNewCustomer({ name: '', surname: '', hasMembership: false, membershipExpiry: '' });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
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

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Customers</h2>
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

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Membership Status</th>
            <th>Expiry Date</th>
            {isEditing && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
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
                    <input
                      type="date"
                      value={editingCustomer.membershipExpiry || ''}
                      onChange={(e) => setEditingCustomer({
                        ...editingCustomer,
                        membershipExpiry: e.target.value
                      })}
                      disabled={!editingCustomer.hasMembership}
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleSaveEdit(customer.id, editingCustomer)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingCustomer(null)}
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
                  <td>
                    <StatusBadge isActive={customer.hasMembership} />
                  </td>
                  <td>{customer.membershipExpiry || 'N/A'}</td>
                  {isEditing && (
                    <td>
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="edit-row-button"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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
                <input
                  type="date"
                  value={newCustomer.membershipExpiry}
                  onChange={(e) => setNewCustomer({...newCustomer, membershipExpiry: e.target.value})}
                  required
                />
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