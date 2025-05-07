import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import { format, parseISO } from 'date-fns';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import { 
  TextField, 
  InputAdornment, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  FormHelperText,
  IconButton,
  Divider,
  Box,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Stack,
  ButtonGroup,
  Chip,
  Button as MuiButton,
  ButtonBase
} from '@mui/material';
import { Search, Close, Add, CalendarMonth, Category, AttachMoney, FilterAlt, DateRange, RestartAlt } from '@mui/icons-material';

const ExpensesPanel = ({ isDarkMode }) => {
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

  // Dark mode teması oluştur
  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
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
            <TextField
              fullWidth
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-mui"
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '20px',
                  '&::placeholder': {
                    fontSize: '0.9rem',
                  },
                }
              }}
              sx={{ 
                maxWidth: '280px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                },
              }}
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
            <AntButton 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setShowAddForm(true)}
              className="add-button"
            >
              Add Expense
            </AntButton>
          </div>
        </div>
      </div>

      <ThemeProvider theme={createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      })}>
        <Paper 
          elevation={0} 
          sx={{ 
            padding: '1.5rem',
            mb: 3,
            bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#f8f9fa',
            border: '1px solid',
            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            borderRadius: '10px'
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <DateRange sx={{ mr: 1, color: '#ff4757' }} />
            <Typography variant="h6" component="h3" sx={{ 
              fontWeight: 600,
              color: theme => theme.palette.mode === 'dark' ? '#fff' : '#333',
              fontSize: '1.1rem'
            }}>
              Filter Expenses by Date Range
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                id="date-from"
                label="Start Date"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { 
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                  }
                }}
                InputProps={{
                  sx: { 
                    color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth fontSize="small" sx={{ color: '#ff4757' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                id="date-to"
                label="End Date"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: { 
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                  }
                }}
                InputProps={{
                  sx: { 
                    color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth fontSize="small" sx={{ color: '#ff4757' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4} md={6}>
              <Stack direction="row" spacing={2}>
                <MuiButton 
                  variant="contained"
                  onClick={handleFilterExpenses}
                  sx={{ 
                    bgcolor: theme => theme.palette.mode === 'dark' ? '#2e7d32' : '#4caf50',
                    color: '#fff !important',
                    '&:hover': {
                      bgcolor: '#ff4757 !important',
                      boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)'
                    },
                    textTransform: 'none',
                    minWidth: '120px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    fontWeight: 500
                  }}
                  startIcon={<FilterAlt />}
                >
                  Apply Filter
                </MuiButton>
                
                <MuiButton 
                  variant="outlined"
                  onClick={handleResetFilter}
                  sx={{ 
                    borderColor: theme => theme.palette.mode === 'dark' ? '#d32f2f' : '#f44336',
                    color: theme => theme.palette.mode === 'dark' ? '#f44336 !important' : '#d32f2f !important',
                    '&:hover': {
                      borderColor: '#ff4757 !important',
                      color: '#ff4757 !important',
                      bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 71, 87, 0.08)' : 'rgba(255, 71, 87, 0.05)',
                      boxShadow: '0 2px 8px rgba(255, 71, 87, 0.15)'
                    },
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    fontWeight: 500
                  }}
                  startIcon={<RestartAlt />}
                >
                  Reset
                </MuiButton>
                
                {(filterDateFrom && filterDateTo) && (
                  <Chip 
                    label={`Filtered: ${format(parseISO(filterDateFrom), 'dd/MM/yyyy')} - ${format(parseISO(filterDateTo), 'dd/MM/yyyy')}`} 
                    color="info"
                    sx={{ 
                      ml: 2,
                      bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(23, 125, 220, 0.2)' : 'rgba(25, 118, 210, 0.1)',
                      borderRadius: '16px',
                      '& .MuiChip-label': {
                        color: theme => theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
                      }
                    }}
                    onDelete={handleResetFilter}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </ThemeProvider>

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
                          style={{
                            backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                            color: isDarkMode ? '#fff' : 'inherit',
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#ddd'
                          }}
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
                          style={{
                            backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                            color: isDarkMode ? '#fff' : 'inherit',
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#ddd'
                          }}
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
                          style={{
                            backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                            color: isDarkMode ? '#fff' : 'inherit',
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#ddd'
                          }}
                        />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <AntButton 
                            type="primary" 
                            size="small" 
                            onClick={handleUpdateExpense} 
                            className="save-button"
                            style={{
                              backgroundColor: isDarkMode ? '#177ddc' : '#1976d2',
                              borderColor: isDarkMode ? '#177ddc' : '#1976d2'
                            }}
                          >
                            <i className="fas fa-save"></i>
                          </AntButton>
                          <AntButton 
                            size="small" 
                            onClick={(e) => handleCancelEdit(e)} 
                            className="cancel-button"
                            danger
                            style={{
                              backgroundColor: isDarkMode ? '#a61d24' : '',
                              borderColor: isDarkMode ? '#a61d24' : ''
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </AntButton>
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
                          ₺{parseFloat(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span className="date-display">
                          {expense.date ? format(parseISO(expense.date), 'dd/MM/yyyy') : 'N/A'}
                        </span>
                      </td>
                      <td>
                        {isEditing && expense.category && expense.category.id !== 4 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectExpense(expense);
                            }}
                            className="edit-button"
                          >
                            ✎
                          </button>
                        )}
                        {isDeleting && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectExpense(expense);
                            }}
                            className="delete-button"
                          >
                            <DeleteOutlined />
                          </button>
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

      <div>
        {showAddForm && (
          <ThemeProvider theme={createTheme({
            palette: {
              mode: isDarkMode ? 'dark' : 'light',
            },
          })}>
            <Dialog 
              open={showAddForm} 
              onClose={() => setShowAddForm(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#fff',
                  color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                }
              }}
            >
              <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: theme => theme.palette.mode === 'dark' ? '#2c2c2c' : '#f8f9fa',
                borderBottom: '1px solid',
                borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                padding: '20px 24px',
                color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Add fontSize="small" sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit' }} />
                  <span>Add New Expense</span>
                </Box>
                <IconButton 
                  onClick={() => setShowAddForm(false)} 
                  size="small"
                  sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </DialogTitle>
              
                <form onSubmit={handleAddExpense} noValidate>
                <DialogContent sx={{ 
                  pt: 4, 
                  pb: 3, 
                  px: 3,
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#fff',
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, my: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel 
                        id="expense-category-label"
                        sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
                      >
                        Category
                      </InputLabel>
                      <Select
                        labelId="expense-category-label"
                        id="expense-category"
                        value={newExpense.categoryId}
                        onChange={(e) => setNewExpense({...newExpense, categoryId: e.target.value})}
                        label="Category"
                        required
                        startAdornment={
                          <InputAdornment position="start">
                            <Category fontSize="small" sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }} />
                          </InputAdornment>
                        }
                        sx={{ 
                          minHeight: '56px',
                          color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.23)'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: theme => theme.palette.mode === 'dark' ? '#2c2c2c' : '#fff',
                              color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                            }
                          }
                        }}
                        inputProps={{
                          'aria-label': 'Select category',
                        }}
                      >
                        <MenuItem value="" disabled>Select a category</MenuItem>
                        {categories
                          .filter(category => category.id !== 4)
                          .map(category => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <FormHelperText sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'inherit' }}>
                        Choose the expense category
                      </FormHelperText>
                    </FormControl>
                    
                    <TextField
                      id="expense-amount"
                      label="Amount (₺)"
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney fontSize="small" sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          minHeight: '56px', 
                          color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                        },
                        inputProps: { 
                          min: "0", 
                          step: "0.01",
                          'aria-label': 'Enter expense amount'
                        }
                      }}
                      sx={{
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.23)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                        },
                        '.MuiInputLabel-root': {
                          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                        },
                        '.MuiInputLabel-root.Mui-focused': {
                          color: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                        }
                      }}
                      InputLabelProps={{
                        style: { 
                          color: 'inherit' 
                        }
                      }}
                      helperText="Enter the expense amount"
                      FormHelperTextProps={{
                        sx: { 
                          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'inherit'
                        }
                      }}
                    />
                    
                    <TextField
                      id="expense-date"
                      label="Date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonth fontSize="small" sx={{ color: '#ff4757' }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          minHeight: '56px',
                          color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                        },
                        inputProps: {
                          'aria-label': 'Select expense date'
                        }
                      }}
                      InputLabelProps={{
                        shrink: true,
                        style: { 
                          color: 'inherit' 
                        }
                      }}
                      sx={{
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.23)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                        },
                        '.MuiInputLabel-root': {
                          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                        },
                        '.MuiInputLabel-root.Mui-focused': {
                          color: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2'
                        }
                      }}
                      helperText="Select the expense date"
                      FormHelperTextProps={{
                        sx: { 
                          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'inherit'
                        }
                      }}
                    />
                  </Box>
                </DialogContent>
                
                <Divider sx={{ borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }} />
                
                <DialogActions sx={{ 
                  padding: '20px 24px', 
                  justifyContent: 'space-between',
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#fff',
                }}>
                  <MuiButton 
                    onClick={() => setShowAddForm(false)} 
                    className="cancel-button"
                    sx={{ 
                      borderRadius: '8px',
                      color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                    }}
                  >
                    Cancel
                  </MuiButton>
                  <MuiButton 
                    type="submit" 
                    variant="contained"
                    className="add-button"
                    sx={{ 
                      borderRadius: '8px',
                      bgcolor: theme => theme.palette.mode === 'dark' ? '#177ddc' : '#1976d2',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: theme => theme.palette.mode === 'dark' ? '#3c9ae8' : '#1565c0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Add fontSize="small" />
                      <span>Add Expense</span>
                    </Box>
                  </MuiButton>
                </DialogActions>
                </form>
            </Dialog>
          </ThemeProvider>
        )}
      </div>
      
      {showConfirmDialog && (
        <ThemeProvider theme={createTheme({
          palette: {
            mode: isDarkMode ? 'dark' : 'light',
          },
        })}>
          <Dialog
            open={showConfirmDialog}
            onClose={handleDeleteCancel}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#fff',
                color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
              }
            }}
          >
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: theme => theme.palette.mode === 'dark' ? '#2c2c2c' : '#f8f9fa',
              borderBottom: '1px solid',
              borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              padding: '16px 24px',
              color: '#e74c3c'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Confirm Delete</span>
              </Box>
              <IconButton 
                onClick={handleDeleteCancel} 
                size="small"
                sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ 
              pt: 3, 
              pb: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#fff',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                <Box sx={{ 
                  fontSize: '3rem', 
                  color: '#e74c3c',
                  mb: 1
                }}>
                  ⚠️
                </Box>
                
                <Box sx={{ 
                  fontSize: '1.1rem', 
                  mb: 1, 
                  fontWeight: 500,
                  color: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                }}>
                  Are you sure you want to delete this expense?
                </Box>
                
                <Box sx={{ 
                  width: '100%', 
                  p: 2, 
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#2c2c2c' : '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: theme => theme.palette.mode === 'dark' ? '#ddd' : '#333',
                }}>
                  {expenseToDelete && (
                    <>
                      <div><strong>Category:</strong> {expenseToDelete.category?.name}</div>
                      <div><strong>Amount:</strong> ₺{expenseToDelete.amount.toFixed(2)}</div>
                      <div><strong>Date:</strong> {format(parseISO(expenseToDelete.date), 'dd/MM/yyyy')}</div>
                    </>
                  )}
                </Box>
                
                <Box sx={{ 
                  fontSize: '0.9rem', 
                  mt: 1,
                  color: '#e74c3c',
                  fontWeight: 500
                }}>
                  This action cannot be undone.
                </Box>
              </Box>
            </DialogContent>
            
            <Divider sx={{ borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }} />
            
            <DialogActions sx={{ 
              justifyContent: 'space-between', 
              p: 3,
              bgcolor: theme => theme.palette.mode === 'dark' ? '#1f1f1f' : '#fff',
            }}>
              <MuiButton 
                onClick={handleDeleteCancel} 
                sx={{ 
                  borderRadius: '8px',
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
                }}
              >
                Cancel
              </MuiButton>
              <MuiButton 
                onClick={handleDeleteExpense} 
                variant="contained" 
                color="error"
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#a61d24' : '#f44336',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: theme => theme.palette.mode === 'dark' ? '#d32029' : '#d32f2f',
                  }
                }}
              >
                Delete
              </MuiButton>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
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
          min-width: 280px;
          max-width: 280px;
        }
        
        .search-input-mui {
          width: 100%;
        }
        
        .search-input-mui .MuiInputBase-root {
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        
        .search-input-mui .MuiInputBase-root:hover {
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
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
        
        /* Edit and Delete button styles */
        .edit-button {
          background-color: #2196f3;
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        
        .edit-button:hover, .edit-button.active {
          background-color: #1976d2;
        }
        
        .delete-button {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        
        .delete-button:hover, .delete-button.active {
          background-color: #ff7875;
          border-color: #ff7875;
        }
        
        .edit-input, .edit-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #3498db;
          border-radius: 4px;
          background-color: #f8f9fa;
        }
        
        .dark-mode .panel-container {
          background-color: #1f1f1f;
          color: #fff;
        }
        
        .dark-mode .search-input-mui .MuiInputBase-root {
          background-color: #2c2c2c;
          color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .search-input-mui .MuiInputBase-root:hover {
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        }
        
        .dark-mode .search-input-mui .MuiOutlinedInput-notchedOutline {
          border-color: rgba(255, 255, 255, 0.15);
        }
        
        .dark-mode .search-input-mui:hover .MuiOutlinedInput-notchedOutline {
          border-color: rgba(255, 255, 255, 0.25);
        }
        
        .dark-mode .search-input-mui .MuiInputAdornment-root .MuiSvgIcon-root {
          color: rgba(255, 255, 255, 0.7);
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
        
        /* Dark mode button styles */
        .dark-mode .edit-button {
          background-color: #177ddc;
          border-color: #177ddc;
        }
        
        .dark-mode .edit-button:hover,
        .dark-mode .edit-button.active {
          background-color: #3c9ae8;
          border-color: #3c9ae8;
        }
        
        .dark-mode .delete-button {
          background-color: #a61d24;
          border-color: #a61d24;
        }
        
        .dark-mode .delete-button:hover,
        .dark-mode .delete-button.active {
          background-color: #d32029;
          border-color: #d32029;
        }
      `}</style>
    </div>
  );
};

export default ExpensesPanel; 