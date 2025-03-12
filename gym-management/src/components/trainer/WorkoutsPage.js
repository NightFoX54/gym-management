import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add as AddIcon,
  FitnessCenter,
  Timer,
  LocalFireDepartment as FireIcon,
  FilterList,
  Edit,
  Delete,
  Speed,
  AccessTime,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingButton } from '@mui/lab';

const WorkoutsPage = ({ isDarkMode }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: '',
    difficulty: '',
    duration: '',
    calories: '',
    exercises: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const workoutsPerPage = 6;

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const response = await new Promise(resolve => 
        setTimeout(() => resolve(mockWorkouts), 1000)
      );
      setWorkouts(response);
      showAlert('Workouts loaded successfully', 'success');
    } catch (error) {
      showAlert('Failed to load workouts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]{3,50}$/;
        if (!value) return 'Workout name is required';
        if (!nameRegex.test(value)) return 'Name format is invalid';
        return '';
      case 'type':
        return value ? '' : 'Workout type is required';
      case 'difficulty':
        return value ? '' : 'Difficulty level is required';
      case 'duration':
        const duration = parseInt(value);
        if (!value) return 'Duration is required';
        if (isNaN(duration) || duration <= 0 || duration > 360) {
          return 'Duration must be between 1-360 minutes';
        }
        return '';
      case 'calories':
        const calories = parseInt(value);
        if (value && (isNaN(calories) || calories < 0 || calories > 2000)) {
          return 'Calories must be between 0-2000';
        }
        return '';
      case 'exercises':
        const exercises = parseInt(value);
        if (value && (isNaN(exercises) || exercises <= 0 || exercises > 50)) {
          return 'Exercises must be between 1-50';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // For workout name, prevent special characters
    if (name === 'name') {
      const lastChar = value.slice(-1);
      if (!/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]$/.test(lastChar)) return;
    }

    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Check if form is valid
    const requiredFields = ['name', 'type', 'difficulty', 'duration'];
    const isValid = requiredFields.every(field => 
      newWorkout[field] && !errors[field]
    );
    setIsFormValid(isValid);
  };

  const validateForm = () => {
    const required = ['name', 'type', 'difficulty', 'duration'];
    return required.every(field => newWorkout[field].toString().trim());
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedWorkout) {
        setWorkouts(prev => prev.map(workout => 
          workout.id === selectedWorkout.id ? { ...newWorkout, id: workout.id } : workout
        ));
        showAlert('Workout updated successfully!', 'success');
      } else {
        const newWorkoutData = {
          id: workouts.length + 1,
          ...newWorkout,
          completion: 0
        };
        setWorkouts(prev => [...prev, newWorkoutData]);
        showAlert('Workout added successfully!', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showAlert(selectedWorkout ? 'Failed to update workout' : 'Failed to add workout', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      showAlert('Workout deleted successfully!', 'success');
    } catch (error) {
      showAlert('Failed to delete workout', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditWorkout = (workout) => {
    setSelectedWorkout(workout);
    setNewWorkout(workout);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkout(null);
    setNewWorkout({
      name: '',
      type: '',
      difficulty: '',
      duration: '',
      calories: '',
      exercises: '',
      description: ''
    });
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const renderDialog = () => (
    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialog}
      maxWidth="md" // Changed from sm to md for more space
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
          {selectedWorkout ? <Edit /> : <AddIcon />}
          {selectedWorkout ? 'Update Workout' : 'Create New Workout Program'}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, pb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Workout Name"
              name="name"
              value={newWorkout.name}
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
                  borderRadius: '12px',
                  '&:hover fieldset': { borderColor: '#ff4757' },
                  '&.Mui-focused fieldset': { borderColor: '#ff4757' }
                }
              }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Workout Type</InputLabel>
              <Select
                name="type"
                value={newWorkout.type}
                onChange={handleInputChange}
                label="Workout Type"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="strength">Strength Training</MenuItem>
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="hiit">HIIT</MenuItem>
                <MenuItem value="flexibility">Flexibility</MenuItem>
                <MenuItem value="crossfit">CrossFit</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                name="difficulty"
                value={newWorkout.difficulty}
                onChange={handleInputChange}
                label="Difficulty Level"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={newWorkout.duration}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Timer sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              error={!!errors.duration}
              helperText={errors.duration}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Calories Burn"
              name="calories"
              type="number"
              value={newWorkout.calories}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FireIcon sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              error={!!errors.calories}
              helperText={errors.calories}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number of Exercises"
              name="exercises"
              type="number"
              value={newWorkout.exercises}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Speed sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              error={!!errors.exercises}
              helperText={errors.exercises}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Workout Description"
              name="description"
              multiline
              rows={4}
              value={newWorkout.description}
              onChange={handleInputChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              placeholder="Enter detailed workout description, instructions, and goals..."
            />
          </Grid>

          {/* Additional form fields for equipment and target muscles */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Required Equipment</InputLabel>
              <Select
                multiple
                name="equipment"
                value={newWorkout.equipment || []}
                onChange={handleInputChange}
                label="Required Equipment"
                sx={{ borderRadius: '12px' }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,71,87,0.1)',
                          color: '#ff4757'
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {['Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Yoga Mat', 'Treadmill'].map((eq) => (
                  <MenuItem key={eq} value={eq}>{eq}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Target Muscle Groups</InputLabel>
              <Select
                multiple
                name="targetMuscles"
                value={newWorkout.targetMuscles || []}
                onChange={handleInputChange}
                label="Target Muscle Groups"
                sx={{ borderRadius: '12px' }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,71,87,0.1)',
                          color: '#ff4757'
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map((muscle) => (
                  <MenuItem key={muscle} value={muscle}>{muscle}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions 
        sx={{ 
          p: 3, 
          bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
          borderTop: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
      >
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
          {selectedWorkout ? 'Update Workout' : 'Create Workout'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  // Update initial state for new workout
  const resetNewWorkout = () => ({
    name: '',
    type: '',
    difficulty: '',
    duration: '',
    calories: '',
    exercises: '',
    description: '',
    equipment: [],
    targetMuscles: [],
    completion: 0
  });

  const difficultyColors = {
    beginner: '#2ecc71',
    intermediate: '#f1c40f',
    advanced: '#ff4757',
  };

  const filterOptions = [
    { value: 'all', label: 'All Workouts' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
  ];

  const groupWorkoutsByType = (workouts) => {
    return workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = [];
      }
      acc[workout.type].push(workout);
      return acc;
    }, {});
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1); // Reset page when changing tabs
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'all' || workout.type === selectedFilter)
  );

  const getFilteredWorkouts = () => {
    if (activeTab === 'all') {
      const startIndex = (page - 1) * workoutsPerPage;
      return filteredWorkouts.slice(startIndex, startIndex + workoutsPerPage);
    } else {
      const groupedWorkouts = groupWorkoutsByType(filteredWorkouts);
      return groupedWorkouts[activeTab] || [];
    }
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
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff4757' }}>
            Workout Programs
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search workouts..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  color: '#fff', // Changed to always white
                  '& input': {
                    color: '#fff', // Added to ensure input text is white
                  },
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'rgba(255,71,87,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,71,87,0.5) !important',
                  }
                }
              }}
            />

            <Tooltip title="Filter Workouts">
              <IconButton 
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ 
                  color: '#ff4757',
                  bgcolor: 'rgba(255,71,87,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,71,87,0.2)' }
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 2,
              minWidth: 180,
            }
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem 
              key={option.value}
              onClick={() => {
                setSelectedFilter(option.value);
                setFilterAnchor(null);
              }}
              selected={selectedFilter === option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: isDarkMode ? '#fff' : '#666',
                '&.Mui-selected': {
                  color: '#ff4757',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ff4757',
              }
            }}
          >
            <Tab label="All Workouts" value="all" />
            <Tab label="Strength" value="strength" />
            <Tab label="Cardio" value="cardio" />
            <Tab label="HIIT" value="hiit" />
            <Tab label="Flexibility" value="flexibility" />
            <Tab label="CrossFit" value="crossfit" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {getFilteredWorkouts().map((workout) => (
                <Grid item xs={12} sm={6} key={workout.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{
                      display: 'flex',
                      background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,71,87,0.1)',
                      transition: 'all 0.3s ease',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(255,71,87,0.1)',
                      }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        width: '100%',
                        p: 3 
                      }}>
                        {/* Header */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2
                        }}>
                          <Typography variant="h6" sx={{ 
                            color: '#ff4757',
                            fontWeight: 600,
                          }}>
                            {workout.name}
                          </Typography>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditWorkout(workout)}
                              sx={{ color: '#ff4757' }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteWorkout(workout.id)}
                              sx={{ color: '#666' }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Tags */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={workout.difficulty}
                            sx={{
                              bgcolor: `${difficultyColors[workout.difficulty]}15`,
                              color: difficultyColors[workout.difficulty]
                            }}
                          />
                          <Chip
                            size="small"
                            label={workout.type}
                            sx={{
                              bgcolor: 'rgba(255,71,87,0.1)',
                              color: '#ff4757'
                            }}
                          />
                        </Box>

                        {/* Description */}
                        <Typography variant="body2" sx={{ 
                          mb: 2,
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {workout.description}
                        </Typography>

                        {/* Stats Grid */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Timer sx={{ color: '#ff4757', mb: 0.5 }} />
                              <Typography variant="body2">{workout.duration} min</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <FireIcon sx={{ color: '#ff4757', mb: 0.5 }} />
                              <Typography variant="body2">{workout.calories} cal</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <FitnessCenter sx={{ color: '#ff4757', mb: 0.5 }} />
                              <Typography variant="body2">{workout.exercises} ex</Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Equipment and Muscles */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                            display: 'block',
                            mb: 1
                          }}>
                            Equipment:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {workout.equipment.map((item, index) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                sx={{
                                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                            display: 'block',
                            mb: 1
                          }}>
                            Target Muscles:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {workout.targetMuscles.map((muscle, index) => (
                              <Chip
                                key={index}
                                label={muscle}
                                size="small"
                                sx={{
                                  bgcolor: isDarkMode ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.1)',
                                  color: '#ff4757',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Progress Bar */}
                        <Box sx={{ mt: 'auto' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ 
                              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit'
                            }}>
                              Completion Rate
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ff4757' }}>
                              {workout.completion}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={workout.completion}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,71,87,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: '#ff4757',
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {activeTab === 'all' && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4 
              }}>
                <Pagination
                  count={Math.ceil(filteredWorkouts.length / workoutsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: isDarkMode ? '#fff' : 'inherit',
                      '&.Mui-selected': {
                        bgcolor: '#ff4757',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#ff3747',
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        <Tooltip title="Add New Workout">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: '#ff4757',
              '&:hover': {
                bgcolor: '#ff3747',
              }
            }}
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {renderDialog()}

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

const mockWorkouts = [
  {
    id: 1,
    name: 'Full Body Strength',
    type: 'strength',
    difficulty: 'intermediate',
    duration: 60,
    calories: 450,
    exercises: 12,
    completion: 85,
    description: 'Complete full body workout focusing on major muscle groups',
    equipment: ['Dumbbells', 'Barbell', 'Resistance Bands'],
    targetMuscles: ['Chest', 'Back', 'Legs', 'Shoulders']
  },
  {
    id: 2,
    name: 'HIIT Cardio Blast',
    type: 'cardio',
    difficulty: 'advanced',
    duration: 45,
    calories: 600,
    exercises: 8,
    completion: 92,
    description: 'High-intensity interval training for maximum calorie burn',
    equipment: ['Kettlebell', 'Jump Rope', 'Yoga Mat'],
    targetMuscles: ['Core', 'Legs', 'Shoulders']
  },
  {
    id: 3,
    name: 'Yoga Flow',
    type: 'flexibility',
    difficulty: 'beginner',
    duration: 50,
    calories: 200,
    exercises: 15,
    completion: 78,
    description: 'Relaxing yoga session focusing on flexibility and mindfulness',
    equipment: ['Yoga Mat', 'Resistance Bands'],
    targetMuscles: ['Core', 'Back', 'Legs']
  },
  {
    id: 4,
    name: 'Power Lifting',
    type: 'strength',
    difficulty: 'advanced',
    duration: 75,
    calories: 500,
    exercises: 6,
    completion: 65,
    description: 'Heavy lifting session focusing on compound movements',
    equipment: ['Barbell', 'Power Rack', 'Weight Plates'],
    targetMuscles: ['Chest', 'Back', 'Legs']
  },
  {
    id: 5,
    name: 'Core Crusher',
    type: 'strength',
    difficulty: 'intermediate',
    duration: 30,
    calories: 300,
    exercises: 10,
    completion: 95,
    description: 'Intense core workout for strengthening abdominal muscles',
    equipment: ['Yoga Mat', 'Medicine Ball'],
    targetMuscles: ['Core', 'Back']
  },
  {
    id: 6,
    name: 'Sprint Intervals',
    type: 'cardio',
    difficulty: 'advanced',
    duration: 40,
    calories: 550,
    exercises: 5,
    completion: 88,
    description: 'High-intensity sprint training for cardiovascular endurance',
    equipment: ['Treadmill'],
    targetMuscles: ['Legs', 'Core']
  },
  {
    id: 7,
    name: 'Upper Body Focus',
    type: 'strength',
    difficulty: 'intermediate',
    duration: 55,
    calories: 400,
    exercises: 9,
    completion: 72,
    description: 'Complete upper body workout targeting all major muscle groups',
    equipment: ['Dumbbells', 'Pull-up Bar', 'Resistance Bands'],
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms']
  },
  {
    id: 8,
    name: 'Leg Day Challenge',
    type: 'strength',
    difficulty: 'advanced',
    duration: 65,
    calories: 480,
    exercises: 8,
    completion: 60,
    description: 'Intense lower body workout focusing on strength and hypertrophy',
    equipment: ['Barbell', 'Squat Rack', 'Leg Press'],
    targetMuscles: ['Legs', 'Core']
  },
  {
    id: 9,
    name: 'Mobility Flow',
    type: 'flexibility',
    duration: 35,
    difficulty: 'beginner',
    calories: 150,
    exercises: 12,
    completion: 90,
    description: 'Dynamic stretching and mobility exercises for better flexibility',
    equipment: ['Foam Roller', 'Yoga Mat'],
    targetMuscles: ['Full Body']
  },
  {
    id: 10,
    name: 'CrossFit WOD',
    type: 'crossfit',
    difficulty: 'advanced',
    duration: 45,
    calories: 580,
    exercises: 6,
    completion: 82,
    description: 'High-intensity CrossFit workout of the day',
    equipment: ['Kettlebell', 'Jump Rope', 'Barbell'],
    targetMuscles: ['Full Body']
  }
];

export default WorkoutsPage;
