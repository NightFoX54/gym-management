import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaUserCircle,
  FaCalendar,
  FaCreditCard,
  FaDumbbell,
  FaCog,
  FaCamera,
  FaSpinner,
  FaTimes,
  FaMoon,
  FaSun,
  FaChartLine,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaCheck,
  FaShoppingCart,
  FaUserFriends,
  FaUsers,
  FaRegCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../../styles/Member.css";
import "../../styles/PageTransitions.css";
import { logout } from '../../utils/auth';

const Member = ({ isDarkMode, setIsDarkMode }) => {
  // Get user info from localStorage
  const userInfoString = localStorage.getItem('user');
  const userInfo = JSON.parse(userInfoString || '{}');
  const userId = userInfo.id;

  const [member, setMember] = useState({
    name: userInfo.name || "Loading...",
    email: "Loading...",
    phone: "Loading...",
    membershipType: "Loading...",
    membershipStatus: "Loading...",
    membershipEndDate: "Loading...",
    profilePhoto: "/default-avatar.jpg",
    attendance: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
    },
    upcomingSessions: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your next training session is tomorrow at 10:00 AM",
      type: "reminder",
      isRead: false,
    },
    {
      id: 2,
      message: "New class schedule available for next week",
      type: "info",
      isRead: false,
    },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/members/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("User profile data:", data);

        // Update member state with real data
        setMember({
          name: data.firstName + " " + data.lastName,
          email: data.email,
          phone: data.phoneNumber || "Not provided",
          membershipType: data.membershipPlan || "Standard",
          membershipStatus: data.membershipStatus || "Active",
          membershipEndDate: data.membershipEndDate || "N/A",
          profilePhoto: data.profilePhotoPath || "/uploads/images/default-avatar.jpg",
          attendance: data.attendance || {
            total: 0,
            thisMonth: 0,
            lastMonth: 0,
          },
          upcomingSessions: data.upcomingSessions || [],
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
        
        // If we can't fetch the profile, use the data from localStorage
        setMember(prev => ({
          ...prev,
          name: userInfo.name || "User",
          email: userInfo.email || "No email available",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogoutMember = () => {
    logout();
  };

  const handleCardClickMember = (route) => {
    navigate(route);
  };

  const toggleNotificationsMember = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsReadMember = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  const handleImageClickMember = () => {
    // Trigger file input click when profile image is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onImageLoad = useCallback((img) => {
    // Store image reference for cropping
    if (img) {
      imgRef.current = img;
    }
  }, []);

  const handleImageChangeMember = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, PNG or GIF)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const img = new Image();
        img.onload = () => {
          // Calculate aspect ratio
          const aspectRatio = img.width / img.height;

          // Set default crop area
          const cropWidth = Math.min(img.width, 400);
          const cropHeight = cropWidth / aspectRatio;

          // Center the crop area
          const cropX = (img.width - cropWidth) / 2;
          const cropY = (img.height - cropHeight) / 2;

          // Create canvas for preview
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas size to crop size
          canvas.width = cropWidth;
          canvas.height = cropHeight;

          // Draw cropped image
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight,
          );

          // Convert to blob and update preview
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const previewUrl = URL.createObjectURL(blob);
                setMember((prev) => ({
                  ...prev,
                  profilePhoto: previewUrl,
                }));
              }
            },
            file.type,
            0.8,
          ); // 0.8 quality for better performance
        };
        img.onerror = () => {
          alert("Error loading image. Please try again.");
        };
        img.src = reader.result;
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Error processing image. Please try again.");
      }
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const generateCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    setCroppedImage(base64Image);
  }, [completedCrop]);

  useEffect(() => {
    generateCrop();
  }, [completedCrop, generateCrop]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [setIsDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleUploadMember = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simüle edilmiş yükleme işlemi
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowImageModal(false);
          setMember((prev) => ({
            ...prev,
            profilePhoto: croppedImage,
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

  const handleRescheduleClick = (session) => {
    setSelectedSession(session);
    setShowRescheduleModal(true);
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedSession(null);
  };

  return (
    <>
      <button
        className="notification-button-member card-animate stagger-8"
        onClick={toggleNotificationsMember}
      >
        <FaBell />
        {unreadNotificationsCount > 0 && (
          <span className="notification-badge-member">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      <div className="notification-section-member">
        {showNotifications && (
          <div className="notification-dropdown-member card-animate stagger-9">
            {notifications.length > 0 ? (
              <div className="notification-list-member">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item-member ${notification.isRead ? "read" : "unread"}`}
                    onClick={() =>
                      markNotificationAsReadMember(notification.id)
                    }
                  >
                    <p>{notification.message}</p>
                    {!notification.isRead && (
                      <span className="unread-dot-member" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-notifications-member">No notifications</p>
            )}
          </div>
        )}
      </div>
      <div
        className={`member-container-member container-animate ${isDarkMode ? "dark-mode" : ""}`}
      >
        <div className="member-content-member">
          <div className="member-header-member card-animate stagger-1">
            <h1>Member Dashboard</h1>
            <button
              className={`dark-mode-toggle-member ${isDarkMode ? "active" : ""}`}
              onClick={toggleDarkMode}
            >
              <FaSun className="toggle-icon-member sun-member" />
              <div className="toggle-circle-member"></div>
              <FaMoon className="toggle-icon-member moon-member" />
            </button>
          </div>

          <div className="member-profile-member card-animate stagger-2">
            <div className="profile-photo-member">
              {isLoading ? (
                <div className="loading-spinner">
                  <FaSpinner className="spinner" />
                </div>
              ) : (
                <img
                  src={member.profilePhoto}
                  alt="Profile"
                  className="profile-photo-member"
                  onClick={handleImageClickMember}
                />
              )}
              <div className="photo-overlay" onClick={handleImageClickMember}>
                <FaCamera />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChangeMember}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
            <div className="profile-info-member">
              <h2>{member.name}</h2>
              <p>
                <strong>Email:</strong> {member.email}
              </p>
              <p>
                <strong>Phone:</strong> {member.phone}
              </p>
            </div>
          </div>

          <div className="dashboard-grid-member">
            <div
              className="dashboard-card-member stagger-1"
              onClick={() => navigate("/member/profile")}
            >
              <FaUserCircle className="card-icon-member" />
              <h3>My Profile</h3>
              <p>View and edit your profile information</p>
            </div>

            <div
              className="dashboard-card-member stagger-2"
              onClick={() => navigate("/member/membership")}
            >
              <FaCreditCard className="card-icon-member" />
              <h3>Membership Status</h3>
              <p>Check your membership details and renewal options</p>
            </div>

            <div
              className="dashboard-card-member stagger-3"
              onClick={() => navigate("/member/training")}
            >
              <FaDumbbell className="card-icon-member" />
              <h3>Training Plan</h3>
              <p>View your personalized training program</p>
            </div>

            <div
              className="dashboard-card-member stagger-4"
              onClick={() => navigate("/member/weekly-schedule")}
            >
              <FaCalendar className="card-icon-member" />
              <h3>Weekly Schedule</h3>
              <p>Check your upcoming training sessions</p>
            </div>

            <div
              className="dashboard-card-member stagger-5"
              onClick={() => navigate("/member/personal-statistics")}
            >
              <FaChartLine className="card-icon-member" />
              <h3>Personal Statistics</h3>
              <p>View your fitness progress and achievements</p>
            </div>

            <div
              className="dashboard-card-member stagger-6"
              onClick={() => navigate("/member/training-programs")}
            >
              <FaDumbbell className="card-icon-member" />
              <h3>Group Classes</h3>
              <p>Choose the suitable program among our already prepared programs by our trainers</p>
            </div>

            <div
              className="dashboard-card-member stagger-7"
              onClick={() => navigate("/member/settings")}
            >
              <FaCog className="card-icon-member" />
              <h3>Settings</h3>
              <p>Manage your account preferences</p>
            </div>

            <div
              className="dashboard-card-member stagger-8"
              onClick={() => navigate("/market")}
            >
              <FaShoppingCart className="card-icon-member" />
              <h3>Market</h3>
              <p>Shop for supplements, equipment, and fitness accessories with your member discount</p>
            </div>

            <div
              className="dashboard-card-member stagger-9"
              onClick={() => navigate("/member/personal-trainers")}
            >
              <FaUserFriends className="card-icon-member" />
              <h3>Personal Trainers</h3>
              <p>Browse and book sessions with our expert trainers</p>
            </div>

            <div
              className="dashboard-card-member stagger-10"
              onClick={() => navigate("/member/workout-programs")}
            >
              <FaUsers className="card-icon-member" />
              <h3>Workout Programs</h3>
              <p>Create and browse personalized workout plans</p>
            </div>
          </div>

          <div className="upcoming-sessions-member card-animate stagger-11">
            <h3>Upcoming Sessions</h3>
            <div className="sessions-list-member">
              {member.upcomingSessions.map((session) => (
                <div key={session.id} className="session-item-member">
                  <div className="session-info-member">
                    <h4>{session.type}</h4>
                    <p>Trainer: {session.trainer}</p>
                    <p>Date: {session.date}</p>
                    <p>Time: {session.time}</p>
                  </div>
                  <button 
                    className="reschedule-button-member"
                    onClick={() => handleRescheduleClick(session)}
                  >
                    Reschedule
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="attendance-summary-member card-animate stagger-12">
            <h3>Attendance Summary</h3>
            <div className="attendance-stats-member">
              <div className="stat-item-member">
                <span className="stat-value-member">
                  {member.attendance.total}
                </span>
                <span className="stat-label-member">Total Visits</span>
              </div>
              <div className="stat-item-member">
                <span className="stat-value-member">
                  {member.attendance.thisMonth}
                </span>
                <span className="stat-label-member">This Month</span>
              </div>
              <div className="stat-item-member">
                <span className="stat-value-member">
                  {member.attendance.lastMonth}
                </span>
                <span className="stat-label-member">Last Month</span>
              </div>
            </div>
          </div>

          <button
            className="logout-button-member card-animate stagger-13"
            onClick={handleLogoutMember}
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>

        {showImageModal && (
          <div className="image-modal-overlay-member">
            <div className="image-modal-member">
              <div className="modal-header-member">
                <h3>Crop Profile Image</h3>
                <button
                  className="close-button-member"
                  onClick={handleCancelMember}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-content-member">
                <div className="crop-container-member">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                  >
                    <img src={tempImage} alt="Crop me" onLoad={onImageLoad} />
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
                <button
                  className="cancel-button-member"
                  onClick={handleCancelMember}
                >
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

        {showRescheduleModal && selectedSession && (
          <div className="reschedule-modal-overlay-member">
            <div className="reschedule-modal-member">
              <button className="close-modal-member" onClick={handleCloseRescheduleModal}>
                <FaTimes />
              </button>
              <div className="reschedule-content-member">
                <FaCheck className="success-icon-member" />
                <h2>Reschedule Request Sent</h2>
                <p>Your reschedule request has been sent to your trainer:</p>
                <div className="session-details-member">
                  <p><strong>Session Type:</strong> {selectedSession.type}</p>
                  <p><strong>Trainer:</strong> {selectedSession.trainer}</p>
                  <p><strong>Current Date:</strong> {selectedSession.date}</p>
                  <p><strong>Current Time:</strong> {selectedSession.time}</p>
                </div>
                <p className="notification-member">Your trainer will contact you shortly to confirm the new schedule.</p>
              </div>
              <button className="close-button-member" onClick={handleCloseRescheduleModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Member;
