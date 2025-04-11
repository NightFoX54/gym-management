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
  FormHelperText,
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Close } from '@mui/icons-material';


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
    imageFile: null,
    imagePreview: null
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
    title: '',
    description: '',
    category_id: '',
    level_id: '',
    duration: '',
    capacity: '',
    image_path: ''
  });
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const difficultyColors = {
    beginner: '#2ecc71',
    intermediate: '#f1c40f',
    advanced: '#ff4757',
  };
  const [error, setError] = useState(null);
  const [groupWorkoutCategories, setGroupWorkoutCategories] = useState([]);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [sessionDate, setSessionDate] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(new Date());
  const [sessionNotes, setSessionNotes] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchWorkouts();
    fetchGroupWorkouts();
    fetchGroupWorkoutCategories();
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
      console.log('Group workout data already initialized, skipping...');
      fetchGroupWorkouts();
    } catch (error) {
      console.error('Error initializing group workout data:', error);
      setError('Failed to initialize group workout data');
    }
  };

  const fetchWorkoutTypesAndLevels = async () => {
    try {
      const typesResponse = await axios.get('http://localhost:8080/api/workouts/types');
      setWorkoutTypes(typesResponse.data);
      console.log("Workout types fetched:", typesResponse.data);
      
      const levelsResponse = await axios.get('http://localhost:8080/api/workouts/levels');
      console.log("Workout levels fetched:", levelsResponse.data);
      // Log the first level to see its structure
      if (levelsResponse.data && levelsResponse.data.length > 0) {
        console.log("First level object structure:", JSON.stringify(levelsResponse.data[0]));
      }
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
      // Get current logged in trainer ID from localStorage or context
      const trainerId = localStorage.getItem('userId') || 3; // Fallback to 3 for development
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
    console.log("Fetching group workouts...");
    try {
      // Get the user ID from localStorage, same as in fetchWorkouts
      const trainerId = localStorage.getItem('userId') || 3; // Fallback to 3 for development
      
      // Update the URL to use the absolute backend URL instead of a relative path
      const response = await axios.get(`http://localhost:8080/api/group-workouts/trainer/${trainerId}`);
      setGroupWorkouts(response.data || []);
      console.log("Group workouts fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching group workouts:", error);
      // Set empty array to prevent undefined errors
      setGroupWorkouts([]);
    }
  };

  const fetchGroupWorkoutCategories = async () => {
    try {
      console.log("Fetching group workout categories...");
      const response = await axios.get('http://localhost:8080/api/group-workouts/categories');
      console.log("Group workout categories response:", response.data);
      
      // Log the structure of the first category to understand its properties
      if (response.data && response.data.length > 0) {
        console.log("First category object structure:", JSON.stringify(response.data[0]));
      }
      
      setGroupWorkoutCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching group workout categories:", error);
      console.log("Please check network tab to see what endpoint is being used for group workout categories");
      setGroupWorkoutCategories([]);
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
      console.log("Starting group workout submission process...");
      
      // Get current logged in trainer ID from localStorage or context
      const trainerId = localStorage.getItem('userId') || 3; // Fallback to 3 for development
      
      // Handle image upload if there is a file
      let imagePath = newGroupWorkout.image_path;
      if (newGroupWorkout.imageFile) {
        console.log("Image file present, uploading:", newGroupWorkout.imageFile.name);
        
        const uploadedImagePath = await handleImageUpload(newGroupWorkout.imageFile);
        if (uploadedImagePath) {
          imagePath = uploadedImagePath;
          console.log("Image upload successful, new path:", imagePath);
        } else {
          console.error("Failed to upload image");
        }
      } else {
        console.log("No image file to upload, using existing path:", imagePath);
      }
      
      const groupWorkoutRequest = {
        name: newGroupWorkout.name,
        description: newGroupWorkout.description,
        capacity: parseInt(newGroupWorkout.capacity),
        duration: parseInt(newGroupWorkout.duration),
        level_id: parseInt(newGroupWorkout.level_id),
        category_id: parseInt(newGroupWorkout.category_id),
        trainer_id: trainerId,
        // Include the image path explicitly with both potential keys to ensure compatibility
        imagePath: imagePath,
        image_path: imagePath
      };
      
      console.log("Sending request with data:", JSON.stringify(groupWorkoutRequest));
      
      let response;
      if (selectedGroupWorkout) {
        response = await axios.put(
          `http://localhost:8080/api/group-workouts/${selectedGroupWorkout.id}`, 
          groupWorkoutRequest
        );
        console.log("Update response:", response.data);
        showAlert('Group workout updated successfully!', 'success');
      } else {
        response = await axios.post(
          'http://localhost:8080/api/group-workouts', 
          groupWorkoutRequest
        );
        console.log("Create response:", response.data);
        showAlert('Group workout added successfully!', 'success');
      }
      
      await fetchGroupWorkouts();
      handleCloseGroupDialog();
    } catch (error) {
      console.error('Error saving group workout:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      showAlert(
        selectedGroupWorkout ? 
          'Failed to update group workout: ' + (error.response?.data?.error || error.message || 'Unknown error') : 
          'Failed to add group workout: ' + (error.response?.data?.error || error.message || 'Unknown error'),
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
      title: '',
      description: '',
      category_id: '',
      level_id: '',
      duration: '',
      capacity: '',
      image_path: ''
    });
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleEditGroupWorkout = (workout) => {
    console.log("Editing group workout with raw data:", workout);
    setSelectedGroupWorkout(workout);
    
    // Log workout levels for debugging
    console.log("Available workout levels:", workoutLevels);
    
    // Fix category and level matching - these need to match the properties from backend
    let categoryObject = null;
    let levelObject = null;
    
    // Use categoryName instead of name property when matching categories
    if (workout && workout.category && groupWorkoutCategories && groupWorkoutCategories.length > 0) {
      console.log("Searching for category:", workout.category);
      categoryObject = groupWorkoutCategories.find(cat => 
        cat && cat.categoryName && cat.categoryName.toLowerCase() === workout.category.toLowerCase()
      );
    }
    
    // The levels might use 'name' property instead of 'levelName'
    if (workout && workout.level && workoutLevels && workoutLevels.length > 0) {
      console.log("Searching for level:", workout.level);
      // Try both name and levelName properties to be safe
      levelObject = workoutLevels.find(lvl => 
        (lvl.name && lvl.name.toLowerCase() === workout.level.toLowerCase()) ||
        (lvl.levelName && lvl.levelName.toLowerCase() === workout.level.toLowerCase())
      );
      
      // If still not found, try a case-insensitive substring match as fallback
      if (!levelObject) {
        console.log("Level not found by exact match, trying substring match...");
        levelObject = workoutLevels.find(lvl => {
          const levelName = lvl.name || lvl.levelName || "";
          return workout.level.toLowerCase().includes(levelName.toLowerCase()) || 
                 levelName.toLowerCase().includes(workout.level.toLowerCase());
        });
      }
    }
    
    console.log("Found category:", categoryObject);
    console.log("Found level:", levelObject);
    
    // Create properly formatted data object
    const formData = {
      name: workout.title || '',
      description: workout.description || '',
      category_id: categoryObject ? categoryObject.id : '',
      level_id: levelObject ? levelObject.id : '',
      duration: workout.duration ? String(workout.duration).replace(' min', '') : '',
      capacity: workout.capacity || '',
      image_path: workout.image || ''
    };
    
    console.log("Setting form data to:", formData);
    setNewGroupWorkout(formData);
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
      const trainerId = localStorage.getItem('userId') || 3;
      
      // Determine the image path to use:
      let imagePath = "";
      
      if (newWorkout.imageFile) {
        try {
          // Try to upload the image
          const uploadedImagePath = await handleImageUpload(newWorkout.imageFile);
          
          if (uploadedImagePath) {
            imagePath = uploadedImagePath;
            console.log("Successfully uploaded image:", imagePath);
          } else {
            // If upload fails, use a default or empty string
            console.log("Image upload returned null/undefined, using empty string");
            imagePath = "";
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          // Don't throw - continue with empty image path
          imagePath = "";
        }
      } else if (selectedWorkout && selectedWorkout.imagePath) {
        // Keep existing image path when editing
        imagePath = selectedWorkout.imagePath;
        console.log("Using existing image path:", imagePath);
      } else {
        // Default empty string for new workout without image
        imagePath = "";
      }
      
      // IMPORTANT: Ensure image path is never null or undefined
      if (!imagePath) {
        imagePath = "";
      }
      
      console.log("Final image path:", imagePath);
      
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
        })) : [],
        imagePath: imagePath // This will never be null
      };
      
      console.log("Sending workout data:", workoutRequest);
      
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
        exercises: workoutData.exerciseList || [],
        imageFile: workoutData.imageFile,
        imagePreview: workoutData.imagePreview
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
      description: '',
      equipment: [],
      targetMuscles: [],
      exercises: [],
      imageFile: null,
      imagePreview: null
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
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
          color: isDarkMode ? '#fff' : undefined,
        }
      }}
    >
      <DialogTitle sx={{ color: isDarkMode ? '#fff' : undefined }}>
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
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
              }}
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
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
              }}
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
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                  opacity: 1,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExerciseDialogOpen(false)} sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveExercise} 
          variant="contained" 
          sx={{
            bgcolor: '#ff4757',
            '&:hover': { bgcolor: '#ff3747' }
          }}
        >
          Save
        </Button>
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
                  '&.Mui-focused fieldset': { borderColor: '#ff4757' },
                },
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
              }}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.type} sx={{
              // Fix for dark mode visibility for select elements
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
              },
              '& .MuiSelect-select': {
                color: isDarkMode ? '#fff' : undefined,
              },
              '& .MuiSvgIcon-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
            }}>
              <InputLabel>Workout Type</InputLabel>
              <Select
                name="type"
                value={newWorkout.type}
                onChange={handleInputChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Category sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                }
              >
                {workoutTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText sx={{ color: isDarkMode ? 'rgba(255,82,82,1)' : undefined }}>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.difficulty} sx={{
              // Fix for dark mode visibility for select elements
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
              },
              '& .MuiSelect-select': {
                color: isDarkMode ? '#fff' : undefined,
              },
              '& .MuiSvgIcon-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
            }}>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                name="difficulty"
                value={newWorkout.difficulty}
                onChange={handleInputChange}
                startAdornment={
                  <InputAdornment position="start">
                    <TrendingUp sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                }
              >
                {workoutLevels.map((level) => (
                  <MenuItem key={level.id} value={level.name}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.difficulty && <FormHelperText sx={{ color: isDarkMode ? 'rgba(255,82,82,1)' : undefined }}>{errors.difficulty}</FormHelperText>}
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
                    <AccessTime sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
              }}
              error={!!errors.duration}
              helperText={errors.duration}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Calories Burned"
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
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
              }}
              error={!!errors.calories}
              helperText={errors.calories}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={newWorkout.description}
              onChange={handleInputChange}
              placeholder="Enter workout description, goals, and instructions..."
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                  opacity: 1,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: isDarkMode ? '#fff' : undefined }}>
              Equipment
            </Typography>
            <TextField
              fullWidth
              label="Add Equipment (comma separated)"
              value={newWorkout.equipmentInput || newWorkout.equipment.join(', ')}
              onChange={(e) => {
                setNewWorkout({ 
                  ...newWorkout, 
                  equipmentInput: e.target.value 
                });
              }}
              onBlur={(e) => {
                const equipmentArray = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                setNewWorkout({ 
                  ...newWorkout, 
                  equipment: equipmentArray,
                  equipmentInput: null 
                });
              }}
              placeholder="e.g., Dumbbells, Barbell, Resistance Bands, Kettlebell"
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                  opacity: 1,
                },
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {newWorkout.equipment.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => {
                    const updatedEquipment = [...newWorkout.equipment];
                    updatedEquipment.splice(index, 1);
                    setNewWorkout({ ...newWorkout, equipment: updatedEquipment });
                  }}
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    color: isDarkMode ? '#fff' : 'inherit',
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: isDarkMode ? '#fff' : undefined }}>
              Target Muscles
            </Typography>
            <TextField
              fullWidth
              label="Add Target Muscles (comma separated)"
              value={newWorkout.musclesInput || newWorkout.targetMuscles.join(', ')}
              onChange={(e) => {
                setNewWorkout({ 
                  ...newWorkout, 
                  musclesInput: e.target.value 
                });
              }}
              onBlur={(e) => {
                const musclesArray = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                setNewWorkout({ 
                  ...newWorkout, 
                  targetMuscles: musclesArray,
                  musclesInput: null 
                });
              }}
              placeholder="e.g., Chest, Back, Legs, Shoulders, Arms, Core"
              sx={{
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                  opacity: 1,
                },
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {newWorkout.targetMuscles.map((muscle, index) => (
                <Chip
                  key={index}
                  label={muscle}
                  onDelete={() => {
                    const updatedMuscles = [...newWorkout.targetMuscles];
                    updatedMuscles.splice(index, 1);
                    setNewWorkout({ ...newWorkout, targetMuscles: updatedMuscles });
                  }}
                  sx={{
                    bgcolor: 'rgba(255,71,87,0.1)',
                    color: '#ff4757',
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ color: isDarkMode ? '#fff' : undefined }}>
                Exercises
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenExerciseDialog()}
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
            {newWorkout.exercises && newWorkout.exercises.length > 0 ? (
              <Box sx={{ mt: 1 }}>
                {newWorkout.exercises.map((exercise, index) => (
                  <Card key={index} sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: '12px',
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : undefined,
                    color: isDarkMode ? '#fff' : undefined,
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isDarkMode ? '#fff' : undefined }}>
                        {exercise.exerciseName}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleOpenExerciseDialog(exercise, index)} sx={{ color: isDarkMode ? '#ff6b81' : '#ff4757' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteExercise(index)} sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#666' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      <Chip size="small" label={`${exercise.sets} sets`} sx={{ color: isDarkMode ? '#fff' : undefined }} />
                      <Chip size="small" label={exercise.repRange} sx={{ color: isDarkMode ? '#fff' : undefined }} />
                    </Box>
                  </Card>
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary' }}>
                  No exercises added yet. Click "Add Exercise" to begin.
                </Typography>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: isDarkMode ? '#fff' : '#333' }}>
              Workout Image
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* Hidden file input */}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="individual-workout-image-upload"
                type="file"
                onChange={handleWorkoutFileChange}
              />
              
              {/* Image preview or placeholder */}
              {(newWorkout.imagePreview || (selectedWorkout && selectedWorkout.imagePath)) ? (
                <Box position="relative" mb={2} width="100%" maxWidth={300}>
                  <img 
                    src={newWorkout.imagePreview || selectedWorkout.imagePath}
                    alt="Workout preview"
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px',
                      objectFit: 'cover',
                      height: '200px'
                    }}
                  />
                  {newWorkout.imagePreview && (
                    <IconButton 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.7)',
                        }
                      }}
                      onClick={() => {
                        URL.revokeObjectURL(newWorkout.imagePreview);
                        setNewWorkout({
                          ...newWorkout,
                          imageFile: null,
                          imagePreview: null
                        });
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ) : (
                <label htmlFor="individual-workout-image-upload">
                  <Box 
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 200,
                      border: '2px dashed',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Image 
                      sx={{ 
                        fontSize: 48, 
                        color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                        mb: 1
                      }}
                    />
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#aaa' : '#666' }}>
                      Click to upload
                    </Typography>
                  </Box>
                </label>
              )}
              
              {/* Upload/Change button */}
              <label htmlFor="individual-workout-image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<Image />}
                  sx={{
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? '#fff' : '#333',
                    '&:hover': {
                      background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  {newWorkout.imageFile ? 'Change Image' : (selectedWorkout?.imagePath ? 'Change Image' : 'Upload Image')}
                </Button>
              </label>
            </Box>
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
              value={newGroupWorkout.name || ""}
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
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
              }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required sx={{
              // Fix for dark mode visibility for select elements
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
              },
              '& .MuiSelect-select': {
                color: isDarkMode ? '#fff' : undefined,
              },
              '& .MuiSvgIcon-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiFormHelperText-root': {
                color: isDarkMode ? 'rgba(255,82,82,1)' : undefined,
              }
            }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={newGroupWorkout.category_id}
                onChange={handleGroupWorkoutInputChange}
                error={!!errors.category_id}
              >
                {groupWorkoutCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName || category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && <FormHelperText error>{errors.category_id}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required sx={{
              // Fix for dark mode visibility for select elements
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
              },
              '& .MuiSelect-select': {
                color: isDarkMode ? '#fff' : undefined,
              },
              '& .MuiSvgIcon-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiFormHelperText-root': {
                color: isDarkMode ? 'rgba(255,82,82,1)' : undefined,
              }
            }}>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                name="level_id"
                value={newGroupWorkout.level_id}
                onChange={handleGroupWorkoutInputChange}
                error={!!errors.level_id}
              >
                {workoutLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.levelName || level.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.level_id && <FormHelperText error>{errors.level_id}</FormHelperText>}
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
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiFormHelperText-root': {
                  color: isDarkMode ? 'rgba(255,82,82,1)' : undefined,
                }
              }}
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
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiFormHelperText-root': {
                  color: isDarkMode ? 'rgba(255,82,82,1)' : undefined,
                }
              }}
              error={!!errors.duration}
              helperText={errors.duration}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: isDarkMode ? '#fff' : '#333' }}>
              Workout Image
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start', 
              border: isDarkMode ? '1px dashed rgba(255,255,255,0.3)' : '1px dashed rgba(0,0,0,0.2)', 
              borderRadius: '12px',
              padding: '16px',
              background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'
            }}>
              <input
                type="file"
                accept="image/*"
                id="workout-image-upload"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              {/* Style this section to look similar to Ant Design Upload */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {/* Preview area - shows new image or current image */}
                {newGroupWorkout.imagePreview ? (
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: '100%',
                      marginBottom: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src={newGroupWorkout.imagePreview}
                      alt="Image preview"
                      sx={{ 
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        zIndex: 1,
                        p: 0.5
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          // Release object URL to avoid memory leaks
                          if (newGroupWorkout.imagePreview) {
                            URL.revokeObjectURL(newGroupWorkout.imagePreview);
                          }
                          setNewGroupWorkout({
                            ...newGroupWorkout,
                            imageFile: null,
                            imagePreview: null
                          });
                        }}
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.7)',
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ) : selectedGroupWorkout?.image ? (
                  <Box 
                    sx={{ 
                      width: '100%',
                      marginBottom: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src={selectedGroupWorkout.image}
                      alt="Current workout image"
                      sx={{ 
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                ) : (
                  <label htmlFor="workout-image-upload">
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '8px',
                        mb: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        }
                      }}
                    >
                      <Image 
                        sx={{ 
                          fontSize: 48, 
                          color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#aaa' : '#666' }}>
                        Click to upload
                      </Typography>
                    </Box>
                  </label>
                )}
                
                {/* Upload/Change button */}
                <label htmlFor="workout-image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<Image />}
                    sx={{
                      background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: isDarkMode ? '#fff' : '#333',
                      '&:hover': {
                        background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    {newGroupWorkout.imageFile ? 'Change Image' : (selectedGroupWorkout?.image ? 'Change Image' : 'Upload Image')}
                  </Button>
                </label>
              </Box>
              
              <Typography variant="caption" sx={{ mt: 1, color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                Upload an image for your group workout (JPG, PNG, max 2MB)
              </Typography>
            </Box>
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
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                // Fix for dark mode visibility
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                  opacity: 1,
                },
              }}
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
          const workoutTypeName = workout.category || 'Unknown';
          const workoutLevelName = workout.level || 'Unknown';
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
                    position: 'relative', // Add this to position the button properly
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 32px rgba(255,71,87,0.1)',
                    },
                  }}
                >
                  {/* Add Session Button - Repositioned */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: '10px',  // Changed from top to bottom
                      right: '10px',
                      backgroundColor: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      color: isDarkMode ? 'rgba(255, 71, 87, 0.8)' : 'rgba(255, 71, 87, 0.9)',
                      width: '36px',
                      height: '36px',
                      zIndex: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSessionModal(workout);
                    }}
                    aria-label="Add Session"
                    title="Add New Session"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  
                  {workout.image && (
                    <Box
                      sx={{
                        width: '120px',
                        minHeight: '100%',
                        backgroundImage: `url(${workout.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: workout.image ? 'calc(100% - 120px)' : '100%',
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
                        {workout.title}
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
                        label={workoutLevelName}
                        sx={{
                          bgcolor: `${difficultyColors[workoutLevelName.toLowerCase()]}15` || 'rgba(0,0,0,0.1)',
                          color: difficultyColors[workoutLevelName.toLowerCase()] || '#333',
                        }}
                      />
                      <Chip
                        size="small"
                        label={workoutTypeName}
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
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Timer sx={{ color: '#ff4757', mb: 0.5 }} />
                          <Typography variant="body2">{workout.duration} min</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <FireIcon sx={{ color: '#ff4757', mb: 0.5 }} />
                          <Typography variant="body2">{workout.calories || '0'} cal</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <FitnessCenter sx={{ color: '#ff4757', mb: 0.5 }} />
                          <Typography variant="body2">{workout.exercises || 0} ex</Typography>
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

  const handleOpenSessionModal = (workout) => {
    setCurrentWorkout(workout);
    setSessionModalOpen(true);
  };

  const handleCloseSessionModal = () => {
    setSessionModalOpen(false);
    setSessionDate(new Date());
    setSessionTime(new Date());
    setSessionNotes('');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCreateSession = async () => {
    try {
      // Format date and time for backend
      const formattedDate = format(sessionDate, 'yyyy-MM-dd');
      const formattedTime = format(sessionTime, 'HH:mm:ss');
      
      const response = await fetch(`http://localhost:8080/api/group-workout-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          groupWorkoutId: currentWorkout.id,
          date: formattedDate,
          time: formattedTime,
          notes: sessionNotes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      // Show success message using our Snackbar
      showNotification('Workout session created successfully!');
      
      // Close modal and reset form
      handleCloseSessionModal();
      
      // Refresh data if needed
      fetchWorkouts(); // Assuming this function exists to refresh workout data
    } catch (error) {
      console.error('Error creating session:', error);
      showNotification('Failed to create session', 'error');
    }
  };

  // First, update the handleFileInputChange function to create a preview URL
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected via input:", file.name, file.type, file.size);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      setNewGroupWorkout({
        ...newGroupWorkout,
        imageFile: file,
        imagePreview: previewUrl // Store the preview URL
      });
    }
  };

  // Then update the JSX for the image upload section with a nicer preview
  <Grid item xs={12}>
    <Typography variant="subtitle1" sx={{ mb: 1, color: isDarkMode ? '#fff' : '#333' }}>
      Workout Image
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'flex-start', 
      border: isDarkMode ? '1px dashed rgba(255,255,255,0.3)' : '1px dashed rgba(0,0,0,0.2)', 
      borderRadius: '12px',
      padding: '16px',
      background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'
    }}>
      <input
        type="file"
        accept="image/*"
        id="workout-image-upload"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      {/* Style this section to look similar to Ant Design Upload */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {/* Preview area - shows new image or current image */}
        {newGroupWorkout.imagePreview ? (
          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              marginBottom: 2,
              textAlign: 'center'
            }}
          >
            <Box
              component="img"
              src={newGroupWorkout.imagePreview}
              alt="Image preview"
              sx={{ 
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1,
                p: 0.5
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  // Release object URL to avoid memory leaks
                  if (newGroupWorkout.imagePreview) {
                    URL.revokeObjectURL(newGroupWorkout.imagePreview);
                  }
                  setNewGroupWorkout({
                    ...newGroupWorkout,
                    imageFile: null,
                    imagePreview: null
                  });
                }}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : selectedGroupWorkout?.image ? (
          <Box 
            sx={{ 
              width: '100%',
              marginBottom: 2,
              textAlign: 'center'
            }}
          >
            <Box
              component="img"
              src={selectedGroupWorkout.image}
              alt="Current workout image"
              sx={{ 
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        ) : (
          <label htmlFor="workout-image-upload">
            <Box
              sx={{
                width: '100%',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                mb: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }
              }}
            >
              <Image 
                sx={{ 
                  fontSize: 48, 
                  color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                  mb: 1
                }}
              />
              <Typography variant="body2" sx={{ color: isDarkMode ? '#aaa' : '#666' }}>
                Click to upload
              </Typography>
            </Box>
          </label>
        )}
        
        {/* Upload/Change button */}
        <label htmlFor="workout-image-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<Image />}
            sx={{
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: isDarkMode ? '#fff' : '#333',
              '&:hover': {
                background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              }
            }}
          >
            {newGroupWorkout.imageFile ? 'Change Image' : (selectedGroupWorkout?.image ? 'Change Image' : 'Upload Image')}
          </Button>
        </label>
      </Box>
      
      <Typography variant="caption" sx={{ mt: 1, color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
        Upload an image for your group workout (JPG, PNG, max 2MB)
      </Typography>
    </Box>
  </Grid>

  // Update image upload function to include more debugging
  const handleImageUpload = async (file) => {
    try {
      console.log("Starting image upload process...");
      if (!file) {
        console.error('No file provided to handleImageUpload');
        return null;
      }
      
      console.log('File:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Convert file to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log("File read successfully, data length:", reader.result.length);
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject(error);
        };
        console.log("Starting file read as data URL...");
        reader.readAsDataURL(file);
      });
      
      console.log("Base64 conversion complete. Making API request to upload image...");
      
      // Upload the base64 image to the server
      const response = await axios.post(
        'http://localhost:8080/api/images/upload-base64', 
        { image: base64Image },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log('Image upload API response:', response.data);
      return response.data.imagePath;
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      showAlert('Failed to upload image: ' + error.message, 'error');
      return null;
    }
  };

  // Add this function to handle file input change for individual workouts
  const handleWorkoutFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Workout image selected:", file.name, file.type, file.size);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      setNewWorkout({
        ...newWorkout,
        imageFile: file,
        imagePreview: previewUrl
      });
    }
  };

  // Add this function to handle workout image upload
  const handleWorkoutImageUpload = async (file) => {
    // Use the exact same image upload function that works for group workouts
    return await handleImageUpload(file);
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
                                    <Typography variant="body2">{workout.calories || '0'} cal</Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <FitnessCenter sx={{ color: '#ff4757', mb: 0.5 }} />
                                    <Typography variant="body2">{workout.exercises || 0} ex</Typography>
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
        {/* Session Modal */}
        <Dialog open={sessionModalOpen} onClose={handleCloseSessionModal} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Session for {currentWorkout?.title}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Session Date"
                  value={sessionDate}
                  onChange={(newValue) => setSessionDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <TimePicker
                  label="Session Time"
                  value={sessionTime}
                  onChange={(newValue) => setSessionTime(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <TextField
                label="Notes"
                multiline
                rows={4}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSessionModal}>Cancel</Button>
            <Button 
              onClick={handleCreateSession} 
              variant="contained" 
              color="primary"
              disabled={!sessionDate || !sessionTime}
            >
              Create Session
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
};

export default WorkoutsPage;
