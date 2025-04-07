import React, { useState, useEffect } from 'react';
import { FaDumbbell, FaRunning, FaSwimmer, FaPrayingHands, FaArrowLeft, FaClock, FaUser, FaCalendarAlt, FaSun, FaMoon, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainingPrograms.css';
import axios from 'axios';

const TrainingPrograms = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [enrolledSessions, setEnrolledSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get logged in user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Fetch categories
    fetchCategories();
    
    // Fetch all programs initially
    fetchPrograms();
    
    // If user is logged in, fetch their enrollments
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchUserEnrollments(parsedUser.id);
    }
  }, [setIsDarkMode]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/group-workouts/categories');
      const categoriesData = response.data;
      
      // Map categories with icons
      const categoriesWithIcons = [
        { id: 'all', name: 'All Programs', icon: <FaDumbbell /> },
        ...categoriesData.map(category => {
          let icon = <FaDumbbell />;
          
          // Map category names to icons (adjust as needed)
          if (category.categoryName.toLowerCase().includes('yoga')) {
            icon = <FaPrayingHands />;
          } else if (category.categoryName.toLowerCase().includes('cardio')) {
            icon = <FaRunning />;
          } else if (category.categoryName.toLowerCase().includes('swimming')) {
            icon = <FaSwimmer />;
          }
          
          return {
            id: category.id,
            name: category.categoryName,
            icon: icon
          };
        })
      ];
      
      setCategories(categoriesWithIcons);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchPrograms = async (categoryId = null) => {
    try {
      const url = categoryId && categoryId !== 'all' 
        ? `http://localhost:8080/api/group-workouts?categoryId=${categoryId}`
        : 'http://localhost:8080/api/group-workouts';
        
      const response = await axios.get(url);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to load workout programs');
    }
  };

  const fetchSessionsForProgram = async (programId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/group-workouts/${programId}/sessions`);
      setSessions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load available sessions');
      return [];
    }
  };

  const fetchUserEnrollments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/group-workouts/user/${userId}/enrollments`);
      setEnrolledSessions(response.data);
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
    }
  };

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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchPrograms(categoryId);
  };

  const handleEnrollClick = async (program) => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    setSelectedProgram(program);
    
    // Fetch available sessions for this program
    const programSessions = await fetchSessionsForProgram(program.id);
    
    if (programSessions.length > 0) {
      setShowEnrollModal(true);
    } else {
      setError('No available sessions for this program');
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleEnrollConfirm = async () => {
    if (!user || !selectedProgram || !selectedSession) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/api/group-workouts/enroll', {
        userId: user.id,
        sessionId: selectedSession.id
      });
      
      if (response.data.success) {
        // Add this session to enrolled sessions
        setEnrolledSessions([...enrolledSessions, selectedSession.id]);
        setShowEnrollModal(false);
        setSelectedProgram(null);
        setSelectedSession(null);
        alert(`Successfully enrolled in ${selectedProgram.title}!`);
      }
    } catch (error) {
      console.error('Error enrolling in session:', error);
      setError(error.response?.data?.error || 'Failed to enroll in session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollCancel = () => {
    setShowEnrollModal(false);
    setSelectedProgram(null);
    setSelectedSession(null);
  };

  const filteredPrograms = programs;

  return (
    <div className={`training-programs-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <button className="back-button" onClick={() => navigate("/member")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="header-title">Group Classes</h1>
        <div className="header-right">
          <button
            className={`dark-mode-toggle ${isDarkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon sun" />
            <div className="toggle-circle"></div>
            <FaMoon className="toggle-icon moon" />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="programs-grid">
        {filteredPrograms.map(program => (
          <div key={program.id} className="program-card">
            <div className="program-image">
              <img 
                src={program.image || '/images/group-workouts/default.jpg'} 
                alt={program.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/group-workouts/default.jpg';
                }}
              />
              <div className="program-level">{program.level}</div>
            </div>
            <div className="program-content">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <div className="program-details">
                <div className="detail-item">
                  <FaClock />
                  <span>{program.duration}</span>
                </div>
                <div className="detail-item">
                  <FaUser />
                  <span>{program.trainer}</span>
                </div>
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>Multiple sessions available</span>
                </div>
              </div>
              <button 
                className="enroll-button"
                onClick={() => handleEnrollClick(program)}
              >
                View Sessions
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEnrollModal && selectedProgram && (
        <div className="enroll-modal-overlay">
          <div className="enroll-modal">
            <button className="close-modal" onClick={handleEnrollCancel}>
              <FaTimes />
            </button>
            <h2>Select a Session</h2>
            <div className="modal-content">
              <h3>{selectedProgram.title}</h3>
              <div className="program-details">
                <p><strong>Duration:</strong> {selectedProgram.duration}</p>
                <p><strong>Trainer:</strong> {selectedProgram.trainer}</p>
                <p><strong>Level:</strong> {selectedProgram.level}</p>
              </div>
              
              <div className="sessions-list">
                <h4>Available Sessions:</h4>
                {sessions.length > 0 ? (
                  sessions.map(session => (
                    <div 
                      key={session.id} 
                      className={`session-item ${selectedSession?.id === session.id ? 'selected' : ''} ${enrolledSessions.includes(session.id) ? 'enrolled' : ''}`}
                      onClick={() => !enrolledSessions.includes(session.id) && handleSessionSelect(session)}
                    >
                      <span>{session.formattedDateTime}</span>
                      {enrolledSessions.includes(session.id) ? (
                        <span className="enrolled-badge">Already Enrolled</span>
                      ) : (
                        <span className="select-badge">
                          {selectedSession?.id === session.id ? 'Selected' : 'Select'}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No sessions available for this program.</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleEnrollCancel}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleEnrollConfirm}
                disabled={!selectedSession || enrolledSessions.includes(selectedSession.id) || isLoading}
              >
                <FaCheck /> {isLoading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPrograms; 