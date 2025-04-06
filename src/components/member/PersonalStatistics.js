import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSun, FaMoon, FaChartLine, FaDumbbell, FaRunning, FaHeartbeat } from 'react-icons/fa';
import '../../styles/PersonalStatistics.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';

const PersonalStatistics = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    workouts: {
      total: 45,
      thisMonth: 12,
      lastMonth: 15
    },
    progress: {
      weight: 75,
      targetWeight: 70,
      muscleGain: 2.5,
      bodyFat: 18
    },
    achievements: [
      {
        title: 'First Workout',
        date: '2024-01-15',
        description: 'Completed your first gym session'
      },
      {
        title: 'Consistency Milestone',
        date: '2024-02-01',
        description: 'Attended gym for 10 consecutive days'
      }
    ]
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const toggleDarkModeMember = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className={`personal-statistics-container-personalstatistics container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="statistics-content-personalstatistics">
        <div className="statistics-header-personalstatistics">
          <button className="back-button-personalstatistics" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <button 
            className={`dark-mode-toggle-personalstatistics ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <FaSun className="toggle-icon-personalstatistics sun-personalstatistics" />
            <div className="toggle-circle-personalstatistics"></div>
            <FaMoon className="toggle-icon-personalstatistics moon-personalstatistics" />
          </button>
        </div>

        <div className="statistics-title-personalstatistics">
          <FaChartLine className="title-icon-personalstatistics" />
          <h2>Personal Statistics</h2>
        </div>

        <div className="statistics-grid-personalstatistics">
          <div className="stat-card-personalstatistics card-animate stagger-1">
            <FaDumbbell className="stat-icon-personalstatistics" />
            <h3>Workout Stats</h3>
            <div className="stat-details-personalstatistics">
              <p>Total Workouts: {stats.workouts.total}</p>
              <p>This Month: {stats.workouts.thisMonth}</p>
              <p>Last Month: {stats.workouts.lastMonth}</p>
            </div>
          </div>

          <div className="stat-card-personalstatistics card-animate stagger-2">
            <FaRunning className="stat-icon-personalstatistics" />
            <h3>Progress</h3>
            <div className="stat-details-personalstatistics">
              <p>Current Weight: {stats.progress.weight} kg</p>
              <p>Target Weight: {stats.progress.targetWeight} kg</p>
              <p>Muscle Gain: {stats.progress.muscleGain} kg</p>
              <p>Body Fat: {stats.progress.bodyFat}%</p>
            </div>
          </div>

          <div className="stat-card-personalstatistics card-animate stagger-3">
            <FaHeartbeat className="stat-icon-personalstatistics" />
            <h3>Achievements</h3>
            <div className="achievements-list-personalstatistics">
              {stats.achievements.map((achievement, index) => (
                <div key={index} className="achievement-item-personalstatistics">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-date-personalstatistics">
                    {new Date(achievement.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalStatistics; 