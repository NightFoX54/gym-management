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

  const handleDeleteClient = async (clientId) => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClients(prev => prev.filter(client => client.id !== clientId));
      showAlert('Client deleted successfully!', 'success');
    } catch (error) {
      showAlert('Failed to delete client', 'error');
    } finally {
      setActionLoading(false);
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
            <Typography color="textSecondary">
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
            bgcolor: 'rgba(255, 71, 87, 0.04)',
            transition: 'background-color 0.3s ease'
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
              <Typography>{client.name}</Typography>
            </Box>
          </Fade>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#25D366' }} onClick={() => handleContactAction('whatsapp', client.phone)}>
              <WhatsApp />
            </IconButton>
            <IconButton size="small" sx={{ color: '#ff4757' }} onClick={() => handleContactAction('email', client.email)}>
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

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
    name: 'John Doe',
    avatar: null,
    phone: '+90 532 123 4567',
    email: 'john@example.com',
    program: 'Weight Training',
    status: 'Active',
    startDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: null,
    phone: '+90 533 234 5678',
    email: 'jane@example.com',
    program: 'Cardio',
    status: 'On Hold',
    startDate: '2024-02-01',
  },
];

export default ClientsPage;
