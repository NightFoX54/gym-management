import React, { useState, useEffect } from 'react';
import { FaDumbbell, FaRunning, FaSwimmer, FaPrayingHands, FaArrowLeft, FaClock, FaUser, FaCalendarAlt, FaSun, FaMoon, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainingPrograms.css';

const TrainingPrograms = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);

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

  const programs = [
    {
      id: 1,
      title: 'Strength Training',
      category: 'strength',
      description: 'Build muscle and increase strength with our comprehensive program.',
      duration: '60 min',
      trainer: 'John Smith',
      schedule: 'Mon, Wed, Fri',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      level: 'Intermediate'
    },
    {
      id: 2,
      title: 'Cardio Blast',
      category: 'cardio',
      description: 'High-intensity cardio workout to boost your endurance and burn calories.',
      duration: '45 min',
      trainer: 'Sarah Johnson',
      schedule: 'Tue, Thu, Sat',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      level: 'Advanced'
    },
    {
      id: 3,
      title: 'Swimming Basics',
      category: 'swimming',
      description: 'Learn proper swimming techniques and improve your water confidence.',
      duration: '90 min',
      trainer: 'Mike Wilson',
      schedule: 'Mon, Wed, Fri',
      image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      level: 'Beginner'
    },
    {
      id: 4,
      title: 'Yoga Flow',
      category: 'yoga',
      description: 'Find balance and flexibility with our calming yoga sessions.',
      duration: '75 min',
      trainer: 'Emma Davis',
      schedule: 'Tue, Thu, Sun',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      level: 'All Levels'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Programs', icon: <FaDumbbell /> },
    { id: 'strength', name: 'Strength', icon: <FaDumbbell /> },
    { id: 'cardio', name: 'Cardio', icon: <FaRunning /> },
    { id: 'swimming', name: 'Swimming', icon: <FaSwimmer /> },
    { id: 'yoga', name: 'Yoga', icon: <FaPrayingHands /> }
  ];

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(program => program.category === selectedCategory);

  const handleEnrollClick = (program) => {
    setSelectedProgram(program);
    setShowEnrollModal(true);
  };

  const handleEnrollConfirm = () => {
    if (selectedProgram) {
      setEnrolledPrograms([...enrolledPrograms, selectedProgram.id]);
      setShowEnrollModal(false);
      // Burada backend'e kayıt işlemi yapılabilir
      alert(`Successfully enrolled in ${selectedProgram.title}!`);
    }
  };

  const handleEnrollCancel = () => {
    setShowEnrollModal(false);
    setSelectedProgram(null);
  };

  return (
    <div className={`training-programs-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <button className="back-button" onClick={() => navigate("/member")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="header-title">Training Programs</h1>
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

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
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
              <img src={program.image} alt={program.title} />
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
                  <span>{program.schedule}</span>
                </div>
              </div>
              <button 
                className={`enroll-button ${enrolledPrograms.includes(program.id) ? 'enrolled' : ''}`}
                onClick={() => handleEnrollClick(program)}
                disabled={enrolledPrograms.includes(program.id)}
              >
                {enrolledPrograms.includes(program.id) ? 'Enrolled' : 'Enroll Now'}
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
            <h2>Confirm Enrollment</h2>
            <div className="modal-content">
              <p>Are you sure you want to enroll in:</p>
              <h3>{selectedProgram.title}</h3>
              <div className="program-details">
                <p><strong>Duration:</strong> {selectedProgram.duration}</p>
                <p><strong>Trainer:</strong> {selectedProgram.trainer}</p>
                <p><strong>Schedule:</strong> {selectedProgram.schedule}</p>
                <p><strong>Level:</strong> {selectedProgram.level}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleEnrollCancel}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleEnrollConfirm}>
                <FaCheck /> Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPrograms; 