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
      fetchSessionRequests();
      fetchRescheduleRequests();
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
      return;
    }
    
    setExpandedClientId(clientId);
    setClientDetailTab(0);
    setClientDetailsLoading(true);
    
    try {
      // In a real application, fetch detailed client data from API
      // For now, we'll simulate a response with more detailed info
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the basic client info from our current list
      const clientBasicInfo = clients.find(c => c.id === clientId);
      
      if (!clientBasicInfo) {
        throw new Error("Client not found");
      }
      
      // Mock additional client details
      const mockClientDetails = {
        ...clientBasicInfo,
        age: 32,
        height: 175, // cm
        currentWeight: 78, // kg
        startingWeight: 85, // kg
        targetWeight: 72, // kg
        bodyFatPercentage: 18,
        fitnessGoals: ["Weight loss", "Muscle gain", "Increased endurance"],
        medicalConditions: "None",
        dietaryRestrictions: "Lactose intolerant",
        emergencyContact: {
          name: "John Smith",
          relation: "Spouse",
          phone: "+1234567890"
        },
        progressHistory: [
          { date: "2023-01-10", weight: 85, notes: "Initial assessment" },
          { date: "2023-02-10", weight: 83, notes: "Good progress with cardio" },
          { date: "2023-03-10", weight: 81, notes: "Started strength training" },
          { date: "2023-04-10", weight: 79, notes: "Improved diet adherence" },
          { date: "2023-05-10", weight: 78, notes: "Current weight" }
        ],
        upcomingSessions: [
          { date: "2023-05-25", time: "09:00", type: "Personal Training" },
          { date: "2023-05-27", time: "10:30", type: "Assessment" },
          { date: "2023-05-31", time: "09:00", type: "Personal Training" }
        ],
        completedSessions: 22,
        missedSessions: 3,
        workoutPlans: [
          { 
            name: "Full Body Strength", 
            days: ["Monday", "Thursday"],
            exercises: [
              { name: "Squats", sets: 3, reps: "10-12", weight: "50kg" },
              { name: "Bench Press", sets: 3, reps: "8-10", weight: "60kg" },
              { name: "Deadlifts", sets: 3, reps: "8", weight: "70kg" }
            ] 
          },
          { 
            name: "Cardio", 
            days: ["Tuesday", "Friday"],
            exercises: [
              { name: "Treadmill", duration: "20min", intensity: "Moderate" },
              { name: "Cycling", duration: "15min", intensity: "High" },
              { name: "Rowing", duration: "10min", intensity: "Moderate" }
            ] 
          }
        ]
      };
      
      setClientDetails(mockClientDetails);
    } catch (error) {
      console.error('Error fetching client details:', error);
      showAlert('Failed to load client details', 'error');
    } finally {
      setClientDetailsLoading(false);
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
        <TableCell colSpan={6} sx={{ p: 0, borderBottom: '1px solid', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)' }}>
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
                  <Tab label="Progress" icon={<BarChartIcon />} iconPosition="start" />
                  <Tab label="Sessions" icon={<HistoryIcon />} iconPosition="start" />
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
                                Age
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {clientDetails.age} years
                              </Typography>
                            </Box>
                            {/* Update the remaining info boxes similarly */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Height
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 500
                              }}>
                                {clientDetails.height} cm
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
                                {clientDetails.startingWeight} kg
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
                                {clientDetails.currentWeight} kg
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
                                {clientDetails.targetWeight} kg
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
                                {clientDetails.bodyFatPercentage}%
                              </Typography>
                            </Box>
                          </Stack>
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
                          
                          <Typography variant="subtitle2" sx={{ 
                            color: '#ff6b81', // Keep accent color
                            mt: 2, 
                            mb: 0.5,
                            fontWeight: 600
                          }}>
                            Emergency Contact
                          </Typography>
                          <Box>
                            <Typography variant="body2" sx={{ 
                              color: '#fff', // White text in both modes
                              fontWeight: 500
                            }}>
                              {clientDetails.emergencyContact.name} ({clientDetails.emergencyContact.relation})
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.75)' // Slightly dimmed white
                            }}>
                              {clientDetails.emergencyContact.phone}
                            </Typography>
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
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ 
                          p: 2.5, 
                          bgcolor: 'rgba(255,255,255,0.08)', // Lighter panel that complements header gradient
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            color: '#ff6b81', // Keep accent color
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <BarChartIcon fontSize="small" /> Weight Progress
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          
                          <Box sx={{ 
                            mt: 3, 
                            mb: 4, 
                            height: 20, 
                            width: '100%', 
                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            borderRadius: 5,
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                          }}>
                            <LinearProgress
                              variant="determinate"
                              value={((clientDetails.startingWeight - clientDetails.currentWeight) / 
                                    (clientDetails.startingWeight - clientDetails.targetWeight)) * 100}
                              sx={{
                                height: '100%',
                                borderRadius: 5,
                                backgroundColor: 'transparent',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#ff4757',
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
                                {Math.round(((clientDetails.startingWeight - clientDetails.currentWeight) / 
                                          (clientDetails.startingWeight - clientDetails.targetWeight)) * 100)}%
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                Starting
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 600
                              }}>
                                {clientDetails.startingWeight} kg
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                Current
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#ff4757', // Keep accent color for this highlight
                                fontWeight: 600
                              }}>
                                {clientDetails.currentWeight} kg
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                Target
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 600
                              }}>
                                {clientDetails.targetWeight} kg
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="subtitle2" sx={{ 
                            color: isDarkMode ? '#ff6b81' : '#ff4757', 
                            mt: 4, 
                            mb: 1,
                            fontWeight: 600 
                          }}>
                            Weight Loss Stats
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Box>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Total Loss
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 600
                              }}>
                                {clientDetails.startingWeight - clientDetails.currentWeight} kg
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                Still To Go
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                color: '#fff', // White text in both modes
                                fontWeight: 600
                              }}>
                                {clientDetails.currentWeight - clientDetails.targetWeight} kg
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Box sx={{ 
                          p: 2.5, 
                          bgcolor: 'rgba(255,255,255,0.08)', // Lighter panel that complements header gradient
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            color: '#ff6b81', // Keep accent color
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <MonitorWeightIcon fontSize="small" /> Progress History
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          
                          <Timeline position="right" sx={{ p: 0 }}>
                            {clientDetails.progressHistory.map((progress, index) => (
                              <TimelineItem key={index}>
                                <TimelineOppositeContent sx={{ 
                                  flex: 0.2, 
                                  color: 'rgba(255,255,255,0.7)',
                                  fontSize: '0.8rem'
                                }}>
                                  {new Date(progress.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                  <TimelineDot sx={{ 
                                    bgcolor: '#ff4757',
                                    boxShadow: '0 0 0 4px rgba(255,71,87,0.2)'
                                  }}>
                                    <MonitorWeightIcon fontSize="small" />
                                  </TimelineDot>
                                  {index < clientDetails.progressHistory.length - 1 && (
                                    <TimelineConnector sx={{ 
                                      bgcolor: isDarkMode ? 'rgba(255,71,87,0.4)' : 'rgba(255,71,87,0.3)',
                                      height: 40
                                    }} />
                                  )}
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '10px', px: 2 }}>
                                  <Typography variant="subtitle2" sx={{ 
                                    color: '#fff', // White text in both modes
                                    fontWeight: 600
                                  }}>
                                    {progress.weight} kg
                                  </Typography>
                                  <Typography variant="body2" sx={{
                                    color: 'rgba(255,255,255,0.75)' // Slightly dimmed white
                                  }}>
                                    {progress.notes}
                                  </Typography>
                                </TimelineContent>
                              </TimelineItem>
                            ))}
                          </Timeline>
                        </Box>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
                
                {/* Sessions Tab */}
                {clientDetailTab === 2 && (
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
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            color: '#ff6b81', // Keep accent color
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
                            <Grid item xs={4}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h4" sx={{ 
                                  color: '#ff4757', // Keep accent color for this highlight
                                  fontWeight: 700,
                                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                  {clientDetails.completedSessions}
                                </Typography>
                                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                  Completed
                                </Typography>
                              </Box>
                            </Grid>
                            {/* ...similar updates for other statistics... */}
                          </Grid>
                          
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)" gutterBottom>
                              Attendance Rate
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(clientDetails.completedSessions / (clientDetails.completedSessions + clientDetails.missedSessions)) * 100}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#ff4757',
                                },
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        <Box sx={{ 
                          p: 2.5, 
                          bgcolor: 'rgba(255,255,255,0.08)', // Lighter panel that complements header gradient
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: 'rgba(255,255,255,0.12)',
                        }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ 
                            color: '#ff6b81', // Keep accent color
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
                                    color: '#fff', // White text in both modes
                                    fontWeight: 600,
                                    border: 'none',
                                    fontSize: '0.875rem'
                                  }}>Date</TableCell>
                                  <TableCell sx={{ 
                                    color: '#fff', // White text in both modes
                                    fontWeight: 600,
                                    border: 'none',
                                    fontSize: '0.875rem'
                                  }}>Time</TableCell>
                                  <TableCell sx={{ 
                                    color: '#fff', // White text in both modes
                                    fontWeight: 600,
                                    border: 'none',
                                    fontSize: '0.875rem'
                                  }}>Type</TableCell>
                                  <TableCell align="right" sx={{ 
                                    color: '#fff', // White text in both modes
                                    fontWeight: 600,
                                    border: 'none',
                                    fontSize: '0.875rem'
                                  }}>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {clientDetails.upcomingSessions.map((session, index) => (
                                  <TableRow key={index} hover sx={{
                                    '&:hover': {
                                      bgcolor: 'rgba(255,255,255,0.08)',
                                    },
                                    '& .MuiTableCell-root': {
                                      border: 'none',
                                      py: 1.5,
                                      color: 'rgba(255,255,255,0.9)', // White text with slight transparency in both modes
                                    }
                                  }}>
                                    {/* ...existing code... */}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: '#ff4757',
                                color: '#ff4757',
                                '&:hover': {
                                  borderColor: '#ff3747',
                                  bgcolor: 'rgba(255,71,87,0.1)',
                                }
                              }}
                            >
                              Add Session
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pending Requests
        </Typography>
        
        <Tabs
          value={requestTabValue}
          onChange={(e, newValue) => setRequestTabValue(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label={`Registration (${clientRequests.length})`} />
          <Tab label={`Session (${sessionRequests.length})`} />
          <Tab label={`Reschedule (${rescheduleRequests.length})`} />
        </Tabs>

        {/* Registration Requests */}
        {requestTabValue === 0 && (
          <AnimatePresence>
            {clientRequests.length > 0 ? (
              <Grid container spacing={2}>
                {clientRequests.map((request) => (
                  <Grid item xs={12} md={6} lg={4} key={request.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          bgcolor: isDarkMode ? 'background.paper' : '#f9f9f9',
                          borderLeft: '4px solid #2196f3',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {request.name}
                            </Typography>
                            <Chip size="small" label="Registration" sx={{ bgcolor: '#2196f3', color: 'white' }} />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.email}</Typography>
                          </Box>
                          
                          {request.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.phone}</Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.date || 'No date specified'}</Typography>
                          </Box>
                          
                          {request.time && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.time}</Typography>
                            </Box>
                          )}
                          
                          {request.message && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                "{request.message}"
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        <CardActions>
                          <LoadingButton
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<Check />}
                            onClick={() => handleAcceptRegistration(request.id)}
                            loading={actionLoading}
                          >
                            Accept
                          </LoadingButton>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            startIcon={<Close />}
                            onClick={() => handleDeclineRegistration(request.id)}
                            disabled={actionLoading}
                          >
                            Decline
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No pending registration requests</Typography>
              </Box>
            )}
          </AnimatePresence>
        )}

        {/* Session Requests */}
        {requestTabValue === 1 && (
          <AnimatePresence>
            {sessionRequests.length > 0 ? (
              <Grid container spacing={2}>
                {sessionRequests.map((request) => (
                  <Grid item xs={12} md={6} lg={4} key={request.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          bgcolor: isDarkMode ? 'background.paper' : '#f9f9f9',
                          borderLeft: '4px solid #4caf50',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {request.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {request.isFreeSession && (
                                <Chip size="small" label="Free Session" sx={{ bgcolor: '#ff9800', color: 'white' }} />
                              )}
                              <Chip size="small" label="Session" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.email}</Typography>
                          </Box>
                          
                          {request.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.phone}</Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.date || 'No date specified'}</Typography>
                          </Box>
                          
                          {request.time && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.time}</Typography>
                            </Box>
                          )}
                          
                          {request.message && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                "{request.message}"
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        <CardActions>
                          <LoadingButton
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<Check />}
                            onClick={() => handleAcceptSession(request.id)}
                            loading={actionLoading}
                          >
                            Accept
                          </LoadingButton>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            startIcon={<Close />}
                            onClick={() => handleDeclineSession(request.id)}
                            disabled={actionLoading}
                          >
                            Decline
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No pending session requests</Typography>
              </Box>
            )}
          </AnimatePresence>
        )}

        {/* Reschedule Requests */}
        {requestTabValue === 2 && (
          <AnimatePresence>
            {rescheduleRequests.length > 0 ? (
              <Grid container spacing={2}>
                {rescheduleRequests.map((request) => (
                  <Grid item xs={12} md={6} lg={4} key={request.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          bgcolor: isDarkMode ? 'background.paper' : '#f9f9f9',
                          borderLeft: '4px solid #9c27b0',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {request.name}
                            </Typography>
                            <Chip size="small" label="Reschedule" sx={{ bgcolor: '#9c27b0', color: 'white' }} />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.email}</Typography>
                          </Box>
                          
                          {request.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.phone}</Typography>
                            </Box>
                          )}
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Current Appointment:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.currentDate || 'No date specified'}</Typography>
                          </Box>
                          
                          {request.currentTime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.currentTime}</Typography>
                            </Box>
                          )}
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Requested Change:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.newDate || 'No date specified'}</Typography>
                          </Box>
                          
                          {request.newTime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{request.newTime}</Typography>
                            </Box>
                          )}
                        </CardContent>
                        <CardActions>
                          <LoadingButton
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<Check />}
                            onClick={() => handleAcceptReschedule(request.id, request.sessionId)}
                            loading={actionLoading}
                          >
                            Accept
                          </LoadingButton>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            startIcon={<Close />}
                            onClick={() => handleDeclineReschedule(request.id)}
                            disabled={actionLoading}
                          >
                            Decline
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No pending reschedule requests</Typography>
              </Box>
            )}
          </AnimatePresence>
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
