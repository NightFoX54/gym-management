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
  Zoom,
  Collapse,
  Divider,
  CardContent,
  Stack,
  Tabs,
  Tab,
  LinearProgress,
  Card,
  CardActions,
} from '@mui/material';
import { 
  LoadingButton,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
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
  AccessTimeFilled,
  ExpandMore,
  Info as InfoIcon,
  DirectionsRun as DirectionsRunIcon,
  MonitorWeight as MonitorWeightIcon,
  BarChart as BarChartIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import RequestCard from './RequestCard';

const ClientsPage = ({ isDarkMode }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState(''); // Add this line to define the error state
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
  const [sessionRequests, setSessionRequests] = useState([]);
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [trainerId, setTrainerId] = useState(null);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [clientDetailTab, setClientDetailTab] = useState(0);
  const [clientDetails, setClientDetails] = useState(null);
  const [clientDetailsLoading, setClientDetailsLoading] = useState(false);
  const [requestTabValue, setRequestTabValue] = useState(0);
  const [progressData, setProgressData] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [statFormOpen, setStatFormOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ targetWeight: '', targetBodyFat: '', notes: '' });
  const [newStat, setNewStat] = useState({ weight: '', bodyFat: '', height: '', notes: '' });
  const [sessionDetails, setSessionDetails] = useState(null);
  const [sessionDetailsLoading, setSessionDetailsLoading] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState(null);
  const [exerciseProgressLoading, setExerciseProgressLoading] = useState(false);
  const [exerciseGoalFormOpen, setExerciseGoalFormOpen] = useState(false);
  const [exerciseProgressFormOpen, setExerciseProgressFormOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [newExerciseGoal, setNewExerciseGoal] = useState({
    exerciseName: '',
    targetWeight: '',
    targetReps: '',
    targetDuration: '',
    targetDistance: '',
    notes: '',
    goalDate: new Date().toISOString().slice(0, 10)
  });
  const [newExerciseProgress, setNewExerciseProgress] = useState({
    exerciseName: '',
    weight: '',
    reps: '',
    duration: '',
    distance: '',
    notes: '',
    entryDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    // Get the trainer ID from user in local storage
    const userStr = localStorage.getItem('user');
    try {
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("Found user in localStorage:", user);
        
        if (user && user.id) {
          console.log("Setting trainer ID to:", user.id);
          setTrainerId(user.id);
        } else {
          console.log("User exists but no ID found");
          setError("User ID not found. Please log in again.");
        }
      } else {
        // No user in localStorage - likely not logged in
        console.log("No user found in localStorage");
        setError("You are not logged in. Please log in to view clients.");
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setError("Error loading user data. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (trainerId) {
      fetchClients();
      fetchRequests();
      fetchSessionRequests();
      fetchRescheduleRequests();
    }
  }, [trainerId]);

  useEffect(() => {
    if (clientDetails) {
      // Always start with profile tab when opening client details
      setClientDetailTab(0);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (clientDetails && clientDetailTab === 1) {
      setProgressLoading(true);
      fetch(`http://localhost:8080/api/progress/${clientDetails.id}`)
        .then(res => res.json())
        .then(data => setProgressData(data))
        .finally(() => setProgressLoading(false));
    }
  }, [clientDetails, clientDetailTab]);

  useEffect(() => {
    if (clientDetails && clientDetailTab === 3) {
      setExerciseProgressLoading(true);
      fetch(`http://localhost:8080/api/exercise-progress/${clientDetails.id}`)
        .then(res => res.json())
        .then(data => setExerciseProgress(data))
        .finally(() => setExerciseProgressLoading(false));
    }
  }, [clientDetails, clientDetailTab]);

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

  const fetchSessionRequests = async () => {
    try {
      console.log(`Fetching session requests for trainer ID: ${trainerId}`);
      const response = await fetch(`http://localhost:8080/api/trainer/${trainerId}/session-requests`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Session requests fetched:", data);
        setSessionRequests(data);
      } else {
        console.error("Failed to fetch session requests");
      }
    } catch (error) {
      console.error("Error fetching session requests:", error);
    }
  };

  const fetchRescheduleRequests = async () => {
    try {
      console.log(`Fetching reschedule requests for trainer ID: ${trainerId}`);
      const response = await fetch(`http://localhost:8080/api/trainer/${trainerId}/reschedule-requests`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Reschedule requests fetched:", data);
        setRescheduleRequests(data);
      } else {
        console.error("Failed to fetch reschedule requests");
      }
    } catch (error) {
      console.error("Error fetching reschedule requests:", error);
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

  const handleClientRowClick = async (clientId, event) => {
    // Don't expand if clicking on action buttons
    if (event.target.closest('button')) {
      return;
    }
    
    // Toggle expanded state
    if (expandedClientId === clientId) {
      setExpandedClientId(null);
      setSessionDetails(null);
      return;
    }
    
    setExpandedClientId(clientId);
    setClientDetailTab(0);
    setClientDetailsLoading(true);
    setSessionDetailsLoading(true);
    
    try {
      // Find the basic client info from our current list
      const clientBasicInfo = clients.find(c => c.id === clientId);
      if (!clientBasicInfo) {
        throw new Error("Client not found");
      }
      setClientDetails(clientBasicInfo);

      // Fetch session details
      console.log('Fetching session details for client:', clientId);
      const sessionRes = await fetch(`http://localhost:8080/api/trainer/${trainerId}/clients/${clientId}/sessions`);
      if (!sessionRes.ok) throw new Error('Failed to fetch session details');
      const sessionData = await sessionRes.json();
      console.log('Session details received:', sessionData);
      setSessionDetails(sessionData);

      // Fetch progress data
      setProgressLoading(true);
      const progressRes = await fetch(`http://localhost:8080/api/progress/${clientId}`);
      if (!progressRes.ok) throw new Error('Failed to fetch progress data');
      const progress = await progressRes.json();
      setProgressData(progress);
    } catch (error) {
      console.error('Error fetching client details:', error);
      showAlert('Failed to load client details', 'error');
    } finally {
      setClientDetailsLoading(false);
      setSessionDetailsLoading(false);
      setProgressLoading(false);
    }
  };

  const handleClientDetailTabChange = (event, newValue) => {
    setClientDetailTab(newValue);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderClientDetails = () => {
    if (!clientDetails || clientDetailsLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} sx={{ py: 3, borderBottom: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={30} sx={{ color: '#ff4757' }} />
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, borderBottom: '1px solid', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255,255,255,0.1)' }}>
          <Collapse 
            in={true} 
            timeout={500} 
            unmountOnExit
            sx={{ transformOrigin: 'top' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgb(44, 62, 80) 0%, #1a1a2e 100%)', // Match exactly with clients management header
                borderTop: '1px dashed',
                borderTopColor: isDarkMode ? 'rgba(255,107,129,0.3)' : 'rgba(0,0,0,0.1)', 
                boxShadow: isDarkMode 
                  ? 'inset 0 5px 15px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,107,129,0.05)' 
                  : 'inset 0 5px 15px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#fff', // White text for both modes
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 600,
                  mb: 2
                }}>
                  <InfoIcon /> Client Details
                </Typography>
                
                <Tabs 
                  value={clientDetailTab} 
                  onChange={handleClientDetailTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    mb: 3,
                    '& .MuiTabs-indicator': {
                      backgroundColor: isDarkMode ? '#ff6b81' : '#ff4757',
                      height: 3,
                      borderRadius: '3px',
                    },
                    '& .MuiTab-root': {
                      color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 500,
                      '&.Mui-selected': {
                        color: isDarkMode ? '#ff6b81' : '#ff4757',
                        fontWeight: 600,
                      },
                      '&:hover': {
                        color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                      }
                    },
                  }}
                >
                  <Tab label="Profile" icon={<InfoIcon />} iconPosition="start" />
                  <Tab label="Weight Progress" icon={<BarChartIcon />} iconPosition="start" />
                  <Tab label="Sessions" icon={<HistoryIcon />} iconPosition="start" />
                  <Tab label="Exercise Progress" icon={<FitnessCenterIcon />} iconPosition="start" />
                </Tabs>
                
                {/* Profile Tab */}
                {clientDetailTab === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          p: 2.5, 
                          bgcolor: 'rgba(255,255,255,0.08)', // Lighter panel that complements header gradient
                          borderRadius: '10px',
                          height: '100%',
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            color: '#ff6b81', // Keep accent color for subtitle
                            fontWeight: 600,
                            fontSize: '1rem'
                          }}>
                            Personal Information
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Height
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {progressData?.statisticsHistory[progressData?.statisticsHistory.length - 1]?.height || '-'} cm
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Start Weight
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {progressData?.statisticsHistory[0]?.weight || '-'} kg
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Current Weight
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {progressData?.statisticsHistory[progressData?.statisticsHistory.length - 1]?.weight || '-'} kg
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Target Weight
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {progressData?.goal?.targetWeight || '-'} kg
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Body Fat
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {progressData?.statisticsHistory[progressData?.statisticsHistory.length - 1]?.bodyFat || '-'} %
                              </Typography>
                            </Box>
                          </Stack>
                          {(!progressData?.goal) && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => setClientDetailTab(1)}
                                sx={{ 
                                  bgcolor: '#ff4757',
                                  '&:hover': { bgcolor: '#ff3747' }
                                }}
                              >
                                Set Client Goals
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          p: 2.5, 
                          bgcolor: 'rgba(255,255,255,0.08)', // Lighter panel that complements header gradient
                          borderRadius: '10px',
                          height: '100%',
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            color: '#ff6b81', // Keep accent color for subtitle
                            fontWeight: 600,
                            fontSize: '1rem'
                          }}>
                            Contact Information
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Email
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#fff', // White text in both modes 
                              fontWeight: 500,
                              mt: 0.5
                            }}>
                              {clientDetails.email}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Phone
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#fff', // White text in both modes
                              fontWeight: 500,
                              mt: 0.5
                            }}>
                              {clientDetails.phone || 'Not provided'}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            {clientDetails.phone && (
                              <Button
                                variant="outlined"
                                startIcon={<WhatsApp />}
                                onClick={() => handleContactAction('whatsapp', clientDetails.phone)}
                                sx={{
                                  color: '#25D366',
                                  borderColor: '#25D366',
                                  '&:hover': {
                                    borderColor: '#25D366',
                                    bgcolor: 'rgba(37, 211, 102, 0.1)',
                                  }
                                }}
                              >
                                WhatsApp
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              startIcon={<Mail />}
                              onClick={() => handleContactAction('email', clientDetails.email)}
                              sx={{
                                color: '#EA4335',
                                borderColor: '#EA4335',
                                '&:hover': {
                                  borderColor: '#EA4335',
                                  bgcolor: 'rgba(234, 67, 53, 0.1)',
                                }
                              }}
                            >
                              Email
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
                
                {/* Progress Tab */}
                {clientDetailTab === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {progressLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress color="primary" />
                      </Box>
                    ) : progressData && !progressData.goal ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h6" color="error" gutterBottom>
                          No goal set. Please set a goal to start tracking progress.
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => setGoalFormOpen(true)}>
                          Set Goal
                        </Button>
                        <Dialog open={goalFormOpen} onClose={() => setGoalFormOpen(false)}>
                          <DialogTitle>Set Progress Goal</DialogTitle>
                          <DialogContent>
                            <TextField
                              label="Target Weight (kg)"
                              type="number"
                              fullWidth
                              margin="normal"
                              value={newGoal.targetWeight}
                              onChange={e => setNewGoal({ ...newGoal, targetWeight: e.target.value })}
                            />
                            <TextField
                              label="Target Body Fat (%)"
                              type="number"
                              fullWidth
                              margin="normal"
                              value={newGoal.targetBodyFat}
                              onChange={e => setNewGoal({ ...newGoal, targetBodyFat: e.target.value })}
                            />
                            <TextField
                              label="Notes"
                              fullWidth
                              margin="normal"
                              value={newGoal.notes}
                              onChange={e => setNewGoal({ ...newGoal, notes: e.target.value })}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setGoalFormOpen(false)}>Cancel</Button>
                            <Button onClick={handleSetGoal} variant="contained" color="primary">Save Goal</Button>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    ) : progressData && progressData.goal ? (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '10px', border: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ color: '#ff6b81', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BarChartIcon fontSize="small" /> Weight Progress
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ mt: 3, mb: 4, height: 20, width: '100%', bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 5, position: 'relative', overflow: 'hidden', border: '1px solid', borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                              <LinearProgress
                                variant="determinate"
                                value={(() => {
                                  const stats = progressData.statisticsHistory;
                                  if (!stats || stats.length === 0) return 0;
                                  const start = stats[0].weight;
                                  const current = stats[stats.length - 1].weight;
                                  const target = progressData.goal.targetWeight;
                                  if (!start || !current || !target || start === target) return 0;
                                  return ((start - current) / (start - target)) * 100;
                                })()}
                                sx={{ height: '100%', borderRadius: 5, backgroundColor: 'transparent', '& .MuiLinearProgress-bar': { backgroundColor: '#ff4757' } }}
                              />
                              <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                  {(() => {
                                    const stats = progressData.statisticsHistory;
                                    if (!stats || stats.length === 0) return '0%';
                                    const start = stats[0].weight;
                                    const current = stats[stats.length - 1].weight;
                                    const target = progressData.goal.targetWeight;
                                    if (!start || !current || !target || start === target) return '0%';
                                    return Math.round(((start - current) / (start - target)) * 100) + '%';
                                  })()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">Starting</Typography>
                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {progressData.statisticsHistory.length > 0 ? progressData.statisticsHistory[0].weight : '-'} kg
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">Current</Typography>
                                <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600 }}>
                                  {progressData.statisticsHistory.length > 0 ? progressData.statisticsHistory[progressData.statisticsHistory.length - 1].weight : '-'} kg
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">Target</Typography>
                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {progressData.goal.targetWeight} kg
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#ff6b81' : '#ff4757', mt: 4, mb: 1, fontWeight: 600 }}>
                              Weight Loss Stats
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                              <Box>
                                <Typography variant="body2" color="rgba(255,255,255,0.7)">Total Loss</Typography>
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {(() => {
                                    const stats = progressData.statisticsHistory;
                                    if (!stats || stats.length === 0) return '-';
                                    const start = stats[0].weight;
                                    const current = stats[stats.length - 1].weight;
                                    return (start - current).toFixed(1) + ' kg';
                                  })()}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="rgba(255,255,255,0.7)">Still To Go</Typography>
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {(() => {
                                    const stats = progressData.statisticsHistory;
                                    if (!stats || stats.length === 0) return '-';
                                    const current = stats[stats.length - 1].weight;
                                    const target = progressData.goal.targetWeight;
                                    return (current - target).toFixed(1) + ' kg';
                                  })()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                              <Button variant="outlined" color="primary" onClick={() => setGoalFormOpen(true)}>
                                Update Goal
                              </Button>
                              <Button variant="contained" color="primary" onClick={() => setStatFormOpen(true)}>
                                Add Progress Entry
                              </Button>
                            </Box>
                            {/* Goal Form Dialog */}
                            <Dialog open={goalFormOpen} onClose={() => setGoalFormOpen(false)}>
                              <DialogTitle>Set Progress Goal</DialogTitle>
                              <DialogContent>
                                <TextField
                                  label="Target Weight (kg)"
                                  type="number"
                                  fullWidth
                                  margin="normal"
                                  value={newGoal.targetWeight}
                                  onChange={e => setNewGoal({ ...newGoal, targetWeight: e.target.value })}
                                />
                                <TextField
                                  label="Target Body Fat (%)"
                                  type="number"
                                  fullWidth
                                  margin="normal"
                                  value={newGoal.targetBodyFat}
                                  onChange={e => setNewGoal({ ...newGoal, targetBodyFat: e.target.value })}
                                />
                                <TextField
                                  label="Notes"
                                  fullWidth
                                  margin="normal"
                                  value={newGoal.notes}
                                  onChange={e => setNewGoal({ ...newGoal, notes: e.target.value })}
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => setGoalFormOpen(false)}>Cancel</Button>
                                <Button onClick={handleSetGoal} variant="contained" color="primary">Save Goal</Button>
                              </DialogActions>
                            </Dialog>
                            {/* Stat Form Dialog */}
                            <Dialog open={statFormOpen} onClose={() => setStatFormOpen(false)}>
                              <DialogTitle>Add Progress Entry</DialogTitle>
                              <DialogContent>
                                <TextField
                                  label="Weight (kg)"
                                  type="number"
                                  fullWidth
                                  margin="normal"
                                  value={newStat.weight}
                                  onChange={e => setNewStat({ ...newStat, weight: e.target.value })}
                                />
                                <TextField
                                  label="Body Fat (%)"
                                  type="number"
                                  fullWidth
                                  margin="normal"
                                  value={newStat.bodyFat}
                                  onChange={e => setNewStat({ ...newStat, bodyFat: e.target.value })}
                                />
                                <TextField
                                  label="Height (cm)"
                                  type="number"
                                  fullWidth
                                  margin="normal"
                                  value={newStat.height}
                                  onChange={e => setNewStat({ ...newStat, height: e.target.value })}
                                />
                                <TextField
                                  label="Notes"
                                  fullWidth
                                  margin="normal"
                                  value={newStat.notes}
                                  onChange={e => setNewStat({ ...newStat, notes: e.target.value })}
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => setStatFormOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddStat} variant="contained" color="primary">Add Entry</Button>
                              </DialogActions>
                            </Dialog>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '10px', border: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ color: '#ff6b81', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <MonitorWeightIcon fontSize="small" /> Progress History
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Timeline position="right" sx={{ p: 0 }}>
                              {progressData.statisticsHistory && progressData.statisticsHistory.length > 0 ? progressData.statisticsHistory.map((progress, index) => (
                                <TimelineItem key={index}>
                                  <TimelineOppositeContent sx={{ flex: 0.2, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                    {progress.entryDate}
                                  </TimelineOppositeContent>
                                  <TimelineSeparator>
                                    <TimelineDot sx={{ bgcolor: '#ff4757', boxShadow: '0 0 0 4px rgba(255,71,87,0.2)' }}>
                                      <MonitorWeightIcon fontSize="small" />
                                    </TimelineDot>
                                    {index < progressData.statisticsHistory.length - 1 && (
                                      <TimelineConnector sx={{ bgcolor: isDarkMode ? 'rgba(255,71,87,0.4)' : 'rgba(255,71,87,0.3)', height: 40 }} />
                                    )}
                                  </TimelineSeparator>
                                  <TimelineContent sx={{ py: '10px', px: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                                      {progress.weight} kg
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                      {progress.notes}
                                    </Typography>
                                  </TimelineContent>
                                </TimelineItem>
                              )) : (
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                  No progress entries yet.
                                </Typography>
                              )}
                            </Timeline>
                          </Box>
                        </Grid>
                      </Grid>
                    ) : null}
                  </motion.div>
                )}
                
                {/* Sessions Tab */}
                {clientDetailTab === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {sessionDetailsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ 
                            p: 2.5, 
                            bgcolor: 'rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'rgba(255,255,255,0.12)',
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ 
                              color: '#ff6b81',
                              fontWeight: 600,
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <HistoryIcon fontSize="small" /> Session Statistics
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h4" sx={{ 
                                    color: '#ff4757',
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                  }}>
                                    {sessionDetails?.remainingSessions || 0}
                                  </Typography>
                                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Remaining
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h4" sx={{ 
                                    color: '#ff4757',
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                  }}>
                                    {sessionDetails?.completedSessions || 0}
                                  </Typography>
                                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Completed
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                            
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
                                Sessions Progress
                              </Typography>
                              <Box sx={{ mt: 1, mb: 2, height: 20, width: '100%', bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 5, position: 'relative', overflow: 'hidden', border: '1px solid', borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={(() => {
                                    const completed = sessionDetails?.completedSessions || 0;
                                    const remaining = sessionDetails?.remainingSessions || 0;
                                    const total = completed + remaining;
                                    return total > 0 ? (completed / total) * 100 : 0;
                                  })()}
                                  sx={{ 
                                    height: '100%', 
                                    borderRadius: 5, 
                                    backgroundColor: 'transparent',
                                    '& .MuiLinearProgress-bar': { 
                                      backgroundColor: '#ff4757',
                                      transition: 'transform 1s ease-in-out'
                                    }
                                  }}
                                />
                                <Box sx={{ 
                                  position: 'absolute', 
                                  left: 0, 
                                  right: 0, 
                                  top: 0, 
                                  bottom: 0, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center'
                                }}>
                                  <Typography variant="caption" sx={{ 
                                    color: '#fff', 
                                    fontWeight: 'bold',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                  }}>
                                    {(() => {
                                      const completed = sessionDetails?.completedSessions || 0;
                                      const remaining = sessionDetails?.remainingSessions || 0;
                                      const total = completed + remaining;
                                      return total > 0 ? Math.round((completed / total) * 100) : 0;
                                    })()}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
                                Session History
                              </Typography>
                              <Timeline position="right" sx={{ p: 0, mt: 2 }}>
                                {sessionDetails?.pastSessions?.slice(0, 3).map((session, index) => (
                                  <TimelineItem key={session.id}>
                                    <TimelineOppositeContent sx={{ flex: 0.2, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                      {new Date(session.date).toLocaleDateString()}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                      <TimelineDot sx={{ bgcolor: '#ff4757', boxShadow: '0 0 0 4px rgba(255,71,87,0.2)' }}>
                                        <FitnessCenter fontSize="small" />
                                      </TimelineDot>
                                      {index < 2 && <TimelineConnector sx={{ bgcolor: isDarkMode ? 'rgba(255,71,87,0.4)' : 'rgba(255,71,87,0.3)' }} />}
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                                        {session.type}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                        {session.time}
                                      </Typography>
                                    </TimelineContent>
                                  </TimelineItem>
                                ))}
                              </Timeline>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <Box sx={{ 
                            p: 2.5, 
                            bgcolor: 'rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'rgba(255,255,255,0.12)',
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ 
                              color: '#ff6b81',
                              fontWeight: 600,
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <CalendarToday fontSize="small" /> Upcoming Sessions
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ 
                                      color: '#fff',
                                      fontWeight: 600,
                                      border: 'none',
                                      fontSize: '0.875rem'
                                    }}>Date</TableCell>
                                    <TableCell sx={{ 
                                      color: '#fff',
                                      fontWeight: 600,
                                      border: 'none',
                                      fontSize: '0.875rem'
                                    }}>Time</TableCell>
                                    <TableCell sx={{ 
                                      color: '#fff',
                                      fontWeight: 600,
                                      border: 'none',
                                      fontSize: '0.875rem'
                                    }}>Type</TableCell>
                                    <TableCell align="right" sx={{ 
                                      color: '#fff',
                                      fontWeight: 600,
                                      border: 'none',
                                      fontSize: '0.875rem'
                                    }}>Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {sessionDetails?.upcomingSessions?.map((session, index) => (
                                    <TableRow key={session.id} hover sx={{
                                      '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                      },
                                      '& .MuiTableCell-root': {
                                        border: 'none',
                                        py: 1.5,
                                        color: 'rgba(255,255,255,0.9)',
                                      }
                                    }}>
                                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                                      <TableCell>{session.time}</TableCell>
                                      <TableCell>{session.type}</TableCell>
                                      <TableCell align="right">
                                        <Chip
                                          label={session.status}
                                          size="small"
                                          sx={{
                                            bgcolor: session.status === 'Confirmed' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                                            color: session.status === 'Confirmed' ? '#2ecc71' : '#ff4757',
                                            borderRadius: '4px',
                                            '& .MuiChip-label': {
                                              px: 1,
                                            }
                                          }}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {(!sessionDetails?.upcomingSessions || sessionDetails.upcomingSessions.length === 0) && (
                                    <TableRow>
                                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: 'rgba(255,255,255,0.5)' }}>
                                        No upcoming sessions
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            
                            
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </motion.div>
                )}

                {/* Exercise Progress Tab */}
                {clientDetailTab === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {exerciseProgressLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress color="primary" />
                      </Box>
                    ) : (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ 
                            p: 2.5, 
                            bgcolor: 'rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'rgba(255,255,255,0.12)',
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ 
                              color: '#ff6b81',
                              fontWeight: 600,
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <FitnessCenterIcon fontSize="small" /> Exercise Goals
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {exerciseProgress?.goals?.length > 0 ? (
                              <Stack spacing={2}>
                                {exerciseProgress.goals.map((goal, index) => (
                                  <Box key={index} sx={{ 
                                    p: 2, 
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                  }}>
                                    <Typography variant="subtitle2" sx={{ color: '#ff4757', mb: 1 }}>
                                      {goal.exerciseName}
                                    </Typography>
                                    <Grid container spacing={1}>
                                      {goal.targetWeight && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                            Target Weight: {goal.targetWeight} kg
                                          </Typography>
                                        </Grid>
                                      )}
                                      {goal.targetReps && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                            Target Reps: {goal.targetReps}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {goal.targetDuration && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                            Target Duration: {goal.targetDuration} min
                                          </Typography>
                                        </Grid>
                                      )}
                                      {goal.targetDistance && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                            Target Distance: {goal.targetDistance} km
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                    {goal.notes && (
                                      <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                        {goal.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
                                No exercise goals set yet
                              </Typography>
                            )}
                            
                            <Button 
                              variant="contained" 
                              fullWidth 
                              sx={{ mt: 2 }}
                              onClick={() => setExerciseGoalFormOpen(true)}
                            >
                              Set New Goal
                            </Button>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Box sx={{ 
                            p: 2.5, 
                            bgcolor: 'rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'rgba(255,255,255,0.12)',
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ 
                              color: '#ff6b81',
                              fontWeight: 600,
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <BarChartIcon fontSize="small" /> Progress History
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {exerciseProgress?.goals?.length > 0 ? (
                              <>
                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                  <InputLabel>Select Exercise</InputLabel>
                                  <Select
                                    value={selectedExercise || ''}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                    label="Select Exercise"
                                  >
                                    {exerciseProgress.goals.map((goal, index) => (
                                      <MenuItem key={index} value={goal.exerciseName}>
                                        {goal.exerciseName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>

                                {selectedExercise && (
                                  <>
                                    <Timeline position="right" sx={{ p: 0 }}>
                                      {exerciseProgress.progress
                                        .filter(p => p.exerciseName === selectedExercise)
                                        .map((progress, index) => (
                                          <TimelineItem key={index}>
                                            <TimelineOppositeContent sx={{ flex: 0.2, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                              {progress.entryDate}
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                              <TimelineDot sx={{ bgcolor: '#ff4757' }}>
                                                <FitnessCenterIcon fontSize="small" />
                                              </TimelineDot>
                                              {index < exerciseProgress.progress.length - 1 && (
                                                <TimelineConnector sx={{ bgcolor: 'rgba(255,71,87,0.3)' }} />
                                              )}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                              <Box sx={{ p: 1 }}>
                                                <Grid container spacing={1}>
                                                  {progress.weight && (
                                                    <Grid item xs={6}>
                                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                        Weight: {progress.weight} kg
                                                      </Typography>
                                                    </Grid>
                                                  )}
                                                  {progress.reps && (
                                                    <Grid item xs={6}>
                                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                        Reps: {progress.reps}
                                                      </Typography>
                                                    </Grid>
                                                  )}
                                                  {progress.duration && (
                                                    <Grid item xs={6}>
                                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                        Duration: {progress.duration} min
                                                      </Typography>
                                                    </Grid>
                                                  )}
                                                  {progress.distance && (
                                                    <Grid item xs={6}>
                                                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                        Distance: {progress.distance} km
                                                      </Typography>
                                                    </Grid>
                                                  )}
                                                </Grid>
                                                {progress.notes && (
                                                  <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                                    {progress.notes}
                                                  </Typography>
                                                )}
                                              </Box>
                                            </TimelineContent>
                                          </TimelineItem>
                                        ))}
                                    </Timeline>

                                    <Button 
                                      variant="contained" 
                                      fullWidth 
                                      sx={{ mt: 2 }}
                                      onClick={() => setExerciseProgressFormOpen(true)}
                                    >
                                      Add Progress Entry
                                    </Button>
                                  </>
                                )}
                              </>
                            ) : (
                              <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
                                Set an exercise goal to start tracking progress
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    {/* Exercise Goal Form Dialog */}
                    <Dialog 
                      open={exerciseGoalFormOpen} 
                      onClose={() => setExerciseGoalFormOpen(false)}
                      maxWidth="sm"
                      fullWidth
                    >
                      <DialogTitle>Set Exercise Goal</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Exercise Name"
                          fullWidth
                          margin="normal"
                          value={newExerciseGoal.exerciseName}
                          onChange={e => setNewExerciseGoal({ ...newExerciseGoal, exerciseName: e.target.value })}
                        />
                        <TextField
                          label="Target Weight (kg)"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseGoal.targetWeight}
                          onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetWeight: e.target.value })}
                        />
                        <TextField
                          label="Target Reps"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseGoal.targetReps}
                          onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetReps: e.target.value })}
                        />
                        <TextField
                          label="Target Duration (minutes)"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseGoal.targetDuration}
                          onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetDuration: e.target.value })}
                        />
                        <TextField
                          label="Target Distance (km)"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseGoal.targetDistance}
                          onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetDistance: e.target.value })}
                        />
                        <TextField
                          label="Notes"
                          fullWidth
                          multiline
                          rows={3}
                          margin="normal"
                          value={newExerciseGoal.notes}
                          onChange={e => setNewExerciseGoal({ ...newExerciseGoal, notes: e.target.value })}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setExerciseGoalFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSetExerciseGoal} variant="contained" color="primary">Save Goal</Button>
                      </DialogActions>
                    </Dialog>

                    {/* Exercise Progress Form Dialog */}
                    <Dialog 
                      open={exerciseProgressFormOpen} 
                      onClose={() => setExerciseProgressFormOpen(false)}
                      maxWidth="sm"
                      fullWidth
                    >
                      <DialogTitle>Add Progress Entry</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Weight (kg)"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseProgress.weight}
                          onChange={e => setNewExerciseProgress({ ...newExerciseProgress, weight: e.target.value })}
                        />
                        <TextField
                          label="Reps"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseProgress.reps}
                          onChange={e => setNewExerciseProgress({ ...newExerciseProgress, reps: e.target.value })}
                        />
                        <TextField
                          label="Duration (minutes)"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseProgress.duration}
                          onChange={e => setNewExerciseProgress({ ...newExerciseProgress, duration: e.target.value })}
                        />
                        <TextField
                          label="Distance (km)"
                          type="number"
                          fullWidth
                          margin="normal"
                          value={newExerciseProgress.distance}
                          onChange={e => setNewExerciseProgress({ ...newExerciseProgress, distance: e.target.value })}
                        />
                        <TextField
                          label="Notes"
                          fullWidth
                          multiline
                          rows={3}
                          margin="normal"
                          value={newExerciseProgress.notes}
                          onChange={e => setNewExerciseProgress({ ...newExerciseProgress, notes: e.target.value })}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setExerciseProgressFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddExerciseProgress} variant="contained" color="primary">Add Entry</Button>
                      </DialogActions>
                    </Dialog>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          </Collapse>
        </TableCell>
      </TableRow>
    );
  };

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

    const rows = [];
    filteredClients.forEach((client) => {
      rows.push(
        <TableRow 
          key={client.id}
          onClick={(e) => handleClientRowClick(client.id, e)}
          sx={{
            cursor: 'pointer',
            bgcolor: 'transparent', // Always transparent regardless of expanded state
            '&:hover': { 
              bgcolor: isDarkMode ? 'rgba(255, 71, 87, 0.1)' : 'rgba(204, 181, 183, 0.04)',
              transition: 'background-color 0.3s ease'
            },
            '& .MuiTableCell-root': {
              color: isDarkMode ? '#fff' : 'inherit',
              borderBottom: expandedClientId === client.id ? 'none' : `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            },
            position: 'relative'
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography color={isDarkMode ? 'white' : 'inherit'}>
                    {client.name}
                  </Typography>
                </Box>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactAction('whatsapp', client.phone);
                  }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleContactAction('email', client.email);
                }}
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
                <IconButton 
                  size="small" 
                  sx={{ color: '#ff4757' }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClient(client);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete client" TransitionComponent={Zoom} arrow>
                <IconButton 
                  size="small" 
                  sx={{ color: '#666' }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClient(client.id);
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
          <Box 
            sx={{
              position: 'absolute',
              right: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              color: isDarkMode ? '#ff6b81' : '#ff4757',
              transition: 'transform 0.3s ease',
              transform: expandedClientId === client.id 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: isDarkMode 
                ? 'rgba(255,107,129,0.15)' 
                : 'rgba(255,71,87,0.1)',
              '&::after': {
                content: '""',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `5px solid ${isDarkMode ? '#ff6b81' : '#ff4757'}`,
                position: 'absolute',
              }
            }}
          />
        </TableRow>
      );
      
      // Add client details row if this client is expanded
      if (expandedClientId === client.id) {
        rows.push(renderClientDetails());
      }
    });
    
    return rows;
  };

  const renderRequestsSection = () => {
    return (
      <Box sx={{ mt: 3 }}>
      <Box 
        sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 3,
        background: 'linear-gradient(135deg, rgb(44, 62, 80) 0%, #1a1a2e 100%)',
        p: 3,
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 600, 
          color: '#fff',
          mb: 1 
        }}>
          Pending Requests
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {clientRequests.length + sessionRequests.length + rescheduleRequests.length} Total Requests
        </Typography>
        </Box>
      </Box>
      
      <Tabs
        value={requestTabValue}
        onChange={(e, newValue) => setRequestTabValue(newValue)}
        sx={{
        mb: 3,
        '& .MuiTabs-indicator': {
          backgroundColor: isDarkMode ? '#ff6b81' : '#ff4757',
          height: 3,
          borderRadius: '3px',
        },
        '& .MuiTab-root': {
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          fontWeight: 500,
          '&.Mui-selected': {
          color: isDarkMode ? '#ff6b81' : '#ff4757',
          fontWeight: 600,
          },
          '&:hover': {
          color: isDarkMode ? '#ffffff' : '#000000',
          }
        },
        }}
        TabIndicatorProps={{
        sx: {
          display: 'block',
        }
        }}
      >
        <Tab 
        icon={<PersonAdd sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} />} 
        iconPosition="start" 
        label={`Registration (${clientRequests.length})`} 
        />
        <Tab 
        icon={<AccessTimeFilled sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} />} 
        iconPosition="start" 
        label={`Session (${sessionRequests.length})`} 
        />
        <Tab 
        icon={<CalendarToday sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} />} 
        iconPosition="start" 
        label={`Reschedule (${rescheduleRequests.length})`} 
        />
      </Tabs>

      {/* Registration Requests */}
      {requestTabValue === 0 && (
        <Box sx={{ minHeight: '300px' }}>
        <AnimatePresence>
          {clientRequests.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Grid container spacing={3}>
            {clientRequests.map((request, index) => (
              <Grid item xs={12} md={6} lg={4} key={request.id}>
                <RequestCard 
                  request={request}
                  type="registration"
                  index={index}
                  isDarkMode={isDarkMode}
                  handleAccept={handleAcceptRegistration}
                  handleDecline={handleDeclineRegistration}
                  actionLoading={actionLoading}
                />
              </Grid>
            ))}
            </Grid>
          </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(0,0,0,0.01)',
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)'
              }}>
                <PersonAdd sx={{ 
                  fontSize: '4rem', 
                  color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                  mb: 2
                }} />
                <Typography 
                  color={isDarkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary'}
                  variant="h6"
                >
                  No pending registration requests
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        </Box>
      )}

      {/* Session Requests */}
      {requestTabValue === 1 && (
        <Box sx={{ minHeight: '300px' }}>
          <AnimatePresence>
            {sessionRequests.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Grid container spacing={3}>
                  {sessionRequests.map((request, index) => (
                    <Grid item xs={12} md={6} lg={4} key={request.id}>
                      <RequestCard 
                        request={request}
                        type="session"
                        index={index}
                        isDarkMode={isDarkMode}
                        handleAccept={handleAcceptSession}
                        handleDecline={handleDeclineSession}
                        actionLoading={actionLoading}
                      />
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(0,0,0,0.01)',
                  borderRadius: '12px',
                  border: '1px dashed',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)'
                }}>
                  <AccessTimeFilled sx={{ 
                    fontSize: '4rem', 
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                    mb: 2
                  }} />
                  <Typography 
                    color={isDarkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary'}
                    variant="h6"
                  >
                    No pending session requests
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}

      {/* Reschedule Requests */}
      {requestTabValue === 2 && (
        <Box sx={{ minHeight: '300px' }}>
          <AnimatePresence>
            {rescheduleRequests.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Grid container spacing={3}>
                  {rescheduleRequests.map((request, index) => (
                    <Grid item xs={12} md={6} lg={4} key={request.id}>
                      <RequestCard 
                        request={request}
                        type="reschedule"
                        index={index}
                        isDarkMode={isDarkMode}
                        handleAccept={handleAcceptReschedule}
                        handleDecline={handleDeclineReschedule}
                        actionLoading={actionLoading}
                      />
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(0,0,0,0.01)',
                  borderRadius: '12px',
                  border: '1px dashed',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)'
                }}>
                  <CalendarToday sx={{ 
                    fontSize: '4rem', 
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                    mb: 2
                  }} />
                  <Typography 
                    color={isDarkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary'}
                    variant="h6"
                  >
                    No pending reschedule requests
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}
      </Box>
    );
  };

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

  // Determine if any requests exist
  const hasAnyRequests = clientRequests.length > 0 || 
                         sessionRequests.length > 0 || 
                         rescheduleRequests.length > 0;

  // Handle accepting a client registration request
  const handleAcceptRegistration = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initialSessions: 10 })
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve client request');
      }
      
      // Remove the request from the list
      setClientRequests(clientRequests.filter(req => req.id !== requestId));
      // Refresh the clients list
      fetchClients();
      setAlert({
        open: true,
        message: 'Client registration accepted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error accepting client registration:', error);
      setAlert({
        open: true,
        message: 'Error accepting client registration',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle declining a client registration request
  const handleDeclineRegistration = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject client request');
      }
      
      // Remove the request from the list
      setClientRequests(prev => prev.filter(req => req.id !== requestId));
      showAlert('Client request declined', 'info');
    } catch (error) {
      console.error('Error declining client request:', error);
      showAlert('Failed to decline client request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle accepting a session request
  const handleAcceptSession = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/approve-session-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve session request');
      }
      
      // Remove the request from the list
      setSessionRequests(sessionRequests.filter(req => req.id !== requestId));
      // Refresh the sessions list
      fetchSessions();
      setAlert({
        open: true,
        message: 'Session request accepted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error accepting session request:', error);
      setAlert({
        open: true,
        message: 'Error accepting session request',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle declining a session request
  const handleDeclineSession = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/reject-session-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to decline session request');
      }
      
      // Remove the session request from the list
      setSessionRequests(prev => prev.filter(req => req.id !== requestId));
      showAlert('Session request declined', 'info');
    } catch (error) {
      console.error('Error declining session:', error);
      showAlert('Failed to decline session request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle accepting a reschedule request
  const handleAcceptReschedule = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/approve-reschedule-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve reschedule request');
      }
      
      // Remove the request from the list
      setRescheduleRequests(rescheduleRequests.filter(req => req.id !== requestId));
      // Refresh the sessions list
      fetchSessions();
      setAlert({
        open: true,
        message: 'Reschedule request accepted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error accepting reschedule request:', error);
      setAlert({
        open: true,
        message: 'Error accepting reschedule request',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle declining a reschedule request
  const handleDeclineReschedule = async (requestId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/reject-reschedule-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to decline reschedule request');
      }
      
      // Remove the request from the list
      setRescheduleRequests(prev => prev.filter(req => req.id !== requestId));
      showAlert('Reschedule request declined', 'info');
    } catch (error) {
      console.error('Error declining reschedule request:', error);
      showAlert('Failed to decline reschedule request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/${trainerId}/sessions`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Sessions data received:", data);
      // You might want to store this in state if needed
      // For now, we just need to refresh the data after a reschedule
    } catch (error) {
      console.error('Error fetching sessions:', error);
      showAlert(`Failed to fetch sessions: ${error.message}`, 'error');
    }
  };

  const handleSetGoal = () => {
    fetch('http://localhost:8080/api/progress/goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newGoal,
        userId: clientDetails.id,
        setBy: trainerId,
        goalDate: new Date().toISOString().slice(0, 10)
      })
    })
      .then(res => res.json())
      .then(() => {
        setGoalFormOpen(false);
        setNewGoal({ targetWeight: '', targetBodyFat: '', notes: '' });
        fetch(`http://localhost:8080/api/progress/${clientDetails.id}`)
          .then(res => res.json())
          .then(data => setProgressData(data));
      });
  };

  const handleAddStat = () => {
    fetch('http://localhost:8080/api/progress/statistics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newStat,
        userId: clientDetails.id,
        enteredBy: trainerId,
        entryDate: new Date().toISOString().slice(0, 10)
      })
    })
      .then(res => res.json())
      .then(() => {
        setStatFormOpen(false);
        setNewStat({ weight: '', bodyFat: '', height: '', notes: '' });
        fetch(`http://localhost:8080/api/progress/${clientDetails.id}`)
          .then(res => res.json())
          .then(data => setProgressData(data));
      });
  };

  const handleSetExerciseGoal = () => {
    const goalData = {
      ...newExerciseGoal,
      userId: clientDetails.id,
      setBy: trainerId
    };

    fetch('http://localhost:8080/api/exercise-progress/goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    })
      .then(res => res.json())
      .then(() => {
        setExerciseGoalFormOpen(false);
        setNewExerciseGoal({
          exerciseName: '',
          targetWeight: '',
          targetReps: '',
          targetDuration: '',
          targetDistance: '',
          notes: '',
          goalDate: new Date().toISOString().slice(0, 10)
        });
        // Refresh exercise progress data
        return fetch(`http://localhost:8080/api/exercise-progress/${clientDetails.id}`);
      })
      .then(res => res.json())
      .then(data => setExerciseProgress(data));
  };

  const handleAddExerciseProgress = () => {
    const progressData = {
      ...newExerciseProgress,
      userId: clientDetails.id,
      enteredBy: trainerId,
      exerciseName: selectedExercise
    };

    fetch('http://localhost:8080/api/exercise-progress/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData)
    })
      .then(res => res.json())
      .then(() => {
        setExerciseProgressFormOpen(false);
        setNewExerciseProgress({
          exerciseName: '',
          weight: '',
          reps: '',
          duration: '',
          distance: '',
          notes: '',
          entryDate: new Date().toISOString().slice(0, 10)
        });
        // Refresh exercise progress data
        return fetch(`http://localhost:8080/api/exercise-progress/${clientDetails.id}`);
      })
      .then(res => res.json())
      .then(data => setExerciseProgress(data));
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Display error if present */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {/* Render pending requests section */}
        {renderRequestsSection()}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          background: 'linear-gradient(135deg,rgb(44, 62, 80) 0%, #1a1a2e 100%)',
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
          {/* Add New Client button removed - clients should be added through registration requests */}
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
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)', // Slightly more opaque in dark mode
              '& input': {
                color: isDarkMode ? '#f5f5f5' : '#000', // Brighter text in dark mode
              },
              '& input::placeholder': {
                color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                opacity: 1,
              },
              '&:hover': {
                '& fieldset': {
                  borderColor: isDarkMode ? '#ff6b81' : '#ff4757', // Lighter color in dark mode
                }
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
              </InputAdornment>
            ),
          }}
        />

        {/* Updated client instruction hint with downward arrow indication */}
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          borderRadius: '10px',
          bgcolor: isDarkMode ? 'rgba(44,62,80,0.4)' : 'rgba(247, 241, 241, 0.08)', // Match navbar theme
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,71,87,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon sx={{ color: isDarkMode ? '#ff6b81' : '#ff4757' }} />
          <Typography variant="body2" sx={{ 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0,0,0,0.7)'
          }}>
            Click on any client row to view detailed information
          </Typography>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255, 255, 255, 0.95)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 25px rgba(255, 255, 255, 0.15)',
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1f2b38 0%, #161629 100%)' // Darker gradient for dark mode
                  : 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)'
              }}>
                <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Program</TableCell>
                <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Start Date</TableCell>
                <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Actions</TableCell>
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