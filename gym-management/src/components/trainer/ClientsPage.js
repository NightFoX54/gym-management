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
  const [clientRequests, setClientRequests] = useState([
    {
      id: 1,
      name: 'Ahmet Beyaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      program: 'Weight Training',
      message: 'I want to focus on building muscle and strength.',
      preferredTime: 'Evening',
      status: 'pending',
      requestDate: '2024-02-15'
    },
  ]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await new Promise(resolve => 
        setTimeout(() => resolve(mockClients), 1000)
      );
      setClients(response);
    } catch (error) {
      showAlert('Failed to fetch clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'program'];
    return required.every(field => newClient[field].trim());
  };

  const handleAddClient = async () => {
    if (!validateForm()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClientData = {
        id: clients.length + 1,
        ...newClient,
        avatar: null
      };

      setClients(prev => [...prev, newClientData]);
      handleCloseDialog();
      showAlert('Client added successfully!', 'success');
    } catch (error) {
      showAlert('Failed to add client', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClient = (clientId) => {
    setDeleteConfirm({ open: true, clientId });
  };

  const confirmDelete = async () => {
    const clientId = deleteConfirm.clientId;
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClients(prev => prev.filter(client => client.id !== clientId));
      showAlert('Client deleted successfully!', 'success');
    } catch (error) {
      showAlert('Failed to delete client', 'error');
    } finally {
      setActionLoading(false);
      setDeleteConfirm({ open: false, clientId: null });
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setNewClient({
      ...client,
      startDate: client.startDate || '', // Ensure date format compatibility
      scheduleTime: client.scheduleTime || ''
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
    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/${contact}`, '_blank');
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedClient) {
        // Update existing client
        setClients(prev => prev.map(client => 
          client.id === selectedClient.id ? { ...newClient, id: client.id } : client
        ));
        showAlert('Client updated successfully!', 'success');
      } else {
        // Add new client
        const newClientData = {
          id: clients.length + 1,
          ...newClient,
          avatar: null
        };
        setClients(prev => [...prev, newClientData]);
        showAlert('Client added successfully!', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showAlert(selectedClient ? 'Failed to update client' : 'Failed to add client', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        const approvedRequest = clientRequests.find(req => req.id === requestId);
        const newClient = {
          id: clients.length + 1,
          name: approvedRequest.name,
          email: approvedRequest.email,
          phone: approvedRequest.phone,
          program: approvedRequest.program,
          status: 'Active',
          startDate: new Date().toISOString().split('T')[0],
          avatar: null
        };
        setClients(prev => [...prev, newClient]);
        showAlert('Client request approved successfully!', 'success');
      } else {
        showAlert('Client request rejected', 'info');
      }
      
      setClientRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      showAlert('Failed to process request', 'error');
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

    if (clients.length === 0) {
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
                src={client.avatar}
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                {client.name[0]}
              </Avatar>
              <Typography color={isDarkMode ? 'white' : 'inherit'}>{client.name}</Typography>
            </Box>
          </Fade>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#25D366 !important', // WhatsApp green with !important
                '&:hover': {
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                }
              }} 
              onClick={() => handleContactAction('whatsapp', client.phone)}
            >
              <WhatsApp />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#EA4335 !important', // Gmail red with !important
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
        <TableCell>{client.program}</TableCell>
        <TableCell>
          <Chip
            label={client.status}
            color={client.status === 'Active' ? 'success' : 'warning'}
            size="small"
          />
        </TableCell>
        <TableCell>{client.startDate}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#ff4757' }} onClick={() => handleEditClient(client)}>
              <Edit />
            </IconButton>
            <IconButton size="small" sx={{ color: '#666' }} onClick={() => handleDeleteClient(client.id)}>
              <Delete />
            </IconButton>
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
                            Phone: {request.phone}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Program: {request.program}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Preferred Time: {request.preferredTime}
                          </Typography>
                        </Grid>
                      </Grid>

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

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Add the requests section here, before the existing content */}
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
              setSelectedClient(null);
              setOpenDialog(true);
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
              {selectedClient ? <Edit /> : <PersonAdd />}
              {selectedClient ? 'Update Client' : 'Add New Client'}
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#ff4757' }} />
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newClient.phone}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Program</InputLabel>
                  <Select
                    name="program"
                    value={newClient.program}
                    onChange={handleInputChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <FitnessCenter sx={{ color: '#ff4757', ml: 2 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Weight Training">Weight Training</MenuItem>
                    <MenuItem value="Cardio">Cardio</MenuItem>
                    <MenuItem value="Yoga">Yoga</MenuItem>
                    <MenuItem value="CrossFit">CrossFit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={newClient.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Time"
                  name="scheduleTime"
                  type="time"
                  value={newClient.scheduleTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
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
              {selectedClient ? 'Update Client' : 'Add Client'}
            </LoadingButton>
          </DialogActions>
        </Dialog>

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

const mockClients = [
  {
    id: 1,
    name: 'Faruk Yılmaz',
    avatar: null,
    phone: '+90 532 123 4567',
    email: 'faruk@example.com',
    program: 'Weight Training',
    status: 'Active',
    startDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Mahmut Mahmutoğlu',
    avatar: null,
    phone: '+90 533 234 5678',
    email: 'mahmut@example.com',
    program: 'Cardio',
    status: 'On Hold',
    startDate: '2024-02-01',
  },
];

export default ClientsPage;
