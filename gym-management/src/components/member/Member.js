import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCalendar, FaCreditCard, FaDumbbell, FaCamera, FaSpinner, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../styles/Member.css';

const Member = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    membershipType: 'Premium',
    joinDate: '2024-01-01',
    profileImage: 'https://via.placeholder.com/150'
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Your next training session is tomorrow at 10:00 AM',
      type: 'reminder',
      isRead: false
    },
    {
      id: 2,
      message: 'New class schedule available for next week',
      type: 'info',
      isRead: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    // TODO: Add proper logout logic here
    navigate('/login');
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowImageModal(true);
        setCrop({
          unit: '%',
          x: 25,
          y: 25,
          width: 50,
          height: 50,
          aspect: 1
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setCroppedImage(base64Image);
  }, [completedCrop]);

  useEffect(() => {
    generateCrop();
  }, [completedCrop, generateCrop]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simüle edilmiş yükleme işlemi
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowImageModal(false);
          setUserData(prev => ({
            ...prev,
            profileImage: croppedImage
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancel = () => {
    setShowImageModal(false);
    setTempImage(null);
    setCroppedImage(null);
    setUploadProgress(0);
  };

  return (
    <div className={`member-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="member-header">
        <div className="profile-section">
          <div className="profile-image-container" onClick={handleImageClick}>
            <img src={userData.profileImage} alt="Profile" className="profile-image" />
            <div className={`profile-image-overlay ${isUploading ? 'uploading' : ''}`}>
              {isUploading ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaCamera className="camera-icon" />
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
          <div className="profile-info">
            <h1>Welcome, {userData.name}</h1>
            <p className="membership-status">{userData.membershipType} Member</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon sun" />
            <div className="toggle-circle"></div>
            <FaMoon className="toggle-icon moon" />
          </button>
          <div className="notification-section">
            <button className="notification-button" onClick={toggleNotifications}>
              <FaBell />
              {unreadNotificationsCount > 0 && (
                <span className="notification-badge">{unreadNotificationsCount}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <h3>Notifications</h3>
                {notifications.length > 0 ? (
                  <div className="notification-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <p>{notification.message}</p>
                        {!notification.isRead && <span className="unread-dot" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <div className="member-content">
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => handleCardClick('/member/profile')}>
            <div className="card-icon"><FaUserCircle /></div>
            <h3>My Profile</h3>
            <p>View and edit your personal information</p>
            <div className="card-details">
              <span>Email: {userData.email}</span>
              <span>Member since: {new Date(userData.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="dashboard-card" onClick={() => handleCardClick('/member/schedule')}>
            <div className="card-icon"><FaCalendar /></div>
            <h3>Class Schedule</h3>
            <p>Browse and book fitness classes</p>
            <div className="card-details">
              <span>Upcoming classes: 2</span>
              <span>Available slots: 15</span>
            </div>
          </div>
          
          <div className="dashboard-card" onClick={() => handleCardClick('/member/membership')}>
            <div className="card-icon"><FaCreditCard /></div>
            <h3>Membership Status</h3>
            <p>Check your membership details</p>
            <div className="card-details">
              <span>Status: Active</span>
              <span>Type: {userData.membershipType}</span>
            </div>
          </div>
          
          <div className="dashboard-card" onClick={() => handleCardClick('/member/training')}>
            <div className="card-icon"><FaDumbbell /></div>
            <h3>Training Programs</h3>
            <p>View and track your workout plans</p>
            <div className="card-details">
              <div className="training-program-info">
                <div className="program-title">
                  <FaDumbbell className="program-icon" />
                  Advanced Strength Training
                </div>
                <div className="session-date">
                  <FaCalendar className="date-icon" />
                  <div className="date-info">
                    <div className="date-day">
                      Next Session
                      <span className="time-badge">10:00 AM</span>
                    </div>
                    <div className="date-full">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageModal && (
        <div className="image-modal-overlay">
          <div className="image-modal">
            <div className="modal-header">
              <h3>Edit Profile Photo</h3>
              <button className="close-button" onClick={handleCancel}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="crop-container">
                {tempImage && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={tempImage}
                      onLoad={(e) => onImageLoad(e.currentTarget)}
                    />
                  </ReactCrop>
                )}
              </div>
              {croppedImage && (
                <div className="preview-container">
                  <h4>Preview</h4>
                  <img src={croppedImage} alt="Preview" className="preview-image" />
                </div>
              )}
              {isUploading && (
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button 
                className="save-button" 
                onClick={handleUpload}
                disabled={isUploading || !croppedImage}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Member; 
