import React, { useState } from 'react';
import '../../styles/AdminPanels.css';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const EmployeesPanel = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Enes',
      surname: 'Oy',
      email: 'enes.oy@example.com',
      phone: '+90 555 987 6543',
      salary: 32000,
      hoursPerWeek: 40,
      shiftSchedule: '/s1.jpg'
    },
    {
      id: 2,
      name: 'Arif',
      surname: 'Işık',
      email: 'arif.isik@example.com',
      phone: '+90 555 876 5432',
      salary: 28000,
      hoursPerWeek: 38,
      shiftSchedule: '/s2.jpg'
    },
    {
      id: 3,
      name: 'Aziz',
      surname: 'Vefa',
      email: 'aziz.vefa@example.com',
      phone: '+90 555 765 4321',
      salary: 35000,
      hoursPerWeek: 42,
      shiftSchedule: '/s3.jpg'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    salary: '',
    hoursPerWeek: '',
    shiftSchedule: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
    setShowAddForm(false);
    setNewEmployee({ 
      name: '', 
      surname: '', 
      email: '', 
      phone: '', 
      salary: '', 
      hoursPerWeek: '', 
      shiftSchedule: '' 
    });
  };

  const handleShowShift = (shiftSchedule) => {
    setSelectedShift(shiftSchedule);
    setShowShiftModal(true);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setIsDeleting(false);
    setEditingEmployee(null);
  };

  const handleDeleteClick = () => {
    setIsDeleting(!isDeleting);
    setIsEditing(false);
    setEditingEmployee(null);
    setEmployeeToDelete(null);
  };

  const handleSelectEmployee = (employee) => {
    if (isEditing && !editingEmployee) {
      setEditingEmployee({...employee});
    } else if (isDeleting) {
      setEmployeeToDelete(employee);
      setShowConfirmDialog(true);
    }
  };

  const handleSaveEdit = (id, updatedData) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, ...updatedData } : employee
    ));
    setEditingEmployee(null);
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter(employee => employee.id !== employeeToDelete.id));
      setEmployeeToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setEmployeeToDelete(null);
    setShowConfirmDialog(false);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.name} ${employee.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Prevent row click when clicking the shift button
  const handleShiftButtonClick = (e, shiftSchedule) => {
    e.stopPropagation();
    handleShowShift(shiftSchedule);
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Employees</h2>
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
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-mode-banner">
          <span className="edit-icon">✏️</span>
          <span className="edit-text">Edit Mode: Click on any employee row to edit their information.</span>
        </div>
      )}

      {isDeleting && (
        <div className="delete-mode-banner">
          <span className="delete-icon">🗑️</span>
          <span className="delete-text">Delete Mode: Click on any employee row to delete them.</span>
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
              <th>Salary (₺)</th>
              <th>Hours/Week</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr 
                key={employee.id} 
                onClick={() => handleSelectEmployee(employee)}
                className={
                  isEditing && !editingEmployee 
                    ? 'selectable-row' 
                    : isDeleting 
                      ? 'deletable-row' 
                      : ''
                }
              >
                {editingEmployee?.id === employee.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editingEmployee.name}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          name: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingEmployee.surname}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          surname: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={editingEmployee.email}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          email: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingEmployee.phone}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          phone: validatePhoneInput(e.target.value, editingEmployee.phone)
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editingEmployee.salary}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          salary: Number(e.target.value)
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editingEmployee.hoursPerWeek}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          hoursPerWeek: Number(e.target.value)
                        })}
                      />
                    </td>
                    <td>
                      <div className="edit-actions">
                        <input
                          type="text"
                          placeholder="Shift Schedule URL"
                          value={editingEmployee.shiftSchedule}
                          onChange={(e) => setEditingEmployee({
                            ...editingEmployee,
                            shiftSchedule: e.target.value
                          })}
                        />
                        <div className="action-buttons">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEdit(employee.id, editingEmployee);
                            }}
                            className="save-button"
                          >
                            Save
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEmployee(null);
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
                    <td>{employee.name}</td>
                    <td>{employee.surname}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>₺{employee.salary.toLocaleString()}</td>
                    <td>{employee.hoursPerWeek}h</td>
                    <td>
                      <button 
                        onClick={(e) => handleShiftButtonClick(e, employee.shiftSchedule)}
                        className="shift-button"
                      >
                        View Shift
                      </button>
                    </td>
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
            <h3>Add New Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="employee-name">Name</label>
                  <input
                    id="employee-name"
                    type="text"
                    placeholder="Enter first name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="employee-surname">Surname</label>
                  <input
                    id="employee-surname"
                    type="text"
                    placeholder="Enter last name"
                    value={newEmployee.surname}
                    onChange={(e) => setNewEmployee({...newEmployee, surname: e.target.value})}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="employee-email">Email</label>
                  <input
                    id="employee-email"
                    type="email"
                    placeholder="example@domain.com"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="employee-phone">Phone Number</label>
                  <input
                    id="employee-phone"
                    type="text"
                    placeholder="+90 555 123 4567"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({
                      ...newEmployee, 
                      phone: validatePhoneInput(e.target.value, newEmployee.phone)
                    })}
                    required
                  />
                  <small className="input-hint">Only numbers and a plus sign at the beginning are allowed</small>
                </div>

                <div className="form-grid-full">
                  <div className="form-section">
                    <h4>Work Details</h4>
                    <div className="form-grid">
                      <div className="input-group">
                        <label htmlFor="employee-salary">Salary (₺)</label>
                        <input
                          id="employee-salary"
                          type="number"
                          placeholder="Enter salary amount"
                          value={newEmployee.salary}
                          onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="employee-hours">Hours per Week</label>
                        <input
                          id="employee-hours"
                          type="number"
                          placeholder="Enter work hours"
                          value={newEmployee.hoursPerWeek}
                          onChange={(e) => setNewEmployee({...newEmployee, hoursPerWeek: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="form-grid-full">
                        <div className="input-group">
                          <label htmlFor="shift-schedule">Shift Schedule Image URL</label>
                          <input
                            id="shift-schedule"
                            type="text"
                            placeholder="Enter image URL for shift schedule"
                            value={newEmployee.shiftSchedule}
                            onChange={(e) => setNewEmployee({...newEmployee, shiftSchedule: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-button">Cancel</button>
                <button type="submit" className="add-button">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShiftModal && (
        <div className="modal-overlay" onClick={() => setShowShiftModal(false)}>
          <div className="modal shift-modal" onClick={e => e.stopPropagation()}>
            <img src={selectedShift} alt="Shift Schedule" />
            <button onClick={() => setShowShiftModal(false)} className="shift-button">Close</button>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <div className="confirmation-content">
              <div className="warning-icon">⚠️</div>
              <p>Are you sure you want to delete the employee:</p>
              <div className="highlighted-name">{employeeToDelete?.name} {employeeToDelete?.surname}</div>
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

export default EmployeesPanel; 