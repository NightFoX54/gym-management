import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSun, FaMoon, FaArrowLeft, FaCamera, FaSpinner } from 'react-icons/fa';
import '../../styles/MyProfile.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';

const MyProfile = ({ isDarkMode, setIsDarkMode }) => {
  const [profile, setProfile] = useState({
    fullName: 'Meriç Ütkü',
    email: 'meriç@example.com',
    phone: '+90 555 123 4567',
    birthDate: '1990-01-01',
    membershipStart: '2024-01-01',
    membershipEnd: '2025-01-01',
    profileImage: '/pp.jpg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const handleEditMember = () => {
    setIsEditing(true);
  };

  const handleSaveMember = () => {
    setProfile(prev => ({
      ...prev,
      fullName: prev.fullName,
      email: prev.email,
      phone: prev.phone,
      birthDate: prev.birthDate,
      membershipStart: prev.membershipStart,
      membershipEnd: prev.membershipEnd
    }));
    setIsEditing(false);
  };

  const handleCancelMember = () => {
    setIsEditing(false);
  };

  const handleChangeMember = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
      setShowImageModal(true);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!tempImage) {
      alert('Please select an image first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulated upload process
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowImageModal(false);
          setProfile(prev => ({
            ...prev,
            profileImage: tempImage
          }));
          setTempImage(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancel = () => {
    setShowImageModal(false);
    setTempImage(null);
    setUploadProgress(0);
  };

  return (
    <div className={`my-profile-container-myprofile container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-content-myprofile">
        <div className="profile-header-myprofile">
          <button className="back-button-myprofile" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <button 
            className={`dark-mode-toggle-myprofile ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <FaSun className="toggle-icon-myprofile sun-myprofile" />
            <div className="toggle-circle-myprofile"></div>
            <FaMoon className="toggle-icon-myprofile moon-myprofile" />
          </button>
        </div>

        <div className="profile-top-myprofile">
          <div className="profile-photo-container-myprofile" onClick={handleImageClick}>
            <img src={profile.profileImage} alt="Profile" className="profile-photo-myprofile" />
            <div className={`profile-photo-overlay-myprofile ${isUploading ? 'uploading' : ''}`}>
              {isUploading ? (
                <>
                  <FaSpinner className="spinner-icon-myprofile" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaCamera className="camera-icon-myprofile" />
                  <span>Change Photo</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h2 className="profile-name-myprofile">{profile.fullName}</h2>
          {!isEditing && (
            <button className="edit-button-myprofile" onClick={handleEditMember}>
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="profile-fields-myprofile">
          <div className="profile-field-myprofile card-animate stagger-1">
            <div className="field-icon-myprofile">
              <FaUser />
            </div>
            <div className="field-content-myprofile">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{profile.fullName}</p>
              )}
            </div>
          </div>

          <div className="profile-field-myprofile card-animate stagger-2">
            <div className="field-icon-myprofile">
              <FaEnvelope />
            </div>
            <div className="field-content-myprofile">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
          </div>

          <div className="profile-field-myprofile card-animate stagger-3">
            <div className="field-icon-myprofile">
              <FaPhone />
            </div>
            <div className="field-content-myprofile">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>
          </div>

          <div className="profile-field-myprofile card-animate stagger-4">
            <div className="field-icon-myprofile">
              <FaCalendar />
            </div>
            <div className="field-content-myprofile">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="birthDate"
                  value={profile.birthDate}
                  onChange={handleChangeMember}
                />
              ) : (
                <p>{new Date(profile.birthDate).toLocaleDateString('en-US')}</p>
              )}
            </div>
          </div>

          <div className="membership-info-myprofile card-animate stagger-5">
            <h3>Membership Information</h3>
            <div className="membership-dates-myprofile">
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
            <div className="profile-actions-myprofile card-animate stagger-5">
              <button className="cancel-button-myprofile" onClick={handleCancelMember}>
                Cancel
              </button>
              <button className="save-button-myprofile" onClick={handleSaveMember}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {showImageModal && (
        <div className="photo-modal-overlay">
          <div className="photo-modal">
            <h3>Preview Profile Photo</h3>
            {tempImage && (
              <div className="preview-container">
                <img src={tempImage} alt="Preview" className="preview-image" />
              </div>
            )}
            <div className="modal-buttons">
              <button 
                className="cancel-button" 
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className="upload-button" 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile; 
