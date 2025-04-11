import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Chip,
  Avatar,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  Badge,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  AccessTime,
  Person,
  Event,
  Delete,
  Group,
  FitnessCenter,
  Edit,
  CalendarMonth,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addDays } from 'date-fns';
import axios from 'axios';

const SchedulePage = ({ isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: '',
    notes: ''
  });

  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, appointmentId: null });
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [groupWorkouts, setGroupWorkouts] = useState([]);
  const [groupWorkoutSessions, setGroupWorkoutSessions] = useState([]);
  const [openGroupSessionDialog, setOpenGroupSessionDialog] = useState(false);
  const [newGroupSession, setNewGroupSession] = useState({
    groupWorkoutId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    notes: ''
  });
  const [tabValue, setTabValue] = useState(0);
  const [showGroupWorkouts, setShowGroupWorkouts] = useState(true);
  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState({ open: false, sessionId: null });
  const [selectedGroupSession, setSelectedGroupSession] = useState(null);
  const [groupSessionErrors, setGroupSessionErrors] = useState({});

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchGroupWorkouts();
    fetchGroupWorkoutSessions();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Get current logged in trainer ID from localStorage
      const userStr = localStorage.getItem('user');
      let trainerId;
      if (userStr) {
        const user = JSON.parse(userStr);
        trainerId = user.id;
      }
      if (!trainerId) {
        showAlert('User ID not found. Please log in again.', 'error');
        return;
      }
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/sessions`);
      const formattedSessions = response.data.map(session => ({
        id: session.id,
        date: parseISO(session.sessionDate),
        time: session.sessionTime.substring(0, 5),
        client: session.clientName,
        clientId: session.clientId,
        type: session.sessionType,
        notes: session.notes || "",
        color: getRandomColor(),
      }));
      setAppointments(formattedSessions);
      showAlert('Appointments loaded successfully', 'success');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showAlert('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      // Get current logged in trainer ID from localStorage or context
      const trainerId = localStorage.getItem('userId') || 3; // Fallback to 3 for development
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showAlert('Failed to load clients', 'error');
    }
  };

  const fetchGroupWorkouts = async () => {
    try {
      // Get current logged in trainer ID from localStorage
      const userStr = localStorage.getItem('user');
      let trainerId;
      if (userStr) {
        const user = JSON.parse(userStr);
        trainerId = user.id;
      }
      if (!trainerId) {
        showAlert('User ID not found. Please log in again.', 'error');
        return;
      }
      const response = await axios.get(`http://localhost:8080/api/group-workouts?trainerId=${trainerId}`);
      setGroupWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching group workouts:', error);
      showAlert('Failed to load group workouts', 'error');
    }
  };

  const fetchGroupWorkoutSessions = async () => {
    try {
      // Get current logged in trainer ID from localStorage
      const userStr = localStorage.getItem('user');
      let trainerId;
      if (userStr) {
        const user = JSON.parse(userStr);
        trainerId = user.id;
      }
      if (!trainerId) {
        showAlert('User ID not found. Please log in again.', 'error');
        return;
      }
      const response = await axios.get(`http://localhost:8080/api/group-workout-sessions?trainerId=${trainerId}`);
      
      if (response.status === 200 && response.data) {
        console.log('Group workout sessions loaded:', response.data);
        
        const formattedSessions = response.data.map(session => ({
          id: session.id,
          groupWorkoutId: session.groupWorkoutId,
          groupWorkoutName: session.groupWorkoutName,
          date: parseISO(session.date),
          time: session.time.substring(0, 5),
          capacity: session.capacity,
          enrollment: session.enrollmentCount,
          level: session.level,
          category: session.category,
          notes: session.notes,
          color: '#ff4757',
          type: 'group',
          isGroup: true
        }));
        
        setGroupWorkoutSessions(formattedSessions);
        showAlert('Group workout sessions loaded successfully', 'success');
      } else {
        console.error('Failed to load group workout sessions: Unexpected response', response);
        setGroupWorkoutSessions([]);
        showAlert('Failed to load group workout sessions', 'error');
      }
    } catch (error) {
      console.error('Error fetching group workout sessions:', error);
      setGroupWorkoutSessions([]);
      showAlert('Failed to load group workout sessions: ' + (error.response?.data || error.message), 'error');
    }
  };

  const handleAddSession = async () => {
    if (!validateSession()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      // Get current logged in trainer ID from localStorage
      const userStr = localStorage.getItem('user');
      let trainerId;
      if (userStr) {
        const user = JSON.parse(userStr);
        trainerId = user.id;
      }
      if (!trainerId) {
        showAlert('User ID not found. Please log in again.', 'error');
        setActionLoading(false);
        return;
      }
      const sessionRequest = {
        clientId: parseInt(newSession.clientId),
        sessionDate: newSession.date,
        sessionTime: newSession.time + ":00",
        sessionType: newSession.type,
        notes: newSession.notes || ""
      };
      const response = await axios.post(
        `http://localhost:8080/api/trainer/${trainerId}/sessions`, 
        sessionRequest
      );
      const newAppointment = {
        id: response.data.id,
        date: parseISO(response.data.sessionDate),
        time: response.data.sessionTime.substring(0, 5),
        client: response.data.clientName,
        clientId: response.data.clientId,
        type: response.data.sessionType,
        notes: response.data.notes,
        color: getRandomColor(),
      };
      setAppointments(prev => [...prev, newAppointment]);
      setOpenDialog(false);
      resetNewSession();
      showAlert('Session added successfully!', 'success');
    } catch (error) {
      console.error('Error adding session:', error);
      showAlert('Failed to add session', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddGroupSession = async () => {
    if (!validateGroupSession()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      // Get current logged in trainer ID from localStorage
      const userStr = localStorage.getItem('user');
      let trainerId;
      if (userStr) {
        const user = JSON.parse(userStr);
        trainerId = user.id;
      }
      if (!trainerId) {
        showAlert('User ID not found. Please log in again.', 'error');
        setActionLoading(false);
        return;
      }
      const sessionRequest = {
        groupWorkoutId: parseInt(newGroupSession.groupWorkoutId),
        date: newGroupSession.date,
        time: newGroupSession.time + ":00",
        notes: newGroupSession.notes || ""
      };
      
      let response;
      
      if (selectedGroupSession) {
        response = await axios.put(
          `http://localhost:8080/api/group-workout-sessions/${selectedGroupSession.id}`, 
          sessionRequest
        );
        
        if (response.status === 200) {
          showAlert('Group session updated successfully!', 'success');
        } else {
          throw new Error('Failed to update group session');
        }
      } else {
        response = await axios.post(
          `http://localhost:8080/api/group-workout-sessions`, 
          sessionRequest
        );
        
        if (response.status === 201) {
          showAlert('Group session added successfully!', 'success');
        } else {
          throw new Error('Failed to add group session');
        }
      }
      
      await fetchGroupWorkoutSessions();
      setOpenGroupSessionDialog(false);
      resetNewGroupSession();
    } catch (error) {
      console.error('Error saving group session:', error);
      showAlert(selectedGroupSession ? 
        'Failed to update group session: ' + (error.response?.data || error.message) : 
        'Failed to add group session: ' + (error.response?.data || error.message), 
        'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSession = (appointmentId) => {
    setDeleteConfirm({ open: true, appointmentId });
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      // Get current logged in trainer ID from localStorage
      const userStr = localStorage.getItem('user');
      let trainerId;
      if (userStr) {
        const user = JSON.parse(userStr);
        trainerId = user.id;
      }
      if (!trainerId) {
        showAlert('User ID not found. Please log in again.', 'error');
        setActionLoading(false);
        return;
      }
      
      const appointmentId = deleteConfirm.appointmentId;
      await axios.delete(`http://localhost:8080/api/trainer/sessions/${appointmentId}`);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      showAlert('Session deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting session:', error);
      showAlert('Failed to delete session', 'error');
    } finally {
      setActionLoading(false);
      setDeleteConfirm({ open: false, appointmentId: null });
    }
  };

  const handleDeleteGroupSession = async (sessionId) => {
    setDeleteGroupConfirm({ open: true, sessionId });
  };

  const confirmDeleteGroupSession = async () => {
    const sessionId = deleteGroupConfirm.sessionId;
    setActionLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/group-workout-sessions/${sessionId}`);
      
      if (response.status === 200) {
        setGroupWorkoutSessions(prev => prev.filter(session => session.id !== sessionId));
        showAlert('Group session deleted successfully!', 'success');
      } else {
        throw new Error('Failed to delete group session');
      }
    } catch (error) {
      console.error('Error deleting group session:', error);
      showAlert('Failed to delete group session: ' + (error.response?.data || error.message), 'error');
    } finally {
      setActionLoading(false);
      setDeleteGroupConfirm({ open: false, sessionId: null });
    }
  };

  const handleEditGroupSession = (session) => {
    setSelectedGroupSession(session);
    setNewGroupSession({
      groupWorkoutId: session.groupWorkoutId.toString(),
      date: format(session.date, 'yyyy-MM-dd'),
      time: session.time,
      notes: session.notes || ""
    });
    setOpenGroupSessionDialog(true);
  };

  const validateSession = () => {
    const required = ['clientId', 'date', 'time', 'type'];
    return required.every(field => newSession[field].toString().trim());
  };

  const validateGroupSession = () => {
    const required = ['groupWorkoutId', 'date', 'time'];
    return required.every(field => newGroupSession[field].toString().trim());
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const getRandomColor = () => {
    const colors = ['#ff4757', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetNewSession = () => {
    setNewSession({
      clientId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      type: '',
      notes: ''
    });
    setErrors({});
  };

  const resetNewGroupSession = () => {
    setNewGroupSession({
      groupWorkoutId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      notes: ''
    });
    setGroupSessionErrors({});
    setSelectedGroupSession(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSession(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    const requiredFields = ['clientId', 'date', 'time', 'type'];
    const updatedSession = {...newSession, [name]: value};
    const isValid = requiredFields.every(field => 
      updatedSession[field] && !errors[field]
    );
    setIsFormValid(isValid);
  };

  const handleGroupSessionInputChange = (event) => {
    const { name, value } = event.target;
    setNewGroupSession(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateGroupSessionField(name, value);
    setGroupSessionErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateField = (name, value) => {
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
        if (!value) return 'Time is required';
        return '';
      case 'type':
        return value ? '' : 'Session type is required';
      default:
        return '';
    }
  };

  const validateGroupSessionField = (name, value) => {
    switch (name) {
      case 'groupWorkoutId':
        return value ? '' : 'Group workout is required';
      case 'date':
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today ? '' : 'Date cannot be in the past';
      case 'time':
        if (!value) return 'Time is required';
        return '';
      default:
        return '';
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the day of week (0-6) where 0 is Sunday
  const startDay = monthStart.getDay();
  
  // Calculate the first day to display (may be from the previous month)
  const firstDisplayedDay = new Date(monthStart);
  firstDisplayedDay.setDate(firstDisplayedDay.getDate() - startDay);
  
  // Create an array of all days to display in the calendar
  const calendarDays = [];
  let day = new Date(firstDisplayedDay);
  
  // Generate 42 days (6 weeks) to ensure we show the full calendar grid
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  
  // Create weeks array from the calendarDays
  const weeks = [];
  for (let i = 0; i < 6; i++) {
    weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
  }

  const dayVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, y: -5 },
    tap: { scale: 0.95 }
  };

  const getAllAppointments = () => {
    if (!showGroupWorkouts) return appointments;
    const groupSessionsAsAppointments = groupWorkoutSessions.map(session => ({
      ...session,
      client: `${session.groupWorkoutName} (Group)`,
      isGroup: true
    }));
    return [...appointments, ...groupSessionsAsAppointments];
  };

  const renderDayContent = (day, dayAppointments) => (
    <Paper
      onClick={() => handleDayClick(day, dayAppointments)}
      sx={{
        p: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: dayAppointments.length > 0 ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        opacity: isSameMonth(day, currentDate) ? 1 : 0.4, // Fade out days not in current month
        bgcolor: isSameDay(day, selectedDate) ? 'rgba(255,71,87,0.1)' : 'transparent',
        border: isSameDay(day, selectedDate) ? '2px solid #ff4757' : '1px solid rgba(255,71,87,0.1)',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Typography 
        align="center"
        sx={{
          fontWeight: isSameDay(day, selectedDate) ? 600 : 400,
          color: isSameDay(day, selectedDate) ? '#ff4757' : 'inherit',
          mb: 1
        }}
      >
        {format(day, 'd')}
      </Typography>
      
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,71,87,0.2)',
          borderRadius: '2px'
        }
      }}>
        {dayAppointments.map((apt) => (
          <motion.div
            key={apt.id + (apt.isGroup ? '-group' : '')}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Tooltip title={apt.isGroup ? 
              `${apt.groupWorkoutName} - Group (${apt.enrollment}/${apt.capacity})` : 
              `${apt.client} - ${apt.type}`
            }>
              <Chip
                size="small"
                icon={apt.isGroup ? <Group fontSize="small" /> : <Person fontSize="small" />}
                label={`${apt.time} ${apt.isGroup ? '👥' : ''}${apt.isGroup ? apt.groupWorkoutName : apt.client}`}
                onDelete={() => apt.isGroup ? 
                  handleDeleteGroupSession(apt.id) : 
                  handleDeleteSession(apt.id)
                }
                sx={{
                  mb: 0.5,
                  width: '100%',
                  bgcolor: apt.isGroup ? 'rgba(255,71,87,0.2)' : `${apt.color}22`,
                  color: apt.isGroup ? '#ff4757' : apt.color,
                  '& .MuiChip-label': {
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            </Tooltip>
          </motion.div>
        ))}
      </Box>
    </Paper>
  );

  // Function to restore scroll position and handle dialog with proper overlay display
  const handleDayClick = (day, appointments) => {
    if (appointments.length > 0) {
      // Store day and appointments data only
      setSelectedDayDetails({
        date: day,
        appointments
      });
      
      // No need to modify scroll position
      document.body.style.overflow = 'auto'; // Ensure body remains scrollable
    }
  };

  // Function to close dialog properly
  const handleCloseDialog = () => {
    setSelectedDayDetails(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const renderSessionDialog = () => (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
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
        background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Event /> New Training Session
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.clientId}>
              <InputLabel>Client</InputLabel>
              <Select
                name="clientId"
                value={newSession.clientId}
                onChange={handleInputChange}
                label="Client"
                startAdornment={
                  <InputAdornment position="start">
                    <Person sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                }
              >
                {clients.map((client) => (
                  <MenuItem key={client.clientId} value={client.clientId}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.clientId && <Typography color="error">{errors.clientId}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={newSession.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time"
              type="time"
              name="time"
              value={newSession.time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.time}
              helperText={errors.time}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Session Type</InputLabel>
              <Select
                name="type"
                value={newSession.type}
                onChange={handleInputChange}
                label="Session Type"
              >
                <MenuItem value="Personal Training">Personal Training</MenuItem>
                <MenuItem value="Yoga Session">Yoga Session</MenuItem>
                <MenuItem value="Strength Training">Strength Training</MenuItem>
              </Select>
              {errors.type && <Typography color="error">{errors.type}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={2}
              value={newSession.notes}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setOpenDialog(false)}
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
        </Button>
        <Button
          onClick={handleAddSession}
          disabled={actionLoading || !isFormValid}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff6b81, #ff4757)',
            }
          }}
        >
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderGroupSessionDialog = () => (
    <Dialog
      open={openGroupSessionDialog}
      onClose={() => { setOpenGroupSessionDialog(false); resetNewGroupSession(); }}
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
        background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Group /> {selectedGroupSession ? 'Edit Group Session' : 'New Group Workout Session'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!groupSessionErrors.groupWorkoutId}>
              <InputLabel>Group Workout</InputLabel>
              <Select
                name="groupWorkoutId"
                value={newGroupSession.groupWorkoutId}
                onChange={handleGroupSessionInputChange}
                label="Group Workout"
                startAdornment={
                  <InputAdornment position="start">
                    <FitnessCenter sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                }
              >
                {groupWorkouts.map((workout) => (
                  <MenuItem key={workout.id} value={workout.id}>
                    {workout.name} ({workout.capacity} capacity)
                  </MenuItem>
                ))}
              </Select>
              {groupSessionErrors.groupWorkoutId && <Typography color="error">{groupSessionErrors.groupWorkoutId}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={newGroupSession.date}
              onChange={handleGroupSessionInputChange}
              InputLabelProps={{ shrink: true }}
              error={!!groupSessionErrors.date}
              helperText={groupSessionErrors.date}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time"
              type="time"
              name="time"
              value={newGroupSession.time}
              onChange={handleGroupSessionInputChange}
              InputLabelProps={{ shrink: true }}
              error={!!groupSessionErrors.time}
              helperText={groupSessionErrors.time}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={2}
              value={newGroupSession.notes}
              onChange={handleGroupSessionInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => { setOpenGroupSessionDialog(false); resetNewGroupSession(); }}
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
        </Button>
        <Button
          onClick={handleAddGroupSession}
          disabled={actionLoading || !validateGroupSession()}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff6b81, #ff4757)',
            }
          }}
        >
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 
           selectedGroupSession ? 'Update Session' : 'Add Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDeleteConfirmDialog = () => (
    <Dialog
      open={deleteConfirm.open}
      onClose={() => setDeleteConfirm({ open: false, appointmentId: null })}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
        }
      }}
    >
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this training session?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setDeleteConfirm({ open: false, appointmentId: null })}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={confirmDelete}
          color="error"
          variant="contained"
          disabled={actionLoading}
          sx={{
            bgcolor: '#ff4757',
            '&:hover': { bgcolor: '#ff3747' }
          }}
        >
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDeleteGroupConfirmDialog = () => (
    <Dialog
      open={deleteGroupConfirm.open}
      onClose={() => setDeleteGroupConfirm({ open: false, sessionId: null })}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
        }
      }}
    >
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this group workout session?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setDeleteGroupConfirm({ open: false, sessionId: null })}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={confirmDeleteGroupSession}
          color="error"
          variant="contained"
          disabled={actionLoading}
          sx={{
            bgcolor: '#ff4757',
            '&:hover': { bgcolor: '#ff3747' }
          }}
        >
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDayDetailsDialog = () => (
    <Dialog
      open={Boolean(selectedDayDetails)}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      TransitionComponent={motion.div}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }
      }}
      // Fix dialog positioning and scroll issues
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiDialog-paper': {
          m: 2, // Margin all around for better mobile display
          maxHeight: 'calc(100% - 64px)', // Ensure it fits within viewport with margins
        }
      }}
      // These two props are key to fix scrolling issues
      disableScrollLock={true}
      hideBackdrop={false} // Keep backdrop for visual separation
      keepMounted={false} // Don't keep component mounted when closed
      disablePortal={false} // Use portal to avoid context issues
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event />
            {selectedDayDetails && format(selectedDayDetails.date, 'MMMM d, yyyy')}
          </Box>
          <Chip
            label={`${selectedDayDetails?.appointments.length} Sessions`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white'
            }}
          />
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 2 }}
            centered
          >
            <Tab 
              label="All" 
              icon={<CalendarMonth />} 
              iconPosition="start"
            />
            <Tab 
              label="Individual" 
              icon={<Person />} 
              iconPosition="start"
            />
            <Tab 
              label="Group" 
              icon={<Group />} 
              iconPosition="start"
            />
          </Tabs>
          
          <AnimatePresence>
            {selectedDayDetails?.appointments
              .filter(apt => {
                if (tabValue === 0) return true;
                if (tabValue === 1) return !apt.isGroup;
                if (tabValue === 2) return apt.isGroup;
                return true;
              })
              .map((apt, index) => (
                <motion.div
                  key={apt.id + (apt.isGroup ? '-group' : '')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : apt.isGroup ? 'rgba(255,71,87,0.05)' : 'rgba(255,71,87,0.02)',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,71,87,0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Avatar sx={{ bgcolor: apt.isGroup ? '#ff4757' : apt.color }}>
                      {apt.isGroup ? <Group /> : <Person />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: apt.isGroup ? '#ff4757' : apt.color }}>
                        {apt.isGroup ? apt.groupWorkoutName : apt.client}
                        {apt.isGroup && 
                          <Chip 
                            size="small" 
                            label={`${apt.enrollment}/${apt.capacity}`}
                            sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                          />
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {apt.time} - {apt.isGroup ? apt.category : apt.type}
                      </Typography>
                    </Box>
                    <Box>
                      {apt.isGroup && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            handleEditGroupSession(apt);
                            setSelectedDayDetails(null);
                          }}
                          sx={{ color: '#ff4757', mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => apt.isGroup ? 
                          handleDeleteGroupSession(apt.id) : 
                          handleDeleteSession(apt.id)
                        }
                        sx={{ color: 'error.main' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
          </AnimatePresence>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: '#666' }}
          >
            Close
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );

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
          alignItems: 'center', 
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: '#ff4757',
              minWidth: 200,
              textAlign: 'center'
            }}>
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
            <IconButton onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showGroupWorkouts}
                  onChange={(e) => setShowGroupWorkouts(e.target.checked)}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff4757',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff4757',
                    },
                  }}
                />
              }
              label="Show Group Sessions"
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ 
            p: 2,
            background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Grid 
                  item 
                  key={day} 
                  xs={12/7} 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Typography 
                    align="center" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#ff4757'
                    }}
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {weeks.map((week, weekIndex) => (
                <Grid 
                  container 
                  key={weekIndex} 
                  spacing={1} 
                  sx={{ width: '100%' }}
                >
                  {week.map((day, dayIndex) => {
                    const allAppointments = getAllAppointments();
                    const dayAppointments = allAppointments.filter(apt => 
                      isSameDay(apt.date, day)
                    );

                    return (
                      <Grid 
                        item 
                        xs={12/7} 
                        key={dayIndex} 
                        sx={{ 
                          aspectRatio: '1',
                          display: 'flex'
                        }}
                      >
                        <motion.div
                          variants={dayVariants}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                          whileTap="tap"
                          transition={{ duration: 0.2 }}
                          style={{ width: '100%' }}
                        >
                          {renderDayContent(day, dayAppointments)}
                        </motion.div>
                      </Grid>
                    );
                  })}
                </Grid>
              ))}
            </Box>
          </Paper>
        )}

        {renderSessionDialog()}
        {renderDeleteConfirmDialog()}
        {renderDayDetailsDialog()}
        {renderGroupSessionDialog()}
        {renderDeleteGroupConfirmDialog()}

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

export default SchedulePage;