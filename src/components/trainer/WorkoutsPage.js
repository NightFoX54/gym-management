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
import axios from 'axios';

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
    description: '',
    equipment: [],
    targetMuscles: [],
    exercises: []  // This should be an array of exercises, not a count
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const workoutsPerPage = 6;
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [workoutLevels, setWorkoutLevels] = useState([]);

  useEffect(() => {
    fetchWorkouts();
    // Initialize workout categories and levels in the backend
    initializeWorkoutData();
  }, []);

  const initializeWorkoutData = async () => {
    try {
      console.log('Initializing workout data...');
      await axios.post('http://localhost:8080/api/workouts/init');
      // Fetch workout categories and levels after initialization
      fetchWorkoutTypesAndLevels();
      console.log('Workout categories and levels initialized');
    } catch (error) {
      console.error('Error initializing workout data:', error);
    }
  };

  const fetchWorkoutTypesAndLevels = async () => {
    try {
      // Fetch workout types
      const typesResponse = await axios.get('http://localhost:8080/api/workouts/types');
      setWorkoutTypes(typesResponse.data);
      
      // Fetch workout levels
      const levelsResponse = await axios.get('http://localhost:8080/api/workouts/levels');
      setWorkoutLevels(levelsResponse.data);
    } catch (error) {
      console.error('Error fetching workout types and levels:', error);
    }
  };

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      console.log('Fetching workouts...');
      // Ensure workout data is initialized first
      await initializeWorkoutData();
      
      // Assuming the user is already logged in and trainer ID is 3
      const trainerId = 3; // This should come from your auth context or state
      const response = await axios.get(`http://localhost:8080/api/workouts?userId=${trainerId}&isTrainer=true`, {
        // Add better error handling
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept any status code less than 500 as a valid response
        },
      });
      
      console.log('Workout API response:', response);
      
      if (response.status === 200) {
        setWorkouts(response.data || []);
        showAlert('Workouts loaded successfully', 'success');
      } else {
        console.error('API returned non-200 status:', response.status);
        setWorkouts([]);
        showAlert(`Error ${response.status}: ${response.data?.message || 'Failed to load workouts'}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
      showAlert('Failed to load workouts: ' + (error.response?.data?.message || error.message || 'Unknown error'), 'error');
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
      // Assuming the user is already logged in and trainer ID is 3
      const trainerId = 3; // This should come from your auth context or state
      
      const workoutRequest = {
        name: newWorkout.name,
        type: newWorkout.type,
        difficulty: newWorkout.difficulty,
        duration: parseInt(newWorkout.duration),
        calories: parseInt(newWorkout.calories) || 0,
        description: newWorkout.description || "",
        equipment: newWorkout.equipment || [],
        targetMuscles: newWorkout.targetMuscles || [],
        exercises: Array.isArray(newWorkout.exercises) ? newWorkout.exercises.map(ex => ({
          exerciseName: ex.exerciseName,
          sets: parseInt(ex.sets),
          repRange: ex.repRange
        })) : []
      };
      
      let response;
      
      if (selectedWorkout) {
        // Update existing workout
        response = await axios.put(
          `http://localhost:8080/api/workouts/${selectedWorkout.id}`,
          workoutRequest
        );
        showAlert('Workout updated successfully!', 'success');
      } else {
        // Create new workout
        response = await axios.post(
          `http://localhost:8080/api/workouts?userId=${trainerId}`,
          workoutRequest
        );
        showAlert('Workout added successfully!', 'success');
      }
      
      // Refresh the workouts list
      await fetchWorkouts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving workout:', error);
      showAlert(selectedWorkout ? 
        'Failed to update workout: ' + (error.response?.data?.message || error.message || 'Unknown error') : 
        'Failed to add workout: ' + (error.response?.data?.message || error.message || 'Unknown error'), 
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/workouts/${workoutId}`);
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      showAlert('Workout deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting workout:', error);
      showAlert('Failed to delete workout: ' + (error.response?.data?.message || error.message || 'Unknown error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditWorkout = async (workout) => {
    try {
      // Fetch detailed workout data including exercises
      const response = await axios.get(`http://localhost:8080/api/workouts/${workout.id}`);
      const workoutData = response.data;
      
      setSelectedWorkout(workoutData);
      setNewWorkout({
        name: workoutData.name,
        type: workoutData.type,  // Use the full type name from DB
        difficulty: workoutData.difficulty,  // Use the full difficulty name from DB
        duration: workoutData.duration.toString(),
        calories: workoutData.calories?.toString() || '',
        description: workoutData.description || '',
        equipment: workoutData.equipment || [],
        targetMuscles: workoutData.targetMuscles || [],
        exercises: workoutData.exerciseList || []
      });
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      showAlert('Failed to load workout details: ' + (error.response?.data?.message || error.message || 'Unknown error'), 'error');
    }
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

  // Add new component for exercise management
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({ exerciseName: '', sets: '', repRange: '' });
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);

  const handleOpenExerciseDialog = (exercise = null, index = null) => {
    if (exercise) {
      setCurrentExercise(exercise);
      setEditingExerciseIndex(index);
    } else {
      setCurrentExercise({ exerciseName: '', sets: '', repRange: '' });
      setEditingExerciseIndex(null);
    }
    setExerciseDialogOpen(true);
  };

  const handleSaveExercise = () => {
    if (!currentExercise.exerciseName || !currentExercise.sets || !currentExercise.repRange) {
      showAlert('Please fill all exercise fields', 'error');
      return;
    }

    const updatedExercises = [...(newWorkout.exercises || [])];
    
    if (editingExerciseIndex !== null) {
      // Edit existing exercise
      updatedExercises[editingExerciseIndex] = currentExercise;
    } else {
      // Add new exercise
      updatedExercises.push(currentExercise);
    }
    
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
    setExerciseDialogOpen(false);
    setCurrentExercise({ exerciseName: '', sets: '', repRange: '' });
    setEditingExerciseIndex(null);
  };

  const handleDeleteExercise = (index) => {
    const updatedExercises = [...newWorkout.exercises];
    updatedExercises.splice(index, 1);
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const handleExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise({ ...currentExercise, [name]: value });
  };

  const renderExerciseDialog = () => (
    <Dialog
      open={exerciseDialogOpen}
      onClose={() => setExerciseDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editingExerciseIndex !== null ? 'Edit Exercise' : 'Add Exercise'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Exercise Name"
              name="exerciseName"
              value={currentExercise.exerciseName}
              onChange={handleExerciseInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Sets"
              name="sets"
              type="number"
              value={currentExercise.sets}
              onChange={handleExerciseInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Rep Range"
              name="repRange"
              value={currentExercise.repRange}
              onChange={handleExerciseInputChange}
              placeholder="e.g., 8-12 reps"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExerciseDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleSaveExercise} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );

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
                {workoutTypes.map(type => (
                  <MenuItem 
                    key={type.id} 
                    value={type.name}
                  >
                    {type.name}
                  </MenuItem>
                ))}
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
                {workoutLevels.map(level => (
                  <MenuItem 
                    key={level.id} 
                    value={level.name.toLowerCase()}
                  >
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="subtitle1">Exercises</Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenExerciseDialog()}
                size="small"
                sx={{
                  borderColor: '#ff4757',
                  color: '#ff4757',
                  '&:hover': {
                    borderColor: '#ff3747',
                    backgroundColor: 'rgba(255,71,87,0.1)',
                  }
                }}
              >
                Add Exercise
              </Button>
            </Box>
            
            {/* Exercise List */}
            {newWorkout.exercises && newWorkout.exercises.length > 0 ? (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: 2 }}>
                {newWorkout.exercises.map((exercise, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderBottom: index < newWorkout.exercises.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{exercise.exerciseName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exercise.sets} sets × {exercise.repRange}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenExerciseDialog(exercise, index)}
                        sx={{ color: '#ff4757' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteExercise(index)}
                        sx={{ color: '#666' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box 
                sx={{ 
                  border: '1px dashed', 
                  borderColor: 'divider', 
                  borderRadius: '12px', 
                  p: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <FitnessCenter sx={{ color: 'text.disabled', fontSize: '2rem' }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  No exercises added yet. Click "Add Exercise" to get started.
                </Typography>
              </Box>
            )}
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

  const resetNewWorkout = () => ({
    name: '',
    type: '',
    difficulty: '',
    duration: '',
    calories: '',
    description: '',
    equipment: [],
    targetMuscles: [],
    exercises: [] // Reset to empty array
  });

  const difficultyColors = {
    beginner: '#2ecc71',
    intermediate: '#f1c40f',
    advanced: '#ff4757',
  };

  const getFilterOptions = () => {
    // Start with the "All Workouts" option
    const options = [{ value: 'all', label: 'All Workouts' }];
    
    // Add options from fetched workout types with their original names
    if (workoutTypes.length > 0) {
      workoutTypes.forEach(type => {
        options.push({
          value: type.name,
          label: type.name
        });
      });
    } else {
      // Fallback to static options if API fails
      options.push(
        { value: 'Strength Training', label: 'Strength Training' },
        { value: 'Cardio', label: 'Cardio' },
        { value: 'HIIT', label: 'HIIT' },
        { value: 'Flexibility', label: 'Flexibility' },
        { value: 'CrossFit', label: 'CrossFit' }
      );
    }
    
    return options;
  };

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

  const renderWorkoutTabs = () => {
    return (
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
        {workoutTypes.map(type => (
          <Tab key={type.id} label={type.name} value={type.name} />
        ))}
      </Tabs>
    );
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
          {getFilterOptions().map((option) => (
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
          {renderWorkoutTabs()}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {workouts.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                p: 5, 
                bgcolor: isDarkMode ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <FitnessCenter sx={{ fontSize: 60, color: '#ff4757', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>No Workouts Found</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't created any workout programs yet.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    bgcolor: '#ff4757',
                    '&:hover': { bgcolor: '#ff3747' }
                  }}
                >
                  Create Your First Workout
                </Button>
              </Box>
            ) : (
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
                                <Typography variant="body2">{workout.exercises.length} ex</Typography>
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
            )}
            
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

        {renderExerciseDialog()}
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

export default WorkoutsPage;
