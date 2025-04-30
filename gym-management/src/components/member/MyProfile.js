import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSun, FaMoon, FaArrowLeft, FaCamera, FaSpinner, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/MyProfile.css';
import '../../styles/Navbar.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';
import withChatAndNotifications from './withChatAndNotifications';

const MyProfile = ({ isDarkMode, setIsDarkMode }) => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipStart: '',
    membershipEnd: '',
    profileImage: '/uploads/images/default-avatar.jpg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // New state variables for password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Add state for password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add state to store original profile data
  const [originalProfile, setOriginalProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipStart: '',
    membershipEnd: '',
    profileImage: '/uploads/images/default-avatar.jpg'
  });

  // Get user info from localStorage
  const userInfoString = localStorage.getItem('user');
  const userInfo = JSON.parse(userInfoString || '{}');
  const userId = userInfo.id;
  

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/members/${userId}/profile`);

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("User profile data:", data);

        // Update both profile and originalProfile state with real data
        const profileData = {
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phoneNumber || "Not provided",
          membershipStart: data.membershipStartDate || "N/A",
          membershipEnd: data.membershipEndDate || "N/A",
          profileImage: data.profilePhotoPath || "/default-avatar.jpg"
        };
        
        setProfile(profileData);
        setOriginalProfile(profileData); // Store original data
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
        
        // If we can't fetch the profile, use the data from localStorage
        setProfile(prev => ({
          ...prev,
          fullName: userInfo.name || "User",
          email: userInfo.email || "No email available",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditMember = () => {
    setIsEditing(true);
  };

  const handleSaveMember = async () => {
    try {
      setIsLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        setErrorMessage('Please enter a valid email address');
        setIsLoading(false);
        return;
      }
      
      // Check if email or phone is already in use by another user
      // Skip this check if email/phone hasn't changed from the original
      if (profile.email !== originalProfile.email || profile.phone !== originalProfile.phone) {
        const validateResponse = await fetch('http://localhost:8080/api/auth/validate-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: profile.email,
            phoneNumber: profile.phone,
            userId: userId
          })
        });
        
        if (!validateResponse.ok) {
          throw new Error(`Failed to validate credentials: ${validateResponse.status}`);
        }
        
        const validationResult = await validateResponse.json();
        
        // If the email exists and belongs to another user
        if(profile.email !== originalProfile.email){
          console.log("Profile email:", profile.email);
          console.log("Original email:", originalProfile.email);
          if (validationResult.emailExists) {
            setErrorMessage('This email is already in use by another user');
            setIsLoading(false);
            return;
          }
        }
        
        // If the phone number exists and belongs to another user
        if(profile.phone !== originalProfile.phone){
          console.log("Profile phone:", profile.phone);
          console.log("Original phone:", originalProfile.phone);
          if (validationResult.phoneExists) {
            setErrorMessage('This phone number is already in use by another user');
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Extract first and last name from fullName
      // Get the last word as lastName, and all other words as firstName
      const nameParts = profile.fullName.trim().split(/\s+/);
      
      // Capitalize first letter of each word
      const capitalizeWords = (string) => {
        return string.split(/\s+/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      };
      
      let firstName, lastName;
      
      if (nameParts.length === 1) {
        // Only one name provided
        firstName = capitalizeWords(nameParts[0]);
        lastName = ""; // Empty last name
      } else {
        // Multiple names - last word is lastname, rest is firstname
        lastName = capitalizeWords(nameParts.pop()); // Get and remove last element
        firstName = capitalizeWords(nameParts.join(' ')); // Join the rest with spaces
      }
      
      const updateData = {
        firstName: firstName,
        lastName: lastName,
        email: profile.email.trim(),
        phoneNumber: profile.phone
      };
      
      const response = await fetch(`http://localhost:8080/api/members/${userId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }
      
      // Update was successful
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh the profile data
      const updatedResponse = await fetch(`http://localhost:8080/api/members/${userId}/profile`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setProfile({
          fullName: `${updatedData.firstName} ${updatedData.lastName}`,
          email: updatedData.email,
          phone: updatedData.phoneNumber || "Not provided",
          membershipStart: updatedData.membershipStartDate || "N/A",
          membershipEnd: updatedData.membershipEndDate || "N/A",
          profileImage: updatedData.profilePhotoPath || "/default-avatar.jpg"
        });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage(`Failed to update profile: ${err.message}`);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelMember = () => {
    setIsEditing(false);
    
    // Reset form to original values
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/members/${userId}/profile`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            fullName: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phoneNumber || "Not provided",
            membershipStart: data.membershipStartDate || "N/A",
            membershipEnd: data.membershipEndDate || "N/A",
            profileImage: data.profilePhotoPath || "/default-avatar.jpg"
          });
        }
      } catch (err) {
        console.error("Error resetting profile form:", err);
      }
    };
    
    fetchUserProfile();
  };

  const handleChangeMember = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fullName') {
      // Only allow letters, spaces, hyphens, apostrophes and Turkish characters for names
      const nameRegex = /^[A-Za-züöçşğıÜÖÇŞĞİ\s\-']*$/;
      if (!nameRegex.test(value)) {
        return;
      }
    } else if (name === 'email') {
      // Reset any previous error
      setErrorMessage('');
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrorMessage('Please enter a valid email address');
      }
    } else if (name === 'phone') {
      // Allow only numbers, +, spaces and parentheses for phone numbers
      const phoneRegex = /^[0-9+\s()]*$/;
      if (!phoneRegex.test(value)) {
        return;
      }
    }
    
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

  const handleUpload = async () => {
    if (!tempImage) {
      alert('Please select an image first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Create a form data object for the file upload
      // Convert base64 to Blob
      const base64Response = await fetch(tempImage);
      const blob = await base64Response.blob();
      
      // Create file from blob
      const fileName = `profile_${userId}.${blob.type.split('/')[1]}`;
      const imageFile = new File([blob], fileName, { type: blob.type });
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      // Upload the image to the server
      const response = await fetch(`http://localhost:8080/api/upload/profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update the user profile with the new image path
      const updateResponse = await fetch(`http://localhost:8080/api/members/${userId}/update-photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ profilePhotoPath: data.filePath })
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update profile photo: ${updateResponse.status}`);
      }
      
      // Complete the progress
      setUploadProgress(100);
      
      // Update the profile with the new image
      setProfile(prev => ({
        ...prev,
        profileImage: data.filePath
      }));
      
      // Close the modal and clean up
      setSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setShowImageModal(false);
      setTempImage(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      setErrorMessage(`Failed to upload image: ${err.message}`);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setShowImageModal(false);
    setTempImage(null);
    setUploadProgress(0);
  };

  // Handle input change in password form
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

  // Reset password form and errors
  const resetPasswordForm = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
  };

  // Open password modal
  const openPasswordModal = () => {
    resetPasswordForm();
    setShowPasswordModal(true);
  };

  // Close password modal
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    resetPasswordForm();
  };

  // Validate password form
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

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    setSuccessMessage('');
    setErrorMessage('');
    
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
      
      // Password changed successfully
      setSuccessMessage('Password changed successfully!');
      closePasswordModal();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setPasswordErrors({
        general: err.message || "Failed to change password. Please try again."
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Password validation function (similar to Signup.js)
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

  // Toggle password visibility functions
  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Enhanced phone number validation and formatting
  const validatePhoneInput = (value, previousValue) => {
    // If empty, return empty
    if (!value) return '';
    
    // Allow only + at the beginning and numbers
    const regex = /^(\+)?[0-9\s]*$/;
    
    if (!regex.test(value)) {
      return previousValue;
    }
    
    // Format: +XX XXX XXX XX XX or 0XXX XXX XX XX
    let formatted = value.replace(/\s/g, ''); // Remove all spaces
    
    if (formatted.startsWith('+')) {
      // International format
      if (formatted.length > 13) {
        formatted = formatted.slice(0, 13);
      }
      // Add spaces for international format
      if (formatted.length > 3) formatted = formatted.slice(0, 3) + ' ' + formatted.slice(3);
      if (formatted.length > 7) formatted = formatted.slice(0, 7) + ' ' + formatted.slice(7);
      if (formatted.length > 11) formatted = formatted.slice(0, 11) + ' ' + formatted.slice(11);
    } else {
      // Local format
      if (formatted.length > 11) {
        formatted = formatted.slice(0, 11);
      }
      // Add spaces for local format
      if (formatted.length > 4) formatted = formatted.slice(0, 4) + ' ' + formatted.slice(4);
      if (formatted.length > 8) formatted = formatted.slice(0, 8) + ' ' + formatted.slice(8);
    }
    
    return formatted;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={`my-profile-container-myprofile container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-content-myprofile">
        <div className="profile-header-myprofile">
          <button className="back-button-myprofile" onClick={() => navigate('/member')}>
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

        {successMessage && (
          <div className="success-message-myprofile">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message-myprofile">
            {errorMessage}
          </div>
        )}

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
            <div className="profile-action-buttons">
              <button className="edit-button-myprofile" onClick={handleEditMember}>
                <FaEdit />
                <span>Edit Profile</span>
              </button>
              <button className="password-button-myprofile" onClick={openPasswordModal}>
                <FaKey />
                <span>Change Password</span>
              </button>
            </div>
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
                  onChange={(e) => {
                    const newValue = validatePhoneInput(e.target.value, profile.phone);
                    setProfile({...profile, phone: newValue});
                  }}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>
          </div>

          <div className="membership-info-myprofile card-animate stagger-5">
            <h3>Membership Information</h3>
            <div className="membership-dates-myprofile">
              <div>
                <label>Start Date</label>
                <p>{profile.membershipStart ? new Date(profile.membershipStart).toLocaleDateString('en-US') : 'N/A'}</p>
              </div>
              <div>
                <label>End Date</label>
                <p>{profile.membershipEnd ? new Date(profile.membershipEnd).toLocaleDateString('en-US') : 'N/A'}</p>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="password-modal-overlay" onClick={closePasswordModal}>
          <div className="password-modal" onClick={e => e.stopPropagation()}>
            <h3>Change Password</h3>
            
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
                <div className="password-toggle-icon" onClick={toggleOldPasswordVisibility}>
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
                <div className="password-toggle-icon" onClick={toggleNewPasswordVisibility}>
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
                <div className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {passwordErrors.confirmPassword && <span className="field-error">{passwordErrors.confirmPassword}</span>}
            </div>
            
            <div className="password-modal-buttons">
              <button 
                className="cancel-button" 
                onClick={closePasswordModal}
                disabled={isChangingPassword}
              >
                Cancel
              </button>
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

export default withChatAndNotifications(MyProfile); 
