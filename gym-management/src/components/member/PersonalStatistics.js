import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSun, FaMoon, FaChartLine, FaChartPie, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import '../../styles/PersonalStatistics.css';
import '../../styles/Navbar.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';
import withChatAndNotifications from './withChatAndNotifications';

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
            className={`dark-mode-toggle-main ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <i className="fas fa-sun toggle-icon-main" style={{ marginLeft: '2px' }}></i>
            <div className="toggle-circle-main"></div>
            <i className="fas fa-moon toggle-icon-main" style={{ marginRight: '2px' }}></i>
          </button>
        </div>

        <div className="statistics-title-personalstatistics">
          <FaChartLine className="title-icon-personalstatistics" />
          <h2>Personal Statistics</h2>
        </div>

        <div className="statistics-grid-personalstatistics">
          <div className="stat-card-personalstatistics card-animate stagger-1">
            <FaChartPie className="stat-icon-personalstatistics" />
            <h3>Workout Stats</h3>
            <div className="stat-details-personalstatistics">
              <p>Total Workouts: {stats.workouts.total}</p>
              <p>This Month: {stats.workouts.thisMonth}</p>
              <p>Last Month: {stats.workouts.lastMonth}</p>
            </div>
          </div>

          <div className="stat-card-personalstatistics card-animate stagger-2">
            <FaChartBar className="stat-icon-personalstatistics" />
            <h3>Progress</h3>
            <div className="stat-details-personalstatistics">
              <p>Current Weight: {stats.progress.weight} kg</p>
              <p>Target Weight: {stats.progress.targetWeight} kg</p>
              <p>Muscle Gain: {stats.progress.muscleGain} kg</p>
              <p>Body Fat: {stats.progress.bodyFat}%</p>
            </div>
          </div>

          <div className="stat-card-personalstatistics card-animate stagger-3">
            <FaCalendarAlt className="stat-icon-personalstatistics" />
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

export default withChatAndNotifications(PersonalStatistics); 