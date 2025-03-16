import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar, 
  Alert, 
  Fade, 
  CircularProgress,
  Menu,
  Tooltip,
  Zoom
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Search,
  Edit,
  Delete,
  Add as AddIcon,
  WhatsApp,
  Mail,
  Person,
  Phone,
  Email,
  FitnessCenter,
  CalendarToday,
  AccessTime,
  PersonAdd,
  Check,
  Close,
  AccessTimeFilled
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ClientsPage = ({ isDarkMode }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    startDate: '',
    scheduleTime: '',
    status: 'Active'
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, clientId: null });
  const [clientRequests, setClientRequests] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    // Get the trainer ID from user in local storage or use a default for testing
    const userStr = localStorage.getItem('user');
    try {
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("Found user in localStorage:", user);
        
        if (user && user.id) {
          console.log("Setting trainer ID to:", user.id);
          setTrainerId(user.id);
        } else {
          // For demo purposes
          console.log("User exists but no ID found, using default trainer ID");
          setTrainerId(4); // Default ID for trainer in our seed data
        }
      } else {
        // No user in localStorage - likely not logged in
        console.log("No user found in localStorage, using default trainer ID for testing");
        setTrainerId(4); // Default ID for trainer in our seed data
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setTrainerId(4); // Default ID for trainer in our seed data
    }
  }, []);

  useEffect(() => {
    if (trainerId) {
      fetchClients();
      fetchRequests();
    }
  }, [trainerId]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      console.log(`Fetching clients for trainer ID: ${trainerId}`);
      const response = await fetch(`http://localhost:8080/api/trainer/${trainerId}/clients`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403) {
        console.error('Access forbidden (403) - Authentication issue');
        showAlert('Authentication error - Please log in again', 'error');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clients: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Clients data received:", data);
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showAlert(`Failed to fetch clients: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      console.log(`Fetching requests for trainer ID: ${trainerId}`);
      
      // Add debugging output
      console.log("localStorage content:", localStorage.getItem('user'));
      console.log("All localStorage keys:", Object.keys(localStorage));
      
      const response = await fetch(`http://localhost:8080/api/trainer/${trainerId}/requests`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          // Add any auth headers you're using
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // For testing purposes, disable credentials
        credentials: 'omit'
      });
      
      // Log the full response for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
      
      if (response.status === 403) {
        console.error('Access forbidden (403) - Authentication issue');
        showAlert('Authentication error when fetching requests - Please log in again', 'error');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Requests data received:", data);
      
      setClientRequests(data.map(req => ({
        ...req,
        preferredTime: req.meetingTime || 'Not specified',
        program: req.program || 'Personal Training',
        requestDate: req.meetingDate || 'Not specified'
      })));
    } catch (error) {
      console.error('Error fetching requests:', error);
      showAlert(`Failed to fetch client requests: ${error.message}`, 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return as-is if it's not a valid date
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{2,50}$/;
        if (!value) return 'Name is required';
        if (!nameRegex.test(value)) return 'Name should only contain letters';
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';
      case 'phone':
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        if (!value) return 'Phone is required';
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Invalid phone format';
        return '';
      case 'program':
        return value ? '' : 'Program is required';
      case 'startDate':
        if (!value) return 'Start date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate < today) return 'Date cannot be in the past';
        return '';
      case 'scheduleTime':
        return value ? '' : 'Schedule time is required';
      default:
        return '';
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // For name field, prevent typing numbers
    if (name === 'name') {
      const lastChar = value.slice(-1);
      if (/[0-9]/.test(lastChar)) return;
    }

    setNewClient(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Check if form is valid
    const requiredFields = ['name', 'email', 'phone', 'program', 'startDate', 'scheduleTime'];
    const isValid = requiredFields.every(field => 
      newClient[field] && !errors[field]
    );
    setIsFormValid(isValid);
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'program'];
    return required.every(field => newClient[field].trim());
  };

  const handleAddClient = async () => {
    // This function is now unused as we're integrating with the backend API
    // Instead, we'll use handleSubmit for all client operations
  };

  const handleDeleteClient = (clientId) => {
    setDeleteConfirm({ open: true, clientId });
  };

  const confirmDelete = async () => {
    const clientId = deleteConfirm.clientId;
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/clients/${clientId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      setClients(prev => prev.filter(client => client.id !== clientId));
      showAlert('Client deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting client:', error);
      showAlert('Failed to delete client', 'error');
    } finally {
      setActionLoading(false);
      setDeleteConfirm({ open: false, clientId: null });
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      program: client.program || '',
      startDate: client.startDate || '', // Ensure date format compatibility
      scheduleTime: client.scheduleTime || '',
      remainingSessions: client.remainingSessions || 0
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      program: '',
      startDate: '',
      scheduleTime: '',
      status: 'Active'
    });
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleContactAction = async (type, contact) => {
    if (!contact) {
      showAlert('Contact information not available', 'error');
      return;
    }
    
    switch (type) {
      case 'whatsapp':
        // Remove spaces and ensure it starts with a '+'
        const formattedNumber = contact.replace(/\s+/g, '');
        window.open(`https://wa.me/${formattedNumber}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${contact}`;
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      if (selectedClient) {
        // Update existing client's session count
        const response = await fetch(`http://localhost:8080/api/trainer/clients/${selectedClient.id}/sessions`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessions: parseInt(newClient.remainingSessions) })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update client');
        }
        
        const updatedClient = await response.json();
        
        // Update the client in the list
        setClients(prev => prev.map(client => 
          client.id === selectedClient.id ? updatedClient : client
        ));
        
        showAlert('Client updated successfully!', 'success');
      } else {
        // We don't add clients directly through this interface
        // Clients are added by approving registration requests
        showAlert('New clients should be added through registration requests', 'info');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating client:', error);
      showAlert(selectedClient ? 'Failed to update client' : 'Failed to add client', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      let response;
      
      if (action === 'approve') {
        // For simplicity, we'll assume 10 initial sessions when approving a request
        response = await fetch(`http://localhost:8080/api/trainer/requests/${requestId}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initialSessions: 10 })
        });
        
        if (!response.ok) {
          throw new Error('Failed to approve request');
        }
        
        const newClient = await response.json();
        setClients(prev => [...prev, newClient]);
        showAlert('Client request approved successfully!', 'success');
      } else {
        response = await fetch(`http://localhost:8080/api/trainer/requests/${requestId}/reject`, {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error('Failed to reject request');
        }
        
        showAlert('Client request rejected', 'info');
      }
      
      // Remove the processed request from the list
      setClientRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error processing request:', error);
      showAlert(`Failed to ${action} request`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
            <CircularProgress color="primary" />
          </TableCell>
        </TableRow>
      );
    }

    if (!clients || clients.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
            <Typography color={isDarkMode ? 'white' : 'textSecondary'}>
              No clients found
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return filteredClients.map((client) => (
      <TableRow 
        key={client.id}
        sx={{
          '&:hover': { 
            bgcolor: isDarkMode ? 'rgba(255, 71, 87, 0.1)' : 'rgba(255, 71, 87, 0.04)',
            transition: 'background-color 0.3s ease'
          },
          '& .MuiTableCell-root': {
            color: isDarkMode ? '#fff' : 'inherit'
          }
        }}
      >
        <TableCell>
          <Fade in={true} timeout={500}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={client.profilePhoto}
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                {client.name ? client.name[0] : '?'}
              </Avatar>
              <Typography color={isDarkMode ? 'white' : 'inherit'}>{client.name}</Typography>
            </Box>
          </Fade>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {client.phone && (
              <IconButton 
                size="small" 
                sx={{ 
                  color: '#25D366 !important',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 211, 102, 0.1)',
                  }
                }} 
                onClick={() => handleContactAction('whatsapp', client.phone)}
              >
                <WhatsApp />
              </IconButton>
            )}
            <IconButton 
              size="small" 
              sx={{ 
                color: '#EA4335 !important',
                '&:hover': {
                  backgroundColor: 'rgba(234, 67, 53, 0.1)',
                }
              }} 
              onClick={() => handleContactAction('email', client.email)}
            >
              <Mail />
            </IconButton>
          </Box>
        </TableCell>
        <TableCell>Personal Training</TableCell>
        <TableCell>
          <Chip
            label={client.status}
            color={client.status === 'Active' ? 'success' : 'warning'}
            size="small"
          />
        </TableCell>
        <TableCell>{formatDate(client.registrationDate)}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit sessions" TransitionComponent={Zoom} arrow>
              <IconButton size="small" sx={{ color: '#ff4757' }} onClick={() => handleEditClient(client)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete client" TransitionComponent={Zoom} arrow>
              <IconButton size="small" sx={{ color: '#666' }} onClick={() => handleDeleteClient(client.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  const renderRequestsSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ 
        mb: 2, 
        color: isDarkMode ? '#fff' : '#2c3e50',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AccessTimeFilled sx={{ color: '#ff4757' }} />
        Pending Client Requests
      </Typography>

      <AnimatePresence>
        {clientRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
            }}>
              <Typography color="textSecondary">
                No pending requests at the moment
              </Typography>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={2}>
            {clientRequests.map((request) => (
              <Grid item xs={12} md={6} key={request.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{
                    p: 3,
                    bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: 'linear-gradient(to bottom, #ff4757, #ff6b81)',
                    }
                  }}>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="h6" sx={{ color: '#ff4757', mb: 1 }}>
                        {request.name}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Email: {request.email}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Phone: {request.phone || 'Not provided'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Program: {request.program}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Meeting Date: {formatDate(request.meetingDate)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Meeting Time: {formatTime(request.meetingTime)}
                          </Typography>
                        </Grid>
                      </Grid>

                      {request.message && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 2,
                            p: 2,
                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            borderRadius: '8px',
                            color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
                          }}
                        >
                          "{request.message}"
                        </Typography>
                      )}

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        gap: 1 
                      }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            disabled={actionLoading}
                            sx={{
                              borderColor: '#ff4757',
                              color: '#ff4757',
                              '&:hover': {
                                borderColor: '#ff3747',
                                bgcolor: 'rgba(255,71,87,0.1)',
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="contained"
                            startIcon={<Check />}
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            disabled={actionLoading}
                            sx={{
                              bgcolor: '#ff4757',
                              '&:hover': {
                                bgcolor: '#ff3747',
                              }
                            }}
                          >
                            Approve
                          </Button>
                        </motion.div>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </AnimatePresence>
    </Box>
  );

  const renderDeleteConfirmDialog = () => (
    <Dialog
      open={deleteConfirm.open}
      onClose={() => setDeleteConfirm({ open: false, clientId: null })}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this client? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button 
          onClick={() => setDeleteConfirm({ open: false, clientId: null })}
          variant="outlined"
          sx={{
            borderColor: '#bdbdbd',
            color: '#757575',
            '&:hover': {
              borderColor: '#9e9e9e',
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={confirmDelete}
          loading={actionLoading}
          variant="contained"
          color="error"
          sx={{
            bgcolor: '#ff4757',
            '&:hover': { bgcolor: '#ff3747' }
          }}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  const renderClientDialog = () => (
    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
        color: 'white',
        borderRadius: '16px 16px 0 0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit />
          Update Client Sessions
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedClient && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{selectedClient.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedClient.email} • {selectedClient.phone || 'No phone'}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Remaining Sessions"
                  name="remainingSessions"
                  type="number"
                  value={newClient.remainingSessions}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FitnessCenter sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#ff4757',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff4757',
                      }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <LoadingButton 
          onClick={handleCloseDialog}
          variant="outlined"
          sx={{
            borderColor: '#ff4757',
            color: '#ff4757',
            '&:hover': {
              borderColor: '#ff3747',
              backgroundColor: 'rgba(255,71,87,0.1)',
            }
          }}
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={handleSubmit}
          loading={actionLoading}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff6b81, #ff4757)',
            }
          }}
        >
          Update Sessions
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Render pending requests section */}
        {renderRequestsSection()}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
          p: 3,
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: '#fff',
              mb: 1 
            }}>
              Clients Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {clients.length} Total Clients • {clients.filter(c => c.status === 'Active').length} Active
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
              boxShadow: '0 4px 15px rgba(255,71,87,0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff6b81, #ff4757)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255,71,87,0.4)',
              }
            }}
            onClick={() => {
              showAlert("New clients should be added through registration requests", "info");
            }}
          >
            Add New Client
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
              '& input': {
                color: isDarkMode ? '#fff' : '#000',
              },
              '& input::placeholder': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                opacity: 1,
              },
              '&:hover': {
                '& fieldset': {
                  borderColor: '#ff4757',
                }
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#ff4757' }}/>
              </InputAdornment>
            ),
          }}
        />

        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)'
              }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Program</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Start Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </TableContainer>

        {renderClientDialog()}
        {renderDeleteConfirmDialog()}

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setAlert({ ...alert, open: false })} 
            severity={alert.severity}
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
};

export default ClientsPage;
