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
  People,
  School,
  Category,
  Image,
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
    exercises: [],
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const workoutsPerPage = 6;
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [workoutLevels, setWorkoutLevels] = useState([]);
  const [workoutView, setWorkoutView] = useState('individual'); // 'individual' or 'group'
  const [groupWorkouts, setGroupWorkouts] = useState([]);
  const [selectedGroupWorkout, setSelectedGroupWorkout] = useState(null);
  const [newGroupWorkout, setNewGroupWorkout] = useState({
    name: '',
    description: '',
    capacity: '',
    duration: '',
    level_id: '',
    trainer_id: 3, // Default trainer ID
    category_id: '',
    image_path: '',
  });
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const difficultyColors = {
    beginner: '#2ecc71',
    intermediate: '#f1c40f',
    advanced: '#ff4757',
  };

  useEffect(() => {
    fetchWorkouts();
    initializeGroupWorkoutData();
    initializeWorkoutData();
  }, []);

  const initializeWorkoutData = async () => {
    try {
      console.log('Initializing workout data...');
      await axios.post('http://localhost:8080/api/workouts/init');
      fetchWorkoutTypesAndLevels();
      console.log('Workout categories and levels initialized');
    } catch (error) {
      console.error('Error initializing workout data:', error);
    }
  };

  const initializeGroupWorkoutData = async () => {
    try {
      console.log('Initializing group workout data...');
      await axios.post('http://localhost:8080/api/group-workouts/init');
      console.log('Group workout data initialized');
      fetchGroupWorkouts();
    } catch (error) {
      console.error('Error initializing group workout data:', error);
    }
  };

  const fetchWorkoutTypesAndLevels = async () => {
    try {
      const typesResponse = await axios.get('http://localhost:8080/api/workouts/types');
      setWorkoutTypes(typesResponse.data);
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
      await initializeWorkoutData();
      const trainerId = 3;
      const response = await axios.get(`http://localhost:8080/api/workouts?userId=${trainerId}&isTrainer=true`, {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });
      if (response.status === 200) {
        setWorkouts(response.data || []);
        showAlert('Workouts loaded successfully', 'success');
      } else {
        setWorkouts([]);
        showAlert(`Error ${response.status}: ${response.data?.message || 'Failed to load workouts'}`, 'error');
      }
    } catch (error) {
      setWorkouts([]);
      showAlert('Failed to load workouts: ' + (error.response?.data?.message || error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupWorkouts = async () => {
    try {
      console.log('Fetching group workouts...');
      const trainerId = 3;
      try {
        const response = await axios.get(`http://localhost:8080/api/group-workouts?trainerId=${trainerId}`, {
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
        });
        console.log('Group workout API response:', response);
        
        if (response.status === 200) {
          setGroupWorkouts(response.data || []);
          showAlert('Group workouts loaded successfully', 'success');
        } else {
          console.error('API returned non-200 status:', response.status);
          setGroupWorkouts([]);
          showAlert(`Error ${response.status}: ${response.data?.message || 'Failed to load group workouts'}`, 'error');
        }
      } catch (error) {
        console.error('Error in fetch request:', error);
        setGroupWorkouts([]);
        showAlert('Failed to load group workouts: ' + (error.response?.data?.message || error.message || 'Server error'), 'error');
      }
    } catch (error) {
      console.error('Unexpected error in fetchGroupWorkouts:', error);
      setGroupWorkouts([]);
      showAlert('Failed to load group workouts: Unexpected error occurred', 'error');
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

  const validateGroupWorkoutField = (name, value) => {
    switch (name) {
      case 'name':
        const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]{3,50}$/;
        if (!value) return 'Group workout name is required';
        if (!nameRegex.test(value)) return 'Name format is invalid';
        return '';
      case 'capacity':
        const capacity = parseInt(value);
        if (!value) return 'Capacity is required';
        if (isNaN(capacity) || capacity <= 0 || capacity > 50) {
          return 'Capacity must be between 1-50 participants';
        }
        return '';
      case 'duration':
        const duration = parseInt(value);
        if (!value) return 'Duration is required';
        if (isNaN(duration) || duration <= 0 || duration > 360) {
          return 'Duration must be between 1-360 minutes';
        }
        return '';
      case 'level_id':
        return value ? '' : 'Difficulty level is required';
      case 'category_id':
        return value ? '' : 'Category is required';
      default:
        return '';
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      const lastChar = value.slice(-1);
      if (!/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]$/.test(lastChar)) return;
    }
    setNewWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    const requiredFields = ['name', 'type', 'difficulty', 'duration'];
    const isValid = requiredFields.every((field) => newWorkout[field] && !errors[field]);
    setIsFormValid(isValid);
  };

  const handleGroupWorkoutInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      const lastChar = value.slice(-1);
      if (!/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]$/.test(lastChar) && lastChar) return;
    }
    setNewGroupWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = validateGroupWorkoutField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmitGroupWorkout = async () => {
    const requiredFields = ['name', 'capacity', 'duration', 'level_id', 'category_id'];
    const hasErrors = requiredFields.some((field) => validateGroupWorkoutField(field, newGroupWorkout[field]));
    if (hasErrors) {
      showAlert('Please fill in all required fields correctly', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const trainerId = 3;
      const groupWorkoutRequest = {
        ...newGroupWorkout,
        trainer_id: trainerId,
        capacity: parseInt(newGroupWorkout.capacity),
        duration: parseInt(newGroupWorkout.duration),
      };
      let response;
      if (selectedGroupWorkout) {
        response = await axios.put(`http://localhost:8080/api/group-workouts/${selectedGroupWorkout.id}`, groupWorkoutRequest);
        showAlert('Group workout updated successfully!', 'success');
      } else {
        response = await axios.post(`http://localhost:8080/api/group-workouts`, groupWorkoutRequest);
        showAlert('Group workout added successfully!', 'success');
      }
      await fetchGroupWorkouts();
      handleCloseGroupDialog();
    } catch (error) {
      showAlert(
        selectedGroupWorkout
          ? 'Failed to update group workout: ' + (error.response?.data?.message || error.message || 'Unknown error')
          : 'Failed to add group workout: ' + (error.response?.data?.message || error.message || 'Unknown error'),
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseGroupDialog = () => {
    setOpenGroupDialog(false);
    setSelectedGroupWorkout(null);
    setNewGroupWorkout({
      name: '',
      description: '',
      capacity: '',
      duration: '',
      level_id: '',
      trainer_id: 3,
      category_id: '',
      image_path: '',
    });
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleEditGroupWorkout = (workout) => {
    setSelectedGroupWorkout(workout);
    setNewGroupWorkout({
      name: workout.name,
      description: workout.description || '',
      capacity: workout.capacity.toString(),
      duration: workout.duration.toString(),
      level_id: workout.level_id,
      trainer_id: workout.trainer_id,
      category_id: workout.category_id,
      image_path: workout.image_path || ''
    });
    setOpenGroupDialog(true);
  };

  const handleDeleteGroupWorkout = async (workoutId) => {
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/group-workouts/${workoutId}`);
      setGroupWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      showAlert('Group workout deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting group workout:', error);
      showAlert('Failed to delete group workout: ' + (error.response?.data?.message || error.message || 'Unknown error'), 'error');
    } finally {
      setActionLoading(false);
    }
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
      const trainerId = 3;
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
        response = await axios.put(
          `http://localhost:8080/api/workouts/${selectedWorkout.id}`,
          workoutRequest
        );
        showAlert('Workout updated successfully!', 'success');
      } else {
        response = await axios.post(
          `http://localhost:8080/api/workouts?userId=${trainerId}`,
          workoutRequest
        );
        showAlert('Workout added successfully!', 'success');
      }
      
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
      const response = await axios.get(`http://localhost:8080/api/workouts/${workout.id}`);
      const workoutData = response.data;
      
      setSelectedWorkout(workoutData);
      setNewWorkout({
        name: workoutData.name,
        type: workoutData.type,
        difficulty: workoutData.difficulty,
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
      updatedExercises[editingExerciseIndex] = currentExercise;
    } else {
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
      maxWidth="md"
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
        {/* Dialog content here */}
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

  const getFilteredWorkouts = () => {
    const filteredWorkouts = workouts.filter(workout =>
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilter === 'all' || workout.type === selectedFilter)
    );
    
    if (activeTab === 'all') {
      const startIndex = (page - 1) * workoutsPerPage;
      return filteredWorkouts.slice(startIndex, startIndex + workoutsPerPage);
    } else {
      const groupedWorkouts = groupWorkoutsByType(filteredWorkouts);
      return groupedWorkouts[activeTab] || [];
    }
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const renderGroupWorkoutDialog = () => (
    <Dialog
      open={openGroupDialog}
      onClose={handleCloseGroupDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedGroupWorkout ? <Edit /> : <AddIcon />}
          {selectedGroupWorkout ? 'Update Group Workout' : 'Create New Group Workout'}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, pb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Group Workout Name"
              name="name"
              value={newGroupWorkout.name}
              onChange={handleGroupWorkoutInputChange}
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
                  '&.Mui-focused fieldset': { borderColor: '#ff4757' },
                },
              }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={newGroupWorkout.category_id}
                onChange={handleGroupWorkoutInputChange}
                label="Category"
                sx={{ borderRadius: '12px' }}
              >
                {workoutTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
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
                name="level_id"
                value={newGroupWorkout.level_id}
                onChange={handleGroupWorkoutInputChange}
                label="Difficulty Level"
                sx={{ borderRadius: '12px' }}
              >
                {workoutLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={newGroupWorkout.capacity}
              onChange={handleGroupWorkoutInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <People sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              error={!!errors.capacity}
              helperText={errors.capacity}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={newGroupWorkout.duration}
              onChange={handleGroupWorkoutInputChange}
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="image_path"
              value={newGroupWorkout.image_path}
              onChange={handleGroupWorkoutInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              placeholder="Enter URL to an image for this group workout"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={newGroupWorkout.description}
              onChange={handleGroupWorkoutInputChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              placeholder="Enter detailed description, instructions, and goals for this group workout..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          bgcolor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
          borderTop: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }}
      >
        <LoadingButton
          onClick={handleCloseGroupDialog}
          variant="outlined"
          sx={{
            borderColor: '#ff4757',
            color: '#ff4757',
            '&:hover': {
              borderColor: '#ff3747',
              backgroundColor: 'rgba(255,71,87,0.1)',
            },
          }}
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={handleSubmitGroupWorkout}
          loading={actionLoading}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff6b81, #ff4757)',
            },
          }}
        >
          {selectedGroupWorkout ? 'Update Group Workout' : 'Create Group Workout'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  const renderWorkoutTypeSwitch = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Tabs
        value={workoutView}
        onChange={(e, newValue) => {
          setWorkoutView(newValue);
          setPage(1);
        }}
        sx={{
          bgcolor: isDarkMode ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)',
          borderRadius: '30px',
          p: 0.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '& .MuiTab-root': {
            minWidth: 130,
            borderRadius: '25px',
            color: isDarkMode ? '#fff' : '#666',
            py: 1,
            '&.Mui-selected': {
              color: '#fff',
              bgcolor: '#ff4757',
            },
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        <Tab label="Individual Workouts" value="individual" />
        <Tab label="Group Workouts" value="group" />
      </Tabs>
    </Box>
  );

  const renderGroupWorkouts = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (groupWorkouts.length === 0) {
      return (
        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            bgcolor: isDarkMode ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <People sx={{ fontSize: 60, color: '#ff4757', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Group Workouts Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't created any group workout sessions yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenGroupDialog(true)}
            sx={{
              bgcolor: '#ff4757',
              '&:hover': { bgcolor: '#ff3747' },
            }}
          >
            Create Your First Group Workout
          </Button>
        </Box>
      );
    }
    return (
      <Grid container spacing={3}>
        {groupWorkouts.map((workout) => {
          const workoutType = workoutTypes.find((type) => type.id === workout.category_id) || { name: 'Unknown' };
          const workoutLevel = workoutLevels.find((level) => level.id === workout.level_id) || { name: 'Unknown' };
          return (
            <Grid item xs={12} sm={6} key={workout.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card
                  sx={{
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
                    },
                  }}
                >
                  {workout.image_path && (
                    <Box
                      sx={{
                        width: '120px',
                        minHeight: '100%',
                        backgroundImage: `url(${workout.image_path})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: workout.image_path ? 'calc(100% - 120px)' : '100%',
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#ff4757',
                          fontWeight: 600,
                        }}
                      >
                        {workout.name}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditGroupWorkout(workout)}
                          sx={{ color: '#ff4757' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGroupWorkout(workout.id)}
                          sx={{ color: '#666' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        size="small"
                        label={workoutLevel.name}
                        sx={{
                          bgcolor: `${difficultyColors[workoutLevel.name.toLowerCase()]}15`,
                          color: difficultyColors[workoutLevel.name.toLowerCase()],
                        }}
                      />
                      <Chip
                        size="small"
                        label={workoutType.name}
                        sx={{
                          bgcolor: 'rgba(255,71,87,0.1)',
                          color: '#ff4757',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {workout.description || 'No description available'}
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Timer sx={{ color: '#ff4757', mb: 0.5 }} />
                          <Typography variant="body2">{workout.duration} min</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <People sx={{ color: '#ff4757', mb: 0.5 }} />
                          <Typography variant="body2">{workout.capacity} participants</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 4,
            background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
            p: 3,
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff4757' }}>
            {workoutView === 'individual' ? 'Workout Programs' : 'Group Workouts'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search workouts..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  color: '#fff',
                  '& input': {
                    color: '#fff',
                  },
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
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
                  },
                },
              }}
            />
            <Tooltip title="Filter Workouts">
              <IconButton
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{
                  color: '#ff4757',
                  bgcolor: 'rgba(255,71,87,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,71,87,0.2)' },
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {renderWorkoutTypeSwitch()}
        {workoutView === 'individual' ? (
          <>
            <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>{renderWorkoutTabs()}</Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {workouts.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 5,
                      bgcolor: isDarkMode ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.8)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <FitnessCenter sx={{ fontSize: 60, color: '#ff4757', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No Workouts Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      You haven't created any workout programs yet.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog(true)}
                      sx={{
                        bgcolor: '#ff4757',
                        '&:hover': { bgcolor: '#ff3747' },
                      }}
                    >
                      Create Your First Workout
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {getFilteredWorkouts().map((workout) => (
                      <Grid item xs={12} sm={6} key={workout.id}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                          <Card
                            sx={{
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
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                p: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  mb: 2,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: '#ff4757',
                                    fontWeight: 600,
                                  }}
                                >
                                  {workout.name}
                                </Typography>
                                <Box>
                                  <IconButton size="small" onClick={() => handleEditWorkout(workout)} sx={{ color: '#ff4757' }}>
                                    <Edit />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteWorkout(workout.id)} sx={{ color: '#666' }}>
                                    <Delete />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Chip
                                  size="small"
                                  label={workout.difficulty}
                                  sx={{
                                    bgcolor: `${difficultyColors[workout.difficulty]}15`,
                                    color: difficultyColors[workout.difficulty],
                                  }}
                                />
                                <Chip
                                  size="small"
                                  label={workout.type}
                                  sx={{
                                    bgcolor: 'rgba(255,71,87,0.1)',
                                    color: '#ff4757',
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 2,
                                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {workout.description}
                              </Typography>
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
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                    display: 'block',
                                    mb: 1,
                                  }}
                                >
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
                                        fontSize: '0.7rem',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                    display: 'block',
                                    mb: 1,
                                  }}
                                >
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
                                        fontSize: '0.7rem',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                              <Box sx={{ mt: 'auto' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                                    }}
                                  >
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
                                    },
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 4,
                    }}
                  >
                    <Pagination
                      count={Math.ceil(
                        workouts.filter(workout =>
                          workout.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                          (selectedFilter === 'all' || workout.type === selectedFilter)
                        ).length / workoutsPerPage
                      )}
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
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        ) : (
          renderGroupWorkouts()
        )}
        <Tooltip title={`Add New ${workoutView === 'individual' ? 'Workout' : 'Group Workout'}`}>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: '#ff4757',
              '&:hover': {
                bgcolor: '#ff3747',
              },
            }}
            onClick={() => (workoutView === 'individual' ? setOpenDialog(true) : setOpenGroupDialog(true))}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        {renderExerciseDialog()}
        {renderDialog()}
        {renderGroupWorkoutDialog()}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
};

export default WorkoutsPage;
