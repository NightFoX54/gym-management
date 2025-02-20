import React, { useState } from 'react';
import '../../styles/AdminPanels.css';

const EmployeesPanel = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Sarah',
      surname: 'Wilson',
      salary: 3500,
      hoursPerWeek: 40,
      shiftSchedule: '/shifts/shift1.jpg'
    },
    {
      id: 2,
      name: 'David',
      surname: 'Brown',
      salary: 2800,
      hoursPerWeek: 30,
      shiftSchedule: '/shifts/shift2.jpg'
    },
    {
      id: 3,
      name: 'Emma',
      surname: 'Davis',
      salary: 3200,
      hoursPerWeek: 35,
      shiftSchedule: '/shifts/shift3.jpg'
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
    salary: '',
    hoursPerWeek: '',
    shiftSchedule: ''
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
    setShowAddForm(false);
    setNewEmployee({ name: '', surname: '', salary: '', hoursPerWeek: '', shiftSchedule: '' });
  };

  const handleShowShift = (shiftSchedule) => {
    setSelectedShift(shiftSchedule);
    setShowShiftModal(true);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const handleSaveEdit = (id, updatedData) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, ...updatedData } : employee
    ));
    setEditingEmployee(null);
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Employees</h2>
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

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Salary ($)</th>
            <th>Hours/Week</th>
            <th>Actions</th>
            {isEditing && <th>Edit</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
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
                    <button 
                      onClick={() => handleShowShift(employee.shiftSchedule)}
                      className="shift-button"
                    >
                      View Shift
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleSaveEdit(employee.id, editingEmployee)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingEmployee(null)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>{employee.name}</td>
                  <td>{employee.surname}</td>
                  <td>${employee.salary.toLocaleString()}</td>
                  <td>{employee.hoursPerWeek}h</td>
                  <td>
                    <button 
                      onClick={() => handleShowShift(employee.shiftSchedule)}
                      className="shift-button"
                    >
                      View Shift
                    </button>
                  </td>
                  {isEditing && (
                    <td>
                      <button 
                        onClick={() => handleEditEmployee(employee)}
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