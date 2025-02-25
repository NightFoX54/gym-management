import React, { useState } from 'react';
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
} from '@mui/material';
import {
  People as PeopleIcon,
  Today as TodayIcon,
  FitnessCenter as FitnessIcon,
  Timeline as TimelineIcon,
  Person,
  Mail,
  Phone,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import ClientsPage from './ClientsPage';
import SchedulePage from './SchedulePage';
import WorkoutsPage from './WorkoutsPage';
import ProgressReportPage from './ProgressReportPage';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsPage from './SettingsPage';

const TrainerPage = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(null);
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
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    // Burada form verilerini işleyebilirsiniz
    console.log('Form submitted:', formData);
    handleDialogClose();
  };

  const stats = [
    { title: 'Total Clients', value: '24', icon: <PeopleIcon />, color: '#ff4757' },
    { title: 'Today\'s Sessions', value: '8', icon: <TodayIcon />, color: '#ff3747' },
    { title: 'Active Programs', value: '12', icon: <FitnessIcon />, color: '#ff5767' },
    { title: 'Hours This Week', value: '32', icon: <TimelineIcon />, color: '#ff6777' },
  ];

  const upcomingSessions = [
    { client: 'John Doe', time: '09:00 AM', program: 'Weight Training' },
    { client: 'Jane Smith', time: '10:30 AM', program: 'Cardio' },
    { client: 'Mike Johnson', time: '02:00 PM', program: 'CrossFit' },
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
      title: 'Create Workout', 
      icon: <FitnessIcon />, 
      action: () => setOpenDialog('workout'),
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
            color: '#ff4757',
            borderBottom: '2px solid rgba(255,71,87,0.1)',
            mb: 2,
            '& .MuiTypography-root': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }
          }}
        >
          <PeopleIcon /> Add New Client
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
                    boxShadow: '0 4px 10px rgba(255,71,87,0.1)',
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(255,71,87,0.2)',
                  }
                }
              }
            }}>
              <TextField
                name="clientName"
                label="Client Name"
                value={formData.clientName}
                onChange={handleInputChange}
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
      <>
        <DialogTitle sx={{ color: '#ff4757' }}>Schedule New Session</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="sessionDate"
              label="Date"
              type="date"
              value={formData.sessionDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="sessionTime"
              label="Time"
              type="time"
              value={formData.sessionTime}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Session Type</InputLabel>
              <Select
                name="sessionType"
                value={formData.sessionType}
                onChange={handleInputChange}
                label="Session Type"
              >
                <MenuItem value="personal">Personal Training</MenuItem>
                <MenuItem value="group">Group Class</MenuItem>
                <MenuItem value="assessment">Assessment</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
      </>
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
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Workout Type</InputLabel>
              <Select
                name="workoutType"
                value={formData.workoutType}
                onChange={handleInputChange}
                label="Workout Type"
              >
                <MenuItem value="strength">Strength Training</MenuItem>
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="hiit">HIIT</MenuItem>
                <MenuItem value="flexibility">Flexibility</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="duration"
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
      </>
    ),
  };

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="welcome-banner" sx={{
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/wave-pattern.svg) no-repeat',
          backgroundSize: 'cover',
          opacity: 0.1,
        }
      }}>
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome back, John!
          </Typography>
          <Typography variant="subtitle1">
            You have 3 sessions scheduled for today
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="action-card"
                onClick={action.action}
                sx={{
                  background: 'rgba(255, 71, 87, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 71, 87, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255, 71, 87, 0.1)',
                      color: '#ff4757',
                      width: 56,
                      height: 56,
                      margin: '0 auto 1rem',
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="stat-card"
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                        {stat.icon}
                      </Avatar>
                      <Typography variant="h4" className="stat-value" sx={{ color: 'white' }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 2 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Paper className="schedule-paper" sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              <Typography variant="h6" gutterBottom className="section-title">
                Today's Schedule
              </Typography>
              <List className="session-list">
                {upcomingSessions.map((session, index) => (
                  <ListItem key={index} className="session-item">
                    <ListItemAvatar>
                      <Avatar className="session-avatar">
                        <PeopleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={session.client}
                      secondary={`${session.time} - ${session.program}`}
                      className="session-text"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Paper className="progress-paper" sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              <Typography variant="h6" gutterBottom className="section-title">
                Client Progress
              </Typography>
              <Box className="progress-box">
                <Typography variant="body1" color="text.secondary">
                  Client progress charts and metrics will be displayed here
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );

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
        return <SettingsPage isDarkMode={isDarkMode} />;
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
        justifyContent: 'center' // Center the content horizontally
      }}>
        <TrainerNavbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="trainer-content">
          {renderContent()}
        </div>
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
                  color: isDarkMode ? '#fff' : 'inherit',
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
                        borderColor: '#ff4757',
                        color: '#ff4757',
                        borderRadius: '10px',
                        px: 3,
                        '&:hover': {
                          borderColor: '#ff3747',
                          bgcolor: 'rgba(255,71,87,0.1)',
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
                      sx={{
                        bgcolor: '#ff4757',
                        borderRadius: '10px',
                        px: 3,
                        '&:hover': {
                          bgcolor: '#ff3747',
                        }
                      }}
                    >
                      Save
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