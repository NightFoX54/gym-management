import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Switch,
  Divider,
  IconButton,
  Card,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Camera as CameraIcon,
  Notifications,
  Security,
  Language,
  Palette,
  Schedule,
  Settings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LoadingButton } from '@mui/lab';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SettingsPage = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Enes Trainer',
    email: 'enes@gymflex.com',
    phone: '+90 532 123 4567',
    specialization: 'Weight Training',
    bio: 'Professional trainer with 5 years of experience...',
    notifyEmails: true,
    notifyMessages: true,
    notifySessionReminders: true,
    notifyClientProgress: true,
    notifyMobile: true,
    notifyDesktop: true,
  });
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showAlert('Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!validateFields()) {
      showAlert('Please check your inputs', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('trainerSettings', JSON.stringify(formData));
      showAlert('Profile updated successfully', 'success');
    } catch (error) {
      showAlert('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('notificationSettings', JSON.stringify({
        notifyEmails: formData.notifyEmails,
        notifyMessages: formData.notifyMessages,
        notifyUpdates: formData.notifyUpdates,
      }));
      showAlert('Notification settings updated', 'success');
    } catch (error) {
      showAlert('Failed to update notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    return errors;
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
    setTimeout(() => setAlert({ ...alert, open: false }), 6000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('trainerSettings', JSON.stringify(formData));
      showAlert('Settings updated successfully', 'success');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      showAlert('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        showAlert('Please upload only JPG, JPEG or PNG files', 'error');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('File size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
      showAlert('Photo uploaded successfully', 'success');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const renderProfileAvatar = () => (
    <Box sx={{ 
      textAlign: 'center', 
      mb: 3,
      position: 'relative',
      '&:hover .upload-overlay': {
        opacity: 1,
      }
    }}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/jpg"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <motion.div whileHover={{ scale: 1.05 }}>
        <Avatar
          src={avatarPreview || formData.avatar}
          sx={{
            width: 150,
            height: 150,
            margin: '0 auto',
            border: '4px solid',
            borderColor: isDarkMode ? 'rgba(255,71,87,0.3)' : 'rgba(255,71,87,0.2)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={triggerFileInput}
        >
          {!avatarPreview && !formData.avatar && formData.fullName[0]}
        </Avatar>
        <Box
          className="upload-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            cursor: 'pointer',
          }}
          onClick={triggerFileInput}
        >
          <CameraIcon sx={{ color: 'white', fontSize: 40, mb: 1 }} />
          <Typography variant="caption" sx={{ color: 'white' }}>
            Click to change
          </Typography>
        </Box>
      </motion.div>
      <Typography variant="h6" sx={{ mt: 2 }}>Profile Picture</Typography>
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Allowed formats: JPG, JPEG, PNG
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Max size: 5MB
      </Typography>
    </Box>
  );

  const tabPanels = [
    { icon: <EditIcon />, label: 'Profile' },
    { icon: <Notifications />, label: 'Notifications' },
    { icon: <Schedule />, label: 'Schedule' },
    { icon: <Security />, label: 'Security' },
  ];

  const handleTabPanel = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                {renderProfileAvatar()}
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.fullName}
                      onChange={handleChange('fullName')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={handleChange('email')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Specialization"
                      value={formData.specialization}
                      onChange={handleChange('specialization')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Bio"
                      value={formData.bio}
                      onChange={handleChange('bio')}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ff4757', mb: 2 }}>
                    Email Notifications
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.notifyEmails}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifyEmails: e.target.checked
                            }))}
                            color="primary"
                          />
                        }
                        label="New Client Registrations"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.notifyClientProgress}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifyClientProgress: e.target.checked
                            }))}
                            color="primary"
                          />
                        }
                        label="Client Progress Updates"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: '#ff4757', mb: 2 }}>
                    App Notifications
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.notifyMobile}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifyMobile: e.target.checked
                            }))}
                            color="primary"
                          />
                        }
                        label="Mobile Notifications"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.notifyDesktop}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifyDesktop: e.target.checked
                            }))}
                            color="primary"
                          />
                        }
                        label="Desktop Notifications"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        );

      case 2:
        return (
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Working Hours"
                  value={formData.availability}
                  onChange={handleChange('availability')}
                />
              </Grid>
            </Grid>
          </Card>
        );

      case 3:
        return (
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showCurrentPassword ? "text" : "password"}
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <div 
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                        style={{ cursor: 'pointer', marginRight: '8px' }}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showNewPassword ? "text" : "password"}
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <div 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        style={{ cursor: 'pointer', marginRight: '8px' }}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <div 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        style={{ cursor: 'pointer', marginRight: '8px' }}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
          p: 3,
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: '#fff',
              mb: 1 
            }}>
              Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Manage your account settings and preferences
            </Typography>
          </Box>
        </Box>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              Settings updated successfully!
            </Alert>
          </motion.div>
        )}

        {alert.open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert 
              severity={alert.severity} 
              sx={{ mb: 3 }}
              onClose={() => setAlert({ ...alert, open: false })}
            >
              {alert.message}
            </Alert>
          </motion.div>
        )}

        <Paper sx={{ 
          p: 3, 
          borderRadius: '16px',
          background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.9rem',
                color: isDarkMode ? '#fff' : '#2c3e50',
                '&.Mui-selected': {
                  color: '#ff4757',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ff4757',
              }
            }}
          >
            {tabPanels.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>

          <Box sx={{ p: 3 }}>
            {handleTabPanel(activeTab)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#ff4757',
                color: '#ff4757',
                '&:hover': {
                  borderColor: '#ff3747',
                  backgroundColor: 'rgba(255,71,87,0.1)',
                }
              }}
              onClick={() => {
                if (activeTab === 3) {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              sx={{
                bgcolor: '#ff4757',
                '&:hover': { bgcolor: '#ff3747' }
              }}
              onClick={() => {
                switch (activeTab) {
                  case 0:
                    handleProfileUpdate();
                    break;
                  case 1:
                    handleNotificationUpdate();
                    break;
                  case 3:
                    handlePasswordChange();
                    break;
                  default:
                    handleSave();
                }
              }}
            >
              Save Changes
            </LoadingButton>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default SettingsPage;
