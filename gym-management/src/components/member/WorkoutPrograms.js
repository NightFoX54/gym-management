import React, { useState, useEffect } from 'react';
import { 
  FaDumbbell, 
  FaRunning, 
  FaArrowLeft, 
  FaClock, 
  FaUser, 
  FaCalendarAlt, 
  FaSun, 
  FaMoon, 
  FaTimes, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCheck,
  FaUserFriends,
  FaList,
  FaSpinner,
  FaSave,
  FaCalendarPlus,
  FaExclamationTriangle,
  FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/WorkoutPrograms.css';
import { toast } from 'react-hot-toast';

const WorkoutPrograms = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-programs');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [myPrograms, setMyPrograms] = useState([]);
  const [trainerPrograms, setTrainerPrograms] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [programLevels, setProgramLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newProgram, setNewProgram] = useState({
    name: '',
    type: '',
    difficulty: '',
    duration: '',
    description: '',
    calories: 0,
    equipment: [],
    targetMuscles: [],
    exercises: [{ exerciseName: '', sets: 3, repRange: '8-12' }],
    imageFile: null,
    imagePreview: null
  });

  const [selectedType, setSelectedType] = useState('all');
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    duration: '',
    type: '',
    difficulty: '',
    equipment: '',
    targetMuscles: '',
    calories: ''
  });

  // Add these state variables for exercise management
  const [editExercises, setEditExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    exerciseName: '',
    sets: 3,
    repRange: '8-12'
  });

  // Add these state variables
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedWorkoutForPlan, setSelectedWorkoutForPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1); // Default to Monday
  const [userWeeklyPlan, setUserWeeklyPlan] = useState([]);

  // Get user ID from localStorage correctly
  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const userObj = JSON.parse(userStr);
      return userObj.id;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };
  
  const userId = getUserId();

  // Get workout types and levels on component mount
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any previous errors
        
        // Define API base URL with fallback
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        console.log("Using API base URL:", API_BASE_URL);
        
        // Initialize workout data if needed
        try {
          console.log("Initializing workout data...");
          await axios.post(`${API_BASE_URL}/api/workouts/init`);
          console.log("Workout data initialized successfully");
        } catch (initErr) {
          console.error("Error initializing workout data:", initErr);
          setError(`Failed to initialize workout data: ${initErr.message}`);
          setLoading(false);
          return;
        }
        
        // Fetch workout types (categories)
        let typesList = [];
        try {
          console.log("Fetching workout types...");
          const typesResponse = await axios.get(`${API_BASE_URL}/api/workouts/types`);
          console.log("Workout types fetched:", typesResponse.data);
          
          // Add "All Types" option to the beginning
          typesList = [
            { id: 'all', name: 'All Types', icon: <FaDumbbell /> },
            ...typesResponse.data.map(type => ({
              id: type.name.toLowerCase().replace(/\s+/g, '-'),
              name: type.name,
              icon: getIconForType(type.name)
            }))
          ];
          setProgramTypes(typesList);
        } catch (typesErr) {
          console.error("Error fetching workout types:", typesErr);
          setError(`Failed to fetch workout types: ${typesErr.message}`);
          setLoading(false);
          return;
        }
        
        // Fetch workout difficulty levels
        try {
          console.log("Fetching workout levels...");
          const levelsResponse = await axios.get(`${API_BASE_URL}/api/workouts/levels`);
          console.log("Workout levels fetched:", levelsResponse.data);
          setProgramLevels(levelsResponse.data);
        } catch (levelsErr) {
          console.error("Error fetching workout levels:", levelsErr);
          setError(`Failed to fetch workout levels: ${levelsErr.message}`);
          setLoading(false);
          return;
        }
        
        // Fetch user workouts
        try {
          console.log("Fetching user workouts...");
          await fetchUserWorkouts(API_BASE_URL);
          console.log("User workouts fetched successfully");
        } catch (workoutsErr) {
          console.error("Error fetching user workouts:", workoutsErr);
          setError(`Failed to fetch user workouts: ${workoutsErr.message}`);
          setLoading(false);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching workout data:", err);
        setError(`Failed to load workout data: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchWorkoutData();
  }, [userId]);

  // Function to get icon based on workout type
  const getIconForType = (typeName) => {
    switch(typeName.toLowerCase()) {
      case 'strength training':
        return <FaDumbbell />;
      case 'cardio':
        return <FaRunning />;
      case 'hiit':
        return <FaRunning />;
      case 'flexibility':
        return <FaUserFriends />;
      case 'crossfit':
        return <FaList />;
      default:
        return <FaDumbbell />;
    }
  };
  
  // Fetch user workouts (both personal and trainer workouts)
  const fetchUserWorkouts = async (apiBaseUrl) => {
    const API_BASE_URL = apiBaseUrl || process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    const currentUserId = getUserId(); // Get the latest userId in case it was updated
    
    if (!currentUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    try {
      // Fetch user's own workouts
      console.log(`Fetching user's own workouts for userId=${currentUserId}...`);
      const myWorkoutsResponse = await axios.get(
        `${API_BASE_URL}/api/workouts?userId=${currentUserId}&isTrainer=false`
      );
      console.log("User's own workouts:", myWorkoutsResponse.data);
      setMyPrograms(myWorkoutsResponse.data);
      
      // Try to fetch ALL trainer workouts using the new endpoint
      try {
        console.log("Fetching all trainer workouts...");
        const trainerWorkoutsResponse = await axios.get(
          `${API_BASE_URL}/api/workouts/trainer`
        );
        console.log("All trainer workouts:", trainerWorkoutsResponse.data);
        setTrainerPrograms(trainerWorkoutsResponse.data);
      } catch (trainerErr) {
        console.error("Error fetching trainer workouts, falling back to user's trainer workouts:", trainerErr);
        
        // Fallback: Just use the user's trainer workouts if the /trainer endpoint fails
        const fallbackTrainerResponse = await axios.get(
          `${API_BASE_URL}/api/workouts?userId=${currentUserId}&isTrainer=true`
        );
        console.log("Fallback trainer workouts:", fallbackTrainerResponse.data);
        setTrainerPrograms(fallbackTrainerResponse.data);
      }
    } catch (err) {
      console.error("Error in fetchUserWorkouts:", err);
      throw err; // Rethrow to be caught by the parent function
    }
  };

  // Dark mode toggle
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Filter programs based on selected type
  const filteredMyPrograms = selectedType === 'all'
    ? myPrograms
    : myPrograms.filter(program => program.type.toLowerCase().replace(/\s+/g, '-') === selectedType);

  const filteredTrainerPrograms = selectedType === 'all'
    ? trainerPrograms
    : trainerPrograms.filter(program => program.type.toLowerCase().replace(/\s+/g, '-') === selectedType);

  // Handle program view details
  const handleViewDetails = async (programId, isTrainerProgram = false) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    try {
      const response = await axios.get(`${API_BASE_URL}/api/workouts/${programId}`);
      setSelectedProgram({...response.data, isTrainerProgram});
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching workout details:", err);
      setError("Failed to load workout details. Please try again later.");
    }
  };

  // Handle create new program
  const handleCreateProgram = () => {
    // Reset form first
    setNewProgram({
      name: '',
      type: programTypes.length > 1 ? programTypes[1].name : '', // First real type (skip "All Types")
      difficulty: programLevels.length > 0 ? programLevels[0].name : 'Beginner',
      duration: 30,
      description: '',
      calories: 0,
      equipment: [],
      targetMuscles: [],
      exercises: [{ exerciseName: '', sets: 3, repRange: '8-12' }],
      imageFile: null,
      imagePreview: null
    });
    setShowCreateModal(true);
  };

  // Handle adding exercise to new program
  const handleAddExercise = () => {
    if (!newExercise.exerciseName) {
      toast.error("Exercise name is required");
      return;
    }
    
    // Add the new exercise to the list
    setEditExercises([...editExercises, { ...newExercise, id: Date.now() }]);
    
    // Clear the form
    setNewExercise({
      exerciseName: '',
      sets: 3,
      repRange: '8-12'
    });
  };

  // Handle removing exercise from new program
  const handleRemoveExercise = (index) => {
    const updatedExercises = [...editExercises];
    updatedExercises.splice(index, 1);
    setEditExercises(updatedExercises);
  };

  // Handle input change for new program
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'equipment' || name === 'targetMuscles') {
      // Handle comma-separated input for arrays
      const valueArray = value.split(',').map(item => item.trim()).filter(item => item);
      setNewProgram({
        ...newProgram,
        [name]: valueArray
      });
    } else {
      setNewProgram({
        ...newProgram,
        [name]: value
      });
    }
  };

  // Handle exercise input change
  const handleExerciseChange = (e) => {
    const { id, name, value } = e.target;
    
    // Handle exercise input fields in the add exercise form
    if (id && id.startsWith('exercise-')) {
      const fieldName = id.split('-')[1];
      const index = parseInt(id.split('-')[2]);
      
      setNewProgram(prevState => {
        const updatedExercises = [...prevState.exercises];
        updatedExercises[index] = {
          ...updatedExercises[index],
          [fieldName]: value
        };
        return {
          ...prevState,
          exercises: updatedExercises
        };
      });
    } 
    // Handle form inputs in the edit modal
    else if (name) {
      setEditFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Add this new function to specifically handle exercise input changes in the create modal
  const handleExerciseInputChange = (index, field, value) => {
    setNewProgram(prevState => {
      const updatedExercises = [...prevState.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
      };
      return {
        ...prevState,
        exercises: updatedExercises
      };
    });
  };

  // Handle submit new program
  const handleSubmitProgram = async () => {
    // Validation check
    if (!newProgram.name || !newProgram.type || !newProgram.difficulty || !newProgram.duration) {
      // Show error message
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      
      // Handle image upload if there's a file
      let imagePath = "";
      if (newProgram.imageFile) {
        try {
          const uploadedImagePath = await handleImageUpload(newProgram.imageFile);
          if (uploadedImagePath) {
            imagePath = uploadedImagePath;
            console.log("Successfully uploaded image:", imagePath);
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }
      
      // Prepare workout data
      const workoutData = {
        name: newProgram.name,
        type: newProgram.type,
        difficulty: newProgram.difficulty,
        duration: parseInt(newProgram.duration),
        calories: parseInt(newProgram.calories) || 0,
        description: newProgram.description,
        equipment: newProgram.equipment,
        targetMuscles: newProgram.targetMuscles,
        exercises: newProgram.exercises.map(exercise => ({
          exerciseName: exercise.exerciseName,
          sets: parseInt(exercise.sets),
          repRange: exercise.repRange
        })),
        imagePath: imagePath
      };

      console.log("Sending workout data:", workoutData);

      const response = await axios.post(
        `http://localhost:8080/api/workouts?userId=${userId}`,
        workoutData
      );

      console.log("Workout created successfully:", response.data);
      
      // Reset form and close modal
      setNewProgram({
        name: '',
        description: '',
        type: '',
        difficulty: '',
        duration: '',
        calories: '',
        equipment: [],
        targetMuscles: [],
        exercises: [{ exerciseName: '', sets: 3, repRange: '8-12 reps' }],
        imageFile: null,
        imagePreview: null
      });
      setShowCreateModal(false);
      
      // Refresh programs list
      fetchUserWorkouts();
    } catch (error) {
      console.error("Error creating workout program:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete program
  const handleDeleteProgram = async (id) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/workouts/${id}`);
        // Refresh workouts after deletion
        await fetchUserWorkouts(API_BASE_URL);
      } catch (err) {
        console.error("Error deleting workout:", err);
        alert("Failed to delete workout. Please try again.");
      }
    }
  };

  // Modify handleEditProgram to include exercises
  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setEditFormData({
      name: program.name || '',
      description: program.description || '',
      duration: program.duration || '',
      type: program.type || '',
      difficulty: program.difficulty || '',
      equipment: program.equipment ? program.equipment.join(',') : '',
      targetMuscles: program.targetMuscles ? program.targetMuscles.join(',') : '',
      calories: program.calories || ''
    });
    // Set the exercises for editing with unique IDs if they don't have them
    setEditExercises((program.exerciseList || []).map(ex => ({
      ...ex,
      id: ex.id || Date.now() + Math.random() // Ensure each has a unique ID
    })));
    setShowEditModal(true);
  };

  // Add function to handle exercise editing
  const handleExerciseItemChange = (index, field, value) => {
    const updatedExercises = [...editExercises];
    
    if (field === 'sets') {
      // Convert to number for sets field
      updatedExercises[index][field] = parseInt(value, 10) || 0;
    } else {
      updatedExercises[index][field] = value;
    }
    
    setEditExercises(updatedExercises);
  };

  // Modify handleEditFormSubmit to properly count exercises
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle image upload if there's a new file
      let imagePath = editingProgram.imagePath || "";
      
      if (editingProgram.imageFile) {
        try {
          const uploadedImagePath = await handleImageUpload(editingProgram.imageFile);
          if (uploadedImagePath) {
            imagePath = uploadedImagePath;
            console.log("Successfully uploaded new image:", imagePath);
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }

      // Prepare the workout data
      const workoutData = {
        name: editFormData.name,
        type: editFormData.type,
        difficulty: editFormData.difficulty,
        duration: parseInt(editFormData.duration),
        calories: parseInt(editFormData.calories) || 0,
        description: editFormData.description,
        equipment: editFormData.equipment.split(',').map(item => item.trim()),
        targetMuscles: editFormData.targetMuscles.split(',').map(item => item.trim()),
        exercises: editExercises.map(exercise => ({
          exerciseName: exercise.exerciseName,
          sets: parseInt(exercise.sets),
          repRange: exercise.repRange
        })),
        imagePath: imagePath
      };

      console.log("Sending updated workout data:", workoutData);

      const response = await axios.put(
        `http://localhost:8080/api/workouts/${editingProgram.id}`,
        workoutData
      );

      console.log("Workout updated successfully:", response.data);
      
      setShowEditModal(false);
      fetchUserWorkouts();
    } catch (error) {
      console.error("Error updating workout program:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding workout to weekly plan
  const handleAddToWeeklyPlan = (workout) => {
    setSelectedWorkoutForPlan(workout);
    setShowDayModal(true);
  };

  // Function to confirm day selection and add to plan
  const confirmAddToWeeklyPlan = (dayNumber) => {
    const userId = getUserId();
    
    if (!userId) {
      toast.error("Please log in to add workouts to your weekly plan");
      return;
    }
    
    fetch('http://localhost:8080/api/training-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        workoutId: selectedWorkoutForPlan.id,
        dayOfWeek: dayNumber
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add workout to weekly plan');
      }
      return response.json();
    })
    .then(data => {
      setShowDayModal(false);
      toast.success("Workout successfully added to your weekly plan!");
    })
    .catch(error => {
      console.error('Error adding workout to weekly plan:', error);
      toast.error("Error adding workout to weekly plan: " + error.message);
    });
  };

  // Add a file input handler for workouts
  const handleWorkoutFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Workout image selected:", file.name, file.type, file.size);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      setNewProgram({
        ...newProgram,
        imageFile: file,
        imagePreview: previewUrl
      });
    }
  };

  // Add a file input handler for editing workouts
  const handleEditWorkoutFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Edit workout image selected:", file.name, file.type, file.size);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      setEditingProgram({
        ...editingProgram,
        imageFile: file,
        imagePreview: previewUrl
      });
    }
  };

  // Add the image upload function
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
      return null;
    }
  };

  if (loading) {
    return <div className="loading-container">Loading workout programs...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className={`workout-programs-container-workout ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-container-workout">
        <button className="back-button-workout" onClick={() => navigate("/member")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="header-title-workout">Workout Programs</h1>
        <div className="header-right-workout">
          <button
            className={`dark-mode-toggle-workout ${isDarkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon-workout sun-workout" />
            <div className="toggle-circle-workout"></div>
            <FaMoon className="toggle-icon-workout moon-workout" />
          </button>
        </div>
      </div>

      <div className="tabs-container-workout">
        <button 
          className={`tab-button-workout ${activeTab === 'my-programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-programs')}
        >
          My Workout Programs
        </button>
        <button 
          className={`tab-button-workout ${activeTab === 'trainer-programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainer-programs')}
        >
          Trainer Workout Programs
        </button>
      </div>

      <div className="program-type-filters-workout">
        {programTypes.map(type => (
          <button
            key={type.id}
            className={`program-type-button-workout ${selectedType === type.id ? 'active' : ''}`}
            onClick={() => setSelectedType(type.id)}
          >
            {type.icon}
            <span>{type.name}</span>
          </button>
        ))}
      </div>

      {activeTab === 'my-programs' && (
        <>
          <div className="my-programs-header-workout">
            <h2>My Workout Programs</h2>
            <button className="create-program-button-workout" onClick={handleCreateProgram}>
              <FaPlus /> Create New Program
            </button>
          </div>

          {filteredMyPrograms.length === 0 ? (
            <div className="no-programs-message-workout">
              <p>You haven't created any workout programs yet. Click "Create New Program" to get started!</p>
            </div>
          ) : (
            <div className="programs-grid-workout">
              {filteredMyPrograms.map(program => (
                <div key={program.id} className="program-card-workout my-program-card-workout">
                  <div className="program-image-workout">
                    <img src={program.imagePath || 'https://via.placeholder.com/300x150?text=No+Image'} alt={program.name} />
                    <div className="program-type-badge-workout">{program.type}</div>
                  </div>
                  <div className="program-content-workout">
                    <h3>{program.name}</h3>
                    <div className="program-meta-workout">
                      <div className="meta-item-workout">
                        <FaClock />
                        <span>{program.duration} min</span>
                      </div>
                      <div className="meta-item-workout">
                        <FaCalendarAlt />
                        <span>{program.exercises} exercises</span>
                      </div>
                    </div>
                    <div className="program-actions-workout">
                      <button className="action-button-workout view-button-workout" onClick={() => handleViewDetails(program.id)}>
                        <FaEye /> View
                      </button>
                      <button className="action-button-workout edit-button-workout" onClick={() => handleEditProgram(program)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="action-button-workout delete-button-workout" onClick={() => handleDeleteProgram(program.id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'trainer-programs' && (
        <>
          <div className="trainer-programs-header-workout">
            <h2>Trainer Workout Programs</h2>
            <p>Explore professionally designed workout programs by our certified trainers</p>
          </div>

          <div className="programs-grid-workout">
            {filteredTrainerPrograms.map(program => (
              <div key={program.id} className="program-card-workout trainer-program-card-workout">
                <div className="program-image-workout">
                  <img src={program.imagePath || 'https://via.placeholder.com/300x150?text=No+Image'} alt={program.name} />
                  <div className="program-type-badge-workout">{program.type}</div>
                  <div className="program-level-badge-workout">{program.difficulty}</div>
                </div>
                <div className="program-content-workout">
                  <h3>{program.name}</h3>
                  <div className="trainer-info-workout">
                    <FaUser />
                    <span>{program.user ? program.user.name : 'Trainer'}</span>
                  </div>
                  <div className="program-meta-workout">
                    <div className="meta-item-workout">
                      <FaClock />
                      <span>{program.duration} min</span>
                    </div>
                    <div className="meta-item-workout">
                      <FaCalendarAlt />
                      <span>{program.exercises} exercises</span>
                    </div>
                  </div>
                  <button 
                    className="view-details-button-workout"
                    onClick={() => handleViewDetails(program.id, true)}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showDetailsModal && selectedProgram && (
        <div className="modal-overlay-workout">
          <div className="program-details-modal-workout">
            <button className="close-modal-button-workout" onClick={() => setShowDetailsModal(false)}>
              <FaTimes />
            </button>
            <div className="modal-header-workout">
              <h2>{selectedProgram.name}</h2>
              <div className="program-type-badge-workout modal-badge-workout">
                {selectedProgram.type}
              </div>
            </div>
            
            <div className="modal-content-workout">
              <p className="program-description-workout">{selectedProgram.description}</p>
              
              <div className="program-details-grid-workout">
                <div className="detail-item-workout">
                  <FaClock />
                  <div>
                    <h4>Duration</h4>
                    <p>{selectedProgram.duration} minutes</p>
                  </div>
                </div>
                <div className="detail-item-workout">
                  <FaCalendarAlt />
                  <div>
                    <h4>Exercises</h4>
                    <p>{selectedProgram.exercises} exercises</p>
                  </div>
                </div>
                <div className="detail-item-workout">
                  <FaDumbbell />
                  <div>
                    <h4>Level</h4>
                    <p>{selectedProgram.difficulty}</p>
                  </div>
                </div>
                {selectedProgram.calories && (
                  <div className="detail-item-workout">
                    <FaRunning />
                    <div>
                      <h4>Calories</h4>
                      <p>{selectedProgram.calories} kcal</p>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedProgram.equipment && selectedProgram.equipment.length > 0 && (
                <div className="equipment-section-workout">
                  <h3>Equipment Needed</h3>
                  <div className="tags-container-workout">
                    {selectedProgram.equipment.map((item, index) => (
                      <span key={index} className="tag-workout">{item}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProgram.targetMuscles && selectedProgram.targetMuscles.length > 0 && (
                <div className="muscles-section-workout">
                  <h3>Target Muscles</h3>
                  <div className="tags-container-workout">
                    {selectedProgram.targetMuscles.map((muscle, index) => (
                      <span key={index} className="tag-workout muscle-tag-workout">{muscle}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Exercises Section */}
              <h3 className="exercises-section-title-workout">Exercises</h3>
              <div className="exercises-table-workout">
                <div className="table-header">
                  <div>Exercise</div>
                  <div>Sets</div>
                  <div>Reps</div>
                </div>
                
                {selectedProgram?.exerciseList && selectedProgram.exerciseList.length > 0 ? (
                  selectedProgram.exerciseList.map((exercise, index) => (
                    <div key={index} className="table-row">
                      <div>{exercise.exerciseName}</div>
                      <div>{exercise.sets}</div>
                      <div>{exercise.repRange}</div>
                    </div>
                  ))
                ) : (
                  <div className="table-row">
                    <div colSpan="3" style={{ gridColumn: "span 3", textAlign: "center" }}>
                      No exercises found for this workout.
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer-workout">
              {selectedProgram.isTrainerProgram ? (
                <button className="save-program-button-workout" onClick={() => handleAddToWeeklyPlan(selectedProgram)}>
                  <FaPlus /> Save to Weekly Plan
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => handleAddToWeeklyPlan(selectedProgram)}
                  >
                    <FaCalendarPlus /> Add to Weekly Plan
                  </button>
                  <button className="close-button-workout" onClick={() => setShowDetailsModal(false)}>
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay-workout">
          <div className="create-program-modal-workout">
            <button className="close-modal-button-workout" onClick={() => setShowCreateModal(false)}>
              <FaTimes />
            </button>
            
            <div className="modal-header-workout">
              <h2>Create New Workout Program</h2>
            </div>
            
            <div className="modal-content-workout">
              <div className="form-group-workout">
                <label htmlFor="name">Program Title</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={newProgram.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Full Body Strength"
                  required
                />
              </div>
              
              <div className="form-group-workout">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={newProgram.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your workout program"
                  required
                ></textarea>
              </div>
              
              <div className="form-row-workout">
                <div className="form-group-workout">
                  <label htmlFor="type">Workout Type</label>
                  <select 
                    id="type" 
                    name="type" 
                    value={newProgram.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {programTypes
                      .filter(type => type.id !== 'all') // Exclude "All Types" option
                      .map(type => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="difficulty">Difficulty Level</label>
                  <select 
                    id="difficulty" 
                    name="difficulty" 
                    value={newProgram.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Level</option>
                    {programLevels.map(level => (
                      <option key={level.id} value={level.name}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row-workout">
                <div className="form-group-workout">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input 
                    type="number" 
                    id="duration" 
                    name="duration" 
                    value={newProgram.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="calories">Calories (optional)</label>
                  <input 
                    type="number" 
                    id="calories" 
                    name="calories" 
                    value={newProgram.calories}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group-workout">
                <label htmlFor="equipment">Equipment (comma-separated)</label>
                <input 
                  type="text" 
                  id="equipment" 
                  name="equipment" 
                  value={newProgram.equipment.join(', ')}
                  onChange={handleInputChange}
                  placeholder="e.g., Dumbbells, Barbell, Yoga Mat"
                />
              </div>
              
              <div className="form-group-workout">
                <label htmlFor="targetMuscles">Target Muscles (comma-separated)</label>
                <input 
                  type="text" 
                  id="targetMuscles" 
                  name="targetMuscles" 
                  value={newProgram.targetMuscles.join(', ')}
                  onChange={handleInputChange}
                  placeholder="e.g., Chest, Back, Legs"
                />
              </div>
              
              <div className="form-row">
                <label>Workout Image</label>
                <div className="image-upload-container">
                  {newProgram.imagePreview ? (
                    <div className="image-preview-container">
                      <img 
                        src={newProgram.imagePreview} 
                        alt="Preview" 
                        className="image-preview" 
                      />
                      <button 
                        className="remove-image-btn"
                        onClick={() => {
                          URL.revokeObjectURL(newProgram.imagePreview);
                          setNewProgram({
                            ...newProgram,
                            imageFile: null,
                            imagePreview: null
                          });
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <input
                        type="file"
                        id="workout-image-upload"
                        accept="image/*"
                        onChange={handleWorkoutFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="workout-image-upload" className="upload-btn">
                        <FaPlus /> Upload Image
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="exercises-section-workout">
                <div className="section-header-workout">
                  <h3>Exercises</h3>
                  <button 
                    type="button" 
                    className="add-exercise-button-workout"
                    onClick={handleAddExercise}
                  >
                    <FaPlus /> Add Exercise
                  </button>
                </div>
                
                {newProgram.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-form-workout">
                    <div className="exercise-header-workout">
                      <h4>Exercise {index + 1}</h4>
                      {newProgram.exercises.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-exercise-button-workout"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                    
                    <div className="exercise-form-row-workout">
                      <div className="form-group-workout">
                        <label htmlFor={`exercise-name-${index}`}>Exercise Name</label>
                        <input 
                          type="text" 
                          id={`exercise-name-${index}`}
                          value={exercise.exerciseName}
                          onChange={(e) => handleExerciseInputChange(index, 'exerciseName', e.target.value)}
                          placeholder="e.g., Bench Press"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="exercise-form-row-workout two-columns-workout">
                      <div className="form-group-workout">
                        <label htmlFor={`exercise-sets-${index}`}>Sets</label>
                        <input 
                          type="number" 
                          id={`exercise-sets-${index}`}
                          value={exercise.sets}
                          onChange={(e) => handleExerciseInputChange(index, 'sets', e.target.value)}
                          placeholder="e.g., 3"
                          min="1"
                          required
                        />
                      </div>
                      
                      <div className="form-group-workout">
                        <label htmlFor={`exercise-reps-${index}`}>Rep Range</label>
                        <input 
                          type="text" 
                          id={`exercise-reps-${index}`}
                          value={exercise.repRange}
                          onChange={(e) => handleExerciseInputChange(index, 'repRange', e.target.value)}
                          placeholder="e.g., 8-12 reps"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer-workout">
              <button 
                type="button"
                className="cancel-button-workout"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="create-button-workout"
                onClick={handleSubmitProgram}
              >
                <FaCheck /> Create Program
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProgram && (
        <div className="modal-overlay-workout">
          <div className="program-details-modal-workout edit-modal-workout">
            <button className="close-modal-button-workout" onClick={() => setShowEditModal(false)}>
              <FaTimes />
            </button>
            <div className="modal-header-workout">
              <h2>Edit Workout Program</h2>
            </div>
            
            <div className="modal-content-workout">
              <form onSubmit={handleEditFormSubmit} className="create-program-form-workout">
                <div className="form-group-workout">
                  <label htmlFor="edit-name">Program Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={(e) => handleExerciseChange(e)}
                    required
                  />
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="edit-type">Workout Type</label>
                  <select
                    id="edit-type"
                    name="type"
                    value={editFormData.type}
                    onChange={(e) => handleExerciseChange(e)}
                    required
                  >
                    <option value="">Select workout type</option>
                    {programTypes.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="edit-difficulty">Difficulty Level</label>
                  <select
                    id="edit-difficulty"
                    name="difficulty"
                    value={editFormData.difficulty}
                    onChange={(e) => handleExerciseChange(e)}
                    required
                  >
                    <option value="">Select difficulty level</option>
                    {programLevels.map(level => (
                      <option key={level.id} value={level.name}>{level.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row-workout">
                  <div className="form-group-workout">
                    <label htmlFor="edit-duration">Duration (minutes)</label>
                    <input
                      type="number"
                      id="edit-duration"
                      name="duration"
                      value={editFormData.duration}
                      onChange={(e) => handleExerciseChange(e)}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="form-group-workout">
                    <label htmlFor="edit-calories">Calories</label>
                    <input
                      type="number"
                      id="edit-calories"
                      name="calories"
                      value={editFormData.calories}
                      onChange={(e) => handleExerciseChange(e)}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="edit-equipment">Equipment Needed</label>
                  <input
                    type="text"
                    id="edit-equipment"
                    name="equipment"
                    value={editFormData.equipment}
                    onChange={(e) => handleExerciseChange(e)}
                    placeholder="e.g., Dumbbells, Resistance Bands, None"
                  />
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="edit-targetMuscles">Target Muscle Groups</label>
                  <input
                    type="text"
                    id="edit-targetMuscles"
                    name="targetMuscles"
                    value={editFormData.targetMuscles}
                    onChange={(e) => handleExerciseChange(e)}
                    placeholder="e.g., Chest, Back, Legs"
                  />
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editFormData.description}
                    onChange={(e) => handleExerciseChange(e)}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <label>Workout Image</label>
                  <div className="image-upload-container">
                    {editingProgram?.imagePreview ? (
                      <div className="image-preview-container">
                        <img 
                          src={editingProgram.imagePreview} 
                          alt="Preview" 
                          className="image-preview" 
                        />
                      </div>
                    ) : editingProgram?.imagePath ? (
                      <div className="image-preview-container">
                        <img 
                          src={editingProgram.imagePath} 
                          alt="Current" 
                          className="image-preview" 
                        />
                      </div>
                    ) : null}
                    
                    <div className="upload-placeholder">
                      <input
                        type="file"
                        id="edit-workout-image-upload"
                        accept="image/*"
                        onChange={handleEditWorkoutFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="edit-workout-image-upload" className="upload-btn">
                        <FaPlus /> {editingProgram?.imagePath || editingProgram?.imagePreview ? 'Change Image' : 'Upload Image'}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="exercises-section-workout">
                  <h3 className="section-title-workout">Exercises</h3>
                  
                  {/* Current exercises */}
                  <div className="current-exercises-workout">
                    <h4 className="subsection-title-workout">Current Exercises ({editExercises.length})</h4>
                    
                    {editExercises.length > 0 ? (
                      <div className="exercise-list-workout">
                        {editExercises.map((exercise, index) => (
                          <div key={exercise.id || index} className="exercise-item-workout editable">
                            <div className="exercise-input-row-workout">
                              <input
                                type="text"
                                className="edit-exercise-name-workout"
                                value={exercise.exerciseName}
                                onChange={(e) => handleExerciseItemChange(index, 'exerciseName', e.target.value)}
                                placeholder="Exercise name"
                              />
                              
                              <div className="exercise-details-inputs-workout">
                                <div className="sets-input-group-workout">
                                  <label>Sets:</label>
                                  <input
                                    type="number"
                                    className="edit-sets-workout"
                                    value={exercise.sets}
                                    onChange={(e) => handleExerciseItemChange(index, 'sets', e.target.value)}
                                    min="1"
                                  />
                                </div>
                                
                                <div className="reps-input-group-workout">
                                  <label>Reps:</label>
                                  <input
                                    type="text"
                                    className="edit-reps-workout"
                                    value={exercise.repRange}
                                    onChange={(e) => handleExerciseItemChange(index, 'repRange', e.target.value)}
                                    placeholder="e.g., 8-12"
                                  />
                                </div>
                                
                                <button 
                                  type="button" 
                                  className="remove-exercise-btn-workout"
                                  onClick={() => handleRemoveExercise(index)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-exercises-workout">No exercises added yet.</p>
                    )}
                  </div>
                  
                  {/* Add new exercise form */}
                  <div className="add-exercise-form-workout">
                    <h4 className="subsection-title-workout">Add Exercise</h4>
                    <div className="add-exercise-inputs-workout">
                      <div className="exercise-input-group-workout">
                        <input
                          type="text"
                          placeholder="Exercise name"
                          name="exerciseName"
                          value={newExercise.exerciseName}
                          onChange={(e) => handleExerciseChange(e)}
                          className="exercise-name-input-workout"
                        />
                      </div>
                      <div className="exercise-input-group-workout">
                        <input
                          type="number"
                          placeholder="Sets"
                          name="sets"
                          min="1"
                          value={newExercise.sets}
                          onChange={(e) => handleExerciseChange(e)}
                          className="exercise-sets-input-workout"
                        />
                      </div>
                      <div className="exercise-input-group-workout">
                        <input
                          type="text"
                          placeholder="Rep range (e.g., 8-12)"
                          name="repRange"
                          value={newExercise.repRange}
                          onChange={(e) => handleExerciseChange(e)}
                          className="exercise-reps-input-workout"
                        />
                      </div>
                      <button
                        type="button"
                        className="add-exercise-btn-workout"
                        onClick={handleAddExercise}
                      >
                        <FaPlus /> Add
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions-workout">
                  <button type="button" className="cancel-button-workout" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button-workout" disabled={loading}>
                    {loading ? <FaSpinner className="spinner-icon-workout" /> : <FaSave />} Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDayModal && selectedWorkoutForPlan && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '500px', padding: '20px' }}>
            <div className="modal-header">
              <h3>Select Day for Workout</h3>
              <button className="close-button" onClick={() => setShowDayModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <p>Choose which day to add "{selectedWorkoutForPlan.name}" to your weekly plan:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: '15px 0' }}>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(1)}>Monday</button>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(2)}>Tuesday</button>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(3)}>Wednesday</button>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(4)}>Thursday</button>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(5)}>Friday</button>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(6)}>Saturday</button>
                <button className="btn btn-primary" onClick={() => confirmAddToWeeklyPlan(7)}>Sunday</button>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDayModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPrograms; 