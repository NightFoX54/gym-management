import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import axios from 'axios';

// Helper function to get day name from number
const getDayName = (dayNumber) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayNumber - 1] || 'Invalid Day';
};

const EmployeesPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedEmployeeShifts, setSelectedEmployeeShifts] = useState([]);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'STAFF',
    salary: '',
    weeklyHours: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8080/api/users/employees');
        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError('Failed to load employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const validatePhoneInput = (value, previousValue) => {
    if (!value) return '';
    
    const regex = /^(\+)?[0-9\s]*$/;
    
    if (!regex.test(value)) {
      return previousValue;
    }
    
    return value;
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    console.warn("Add employee needs backend integration.");
    setEmployees([...employees, { ...newEmployee, id: Date.now(), shiftEntries: [] }]);
    setShowAddForm(false);
    setNewEmployee({ 
      firstName: '', 
      lastName: '', 
      email: '', 
      phoneNumber: '', 
      role: 'STAFF', 
      salary: '', 
      weeklyHours: ''
    });
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
    console.warn("Edit employee needs backend integration.");
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
    setEditingEmployee(null);
  };

  const handleDeleteConfirm = () => {
    console.warn("Delete employee needs backend integration.");
    if (employeeToDelete) {
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setEmployeeToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setEmployeeToDelete(null);
    setShowConfirmDialog(false);
  };

  const handleShowShift = (shifts) => {
    if (shifts && shifts.length > 0) {
      setSelectedEmployeeShifts(shifts);
      setShowShiftModal(true);
    } else {
      alert("No shift schedule available for this employee.");
    }
  };

  const handleCloseShiftModal = () => {
    setShowShiftModal(false);
    setSelectedEmployeeShifts([]);
  };

  const handleShiftButtonClick = (e, shifts) => {
    e.stopPropagation();
    handleShowShift(shifts);
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Define columns for the shift modal table
  const shiftColumns = [
    { title: 'Day', dataIndex: 'dayOfWeek', key: 'day', render: getDayName },
    { title: 'Start Time', dataIndex: 'startTime', key: 'start' },
    { title: 'End Time', dataIndex: 'endTime', key: 'end' },
    { title: 'Task', dataIndex: 'task', key: 'task' },
  ];

  if (loading) {
    return <div className="panel-container loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="panel-container error">Error: {error}</div>;
  }

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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Salary (₺)</th>
              <th>Hours/Week</th>
              <th>Shift Schedule</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr 
                key={employee.id} 
                onClick={() => handleSelectEmployee(employee)}
                className={`${isEditing && !editingEmployee ? 'editable-row' : ''} ${isDeleting ? 'deletable-row' : ''}`}
              >
                <td>{isEditing && editingEmployee?.id === employee.id ? <input type="text" value={editingEmployee.firstName} onChange={(e) => setEditingEmployee({...editingEmployee, firstName: e.target.value})} /> : employee.firstName}</td>
                <td>{isEditing && editingEmployee?.id === employee.id ? <input type="text" value={editingEmployee.lastName} onChange={(e) => setEditingEmployee({...editingEmployee, lastName: e.target.value})} /> : employee.lastName}</td>
                <td>{isEditing && editingEmployee?.id === employee.id ? <input type="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})} /> : employee.email}</td>
                <td>{isEditing && editingEmployee?.id === employee.id ? <input type="text" value={editingEmployee.phoneNumber || ''} onChange={(e) => setEditingEmployee({...editingEmployee, phoneNumber: validatePhoneInput(e.target.value, editingEmployee.phoneNumber)})} /> : employee.phoneNumber}</td>
                <td>{isEditing && editingEmployee?.id === employee.id ? 
                    <select 
                      value={editingEmployee.role} 
                      onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                    >
                      <option value="TRAINER">TRAINER</option>
                      <option value="STAFF">STAFF</option>
                    </select> 
                    : employee.role}</td>
                <td>{isEditing && editingEmployee?.id === employee.id ? 
                  <input type="number" value={editingEmployee.salary || ''} onChange={(e) => setEditingEmployee({...editingEmployee, salary: e.target.value ? parseFloat(e.target.value) : null})} /> 
                  : employee.salary ? `₺${employee.salary.toLocaleString()}` : 'N/A'}
                </td>
                <td>{isEditing && editingEmployee?.id === employee.id ? 
                  <input type="number" value={editingEmployee.weeklyHours || ''} onChange={(e) => setEditingEmployee({...editingEmployee, weeklyHours: e.target.value ? parseInt(e.target.value) : null})} /> 
                  : employee.weeklyHours ? `${employee.weeklyHours}h` : 'N/A'}
                </td>
                <td>
                  {isEditing && editingEmployee?.id === employee.id ? (
                    <span>Edit Shift (TBD)</span>
                  ) : (
                    <Button 
                      icon={<EyeOutlined />} 
                      onClick={(e) => handleShiftButtonClick(e, employee.shiftEntries)}
                      size="small"
                      disabled={!employee.shiftEntries || employee.shiftEntries.length === 0}
                    >
                      View Shift
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal add-employee-modal">
            <h3>Add New Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-grid two-columns">
                  <div className="input-group">
                    <label htmlFor="employee-name">Name</label>
                    <input
                      id="employee-name"
                      type="text"
                      placeholder="Enter first name"
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="employee-surname">Surname</label>
                    <input
                      id="employee-surname"
                      type="text"
                      placeholder="Enter last name"
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
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
                      value={newEmployee.phoneNumber}
                      onChange={(e) => setNewEmployee({
                        ...newEmployee, 
                        phoneNumber: validatePhoneInput(e.target.value, newEmployee.phoneNumber)
                      })}
                      required
                    />
                    <small className="input-hint">Only numbers and a plus sign at the beginning are allowed</small>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Work Details</h4>
                <div className="form-grid three-columns">
                  <div className="input-group">
                    <label htmlFor="employee-role">Role</label>
                    <select
                      id="employee-role"
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                      required
                    >
                      <option value="TRAINER">TRAINER</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="employee-salary">Salary (₺)</label>
                    <input
                      id="employee-salary"
                      type="number"
                      placeholder="e.g., 30000"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="employee-hours">Hours per Week</label>
                    <input
                      id="employee-hours"
                      type="number"
                      placeholder="e.g., 40"
                      value={newEmployee.weeklyHours}
                      onChange={(e) => setNewEmployee({...newEmployee, weeklyHours: e.target.value})}
                    />
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

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <div className="confirmation-content">
              <div className="warning-icon">⚠️</div>
              <p>Are you sure you want to delete the employee:</p>
              <div className="highlighted-name">{employeeToDelete?.firstName} {employeeToDelete?.lastName}</div>
              <p className="warning-text">This action cannot be undone!</p>
            </div>
            <div className="modal-buttons">
              <button onClick={handleDeleteCancel} className="cancel-button">Cancel</button>
              <button onClick={handleDeleteConfirm} className="delete-confirm-button">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showShiftModal && (
        <div className="modal-overlay" onClick={handleCloseShiftModal}>
          <div className="modal shift-modal large" onClick={e => e.stopPropagation()}>
            <h4>Weekly Shift Schedule</h4>
            <Table 
              columns={shiftColumns} 
              dataSource={selectedEmployeeShifts} 
              rowKey="id" 
              pagination={false}
              size="small"
            />
            <Button onClick={handleCloseShiftModal} style={{ marginTop: '15px' }}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPanel; 