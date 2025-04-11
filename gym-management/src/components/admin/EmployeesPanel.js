import React, { useState, useEffect } from 'react';
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
      shiftSchedule: '/s1.jpg',
      personalTrainings: 12,
      groupClasses: 8
    },
    {
      id: 2,
      name: 'Arif',
      surname: 'Işık',
      email: 'arif.isik@example.com',
      phone: '+90 555 876 5432',
      salary: 28000,
      hoursPerWeek: 38,
      shiftSchedule: '/s2.jpg',
      personalTrainings: 8,
      groupClasses: 4
    },
    {
      id: 3,
      name: 'Aziz',
      surname: 'Vefa',
      email: 'aziz.vefa@example.com',
      phone: '+90 555 765 4321',
      salary: 35000,
      hoursPerWeek: 42,
      shiftSchedule: '/s3.jpg',
      personalTrainings: 15,
      groupClasses: 6
    }
  ]);

  // New state variables for salary payment functionality
  const [lastSalaryDate, setLastSalaryDate] = useState(null);
  const [isPayingSalaries, setIsPayingSalaries] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add the missing newEmployee state
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    salary: '',
    hoursPerWeek: '',
    shiftSchedule: '',
    personalTrainings: 0,
    groupClasses: 0
  });

  // New function to fetch employees data from API
  const fetchEmployeeData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employees/trainers');
      const data = await response.json();
      
      if (data.employees) {
        setEmployees(data.employees);
      }
      
      if (data.lastSalaryDate) {
        setLastSalaryDate(data.lastSalaryDate);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      // Keep using mock data if API fails
    }
  };

  // New function to pay salaries
  const handlePaySalaries = async () => {
    setIsPayingSalaries(true);
    try {
      const response = await fetch('http://localhost:8080/api/employees/pay-salaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLastSalaryDate(data.date);
        fetchEmployeeData(); // Refresh the employee data
      }
    } catch (error) {
      console.error('Error paying salaries:', error);
    } finally {
      setIsPayingSalaries(false);
    }
  };

  useEffect(() => {
    // Call API to fetch employee data when component mounts
    fetchEmployeeData();
  }, []);

  // Name validation function
  const validateNameInput = (newValue, previousValue) => {
    // Allow only letters, spaces and Turkish characters
    const regex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/;
    return regex.test(newValue) ? newValue : previousValue;
  };

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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

  // Function to capitalize first letter of each word
  const capitalizeWords = (text) => {
    if (!text) return '';
    return text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/employees/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh employee data
        fetchEmployeeData();
        setShowAddForm(false);
        setNewEmployee({
          name: '',
          surname: '',
          email: '',
          phone: '',
          salary: '',
          hoursPerWeek: '',
          shiftSchedule: '',
          personalTrainings: 0,
          groupClasses: 0
        });
      } else {
        alert(`Failed to add employee: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Please try again.');
    }
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

  const handleSaveEdit = async () => {
    // Capitalize names before saving
    const formattedEmployee = {
      ...editingEmployee,
      name: capitalizeWords(editingEmployee.name),
      surname: capitalizeWords(editingEmployee.surname)
    };

    // Email validation
    if (!validateEmail(formattedEmployee.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/employees/trainers/${formattedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedEmployee),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh employee data
        fetchEmployeeData();
        setIsEditing(false);
        setEditingEmployee(null);
      } else {
        alert(`Failed to update employee: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/employees/trainers/${employeeToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh employee data
        fetchEmployeeData();
        setShowConfirmDialog(false);
        setEmployeeToDelete(null);
      } else {
        alert(`Failed to delete employee: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setEmployeeToDelete(null);
    setShowConfirmDialog(false);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.name} ${employee.surname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Prevent row click when clicking the shift button
  const handleShiftButtonClick = (e, shiftSchedule) => {
    e.stopPropagation();
    handleShowShift(shiftSchedule);
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Trainers</h2>
        <div className="search-and-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              Add Trainer
            </Button>
          </div>
          <div className="salary-actions">
            {lastSalaryDate && (
              <span className="last-salary-date">Last salary payment: {lastSalaryDate}</span>
            )}
            <button 
              className="pay-salary-button" 
              onClick={handlePaySalaries}
              disabled={isPayingSalaries}
            >
              {isPayingSalaries ? 'Processing...' : 'Pay Salaries'}
            </button>
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
              <th>Personal Trainings</th>
              <th>Group Classes</th>
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
                          name: validateNameInput(e.target.value, editingEmployee.name)
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingEmployee.surname}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          surname: validateNameInput(e.target.value, editingEmployee.surname)
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
                        className={editingEmployee.email && !validateEmail(editingEmployee.email) ? 'invalid-input' : ''}
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
                        step="1"
                        min="0"
                        onKeyDown={(e) => {
                          // Prevent the decimal point
                          if (e.key === '.') {
                            e.preventDefault();
                          }
                        }}
                        value={editingEmployee.hoursPerWeek}
                        onChange={(e) => setEditingEmployee({
                          ...editingEmployee,
                          hoursPerWeek: parseInt(e.target.value) || 0
                        })}
                      />
                    </td>
                    <td>{employee.personalTrainings || 0}</td>
                    <td>{employee.groupClasses || 0}</td>
                    <td>
                      <div className="edit-actions">
                        {/* Commenting out the shift schedule 
                        <input
                          type="text"
                          placeholder="Shift Schedule URL"
                          value={editingEmployee.shiftSchedule}
                          onChange={(e) => setEditingEmployee({
                            ...editingEmployee,
                            shiftSchedule: e.target.value
                          })}
                        />
                        */}
                        <div className="action-buttons">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEdit();
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
                    <td>{employee.personalTrainings || 0}</td>
                    <td>{employee.groupClasses || 0}</td>
                    <td>
                      {/* Commenting out the View Shift button as requested
                      <button 
                        onClick={(e) => handleShiftButtonClick(e, employee.shiftSchedule)}
                        className="shift-button"
                      >
                        View Shift
                      </button>
                      */}
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
              <div className="add-employee-form">
                <div className="form-content">
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
                        placeholder="Enter email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        required
                      />
                      <small className="input-hint">Default password will be set as <strong>trainer123</strong></small>
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