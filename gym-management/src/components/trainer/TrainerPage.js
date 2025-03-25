import React, { useState, useEffect } from 'react';
import TrainerNavbar from './TrainerNavbar';
import '../../styles/TrainerPage.css';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Divider,
  Chip, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Badge,
} from '@mui/material';
import {
  People as PeopleIcon,
  Today as TodayIcon,
  FitnessCenter as FitnessIcon,
  Timeline as TimelineIcon,
  Person,
  Mail,
  Phone,
  TrendingUp,
  Stars,
  EmojiEvents,
  LocalFireDepartment,
  Scale,
  Speed as SpeedIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import ClientsPage from './ClientsPage';
import SchedulePage from './SchedulePage';
import WorkoutsPage from './WorkoutsPage';
import ProgressReportPage from './ProgressReportPage';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsPage from './SettingsPage';
import axios from 'axios'; // Add the axios import
import { format } from 'date-fns'; // Add date-fns import

const TrainerPage = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    sessionDate: '',
    sessionTime: '',
    sessionType: '',
    workoutName: '',
    workoutType: '',
    duration: '',
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [trainerData, setTrainerData] = useState({
    id: 3, // Default trainer ID (you should get this from auth context)
    fullName: 'Loading...',
    email: 'loading@example.com',
    phone: '',
    profilePhoto: null,
    registrationDate: '',
  });
  const [dataLoading, setDataLoading] = useState(true);
  const navbarRef = React.useRef();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalRatings: 0,
    recentRatings: [],
    ratingBreakdown: {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    }
  });
  const [ratingLoading, setRatingLoading] = useState(true);

  // Add these new states needed for session scheduling
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [dialogSessionFormData, setDialogSessionFormData] = useState({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: '',
    notes: ''
  });
  const [dialogSessionErrors, setDialogSessionErrors] = useState({});
  const [dialogSessionValid, setDialogSessionValid] = useState(false);

  useEffect(() => {
    fetchTrainerData();
    fetchTodaySessions();
    fetchTrainerRatings();
    fetchClients(); // Add this new function call
  }, []);

  // Add the showAlert function that was missing
  const showAlert = (message, severity) => {
    setAlert({
      show: true,
      message: message,
      severity: severity
    });
    // Auto hide the alert after 3 seconds
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchTrainerData = async () => {
    setDataLoading(true);
    try {
      // Get trainer ID from auth context or hardcode for now
      const trainerId = 3; // This should be retrieved from authentication context
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/profile`);
      
      if (response.status === 200) {
        setTrainerData(response.data);
        
        // Also update the form data with trainer information
        setFormData(prev => ({
          ...prev,
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          // Other form fields can remain as they are or be updated from response
        }));
      } else {
        showAlert('Failed to load trainer data', 'error');
      }
    } catch (error) {
      console.error('Error fetching trainer data:', error);
      showAlert('Failed to load trainer profile', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  // Add this new function to fetch today's sessions
  const fetchTodaySessions = async () => {
    setSessionsLoading(true);
    try {
      const trainerId = 3; // This should be retrieved from authentication context
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/sessions`);
      
      if (response.status === 200) {
        // Filter sessions for today
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const todaySessions = response.data
          .filter(session => session.sessionDate === todayString)
          .map(session => ({
            client: session.clientName,
            time: session.sessionTime.substring(0, 5), // Format: HH:MM
            program: session.sessionType
          }));
        
        setUpcomingSessions(todaySessions);
      } else {
        showAlert('Failed to load today\'s sessions', 'error');
      }
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      showAlert('Failed to load today\'s sessions', 'error');
    } finally {
      setSessionsLoading(false);
    }
  };

  // Add function to fetch trainer ratings
  const fetchTrainerRatings = async () => {
    setRatingLoading(true);
    try {
      const trainerId = 3; // This should be retrieved from authentication context
      // In a real application, you would call your API endpoint
      // For now, we'll simulate a response with mock data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - Updated to be trainer-focused reviews
      const mockRatingData = {
        averageRating: 4.7,
        totalRatings: 58,
        recentRatings: [
          { id: 1, clientName: 'Ali Yilmaz', rating: 5, comment: 'Best trainer I\'ve ever had! You helped me reach my fitness goals in just 3 months.', date: '2023-05-15' },
          { id: 2, clientName: 'Ayse Demir', rating: 4.5, comment: 'Your training programs are very effective. I\'ve seen significant improvements in my stamina.', date: '2023-05-10' },
          { id: 3, clientName: 'Mehmet Kaya', rating: 5, comment: 'I appreciate your professional approach and the personal attention you give during sessions.', date: '2023-05-05' },
          { id: 4, clientName: 'Zeynep Ak', rating: 4, comment: 'Great motivator! You always know how to push me just the right amount.', date: '2023-04-28' },
        ],
        ratingBreakdown: {
          5: 38,
          4: 15,
          3: 3,
          2: 1,
          1: 1
        }
      };
      
      setRatingData(mockRatingData);
    } catch (error) {
      console.error('Error fetching trainer ratings:', error);
    } finally {
      setRatingLoading(false);
    }
  };

  // Add the fetchClients function to match SchedulePage
  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const trainerId = 3; // This should be retrieved from authentication context
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showAlert('Failed to load clients', 'error');
    } finally {
      setClientsLoading(false);
    }
  };
  
  // Add session validation function
  const validateSessionField = (name, value) => {
    switch (name) {
      case 'clientId':
        return value ? '' : 'Client is required';
      case 'date':
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today ? '' : 'Date cannot be in the past';
      case 'time':
        return value ? '' : 'Time is required';
      case 'type':
        return value ? '' : 'Session type is required';
      default:
        return '';
    }
  };

  // Add session input change handler
  const handleSessionInputChange = (event) => {
    const { name, value } = event.target;
    setDialogSessionFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const error = validateSessionField(name, value);
    setDialogSessionErrors(prev => ({ ...prev, [name]: error }));

    // Check if form is valid
    const requiredFields = ['clientId', 'date', 'time', 'type'];
    const updatedSession = {...dialogSessionFormData, [name]: value};
    const isValid = requiredFields.every(field => 
      updatedSession[field] && !dialogSessionErrors[field]
    );
    setDialogSessionValid(isValid);
  };

  // Add function to handle adding a new session
  const handleAddNewSession = async () => {
    if (!validateSessionDialog()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      // Assuming the user is already logged in and the trainer ID is 3
      const trainerId = 3; // This should come from your auth context or state
      
      const sessionRequest = {
        clientId: parseInt(dialogSessionFormData.clientId),
        sessionDate: dialogSessionFormData.date,
        sessionTime: dialogSessionFormData.time + ":00", // Add seconds to match LocalTime format
        sessionType: dialogSessionFormData.type,
        notes: dialogSessionFormData.notes || ""
      };
      
      const response = await axios.post(
        `http://localhost:8080/api/trainer/${trainerId}/sessions`, 
        sessionRequest
      );
      
      // Close dialog and show success message
      setOpenDialog(null);
      resetSessionDialog();
      showAlert('Session scheduled successfully!', 'success');
      
      // Refresh today's sessions
      fetchTodaySessions();
    } catch (error) {
      console.error('Error adding session:', error);
      showAlert('Failed to add session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateSessionDialog = () => {
    const required = ['clientId', 'date', 'time', 'type'];
    return required.every(field => dialogSessionFormData[field].toString().trim());
  };

  const resetSessionDialog = () => {
    setDialogSessionFormData({
      clientId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      type: '',
      notes: ''
    });
    setDialogSessionErrors({});
    setDialogSessionValid(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name) => {
    // Only allow letters, spaces, and hyphens for names
    const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]{2,50}$/;
    if (!name) return 'Name is required';
    if (!nameRegex.test(name)) {
      return 'Name should only contain letters';
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.length > 50) {
      return 'Name must be less than 50 characters';
    }
    return '';
  };

  const validateFormData = () => {
    const newErrors = {};

    // Client form validation
    if (openDialog === 'client') {
      if (!formData.clientName?.trim()) {
        newErrors.clientName = 'Name is required';
      }
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Invalid phone format';
      }
    }

    // Session form validation
    if (openDialog === 'session') {
      if (!formData.sessionDate) {
        newErrors.sessionDate = 'Date is required';
      } else {
        const selectedDate = new Date(formData.sessionDate);
        const today = new Date();
        if (selectedDate < today) {
          newErrors.sessionDate = 'Date cannot be in the past';
        }
      }
      if (!formData.sessionTime) {
        newErrors.sessionTime = 'Time is required';
      }
      if (!formData.sessionType) {
        newErrors.sessionType = 'Session type is required';
      }
    }

    // Workout form validation
    if (openDialog === 'workout') {
      if (!formData.workoutName?.trim()) {
        newErrors.workoutName = 'Workout name is required';
      }
      if (!formData.workoutType) {
        newErrors.workoutType = 'Workout type is required';
      }
      if (!formData.duration) {
        newErrors.duration = 'Duration is required';
      } else if (isNaN(formData.duration) || formData.duration <= 0) {
        newErrors.duration = 'Duration must be a positive number';
      }
    }

    return newErrors;
  };

  const handleDialogClose = () => {
    setOpenDialog(null);
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      sessionDate: '',
      sessionTime: '',
      sessionType: '',
      workoutName: '',
      workoutType: '',
      duration: '',
    });
    setErrors({});
    resetSessionDialog(); // Add this line to reset session form
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'clientName':
        return validateName(value.trim());
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      case 'phone':
        return /^\+?[1-9]\d{1,14}$/.test(value.replace(/\s/g, '')) ? '' : 'Invalid phone format';
      case 'sessionDate':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today ? '' : 'Date cannot be in the past';
      case 'sessionTime':
        return value ? '' : 'Time is required';
      case 'sessionType':
        return value ? '' : 'Session type is required';
      case 'workoutName':
        return value.trim().length >= 3 ? '' : 'Workout name must be at least 3 characters';
      case 'workoutType':
        return value ? '' : 'Workout type is required';
      case 'duration':
        const duration = parseInt(value);
        return duration > 0 && duration <= 360 ? '' : 'Duration must be between 1 and 360 minutes';
      default:
        return '';
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // For clientName, prevent typing numbers
    if (name === 'clientName') {
      const lastChar = value.slice(-1);
      if (/[0-9]/.test(lastChar)) {
        return; // Don't update if last character is a number
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Check if form is valid
    const newErrors = { ...errors, [name]: error };
    const requiredFields = getRequiredFields(openDialog);
    const isValid = requiredFields.every(field => 
      formData[field] && !newErrors[field]
    );
    setIsFormValid(isValid);
  };

  const getRequiredFields = (dialogType) => {
    switch (dialogType) {
      case 'client':
        return ['clientName', 'email', 'phone'];
      case 'session':
        return ['sessionDate', 'sessionTime', 'sessionType'];
      case 'workout':
        return ['workoutName', 'workoutType', 'duration'];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (openDialog === 'session') {
      await handleAddNewSession();
      return;
    }

    const validationErrors = validateFormData();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call with different endpoints based on dialog type
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (openDialog) {
        case 'client':
          // Add client logic
          console.log('Adding client:', formData);
          break;
        case 'workout':
          // Add workout logic
          console.log('Creating workout:', formData);
          break;
      }
      
      handleDialogClose();
      // Show success message
      setAlert({
        show: true,
        message: `${openDialog} added successfully!`,
        severity: 'success'
      });
      // Auto hide alert after 3 seconds
      setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: `Failed to add ${openDialog}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Clients', value: '24', icon: <PeopleIcon />, color: '#ff4757' },
    { title: 'Today\'s Sessions', value: '8', icon: <TodayIcon />, color: '#ff4757' },
    { title: 'Active Programs', value: '12', icon: <FitnessIcon />, color: '#ff4757' },
    { title: 'Hours This Week', value: '32', icon: <TimelineIcon />, color: '#ff4757' },
  ];

  const quickActions = [
    { 
      title: 'Add Client', 
      icon: <PeopleIcon />, 
      action: () => setOpenDialog('client'),
    },
    { 
      title: 'New Session', 
      icon: <TodayIcon />, 
      action: () => setOpenDialog('session'),
    },
    { 
      title: 'View Reports', 
      icon: <TimelineIcon />, 
      action: () => navigate('/trainer/reports'),
    },
  ];

  const dialogContent = {
    client: (
      <Box>
        <DialogTitle 
          sx={{ 
            color: '#ff4757', // Changed from #007bff to #ff4757
            borderBottom: '2px solid #ff4757',
            mb: 2,
            '& .MuiTypography-root': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }
          }}
        >
          <PeopleIcon sx={{ color: '#ff4757' }} /> Add New Client
        </DialogTitle>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2.5,
              mt: 2,
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 10px rgba(255, 71, 87, 0.1)',
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(255, 71, 87, 0.2)',
                  }
                }
              }
            }}>
              <TextField
                name="clientName"
                label="Client Name"
                value={formData.clientName}
                onChange={handleInputChange}
                error={!!errors.clientName}
                helperText={errors.clientName}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#ff4757' }}/>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail sx={{ color: '#ff4757' }}/>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#ff4757' }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </motion.div>
        </DialogContent>
      </Box>
    ),
    session: (
      <Box>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <TodayIcon /> Schedule New Session
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!dialogSessionErrors.clientId}>
                <InputLabel id="client-select-label">Client</InputLabel>
                <Select
                  labelId="client-select-label"
                  name="clientId"
                  value={dialogSessionFormData.clientId}
                  onChange={handleSessionInputChange}
                  label="Client"
                  startAdornment={
                    <InputAdornment position="start">
                      <Person sx={{ color: '#ff4757' }} />
                    </InputAdornment>
                  }
                  sx={{
                    '& .MuiSelect-select': {
                      color: isDarkMode ? '#fff' : 'inherit',
                    }
                  }}
                >
                  {clientsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading clients...
                    </MenuItem>
                  ) : clients.length ? (
                    clients.map((client) => (
                      <MenuItem key={client.clientId} value={client.clientId}>
                        {client.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No clients available</MenuItem>
                  )}
                </Select>
                {dialogSessionErrors.clientId && <Typography color="error" variant="caption">{dialogSessionErrors.clientId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={dialogSessionFormData.date}
                onChange={handleSessionInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!dialogSessionErrors.date}
                helperText={dialogSessionErrors.date}
                sx={{
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4757',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                name="time"
                value={dialogSessionFormData.time}
                onChange={handleSessionInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!dialogSessionErrors.time}
                helperText={dialogSessionErrors.time}
                sx={{
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4757',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!dialogSessionErrors.type}>
                <InputLabel id="session-type-label">Session Type</InputLabel>
                <Select
                  labelId="session-type-label"
                  name="type"
                  value={dialogSessionFormData.type}
                  onChange={handleSessionInputChange}
                  label="Session Type"
                  sx={{
                    '& .MuiSelect-select': {
                      color: isDarkMode ? '#fff' : 'inherit',
                    }
                  }}
                >
                  <MenuItem value="Personal Training">Personal Training</MenuItem>
                  <MenuItem value="Yoga Session">Yoga Session</MenuItem>
                  <MenuItem value="Strength Training">Strength Training</MenuItem>
                  <MenuItem value="Assessment">Assessment</MenuItem>
                  <MenuItem value="Group Class">Group Class</MenuItem>
                </Select>
                {dialogSessionErrors.type && <Typography color="error" variant="caption">{dialogSessionErrors.type}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={2}
                value={dialogSessionFormData.notes}
                onChange={handleSessionInputChange}
                sx={{
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4757',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    ),
    workout: (
      <>
        <DialogTitle sx={{ color: '#ff4757' }}>Create New Workout</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="workoutName"
              label="Workout Name"
              value={formData.workoutName}
              onChange={handleInputChange}
              error={!!errors.workoutName}
              helperText={errors.workoutName}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Workout Type</InputLabel>
              <Select
                name="workoutType"
                value={formData.workoutType}
                onChange={handleInputChange}
                error={!!errors.workoutType}
                label="Workout Type"
              >
                <MenuItem value="strength">Strength Training</MenuItem>
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="hiit">HIIT</MenuItem>
                <MenuItem value="flexibility">Flexibility</MenuItem>
              </Select>
              {errors.workoutType && <Typography color="error">{errors.workoutType}</Typography>}
            </FormControl>
            <TextField
              name="duration"
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              error={!!errors.duration}
              helperText={errors.duration}
              fullWidth
            />
          </Box>
        </DialogContent>
      </>
    ),
  };

  // Add mock data for progress charts
  const clientProgress = {
    weeklyStats: {
      workoutsCompleted: 45,
      totalClients: 52,
      averageRating: 4.8,
      totalHours: 86
    },
    topPerformers: [
      { name: 'Edin Dzeko', progress: 92, achievement: 'Weight Goal Reached' },
      { name: 'Lionel Messi', progress: 88, achievement: 'Monthly Attendance' },
      { name: 'Mike Tyson', progress: 85, achievement: 'Strength Milestone' }
    ],
    recentAchievements: [
      { client: 'Bruce Lee', type: 'Weight Loss', value: '-5kg' },
      { client: 'Conor McGregor', type: 'Strength Gain', value: '+15kg bench' },
      { client: 'Jon Jones', type: 'Attendance', value: '15 days streak' }
    ]
  };

  const renderProgressSection = () => (
    <Grid item xs={12} md={6}>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
        <Paper sx={{
          borderRadius: '16px',
          background: isDarkMode ? 'rgba(44,62,80,0.3)' : 'white',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          height: '100%'
        }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ 
              color: '#ff4757',
              fontWeight: 600,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TrendingUp /> Client Progress Overview
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#333',
                      borderBottom: '2px solid #ff4757'
                    }}>
                      Client
                    </TableCell>
                    <TableCell align="center" sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#333',
                      borderBottom: '2px solid #ff4757'
                    }}>
                      Progress
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#333',
                      borderBottom: '2px solid #ff4757'
                    }}>
                      Achievement
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientProgress.topPerformers.map((performer, index) => (
                    <TableRow key={index} sx={{
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,71,87,0.05)',
                      },
                    }}>
                      <TableCell sx={{ 
                        color: isDarkMode ? '#fff' : 'inherit',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff4757' }}>
                            {performer.name[0]}
                          </Avatar>
                          {performer.name}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={performer.progress}
                            sx={{
                              width: '100%',
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,71,87,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: '#ff4757',
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ 
                            color: '#ff4757',
                            minWidth: '45px'
                          }}>
                            {performer.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}>
                        <Chip
                          size="small"
                          label={performer.achievement}
                          sx={{
                            bgcolor: isDarkMode ? 'rgba(255,71,87,0.2)' : 'rgba(255,71,87,0.1)',
                            color: '#ff4757',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 2, color: isDarkMode ? '#fff' : '#666' }}>
              Recent Achievements
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {clientProgress.recentAchievements.map((achievement, index) => (
                    <TableRow key={index} sx={{
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,71,87,0.05)',
                      },
                    }}>
                      <TableCell sx={{ 
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        color: isDarkMode ? '#fff' : 'inherit',  // Added color for dark mode
                      }}>
                        {achievement.client}
                      </TableCell>
                      <TableCell sx={{ 
                        color: isDarkMode ? '#fff' : '#ff4757',  // Updated color for dark mode
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}>
                        {achievement.type}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      }}>
                        <Chip
                          size="small"
                          label={achievement.value}
                          sx={{
                            bgcolor: isDarkMode ? 'rgba(255,71,87,0.2)' : 'rgba(255,71,87,0.1)',
                            color: '#ff4757'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </motion.div>
    </Grid>
  );

  // Add a rating section component to display in dashboard - Updated for trainer perspective
  const renderRatingSection = () => (
    <Grid item xs={12}>
      <motion.div 
        whileHover={{ y: -5 }} 
        transition={{ duration: 0.3 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper sx={{
          borderRadius: '16px',
          background: isDarkMode ? 'rgba(44,62,80,0.3)' : 'white',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ 
              color: '#ff4757',
              fontWeight: 600,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <StarIcon /> Your Client Feedback
            </Typography>

            {ratingLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={30} sx={{ color: '#ff4757' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Rating Summary */}
                <Grid item xs={12} md={4}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 2,
                    height: '100%',
                    borderRadius: '12px',
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,71,87,0.05)',
                  }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                      }}
                    >
                      <Typography variant="h1" sx={{ 
                        color: '#ff4757',
                        fontWeight: 700,
                        fontSize: '4rem',
                        mb: 1
                      }}>
                        {ratingData.averageRating.toFixed(1)}
                      </Typography>
                    </motion.div>
                    
                    <Rating 
                      value={ratingData.averageRating} 
                      precision={0.5} 
                      readOnly
                      icon={<StarIcon fontSize="large" sx={{ color: '#ff4757' }} />}
                      emptyIcon={<StarBorderIcon fontSize="large" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }} />}
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="body1" sx={{ 
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      fontWeight: 500
                    }}>
                      Your rating from {ratingData.totalRatings} client reviews
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 2
                    }}>
                      <Chip 
                        icon={<ThumbUpIcon />} 
                        label={`${Math.round((ratingData.ratingBreakdown[5] + ratingData.ratingBreakdown[4]) / ratingData.totalRatings * 100)}% Client Satisfaction`}
                        sx={{
                          bgcolor: isDarkMode ? 'rgba(255,71,87,0.2)' : 'rgba(255,71,87,0.1)',
                          color: '#ff4757',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                
                {/* Rating Breakdown */}
                <Grid item xs={12} md={3}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: isDarkMode ? '#fff' : '#666',
                      fontWeight: 500
                    }}>
                      Your Rating Breakdown
                    </Typography>
                    
                    {[5, 4, 3, 2, 1].map((star) => (
                      <Box key={star} sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        gap: 1
                      }}>
                        <Typography variant="body2" sx={{ minWidth: '25px', color: isDarkMode ? '#fff' : '#666' }}>
                          {star}
                        </Typography>
                        <StarIcon sx={{ color: '#ff4757', fontSize: '18px' }} />
                        <LinearProgress
                          variant="determinate"
                          value={(ratingData.ratingBreakdown[star] / ratingData.totalRatings) * 100}
                          sx={{
                            width: '100%',
                            height: 8,
                            borderRadius: 3,
                            bgcolor: 'rgba(255,71,87,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#ff4757',
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ 
                          minWidth: '35px',
                          textAlign: 'right',
                          color: isDarkMode ? '#fff' : '#666'
                        }}>
                          {ratingData.ratingBreakdown[star]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                
                {/* Recent Reviews */}
                <Grid item xs={12} md={5}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: isDarkMode ? '#fff' : '#666',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CommentIcon fontSize="small" /> Latest Client Feedback
                    </Typography>
                    
                    <List sx={{ maxHeight: '280px', overflow: 'auto' }}>
                      {ratingData.recentRatings.map((review, index) => (
                        <motion.div
                          key={review.id}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem sx={{
                            mb: 1,
                            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,71,87,0.05)',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,71,87,0.1)',
                            },
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                          }}>
                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', mb: 1 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  bgcolor: 'rgba(255,71,87,0.2)',
                                  color: '#ff4757'
                                }}>
                                  {review.clientName.charAt(0)}
                                </Avatar>
                              </ListItemAvatar>
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 600,
                                  color: isDarkMode ? '#fff' : '#2c3e50',
                                }}>
                                  From: {review.clientName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Rating 
                                    value={review.rating} 
                                    readOnly 
                                    size="small"
                                    precision={0.5}
                                    icon={<StarIcon sx={{ color: '#ff4757', fontSize: '16px' }} />}
                                    emptyIcon={<StarBorderIcon sx={{ color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', fontSize: '16px' }} />}
                                  />
                                  <Typography variant="caption" sx={{ 
                                    ml: 1,
                                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' 
                                  }}>
                                    {new Date(review.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ 
                              pl: 7,
                              pr: 2,
                              pb: 1,
                              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                              fontStyle: 'italic'
                            }}>
                              "{review.comment}"
                            </Typography>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Grid>
  );

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Banner - Update to use trainerData */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
        borderRadius: '20px',
        p: 4,
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {dataLoading ? (
            <CircularProgress color="inherit" size={24} sx={{ mb: 1 }} />
          ) : (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Welcome back, {trainerData.firstName || trainerData.fullName.split(' ')[0]}!
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                You have {upcomingSessions.length} sessions scheduled for today
              </Typography>
            </>
          )}
        </motion.div>
      </Box>

      {/* Quick Actions - keep existing code */}
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          mb: 4,
          justifyContent: 'center', // Center the grid items
          alignItems: 'center',
          '& .MuiGrid-item': {
            display: 'flex',
            justifyContent: 'center'
          }
        }}
      >
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={4} md={3} key={index}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1, // Stagger the animations
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
              style={{ width: '100%', maxWidth: '280px' }} // Control card width
            >
              <Card 
                onClick={action.action}
                sx={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(44, 62, 80, 0.4) 0%, rgba(26, 26, 46, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,71,87,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(255,71,87,0.15)',
                    borderColor: '#ff4757',
                    '& .action-icon': {
                      transform: 'rotate(10deg) scale(1.1)',
                    },
                    '&::after': {
                      transform: 'scale(1.5)',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(255,71,87,0.1) 0%, transparent 70%)',
                    transition: 'transform 0.5s ease',
                    transform: 'scale(1)',
                    zIndex: 0,
                  }
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Avatar
                      className="action-icon"
                      sx={{
                        bgcolor: 'rgba(255,71,87,0.1)',
                        width: 56,
                        height: 56,
                        margin: '0 auto 1rem',
                        transition: 'all 0.3s ease',
                        color: '#ff4757',
                      }}
                    >
                      {action.icon}
                    </Avatar>
                  </motion.div>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600,
                    color: isDarkMode ? '#fff' : '#2c3e50'
                  }}>
                    {action.title}
                  </Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Schedule and Progress Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Paper sx={{
              borderRadius: '16px',
              background: isDarkMode 
                ? 'rgba(44,62,80,0.4)'
                : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid rgba(255,71,87,0.1)',
              height: '100%',
            }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#ff4757',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TodayIcon /> Today's Schedule
                </Typography>
                
                {sessionsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={30} sx={{ color: '#ff4757' }} />
                  </Box>
                ) : upcomingSessions.length > 0 ? (
                  <List>
                    {upcomingSessions.map((session, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem sx={{
                          mb: 2,
                          background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,71,87,0.05)',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(10px)',
                            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,71,87,0.1)',
                          }
                        }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: 'rgba(255,71,87,0.2)',
                              color: '#ff4757'
                            }}>
                              <PeopleIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={session.client}
                            secondary={`${session.time} - ${session.program}`}
                            primaryTypographyProps={{
                              fontWeight: 600,
                              color: isDarkMode ? '#fff' : '#2c3e50',
                              fontSize: '1rem'
                            }}
                            secondaryTypographyProps={{
                              color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#666',
                              fontSize: '0.875rem'
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
                  }}>
                    <TodayIcon sx={{ fontSize: '3rem', mb: 2, opacity: 0.5 }} />
                    <Typography variant="body1">No sessions scheduled for today</Typography>
                    <Button 
                      variant="outlined" 
                      sx={{ 
                        mt: 2,
                        borderColor: '#ff4757',
                        color: '#ff4757',
                        '&:hover': {
                          borderColor: '#ff3747',
                          backgroundColor: 'rgba(255,71,87,0.1)',
                        }
                      }}
                      onClick={() => navigate('/trainer/schedule')}
                    >
                      View Schedule
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Progress Section */}
        {renderProgressSection()}
      </Grid>

      {/* Add the new Rating Section below */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {renderRatingSection()}
        </Grid>
      </Box>
    </motion.div>
  );

  const handleSettingsUpdate = (updatedSettings) => {
    // Update trainer data when settings are changed
    setTrainerData(prev => ({
      ...prev,
      fullName: updatedSettings.fullName,
      firstName: updatedSettings.firstName,
      lastName: updatedSettings.lastName,
      email: updatedSettings.email,
      phone: updatedSettings.phone,
      profilePhoto: updatedSettings.profilePhoto
    }));
    
    // Force re-fetch data to ensure everything is in sync
    fetchTrainerData();
    
    // Also refresh the navbar if the ref is available
    if (navbarRef.current) {
      navbarRef.current.refreshTrainerData();
    }
  };
  
  const renderContent = () => {
    switch(location.pathname) {
      case '/trainer':
        return renderDashboard();
      case '/trainer/clients':
        return <ClientsPage />;
      case '/trainer/schedule':
        return <SchedulePage />;
      case '/trainer/workouts':
        return <WorkoutsPage isDarkMode={isDarkMode} />;  // Pass isDarkMode prop here
      case '/trainer/reports':
        return <ProgressReportPage />;
      case '/trainer/settings':
        return <SettingsPage isDarkMode={isDarkMode} onSettingsUpdate={handleSettingsUpdate} />;
      default:
        return <Typography>Page under construction</Typography>;
    }
  };

  return (
    <div className={`trainer-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        width: '100%',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}>
        <TrainerNavbar ref={navbarRef} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          ml: { sm: '280px' },
          mt: 2
        }}>
          {renderContent()}
        </Box>
        {/* Fix dialog position and styling */}
        <AnimatePresence>
          {openDialog && (
            <Dialog
              open={!!openDialog}
              onClose={handleDialogClose}
              maxWidth="sm"
              fullWidth
              TransitionComponent={motion.div}
              PaperProps={{
                sx: {
                  borderRadius: '16px',
                  bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,71,87,0.1)',
                  '& .MuiDialogContent-root': {
                    padding: '24px',
                  },
                  '& .MuiDialogActions-root': {
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(255,71,87,0.1)',
                    bgcolor: isDarkMode ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                  }
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {openDialog && dialogContent[openDialog]}
                <DialogActions sx={{ p: 2.5, gap: 1 }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleDialogClose}
                      variant="outlined"
                      sx={{
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#bdbdbd',
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#757575',
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : '#9e9e9e',
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(158, 158, 158, 0.1)',
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={loading || (openDialog === 'session' ? !dialogSessionValid : !isFormValid)}
                      sx={{
                        background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff6b81, #ff4757)',
                        },
                        '&.Mui-disabled': {
                          background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#9e9e9e',
                          color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                    </Button>
                  </motion.div>
                </DialogActions>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </Box>
    </div>
  );
};

export default TrainerPage;