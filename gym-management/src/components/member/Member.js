import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  FaStopwatch,
  FaPlay,
  FaEdit,
  FaUserCog,
  FaIdCard,
  FaEyeSlash,
  FaEye,
  FaComments,
} from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../../styles/Member.css";
import "../../styles/PageTransitions.css";
import "../../styles/Navbar.css";
import { logout } from '../../utils/auth';
import { Grid, Typography } from "@mui/material";
import withChatAndNotifications from './withChatAndNotifications';

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

  // Add new state for workout tracking
  const [workoutStatus, setWorkoutStatus] = useState({
    isCheckedIn: false,
    visitId: null,
    checkInDate: null,
    checkInTime: null
  });

  // Add state for attendance
  const [attendance, setAttendance] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0
  });

  // Replace the mock upcoming sessions with actual sessions data
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  // Add state for password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add new state for password change success modal
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);

  // Add friend request count
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  // Add styles directly in component
  const styles = {
    successModal: {
      backgroundColor: isDarkMode ? '#444444' : 'white',
      borderRadius: '10px',
      padding: '30px',
      width: '400px',
      maxWidth: '90vw',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      position: 'relative',
      color: isDarkMode ? 'var(--text-light)' : 'inherit'
    },
    successIcon: {
      backgroundColor: '#4CAF50',
      color: 'white',
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      margin: '0 auto 20px'
    },
    heading: {
      fontSize: '22px',
      marginBottom: '15px',
      color: '#4CAF50'
    },
    paragraph: {
      marginBottom: '25px',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 25px',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }
  };

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

  // Add a function to fetch workout status
  useEffect(() => {
    const fetchWorkoutStatus = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/club-visits/status/${userId}`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch workout status: ${response.status}`);
        }
        
        const data = await response.json();
        setWorkoutStatus(data);
      } catch (err) {
        console.error("Error fetching workout status:", err);
      }
    };
    
    fetchWorkoutStatus();
  }, [userId, userInfo.token]);

  // Add a function to fetch attendance data
  const fetchAttendanceData = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/club-visits/attendance/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }
      
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    }
  };

  // Call it in useEffect
  useEffect(() => {
    fetchAttendanceData();
  }, [userId, userInfo.token]);

  // Add a function to fetch user sessions
  const fetchUserSessions = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/user-sessions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user sessions: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Combine trainer sessions and group sessions
      const allSessions = [];
      
      // Format trainer sessions
      if (data.trainerSessions && data.trainerSessions.length > 0) {
        data.trainerSessions.forEach(session => {
          allSessions.push({
            id: `trainer-${session.id}`,
            type: `Personal Training: ${session.sessionType}`,
            trainer: session.trainerName,
            date: session.date,
            time: session.time,
            sessionType: 'trainer',
            trainerId: session.trainerId,
            notes: session.notes || ''
          });
        });
      }
      
      // Format group sessions
      if (data.groupSessions && data.groupSessions.length > 0) {
        data.groupSessions.forEach(session => {
          allSessions.push({
            id: `group-${session.id}`,
            type: `Group Class: ${session.title}`,
            trainer: session.trainer,
            date: session.date,
            time: session.time,
            sessionType: 'group',
            trainerId: session.trainerId,
            level: session.level,
            duration: session.duration,
            category: session.category,
            notes: session.notes || ''
          });
        });
      }
      
      // Sort by date and time (most recent first)
      allSessions.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
      
      // Only show upcoming sessions (filter out past sessions)
      const now = new Date();
      const upcomingSessions = allSessions.filter(session => {
        const sessionDate = new Date(`${session.date}T${session.time}`);
        return sessionDate >= now;
      });
      
      // Limit to the next 2 sessions (changed from 5)
      const nextTwoSessions = upcomingSessions.slice(0, 2);
      
      setUpcomingSessions(nextTwoSessions);
    } catch (err) {
      console.error("Error fetching user sessions:", err);
    }
  };
  
  // Call this function when the component mounts
  useEffect(() => {
    fetchUserSessions();
  }, [userId, userInfo.token]);

  // Check for default password on component mount
  useEffect(() => {
    const checkDefaultPassword = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userInfo.email,
            password: 'member123' // Default password
          })
        });

        if (response.ok) {
          // If login with default password succeeds, show password change modal
          setShowPasswordModal(true);
        }
      } catch (err) {
        console.error('Error checking password:', err);
      }
    };

    checkDefaultPassword();
  }, [userInfo.email]);

  // Add function to fetch friend request count
  const fetchFriendRequestCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/friends/requests/${userInfo.id}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (response.ok) {
        const requests = await response.json();
        setFriendRequestCount(requests.length);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  // Add useEffect for friend request count auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchFriendRequestCount();

    // Set up auto-refresh interval
    const refreshInterval = setInterval(fetchFriendRequestCount, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [userInfo.id]);

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

  // Update the handleWorkoutToggle function to refresh attendance data after checkout
  const handleWorkoutToggle = async () => {
    if (!userId) return;
    
    try {
      const endpoint = workoutStatus.isCheckedIn 
        ? 'http://localhost:8080/api/club-visits/check-out' 
        : 'http://localhost:8080/api/club-visits/check-in';
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${workoutStatus.isCheckedIn ? 'check out' : 'check in'}: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update workout status
      if (workoutStatus.isCheckedIn) {
        // User checked out
        setWorkoutStatus({
          isCheckedIn: false,
          visitId: null,
          checkInDate: null,
          checkInTime: null
        });
        
        // After check-out, refresh the attendance data
        await fetchAttendanceData();
      } else {
        // User checked in
        setWorkoutStatus({
          isCheckedIn: true,
          visitId: data.visitId,
          checkInDate: data.checkInDate,
          checkInTime: data.checkInTime
        });
      }
      
    } catch (err) {
      console.error(`Error ${workoutStatus.isCheckedIn ? 'checking out' : 'checking in'}:`, err);
    }
  };

  // Add password change handlers from MyProfile.js
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate password strength for new password
    if (name === 'newPassword') {
      const error = validatePassword(value);
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: error
      }));
    }
    
    // Check if passwords match for confirm password
    if (name === 'confirmPassword') {
      if (value !== passwordData.newPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords don't match"
        }));
      } else {
        setPasswordErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }));
      }
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    
    return ""; // No error
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    setPasswordErrors({});
    
    try {
      const response = await fetch(`http://localhost:8080/api/members/${userId}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (data.message === 'Incorrect old password') {
          setPasswordErrors(prev => ({
            ...prev,
            oldPassword: 'Current password is incorrect'
          }));
        } else {
          setPasswordErrors(prev => ({
            ...prev,
            general: data.message || 'Failed to change password'
          }));
        }
        return;
      }
      
      // Password changed successfully
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success modal
      setShowPasswordSuccessModal(true);
      
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordErrors(prev => ({
        ...prev,
        general: 'Network error. Please try again.'
      }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current password is required";
    }
    
    const newPasswordError = validatePassword(passwordData.newPassword);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add function to close success modal
  const closeSuccessModal = () => {
    setShowPasswordSuccessModal(false);
  };

  return (
    <>
      {/*
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
      */}
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
              className={`dark-mode-toggle-main ${isDarkMode ? "active" : ""}`}
              onClick={toggleDarkMode}
            >
              <i className="fas fa-sun toggle-icon-main" style={{ marginLeft: '2px' }}></i>
              <div className="toggle-circle-main"></div>
              <i className="fas fa-moon toggle-icon-main" style={{ marginRight: '2px' }}></i>
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
                />
              )}
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
          
          {/* Add workout button here, after the profile info section */}
          <button 
            className={`workout-button-member card-animate stagger-3 ${workoutStatus.isCheckedIn ? "active" : ""}`}
            onClick={handleWorkoutToggle}
          >
            {workoutStatus.isCheckedIn ? (
              <>
                <FaStopwatch className="button-icon-member" />
                <span className="button-text">Finish Your Workout</span>
                <span className="check-in-time-member">
                  Started at {workoutStatus.checkInTime && workoutStatus.checkInTime.substring(0, 5)}
                </span>
              </>
            ) : (
              <>
                <FaPlay className="button-icon-member" />
                <span className="button-text">Start Your Workout</span>
              </>
            )}
          </button>

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
            
            {/* Personal Statistics card is temporarily hidden
            <div
              className="dashboard-card-member stagger-5"
              onClick={() => navigate("/member/personal-statistics")}
            >
              <FaChartLine className="card-icon-member" />
              <h3>Personal Statistics</h3>
              <p>View your fitness progress and achievements</p>
            </div>
            */}

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
              onClick={() => navigate("/market")}
            >
              <FaShoppingCart className="card-icon-member" />
              <h3>Market</h3>
              <p>Shop for supplements, equipment, and fitness accessories with your member discount</p>
            </div>

            <div
              className="dashboard-card-member stagger-8"
              onClick={() => navigate("/member/personal-trainers")}
            >
              <FaUserFriends className="card-icon-member" />
              <h3>Personal Trainers</h3>
              <p>Browse and book sessions with our expert trainers</p>
            </div>

            <div
              className="dashboard-card-member stagger-9"
              onClick={() => navigate("/member/workout-programs")}
            >
              <FaUsers className="card-icon-member" />
              <h3>Workout Programs</h3>
              <p>Create and browse personalized workout plans</p>
            </div>

            <div
              className="dashboard-card-member stagger-10"
              onClick={() => navigate("/member/forum")}
            >
              <FaComments className="card-icon-member" />
              <h3>Forum</h3>
              <p>Join discussions, share experiences, and connect with other members</p>
            </div>

            
            <div
              className="dashboard-card-member stagger-10"
              onClick={() => navigate("/member/progress-tracking")}
            >
              <FaChartLine className="card-icon-member" />
              <h3>Progress Tracking</h3>
              <p>Track your fitness progress, set goals, and monitor achievements</p>
            </div>

            <div
              className="dashboard-card-member stagger-11"
              onClick={() => handleCardClickMember('/member/friends')}
              style={{ position: 'relative' }}
            >
              <FaUserFriends className="card-icon-member" />
              {friendRequestCount > 0 && (
                <div className="friend-request-badge">
                  {friendRequestCount}
                </div>
              )}
              <h3>Friends</h3>
              <p>Manage your friends and friend requests</p>
            </div>
          </div>

          <div className="upcoming-sessions-member card-animate stagger-11">
            <h3>Upcoming Sessions</h3>
            <div className="sessions-list-member">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="session-item-member">
                    <div className="session-info-member">
                      <h4>{session.type}</h4>
                      <p>Trainer: {session.trainer}</p>
                      <p>Date: {session.date}</p>
                      <p>Time: {session.time}</p>
                      {session.sessionType === 'group' && (
                        <>
                          <p>Level: {session.level}</p>
                          <p>Duration: {session.duration}</p>
                        </>
                      )}
                      {session.notes && <p>Notes: {session.notes}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-sessions-message">No upcoming sessions scheduled</p>
              )}
            </div>
          </div>

          <div className="attendance-summary-member card-animate stagger-12">
            <h3>Attendance Summary</h3>
            <div className="attendance-stats-member">
              <div className="stat-item-member">
                <span className="stat-value-member">
                  {attendance.total}
                </span>
                <span className="stat-label-member">Total Visits</span>
              </div>
              <div className="stat-item-member">
                <span className="stat-value-member">
                  {attendance.thisMonth}
                </span>
                <span className="stat-label-member">This Month</span>
              </div>
              <div className="stat-item-member">
                <span className="stat-value-member">
                  {attendance.lastMonth}
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

        {/* Add Password Change Modal */}
        {showPasswordModal && (
          <div className="password-modal-overlay">
            <div className="password-modal">
              <h3>Change Your Password</h3>
              <p className="password-change-warning">
                Your password needs to be changed for security reasons.
              </p>
              
              {passwordErrors.general && (
                <div className="password-error-message">{passwordErrors.general}</div>
              )}
              
              <div className="password-field">
                <label htmlFor="oldPassword">Current Password</label>
                <div className="password-input-container">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.oldPassword ? 'error' : ''}
                  />
                  <div className="password-toggle-icon" onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {passwordErrors.oldPassword && <span className="field-error">{passwordErrors.oldPassword}</span>}
              </div>
              
              <div className="password-field">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? 'error' : ''}
                  />
                  <div className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {passwordErrors.newPassword && <span className="field-error">{passwordErrors.newPassword}</span>}
                <div className="password-requirements">
                  <p><strong>Password must include:</strong></p>
                  <ul>
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter (A-Z)</li>
                    <li>At least one number (0-9)</li>
                    <li>At least one special character (!@#$%^&*)</li>
                  </ul>
                </div>
              </div>
              
              <div className="password-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? 'error' : ''}
                  />
                  <div className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {passwordErrors.confirmPassword && <span className="field-error">{passwordErrors.confirmPassword}</span>}
              </div>
              
              <div className="password-modal-buttons">
                <button 
                  className="save-button" 
                  onClick={handlePasswordSubmit}
                  disabled={isChangingPassword || 
                    !passwordData.oldPassword || 
                    !passwordData.newPassword || 
                    !passwordData.confirmPassword ||
                    Object.values(passwordErrors).some(error => error !== '')}
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Success Modal */}
        {showPasswordSuccessModal && (
          <div className="modal-overlay">
            <div style={styles.successModal}>
              <div style={styles.successIcon}>
                <FaCheck />
              </div>
              <h3 style={styles.heading}>Password Changed Successfully!</h3>
              <p style={styles.paragraph}>Your password has been updated. Please use your new password the next time you log in.</p>
              <button 
                style={styles.button} 
                onClick={closeSuccessModal}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withChatAndNotifications(Member);
