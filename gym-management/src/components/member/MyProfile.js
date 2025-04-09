import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSun, FaMoon, FaArrowLeft, FaCamera, FaSpinner, FaKey } from 'react-icons/fa';
import '../../styles/MyProfile.css';
import '../../styles/PageTransitions.css';
import { useNavigate } from 'react-router-dom';

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
  
  // New state variables for password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

        // Update profile state with real data
        setProfile({
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phoneNumber || "Not provided",
          membershipStart: data.membershipStartDate || "N/A",
          membershipEnd: data.membershipEndDate || "N/A",
          profileImage: data.profilePhotoPath || "/default-avatar.jpg"
        });
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
      
      // Extract first and last name from fullName
      const nameParts = profile.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const updateData = {
        firstName: firstName,
        lastName: lastName,
        email: profile.email,
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

  // Handle input change in password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
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
            className={`dark-mode-toggle-myprofile ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkModeMember}
          >
            <FaSun className="toggle-icon-myprofile sun-myprofile" />
            <div className="toggle-circle-myprofile"></div>
            <FaMoon className="toggle-icon-myprofile moon-myprofile" />
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
                  onChange={handleChangeMember}
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
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              {passwordErrors.general && (
                <div className="password-error-message">
                  {passwordErrors.general}
                </div>
              )}
              
              <div className="password-field">
                <label>Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.oldPassword ? 'error' : ''}
                />
                {passwordErrors.oldPassword && (
                  <span className="field-error">{passwordErrors.oldPassword}</span>
                )}
              </div>
              
              <div className="password-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.newPassword ? 'error' : ''}
                />
                {passwordErrors.newPassword && (
                  <span className="field-error">{passwordErrors.newPassword}</span>
                )}
              </div>
              
              <div className="password-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.confirmPassword ? 'error' : ''}
                />
                {passwordErrors.confirmPassword && (
                  <span className="field-error">{passwordErrors.confirmPassword}</span>
                )}
              </div>
              
              <div className="password-modal-buttons">
                <button
                  type="button"
                  className="cancel-button-myprofile"
                  onClick={closePasswordModal}
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button-myprofile"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <FaSpinner className="spinner" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
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

export default MyProfile; 
