import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import { format, parseISO } from 'date-fns';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ExpensesPanel = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    categoryId: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Get filtered expenses based on search query
  const filteredExpenses = expenses.filter(expense => {
    const searchLower = searchQuery.toLowerCase();
    return expense.category?.name.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchLower);
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        console.error('Failed to fetch expenses');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/expenses/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch expense categories');
      }
    } catch (error) {
      console.error('Error fetching expense categories:', error);
    }
  };

  const handleFilterExpenses = async () => {
    if (!filterDateFrom || !filterDateTo) {
      alert('Please select both start and end dates to filter expenses.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/expenses/range?startDate=${filterDateFrom}&endDate=${filterDateTo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        console.error('Failed to filter expenses');
      }
    } catch (error) {
      console.error('Error filtering expenses:', error);
    }
  };

  const handleResetFilter = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    fetchExpenses();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!newExpense.categoryId || !newExpense.amount || !newExpense.date) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const selectedCategory = categories.find(cat => cat.id === parseInt(newExpense.categoryId));
      
      const expenseData = {
        category: selectedCategory,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date
      };
      
      const response = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });
      
      if (response.ok) {
        await fetchExpenses();
        setShowAddForm(false);
        setNewExpense({
          categoryId: '',
          amount: '',
          date: format(new Date(), 'yyyy-MM-dd')
        });
      } else {
        console.error('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setIsDeleting(false);
    setEditingExpense(null);
  };

  const handleDeleteClick = () => {
    setIsDeleting(!isDeleting);
    setIsEditing(false);
    setEditingExpense(null);
  };

  const handleSelectExpense = (expense) => {
    if (isEditing) {
      // Prevent editing staff salary expenses
      if (expense.category && expense.category.id === 4) {
        alert('Staff salary expenses cannot be edited.');
        return;
      }
      
      setEditingExpense({
        ...expense,
        categoryId: expense.category.id,
        date: expense.date
      });
    } else if (isDeleting) {
      setExpenseToDelete(expense);
      setShowConfirmDialog(true);
    }
  };

  const handleUpdateExpense = async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedCategory = categories.find(cat => cat.id === parseInt(editingExpense.categoryId));
      
      const expenseData = {
        id: editingExpense.id,
        category: selectedCategory,
        amount: parseFloat(editingExpense.amount),
        date: editingExpense.date
      };
      
      const response = await fetch(`http://localhost:8080/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });
      
      if (response.ok) {
        await fetchExpenses();
        setEditingExpense(null);
      } else {
        console.error('Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleCancelEdit = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling
    }
    setEditingExpense(null);
  };

  const handleDeleteExpense = async () => {
    if (expenseToDelete) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/expenses/${expenseToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setExpenses(expenses.filter(expense => expense.id !== expenseToDelete.id));
          setExpenseToDelete(null);
          setShowConfirmDialog(false);
        } else {
          console.error('Failed to delete expense');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setExpenseToDelete(null);
    setShowConfirmDialog(false);
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Expenses Management</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          <div className="button-group">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setShowAddForm(true)}
              className="add-button"
            >
              Add Expense
            </Button>
            <Button 
              type={isEditing ? "primary" : "default"} 
              icon={<EditOutlined />}
              onClick={handleEditClick}
              className={isEditing ? "active-button" : ""}
            >
              Edit
            </Button>
            <Button 
              type={isDeleting ? "primary" : "default"} 
              danger={isDeleting}
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
              className={isDeleting ? "active-button" : ""}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3>Filter by Date Range</h3>
        <div className="filter-controls">
          <div className="input-group">
            <label htmlFor="date-from">From</label>
            <input
              id="date-from"
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="date-to">To</label>
            <input
              id="date-to"
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
          <button onClick={handleFilterExpenses} className="filter-button">Apply Filter</button>
          <button onClick={handleResetFilter} className="reset-filter-button">Reset</button>
        </div>
      </div>

      <div className={`table-container ${
        isEditing ? 'edit-mode-container' : 
        isDeleting ? 'delete-mode-container' : ''
      }`}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount (₺)</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="loading-cell">Loading expenses...</td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-table-message">No expenses found.</td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr 
                  key={expense.id} 
                  onClick={() => handleSelectExpense(expense)}
                  className={
                    isEditing && !editingExpense ? 'selectable-row' : 
                    isDeleting ? 'deletable-row' : ''
                  }
                >
                  {editingExpense?.id === expense.id ? (
                    <>
                      <td>
                        <select
                          value={editingExpense.categoryId}
                          onChange={(e) => setEditingExpense({
                            ...editingExpense,
                            categoryId: parseInt(e.target.value)
                          })}
                          className="edit-select"
                        >
                          {categories
                            .filter(category => category.id !== 4)
                            .map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                          }
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={editingExpense.amount}
                          onChange={(e) => setEditingExpense({
                            ...editingExpense,
                            amount: e.target.value
                          })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={editingExpense.date}
                          onChange={(e) => setEditingExpense({
                            ...editingExpense,
                            date: e.target.value
                          })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button 
                            type="primary" 
                            size="small" 
                            onClick={handleUpdateExpense} 
                            className="save-button"
                          >
                            <i className="fas fa-save"></i>
                          </Button>
                          <Button 
                            size="small" 
                            onClick={(e) => handleCancelEdit(e)} 
                            className="cancel-button"
                            danger
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <span className="category-name">{expense.category ? expense.category.name : 'N/A'}</span>
                      </td>
                      <td>
                        <span className="amount-display">
                          ₺{parseFloat(expense.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span className="date-display">
                          {expense.date ? format(parseISO(expense.date), 'dd/MM/yyyy') : 'N/A'}
                        </span>
                      </td>
                      <td>
                        {isEditing && expense.category && expense.category.id !== 4 && (
                          <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectExpense(expense);
                            }}
                            className="icon-button edit-icon"
                          />
                        )}
                        {isDeleting && (
                          <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectExpense(expense);
                            }}
                            className="icon-button delete-icon"
                          />
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal expense-modal">
            <div className="modal-header">
              <h3><PlusOutlined /> Add New Expense</h3>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="modal-content">
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="expense-category">Category</label>
                    <select
                      id="expense-category"
                      className="form-select"
                      value={newExpense.categoryId}
                      onChange={(e) => setNewExpense({...newExpense, categoryId: e.target.value})}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories
                        .filter(category => category.id !== 4)
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="expense-amount">Amount (₺)</label>
                    <input
                      id="expense-amount"
                      className="form-input"
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="expense-date">Date</label>
                    <input
                      id="expense-date"
                      className="form-input"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-buttons">
                <Button onClick={() => setShowAddForm(false)} className="cancel-button">Cancel</Button>
                <Button type="primary" htmlType="submit" className="add-button">
                  <PlusOutlined /> Add Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal confirm-dialog">
            <h3>Confirm Delete</h3>
            <div className="confirmation-content">
              <div className="warning-icon">⚠️</div>
              <p>Are you sure you want to delete this expense?</p>
              <div className="expense-details">
                <p><strong>Category:</strong> {expenseToDelete?.category?.name}</p>
                <p><strong>Amount:</strong> ₺{parseFloat(expenseToDelete?.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Date:</strong> {expenseToDelete?.date ? format(parseISO(expenseToDelete.date), 'dd/MM/yyyy') : 'N/A'}</p>
              </div>
              <p className="warning-text">This action cannot be undone!</p>
            </div>
            <div className="modal-buttons">
              <Button onClick={handleDeleteCancel} className="cancel-button">Cancel</Button>
              <Button type="primary" danger onClick={handleDeleteExpense} className="delete-confirm-button">Delete</Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .panel-container {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .search-container {
          position: relative;
          min-width: 250px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .search-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #777;
        }
        
        .button-group {
          display: flex;
          gap: 0.5rem;
        }
        
        .category-name {
          font-weight: 500;
          color: #333;
        }
        
        .amount-display {
          font-weight: 600;
          color: #e74c3c;
        }
        
        .date-display {
          color: #555;
        }
        
        .icon-button {
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .edit-icon:hover {
          color: #3498db;
          background-color: rgba(52, 152, 219, 0.1);
        }
        
        .delete-icon:hover {
          color: #e74c3c;
          background-color: rgba(231, 76, 60, 0.1);
        }
        
        .edit-input, .edit-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #3498db;
          border-radius: 4px;
          background-color: #f8f9fa;
        }
        
        .confirmation-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 1rem 0;
        }
        
        .warning-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .expense-details {
          margin: 1rem 0;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          width: 100%;
        }
        
        .expense-details p {
          margin: 0.5rem 0;
          text-align: left;
        }
        
        .warning-text {
          color: #e74c3c;
          font-weight: 600;
          margin-top: 1rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .input-group label {
          font-weight: 500;
          font-size: 0.95rem;
          color: #555;
        }
        
        .form-select, .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        
        .form-select:focus, .form-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          outline: none;
        }
        
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #eaeaea;
          margin-top: 1rem;
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .expense-modal {
          max-width: 500px;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
          animation: modalFadeIn 0.3s ease;
        }
        
        .modal-header {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 1.5rem;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .modal-content {
          padding: 0 1.5rem;
        }
        
        .dark-mode .panel-container {
          background-color: #1f1f1f;
          color: #fff;
        }
        
        .dark-mode .search-input {
          background-color: #2c2c2c;
          border-color: #444;
          color: #fff;
        }
        
        .dark-mode .search-icon {
          color: #aaa;
        }
        
        .dark-mode .category-name {
          color: #ddd;
        }
        
        .dark-mode .amount-display {
          color: #ff6b6b;
        }
        
        .dark-mode .date-display {
          color: #bbb;
        }
        
        .dark-mode .expense-details {
          background-color: #2c2c2c;
        }
        
        .dark-mode .expense-modal {
          background-color: #2a2a2a;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
        }
        
        .dark-mode .modal-header {
          border-bottom-color: #444;
        }
        
        .dark-mode .modal-header h3 {
          color: #eaeaea;
        }
        
        .dark-mode .input-group label {
          color: #bbb;
        }
        
        .dark-mode .form-select, .dark-mode .form-input {
          background-color: #333;
          border-color: #444;
          color: #eaeaea;
        }
        
        .dark-mode .form-select:focus, .dark-mode .form-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
        }
        
        .dark-mode .modal-buttons {
          border-top-color: #444;
        }
      `}</style>
    </div>
  );
};

export default ExpensesPanel; 