import React, { useState, useEffect } from 'react';
import { FaUser, FaBell, FaLock, FaArrowLeft, FaSave, FaSun, FaMoon, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/Settings.css';

const Settings = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Meriç Ütkü',
    email: 'mericutku@gmail.com',
    phone: '+90 539 654 7890'
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // New state variables for password fields and visibility
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleEmailNotificationChange = (e) => {
    setIsLoading(true);
    const newValue = e.target.checked;
    setEmailNotifications(newValue);
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setIsLoading(false);
      // Burada gerçek API çağrısı yapılabilir
      console.log('Email notifications:', newValue);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  return (
    <div className={`settings-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button-settings" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="header-right">
          <button className="action-button" onClick={handleSaveSettings}>
            <FaSave /> Save Changes
          </button>
          <button 
            className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon sun" />
            <div className="toggle-circle"></div>
            <FaMoon className="toggle-icon moon" />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2><FaUser /> Profile Settings</h2>
        <div className="settings-card">
          <div className="setting-item">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="setting-item">
            <label>Phone</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2><FaBell /> Notification Settings</h2>
        <div className="settings-card">
          <div className="setting-item">
            <label>Email Notifications</label>
            <button 
              className={`notification-toggle ${emailNotifications ? 'active' : ''}`}
              onClick={() => handleEmailNotificationChange({ target: { checked: !emailNotifications } })}
              disabled={isLoading}
            >
              <FaBell className="toggle-icon bell" />
              <div className="toggle-circle"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2><FaLock /> Security Settings</h2>
        <div className="settings-card">
          <div className="setting-item">
            <label>Change Password</label>
            <button className="change-password-btn" onClick={handlePasswordChange}>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <div className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input-container">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="toggle-password-visibility" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="toggle-password-visibility" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="toggle-password-visibility" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button className="apply-button">
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;