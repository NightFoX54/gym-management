import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa';
import '../../styles/MyProfile.css';
import { useNavigate } from 'react-router-dom';

const MyProfile = ({ isDarkMode, setIsDarkMode }) => {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+90 555 123 4567',
    birthDate: '1990-01-01',
    membershipStart: '2024-01-01',
    membershipEnd: '2025-01-01',
    profileImage: 'https://via.placeholder.com/150'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});
  const navigate = useNavigate();

  useEffect(() => {
    // Sayfa yüklendiğinde dark mode durumunu kontrol et
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({...profile});
  };

  const handleSave = () => {
    // TODO: API call to update profile
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({...profile});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className={`profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="back-button" onClick={() => navigate('/member')}>
        <FaArrowLeft />
        <span>Back to Dashboard</span>
      </button>
      <div className="profile-top">
        <div className="profile-photo-container">
          <img src={profile.profileImage} alt="Profile" className="profile-photo" />
        </div>
        <div className="profile-header-content">
          <div className="profile-header">
            <h2>My Profile</h2>
            <div className="header-actions">
              <button 
                className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                <span className="toggle-icon sun"><FaSun /></span>
                <div className="toggle-circle"></div>
                <span className="toggle-icon moon"><FaMoon /></span>
              </button>
              {!isEditing && (
                <button 
                  className="edit-button" 
                  onClick={handleEdit}
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
          </div>
          <p className="profile-name">{profile.fullName}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-field">
          <div className="field-icon">
            <FaUser />
          </div>
          <div className="field-content">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editedProfile.fullName}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.fullName}</p>
            )}
          </div>
        </div>

        <div className="profile-field">
          <div className="field-icon">
            <FaEnvelope />
          </div>
          <div className="field-content">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>
        </div>

        <div className="profile-field">
          <div className="field-icon">
            <FaPhone />
          </div>
          <div className="field-content">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editedProfile.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.phone}</p>
            )}
          </div>
        </div>

        <div className="profile-field">
          <div className="field-icon">
            <FaCalendar />
          </div>
          <div className="field-content">
            <label>Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                value={editedProfile.birthDate}
                onChange={handleChange}
              />
            ) : (
              <p>{new Date(profile.birthDate).toLocaleDateString('en-US')}</p>
            )}
          </div>
        </div>

        <div className="membership-info">
          <h3>Membership Information</h3>
          <div className="membership-dates">
            <div>
              <label>Start Date</label>
              <p>{new Date(profile.membershipStart).toLocaleDateString('en-US')}</p>
            </div>
            <div>
              <label>End Date</label>
              <p>{new Date(profile.membershipEnd).toLocaleDateString('en-US')}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile; 
