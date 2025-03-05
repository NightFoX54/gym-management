import React from 'react';
import { FaArrowLeft, FaDumbbell, FaCalendar, FaClock, FaUser, FaCheckCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainingPlan.css';
import '../../styles/PageTransitions.css';

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

  const toggleDarkModeMember = () => {
    setIsDarkMode(!isDarkMode);
  };

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
            onClick={toggleDarkModeMember}
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
                <h3>{workoutProgram.name}</h3>
              </div>
              <div className="progress-indicator-trainingplan">
                <div className="progress-bar-trainingplan">
                  <div 
                    className="progress-fill-trainingplan"
                    style={{ width: `${workoutProgram.progress}%` }}
                  />
                </div>
                <div className="progress-text-trainingplan">
                  <span className="completed">{workoutProgram.progress}% completed</span>
                  <span className="remaining">{100 - workoutProgram.progress}% left</span>
                </div>
              </div>
            </div>

            <div className="program-details-trainingplan">
              <div className="detail-item-trainingplan">
                <FaUser />
                <div>
                  <label>Trainer</label>
                  <p>{workoutProgram.trainer}</p>
                </div>
              </div>
              <div className="detail-item-trainingplan">
                <FaCalendar />
                <div>
                  <label>Start Date</label>
                  <p>{new Date(workoutProgram.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="detail-item-trainingplan">
                <FaClock />
                <div>
                  <label>Duration</label>
                  <p>{workoutProgram.duration}</p>
                </div>
              </div>
            </div>

            <div className="next-session-trainingplan">
              <h4>Next Training Session</h4>
              <p>{new Date(workoutProgram.nextSession).toLocaleString()}</p>
            </div>
          </div>

          <div className="workout-schedule-trainingplan">
            <h3>Weekly Schedule</h3>
            <div className="schedule-grid-trainingplan">
              {workoutProgram.schedule.map((day, index) => (
                <div key={day.day} className={`workout-day-trainingplan card-animate stagger-${index + 1}`}>
                  <h4>{day.day}</h4>
                  <div className="exercises-list-trainingplan">
                    {day.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="exercise-item-trainingplan">
                        <div className="exercise-header-trainingplan">
                          <h5>{exercise.name}</h5>
                        </div>
                        <div className="exercise-details-trainingplan">
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

          <div className="program-goals-trainingplan card-animate stagger-5">
            <h3>Program Goals</h3>
            <ul className="goals-list-trainingplan">
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
    </div>
  );
};

export default TrainingPlan; 
