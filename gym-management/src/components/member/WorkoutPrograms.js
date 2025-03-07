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
  FaList
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/WorkoutPrograms.css';

const WorkoutPrograms = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-programs');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
    duration: '',
    frequency: '',
  });

  // My workout programs
  const [myPrograms, setMyPrograms] = useState([
    {
      id: 1,
      title: 'Upper Body Strength',
      description: 'Focus on building upper body strength with compound movements',
      duration: '45-60 min',
      frequency: '2x per week',
      createdAt: '2024-01-15',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', weight: '70kg' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', weight: 'Body weight' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', weight: '20kg' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', weight: '60kg' },
        { name: 'Tricep Extensions', sets: 3, reps: '12-15', weight: '15kg' }
      ],
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'Strength',
    },
    {
      id: 2,
      title: 'HIIT Cardio',
      description: 'High-intensity interval training to improve cardiovascular fitness',
      duration: '25-30 min',
      frequency: '3x per week',
      createdAt: '2024-02-20',
      exercises: [
        { name: 'Jumping Jacks', sets: 3, reps: '45 sec', weight: 'N/A' },
        { name: 'Burpees', sets: 3, reps: '30 sec', weight: 'N/A' },
        { name: 'Mountain Climbers', sets: 3, reps: '45 sec', weight: 'N/A' },
        { name: 'High Knees', sets: 3, reps: '45 sec', weight: 'N/A' },
        { name: 'Rest', sets: 3, reps: '15 sec', weight: 'N/A' }
      ],
      image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'Cardio',
    }
  ]);

  // Trainer workout programs
  const [trainerPrograms, setTrainerPrograms] = useState([
    {
      id: 1,
      title: 'Full Body Transformation',
      description: 'Complete program targeting all major muscle groups for overall strength and fitness',
      duration: '60 min',
      frequency: '3x per week',
      trainer: 'Berkay Mustafa Arıkan',
      level: 'Intermediate',
      exercises: [
        { name: 'Squats', sets: 4, reps: '10-12', weight: 'Varied' },
        { name: 'Deadlifts', sets: 4, reps: '8-10', weight: 'Varied' },
        { name: 'Bench Press', sets: 3, reps: '10-12', weight: 'Varied' },
        { name: 'Bent-over Rows', sets: 3, reps: '10-12', weight: 'Varied' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', weight: 'Varied' },
        { name: 'Lunges', sets: 3, reps: '12 each leg', weight: 'Varied' }
      ],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'Full Body',
    },
    {
      id: 2,
      title: 'Functional Fitness',
      description: 'Improve daily movement patterns and overall functional strength',
      duration: '45 min',
      frequency: '2-3x per week',
      trainer: 'Nurettin Enes Karakulak',
      level: 'All Levels',
      exercises: [
        { name: 'Kettlebell Swings', sets: 3, reps: '15', weight: '16kg' },
        { name: 'TRX Rows', sets: 3, reps: '12', weight: 'Body weight' },
        { name: 'Medicine Ball Slams', sets: 3, reps: '12', weight: '8kg' },
        { name: 'Battle Ropes', sets: 3, reps: '30 sec', weight: 'N/A' },
        { name: 'Goblet Squats', sets: 3, reps: '15', weight: '12kg' }
      ],
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'Functional',
    },
    {
      id: 3,
      title: 'Strength and Conditioning',
      description: 'Build strength while improving cardiovascular endurance',
      duration: '50 min',
      frequency: '3x per week',
      trainer: 'Mehmet Enes Oy',
      level: 'Advanced',
      exercises: [
        { name: 'Back Squats', sets: 5, reps: '5', weight: 'Heavy' },
        { name: 'Pull-ups', sets: 4, reps: '8-10', weight: 'Body weight' },
        { name: 'Box Jumps', sets: 3, reps: '10', weight: 'N/A' },
        { name: 'Farmers Walks', sets: 3, reps: '40m', weight: 'Heavy' },
        { name: 'Assault Bike', sets: 3, reps: '1 min', weight: 'N/A' }
      ],
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: 'Strength',
    }
  ]);

  // Program types for filtering
  const programTypes = [
    { id: 'all', name: 'All Types', icon: <FaDumbbell /> },
    { id: 'strength', name: 'Strength', icon: <FaDumbbell /> },
    { id: 'cardio', name: 'Cardio', icon: <FaRunning /> },
    { id: 'full-body', name: 'Full Body', icon: <FaUserFriends /> },
    { id: 'functional', name: 'Functional', icon: <FaList /> }
  ];

  const [selectedType, setSelectedType] = useState('all');

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
    : myPrograms.filter(program => program.type.toLowerCase() === selectedType);

  const filteredTrainerPrograms = selectedType === 'all'
    ? trainerPrograms
    : trainerPrograms.filter(program => program.type.toLowerCase() === selectedType);

  // Handle program view details
  const handleViewDetails = (program, isTrainerProgram = false) => {
    setSelectedProgram({...program, isTrainerProgram});
    setShowDetailsModal(true);
  };

  // Handle create new program
  const handleCreateProgram = () => {
    setShowCreateModal(true);
  };

  // Handle adding exercise to new program
  const handleAddExercise = () => {
    setNewProgram({
      ...newProgram,
      exercises: [...newProgram.exercises, { name: '', sets: '', reps: '', weight: '' }]
    });
  };

  // Handle removing exercise from new program
  const handleRemoveExercise = (index) => {
    const updatedExercises = [...newProgram.exercises];
    updatedExercises.splice(index, 1);
    setNewProgram({
      ...newProgram,
      exercises: updatedExercises
    });
  };

  // Handle input change for new program
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram({
      ...newProgram,
      [name]: value
    });
  };

  // Handle exercise input change
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...newProgram.exercises];
    updatedExercises[index][field] = value;
    setNewProgram({
      ...newProgram,
      exercises: updatedExercises
    });
  };

  // Handle submit new program
  const handleSubmitProgram = () => {
    // Validate form
    if (!newProgram.title || !newProgram.description || !newProgram.duration || !newProgram.frequency) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if all exercises have at least name and sets/reps
    const validExercises = newProgram.exercises.every(ex => ex.name && ex.sets && ex.reps);
    if (!validExercises) {
      alert('Please complete all exercise information');
      return;
    }

    // Create new program
    const createdProgram = {
      id: myPrograms.length + 1,
      ...newProgram,
      createdAt: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      type: newProgram.title.includes('Cardio') ? 'Cardio' : 'Strength', // Simple logic for demo
    };

    // Add to my programs
    setMyPrograms([...myPrograms, createdProgram]);
    
    // Reset form and close modal
    setNewProgram({
      title: '',
      description: '',
      exercises: [{ name: '', sets: '', reps: '', weight: '' }],
      duration: '',
      frequency: '',
    });
    setShowCreateModal(false);
  };

  // Handle delete program
  const handleDeleteProgram = (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setMyPrograms(myPrograms.filter(program => program.id !== id));
    }
  };

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
                    <img src={program.image} alt={program.title} />
                    <div className="program-type-badge-workout">{program.type}</div>
                  </div>
                  <div className="program-content-workout">
                    <h3>{program.title}</h3>
                    <p className="created-date-workout">Created: {program.createdAt}</p>
                    <div className="program-meta-workout">
                      <div className="meta-item-workout">
                        <FaClock />
                        <span>{program.duration}</span>
                      </div>
                      <div className="meta-item-workout">
                        <FaCalendarAlt />
                        <span>{program.frequency}</span>
                      </div>
                    </div>
                    <div className="program-actions-workout">
                      <button className="action-button-workout view-button-workout" onClick={() => handleViewDetails(program)}>
                        <FaEye /> View
                      </button>
                      <button className="action-button-workout edit-button-workout">
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
                  <img src={program.image} alt={program.title} />
                  <div className="program-type-badge-workout">{program.type}</div>
                  <div className="program-level-badge-workout">{program.level}</div>
                </div>
                <div className="program-content-workout">
                  <h3>{program.title}</h3>
                  <div className="trainer-info-workout">
                    <FaUser />
                    <span>{program.trainer}</span>
                  </div>
                  <div className="program-meta-workout">
                    <div className="meta-item-workout">
                      <FaClock />
                      <span>{program.duration}</span>
                    </div>
                    <div className="meta-item-workout">
                      <FaCalendarAlt />
                      <span>{program.frequency}</span>
                    </div>
                  </div>
                  <button 
                    className="view-details-button-workout"
                    onClick={() => handleViewDetails(program, true)}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Program Details Modal */}
      {showDetailsModal && selectedProgram && (
        <div className="modal-overlay-workout">
          <div className="program-details-modal-workout">
            <button className="close-modal-button-workout" onClick={() => setShowDetailsModal(false)}>
              <FaTimes />
            </button>
            <div className="modal-header-workout">
              <h2>{selectedProgram.title}</h2>
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
                    <p>{selectedProgram.duration}</p>
                  </div>
                </div>
                <div className="detail-item-workout">
                  <FaCalendarAlt />
                  <div>
                    <h4>Frequency</h4>
                    <p>{selectedProgram.frequency}</p>
                  </div>
                </div>
                {selectedProgram.isTrainerProgram && (
                  <>
                    <div className="detail-item-workout">
                      <FaUser />
                      <div>
                        <h4>Trainer</h4>
                        <p>{selectedProgram.trainer}</p>
                      </div>
                    </div>
                    <div className="detail-item-workout">
                      <FaDumbbell />
                      <div>
                        <h4>Level</h4>
                        <p>{selectedProgram.level}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="exercises-section-workout">
                <h3>Exercises</h3>
                <div className="exercises-table-workout">
                  <div className="table-header-workout">
                    <div className="header-cell-workout">Exercise</div>
                    <div className="header-cell-workout">Sets</div>
                    <div className="header-cell-workout">Reps</div>
                    <div className="header-cell-workout">Weight</div>
                  </div>
                  {selectedProgram.exercises.map((exercise, index) => (
                    <div key={index} className="table-row-workout">
                      <div className="row-cell-workout exercise-name-workout">{exercise.name}</div>
                      <div className="row-cell-workout">{exercise.sets}</div>
                      <div className="row-cell-workout">{exercise.reps}</div>
                      <div className="row-cell-workout">{exercise.weight}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer-workout">
              {selectedProgram.isTrainerProgram ? (
                <button className="save-program-button-workout">
                  <FaPlus /> Save to My Programs
                </button>
              ) : (
                <button className="close-button-workout" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Program Modal */}
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
                <label htmlFor="title">Program Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={newProgram.title}
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
                  <label htmlFor="duration">Duration</label>
                  <input 
                    type="text" 
                    id="duration" 
                    name="duration" 
                    value={newProgram.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 45-60 min"
                    required
                  />
                </div>
                
                <div className="form-group-workout">
                  <label htmlFor="frequency">Frequency</label>
                  <input 
                    type="text" 
                    id="frequency" 
                    name="frequency" 
                    value={newProgram.frequency}
                    onChange={handleInputChange}
                    placeholder="e.g., 3x per week"
                    required
                  />
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
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                          placeholder="e.g., Bench Press"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="exercise-form-row-workout three-columns-workout">
                      <div className="form-group-workout">
                        <label htmlFor={`exercise-sets-${index}`}>Sets</label>
                        <input 
                          type="text" 
                          id={`exercise-sets-${index}`}
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          placeholder="e.g., 3"
                          required
                        />
                      </div>
                      
                      <div className="form-group-workout">
                        <label htmlFor={`exercise-reps-${index}`}>Reps</label>
                        <input 
                          type="text" 
                          id={`exercise-reps-${index}`}
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          placeholder="e.g., 8-12"
                          required
                        />
                      </div>
                      
                      <div className="form-group-workout">
                        <label htmlFor={`exercise-weight-${index}`}>Weight</label>
                        <input 
                          type="text" 
                          id={`exercise-weight-${index}`}
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                          placeholder="e.g., 60kg or N/A"
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
    </div>
  );
};

export default WorkoutPrograms; 