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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }));
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

  const filteredWorkouts = workouts.filter(workout => 
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'all' || workout.type === selectedFilter)
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
              {filteredWorkouts.map((workout) => (
                <Grid item xs={12} sm={6} md={4} key={workout.id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{
                      p: 2,
                      height: '100%',
                      position: 'relative',
                      overflow: 'visible',
                      background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,71,87,0.1)',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(255,71,87,0.1)',
                      }
                    }}>
                      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" sx={{ color: '#ff4757', fontWeight: 600 }}>
                          {workout.name}
                        </Typography>
                        <Box>
                          <IconButton size="small" sx={{ color: '#ff4757' }} onClick={() => handleEditWorkout(workout)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#666' }} onClick={() => handleDeleteWorkout(workout.id)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={workout.difficulty}
                          size="small"
                          sx={{
                            bgcolor: `${difficultyColors[workout.difficulty]}15`,
                            color: difficultyColors[workout.difficulty],
                            mr: 1
                          }}
                        />
                        <Chip
                          label={workout.type}
                          size="small"
                          sx={{ bgcolor: 'rgba(255,71,87,0.1)', color: '#ff4757' }}
                        />
                      </Box>

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

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Completion Rate
                        </Typography>
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
                    </Card>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
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
