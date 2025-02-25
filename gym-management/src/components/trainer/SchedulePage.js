import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  AccessTime,
  Person,
  Event,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const SchedulePage = ({ isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    client: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: '',
    duration: 60,
    notes: ''
  });

  // Örnek randevular
  const appointments = [
    {
      id: 1,
      date: new Date(),
      time: '09:00',
      client: 'John Doe',
      type: 'Personal Training',
      color: '#ff4757'
    },
    {
      id: 2,
      date: new Date(),
      time: '14:30',
      client: 'Jane Smith',
      type: 'Yoga Session',
      color: '#2ecc71'
    },
    // Daha fazla randevu eklenebilir
  ];

  const handleAddSession = () => {
    const newAppointment = {
      id: appointments.length + 1,
      date: new Date(newSession.date),
      time: newSession.time,
      client: newSession.client,
      type: newSession.type,
      color: '#ff4757'
    };
    
    appointments.push(newAppointment);
    setOpenDialog(false);
    setNewSession({
      client: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      type: '',
      duration: 60,
      notes: ''
    });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks = [];
  let week = [];
  
  monthDays.forEach(day => {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });
  
  if (week.length > 0) {
    weeks.push(week);
  }

  const dayVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, y: -5 },
    tap: { scale: 0.95 }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: '#ff4757',
              '&:hover': { bgcolor: '#ff3747' }
            }}
          >
            New Session
          </Button>
        </Box>

        {/* Calendar Grid */}
        <Paper sx={{ 
          p: 2,
          background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px'
        }}>
          {/* Weekday Headers */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
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

          {/* Calendar Days */}
          <AnimatePresence>
            {weeks.map((week, weekIndex) => (
              <Grid container spacing={1} key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dayAppointments = appointments.filter(apt => 
                    isSameDay(apt.date, day)
                  );
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <Grid item xs key={dayIndex}>
                      <motion.div
                        variants={dayVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ duration: 0.2 }}
                      >
                        <Paper
                          onClick={() => setSelectedDate(day)}
                          sx={{
                            p: 1,
                            height: 100,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            bgcolor: isSelected ? 'rgba(255,71,87,0.1)' : 'transparent',
                            border: isSelected ? '2px solid #ff4757' : '1px solid rgba(255,71,87,0.1)',
                            opacity: isCurrentMonth ? 1 : 0.5,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255,71,87,0.05)',
                            }
                          }}
                        >
                          <Typography 
                            align="center"
                            sx={{
                              fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? '#ff4757' : 'inherit'
                            }}
                          >
                            {format(day, 'd')}
                          </Typography>
                          
                          {/* Appointments for the day */}
                          <Box sx={{ mt: 1 }}>
                            {dayAppointments.map((apt, index) => (
                              <motion.div
                                key={apt.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Chip
                                  size="small"
                                  label={`${apt.time} ${apt.client}`}
                                  sx={{
                                    mb: 0.5,
                                    width: '100%',
                                    bgcolor: `${apt.color}22`,
                                    color: apt.color,
                                    '& .MuiChip-label': {
                                      fontSize: '0.7rem'
                                    }
                                  }}
                                />
                              </motion.div>
                            ))}
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            ))}
          </AnimatePresence>
        </Paper>

        {/* New Session Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
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
                <TextField
                  fullWidth
                  label="Client Name"
                  value={newSession.client}
                  onChange={(e) => setNewSession({ ...newSession, client: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Session Type</InputLabel>
                  <Select
                    value={newSession.type}
                    onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
                    label="Session Type"
                  >
                                        <MenuItem value="Personal Training">Personal Training</MenuItem>
                                        <MenuItem value="Yoga Session">Yoga Session</MenuItem>
                                        <MenuItem value="Strength Training">Strength Training</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                                <Button onClick={handleAddSession} variant="contained">Add Session</Button>
                              </DialogActions>
                            </Dialog>
                          </motion.div>
                        </Box>
                      );
                    };
                    
                    export default SchedulePage;