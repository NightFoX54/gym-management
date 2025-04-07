import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaDumbbell, FaCalendar, FaClock, FaUser, FaCheckCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainingPlan.css';
import '../../styles/PageTransitions.css';
import { toast } from 'react-toastify';

const TrainingPlan = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [userTrainingPlan, setUserTrainingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutExercises, setWorkoutExercises] = useState({});

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

  // Sample data for program overview (you can replace this with actual data from API later)
  const programOverview = {
    name: "Advanced Strength Training",
    trainer: "Alex Johnson",
    startDate: "2024-03-01",
    duration: "12 weeks",
    progress: 25,
    nextSession: "2024-03-15 10:00",
    goals: [
      "Increase overall strength by 20%",
      "Improve form in compound lifts",
      "Build lean muscle mass",
      "Enhance core stability"
    ]
  };

  useEffect(() => {
    fetchUserTrainingPlan();
  }, []);

  const fetchUserTrainingPlan = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        toast.error("Please log in to view your training plan");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/training-plans/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch training plan');
      }

      const planData = await response.json();
      
      // Process the fetched data to organize by day of week
      const weeklySchedule = processTrainingPlanData(planData);
      setUserTrainingPlan(weeklySchedule);
      
      // After fetching workout data, fetch exercises for each workout
      if (planData && planData.length > 0) {
        fetchExercisesForWorkouts(planData);
      }
    } catch (error) {
      console.error('Error fetching training plan:', error);
      toast.error("Could not load your weekly training plan");
    } finally {
      setLoading(false);
    }
  };

  // Fetch exercises for each workout
  const fetchExercisesForWorkouts = async (trainingPlans) => {
    try {
      // Create a unique array of all workout IDs
      const workoutIds = [...new Set(trainingPlans.map(plan => plan.workoutId))];
      
      // If no workouts, exit early
      if (workoutIds.length === 0) return;
      
      // Get exercises for each workout
      const exercisesPromises = workoutIds.map(workoutId => 
        fetch(`http://localhost:8080/api/workouts/${workoutId}/exercises`)
          .then(response => {
            if (!response.ok) {
              console.warn(`Failed to fetch exercises for workout ${workoutId}`);
              return [];
            }
            return response.json();
          })
          .then(data => ({ workoutId, exercises: data || [] }))
          .catch(error => {
            console.error(`Error fetching exercises for workout ${workoutId}:`, error);
            return { workoutId, exercises: [] };
          })
      );
      
      const exercisesResults = await Promise.all(exercisesPromises);
      // Create a map of workout ID to exercises
      const exercisesMap = {};
      exercisesResults.forEach(result => {
        exercisesMap[result.workoutId] = result.exercises;
      });
      
      setWorkoutExercises(exercisesMap);
      console.log(exercisesMap);
      console.log(workoutExercises);
    } catch (error) {
      console.error('Error fetching workout exercises:', error);
    }
  };

  // Process the training plan data into a format suitable for the UI
  const processTrainingPlanData = (planData) => {
    // Initialize array with 7 days (index 0 to 6 representing Monday to Sunday)
    const weekDays = [
      { day: "Monday", exercises: [] },
      { day: "Tuesday", exercises: [] },
      { day: "Wednesday", exercises: [] },
      { day: "Thursday", exercises: [] },
      { day: "Friday", exercises: [] },
      { day: "Saturday", exercises: [] },
      { day: "Sunday", exercises: [] }
    ];

    // Group exercises by day of week
    planData.forEach(workout => {
      // dayOfWeek from API is 1-7, so we subtract 1 to get array index 0-6
      const dayIndex = workout.dayOfWeek - 1;
      
      if (dayIndex >= 0 && dayIndex < 7) {
        weekDays[dayIndex].exercises.push({
          id: workout.id,
          workoutId: workout.workoutId,
          name: workout.workoutName,
          description: workout.description,
          difficulty: workout.workoutDifficulty || "Moderate",
          exercisesList: [] // Will be populated later
        });
      }
    });

    return weekDays;
  };

  // When workout exercises data changes, update the training plan UI data
  useEffect(() => {
    if (Object.keys(workoutExercises).length > 0 && userTrainingPlan) {
      // Create a deep copy of userTrainingPlan to modify
      const updatedTrainingPlan = JSON.parse(JSON.stringify(userTrainingPlan));
      
      // Update each day's workout with the exercises
      updatedTrainingPlan.forEach(day => {
        day.exercises.forEach(workout => {
          // If we have exercises for this workout, add them to the exercisesList
          if (workoutExercises[workout.workoutId]) {
            workout.exercisesList = workoutExercises[workout.workoutId];
          }
        });
      });
      
      // Update the state with the exercises included
      setUserTrainingPlan(updatedTrainingPlan);
    }
  }, [workoutExercises]);

  // Only show days that have exercises
  const daysWithExercises = userTrainingPlan ? 
    userTrainingPlan.filter(day => day.exercises.length > 0) : [];

  return (
    <div className={`training-plan-container-trainingplan container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="training-content-trainingplan">
        <div className="training-header-trainingplan">
          <button className="back-button-trainingplan" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <button 
            className={`dark-mode-toggle-trainingplan ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon-trainingplan sun-trainingplan" />
            <div className="toggle-circle-trainingplan"></div>
            <FaMoon className="toggle-icon-trainingplan moon-trainingplan" />
          </button>
        </div>

        <div className="training-content-trainingplan">
          <h2 className="card-animate stagger-3">Training Plan</h2>

          <div className="program-overview-trainingplan card-animate stagger-4">
            <div className="program-header-trainingplan">
              <div className="program-title-trainingplan">
                <FaDumbbell />
                <h3>{programOverview.name}</h3>
              </div>
              <div className="progress-indicator-trainingplan">
                <div className="progress-bar-trainingplan">
                  <div 
                    className="progress-fill-trainingplan"
                    style={{ width: `${programOverview.progress}%` }}
                  />
                </div>
                <div className="progress-text-trainingplan">
                  <span className="completed">{programOverview.progress}% completed</span>
                  <span className="remaining">{100 - programOverview.progress}% left</span>
                </div>
              </div>
            </div>

            <div className="program-details-trainingplan">
              <div className="detail-item-trainingplan">
                <FaUser />
                <div>
                  <label>Trainer</label>
                  <p>{programOverview.trainer}</p>
                </div>
              </div>
              <div className="detail-item-trainingplan">
                <FaCalendar />
                <div>
                  <label>Start Date</label>
                  <p>{new Date(programOverview.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="detail-item-trainingplan">
                <FaClock />
                <div>
                  <label>Duration</label>
                  <p>{programOverview.duration}</p>
                </div>
              </div>
            </div>

            <div className="next-session-trainingplan">
              <h4>Next Training Session</h4>
              <p>{new Date(programOverview.nextSession).toLocaleString()}</p>
            </div>
          </div>

          <div className="workout-schedule-trainingplan">
            <h3>Weekly Schedule</h3>
            
            {loading ? (
              <div className="loading-indicator">Loading your training plan...</div>
            ) : daysWithExercises.length > 0 ? (
              <div className="weekly-schedule-grid">
                {daysWithExercises.map((day) => (
                  <div key={day.day} className="workout-day-column">
                    <h4 className="day-header">{day.day}</h4>
                    <div className="day-workouts">
                      {day.exercises.map((workout, wIndex) => (
                        <div key={wIndex} className="workout-card">
                          <h5 className="workout-name">{workout.name}</h5>
                          
                          <div className="workout-exercises">
                            {workout.exercisesList && workout.exercisesList.length > 0 ? (
                              workout.exercisesList.map((exercise, eIndex) => (
                                <div key={eIndex} className="exercise-item">
                                  <div className="exercise-name">{exercise.exerciseName}</div>
                                  <div className="exercise-details">
                                    <span>{exercise.sets} sets</span>
                                    <span>{exercise.repRange}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="exercise-info">No exercises found</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-schedule">
                <p>You don't have any workouts added to your weekly schedule yet.</p>
                <p>Visit the Workout Programs page to add workouts to your weekly plan.</p>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/member/workout-programs')}
                >
                  Browse Workout Programs
                </button>
              </div>
            )}
          </div>

          <div className="program-goals-trainingplan card-animate stagger-5">
            <h3>Program Goals</h3>
            <ul className="goals-list-trainingplan">
              {programOverview.goals.map((goal, index) => (
                <li key={index}>
                  <FaCheckCircle />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlan; 