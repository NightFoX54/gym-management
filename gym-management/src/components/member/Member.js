import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCalendar, FaCreditCard, FaDumbbell, FaCamera, FaSpinner, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../styles/Member.css';
import '../../styles/PageTransitions.css';

const Member = ({ isDarkMode, setIsDarkMode }) => {
  const [member, setMember] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    membershipType: 'Premium',
    membershipStatus: 'Active',
    membershipEndDate: '2024-12-31',
    profilePhoto: 'https://via.placeholder.com/150',
    attendance: {
      total: 45,
      thisMonth: 12,
      lastMonth: 15
    },
    upcomingSessions: [
      {
        id: 1,
        type: 'Personal Training',
        trainer: 'Mike Johnson',
        date: '2024-03-15',
        time: '10:00 AM'
      },
      {
        id: 2,
        type: 'Group Class',
        trainer: 'Sarah Wilson',
        date: '2024-03-16',
        time: '2:00 PM'
      }
    ]
  });

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

  const handleLogoutMember = () => {
    // TODO: Add proper logout logic here
    navigate('/login');
  };

  const handleCardClickMember = (route) => {
    navigate(route);
  };

  const toggleNotificationsMember = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsReadMember = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleImageClickMember = () => {
    fileInputRef.current.click();
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleImageChangeMember = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
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

  const handleUploadMember = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simüle edilmiş yükleme işlemi
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowImageModal(false);
          setMember(prev => ({
            ...prev,
            profilePhoto: croppedImage
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCancelMember = () => {
    setShowImageModal(false);
    setTempImage(null);
    setCroppedImage(null);
    setUploadProgress(0);
  };

  return (
    <div className={`member-container-member ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="member-content-member">
        <div className="member-header-member">
          <h1>Member Dashboard</h1>
          <button 
            className={`dark-mode-toggle-member ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon-member sun-member" />
            <div className="toggle-circle-member"></div>
            <FaMoon className="toggle-icon-member moon-member" />
          </button>
        </div>

        <div className="member-profile-member">
          <div className="profile-photo-member">
            <img src={member.profilePhoto} alt="Profile" />
          </div>
          <div className="profile-info-member">
            <h2>{member.name}</h2>
            <p>{member.email}</p>
            <p>{member.phone}</p>
          </div>
        </div>

        <div className="dashboard-grid-member">
          <div className="dashboard-card-member card-animate stagger-1" onClick={() => handleCardClickMember('/member/profile')}>
            <FaUserCircle className="card-icon-member" />
            <h3>My Profile</h3>
            <p>View and edit your profile information</p>
          </div>
          
          <div className="dashboard-card-member card-animate stagger-2" onClick={() => handleCardClickMember('/member/membership')}>
            <FaCreditCard className="card-icon-member" />
            <h3>Membership Status</h3>
            <p>Check your membership details and renewal options</p>
          </div>
          
          <div className="dashboard-card-member card-animate stagger-3" onClick={() => handleCardClickMember('/member/training')}>
            <FaDumbbell className="card-icon-member" />
            <h3>Training Plan</h3>
            <p>View your personalized training program</p>
          </div>
          
          <div className="dashboard-card-member card-animate stagger-4" onClick={() => handleCardClickMember('/member/weekly-schedule')}>
            <FaCalendar className="card-icon-member" />
            <h3>Weekly Schedule</h3>
            <p>Check your upcoming training sessions</p>
          </div>
        </div>

        <div className="notification-section-member">
          <button className="notification-button-member" onClick={toggleNotificationsMember}>
            <FaBell />
            {unreadNotificationsCount > 0 && (
              <span className="notification-badge-member">{unreadNotificationsCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="notification-dropdown-member">
              <h3>Notifications</h3>
              {notifications.length > 0 ? (
                <div className="notification-list-member">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item-member ${notification.isRead ? 'read' : 'unread'}`}
                      onClick={() => markNotificationAsReadMember(notification.id)}
                    >
                      <p>{notification.message}</p>
                      {!notification.isRead && <span className="unread-dot-member" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-notifications-member">No notifications</p>
              )}
            </div>
          )}
        </div>

        <button className="logout-button-member" onClick={handleLogoutMember}>
          Logout
        </button>
      </div>

      {showImageModal && (
        <div className="image-modal-overlay-member">
          <div className="image-modal-member">
            <div className="modal-header-member">
              <h3>Crop Profile Image</h3>
              <button className="close-button-member" onClick={handleCancelMember}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content-member">
              <div className="crop-container-member">
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    src={tempImage}
                    alt="Crop me"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
              <div className="preview-container-member">
                <h4>Preview</h4>
                {croppedImage && (
                  <img
                    src={croppedImage}
                    alt="Preview"
                    className="preview-image-member"
                  />
                )}
              </div>
              <div className="progress-bar-container-member">
                <div 
                  className="progress-bar-member"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="progress-text-member">{uploadProgress}%</p>
            </div>
            <div className="modal-footer-member">
              <button className="cancel-button-member" onClick={handleCancelMember}>
                Cancel
              </button>
              <button 
                className="save-button-member" 
                onClick={handleUploadMember}
                disabled={isUploading}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Member; 
