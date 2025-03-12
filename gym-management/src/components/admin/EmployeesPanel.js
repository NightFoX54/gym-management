import React, { useState } from 'react';
import '../../styles/AdminPanels.css';

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
  const [editingEmployee, setEditingEmployee] = useState(null);
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
    setEditingEmployee(null);
  };

  const handleSelectEmployee = (employee) => {
    if (isEditing && !editingEmployee) {
      setEditingEmployee({...employee});
    }
  };

  const handleSaveEdit = (id, updatedData) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, ...updatedData } : employee
    ));
    setEditingEmployee(null);
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
            <button onClick={() => setShowAddForm(true)} className="add-button">
              Add Employee
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
          <span className="edit-text">Edit Mode: Click on any employee row to edit their information.</span>
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
                className={isEditing && !editingEmployee ? 'selectable-row' : ''}
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
                          phone: e.target.value
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
              <input
                type="text"
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Surname"
                value={newEmployee.surname}
                onChange={(e) => setNewEmployee({...newEmployee, surname: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Salary"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Hours per Week"
                value={newEmployee.hoursPerWeek}
                onChange={(e) => setNewEmployee({...newEmployee, hoursPerWeek: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Shift Schedule Image URL"
                value={newEmployee.shiftSchedule}
                onChange={(e) => setNewEmployee({...newEmployee, shiftSchedule: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="add-button">Add</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
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
    </div>
  );
};

export default EmployeesPanel; 