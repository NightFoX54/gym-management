import React from 'react';
import { FaArrowLeft, FaDumbbell, FaCalendar, FaClock, FaUser, FaCheckCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainingPlan.css';

const TrainingPlan = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  const workoutProgram = {
    name: "Advanced Strength Training",
    trainer: "Alex Johnson",
    startDate: "2024-03-01",
    duration: "12 weeks",
    progress: 25,
    nextSession: "2024-03-15 10:00",
    schedule: [
      {
        day: "Monday",
        exercises: [
          { name: "Bench Press", sets: "4", reps: "8-10", weight: "70-80kg" },
          { name: "Squats", sets: "4", reps: "8-10", weight: "90-100kg" },
          { name: "Pull-ups", sets: "3", reps: "8-12", weight: "Body weight" }
        ]
      },
      {
        day: "Wednesday",
        exercises: [
          { name: "Deadlift", sets: "4", reps: "6-8", weight: "100-120kg" },
          { name: "Shoulder Press", sets: "4", reps: "8-10", weight: "45-55kg" },
          { name: "Barbell Rows", sets: "3", reps: "10-12", weight: "60-70kg" }
        ]
      },
      {
        day: "Friday",
        exercises: [
          { name: "Leg Press", sets: "4", reps: "10-12", weight: "150-180kg" },
          { name: "Incline Bench", sets: "4", reps: "8-10", weight: "60-70kg" },
          { name: "Lat Pulldown", sets: "3", reps: "12-15", weight: "55-65kg" }
        ]
      }
    ],
    goals: [
      "Increase overall strength by 20%",
      "Improve form in compound lifts",
      "Build lean muscle mass",
      "Enhance core stability"
    ]
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`training-plan-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="back-button" onClick={() => navigate('/member')}>
        <FaArrowLeft />
        <span>Back to Dashboard</span>
      </button>

      <div className="dark-mode-toggle-container">
        <button 
          className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
          onClick={toggleDarkMode}
        >
          <FaSun className="toggle-icon sun" />
          <div className="toggle-circle"></div>
          <FaMoon className="toggle-icon moon" />
        </button>
      </div>

      <div className="training-plan-content">
        <h2>Training Plan</h2>

        <div className="program-overview">
          <div className="program-header">
            <div className="program-title">
              <FaDumbbell />
              <h3>{workoutProgram.name}</h3>
            </div>
            <div className="progress-indicator">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${workoutProgram.progress}%` }}
                />
              </div>
              <div className="progress-text">
                <span className="completed">{workoutProgram.progress}% completed</span>
                <span className="remaining">{100 - workoutProgram.progress}% left</span>
              </div>
            </div>
          </div>

          <div className="program-details">
            <div className="detail-item">
              <FaUser />
              <div>
                <label>Trainer</label>
                <p>{workoutProgram.trainer}</p>
              </div>
            </div>
            <div className="detail-item">
              <FaCalendar />
              <div>
                <label>Start Date</label>
                <p>{new Date(workoutProgram.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="detail-item">
              <FaClock />
              <div>
                <label>Duration</label>
                <p>{workoutProgram.duration}</p>
              </div>
            </div>
          </div>

          <div className="next-session">
            <h4>Next Training Session</h4>
            <p>{new Date(workoutProgram.nextSession).toLocaleString()}</p>
          </div>
        </div>

        <div className="workout-schedule">
          <h3>Weekly Schedule</h3>
          <div className="schedule-grid">
            {workoutProgram.schedule.map((day, index) => (
              <div key={index} className="workout-day">
                <h4>{day.day}</h4>
                <div className="exercises-list">
                  {day.exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="exercise-item">
                      <div className="exercise-header">
                        <h5>{exercise.name}</h5>
                      </div>
                      <div className="exercise-details">
                        <span>{exercise.sets} sets</span>
                        <span>{exercise.reps} reps</span>
                        <span>{exercise.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="program-goals">
          <h3>Program Goals</h3>
          <ul className="goals-list">
            {workoutProgram.goals.map((goal, index) => (
              <li key={index}>
                <FaCheckCircle />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlan; 