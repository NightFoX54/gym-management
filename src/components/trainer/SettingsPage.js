import React, { useState, useRef, useEffect } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
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
  AccessTime,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LoadingButton } from '@mui/lab';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const SettingsPage = ({ isDarkMode, onSettingsUpdate }) => {
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
  const [errors, setErrors] = useState({});
  const [workingHours, setWorkingHours] = useState({
    monday: { active: true, start: '09:00', end: '17:00' },
    tuesday: { active: true, start: '09:00', end: '17:00' },
    wednesday: { active: true, start: '09:00', end: '17:00' },
    thursday: { active: true, start: '09:00', end: '17:00' },
    friday: { active: true, start: '09:00', end: '17:00' },
    saturday: { active: false, start: '09:00', end: '13:00' },
    sunday: { active: false, start: '09:00', end: '13:00' },
  });
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    fetchTrainerProfile();
  }, []);

  const fetchTrainerProfile = async () => {
    setProfileLoading(true);
    try {
      const trainerId = 3; // This should come from your auth context
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/profile`);
      
      if (response.status === 200) {
        const data = response.data;
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.profilePhoto || null,
          specialization: data.specialization || '',
          bio: data.bio || '',
          notifyEmails: data.newClientNotifications !== undefined ? data.newClientNotifications : true,
          notifyClientProgress: data.progressUpdateNotifications !== undefined ? data.progressUpdateNotifications : true,
          notifyMobile: data.mobileNotifications !== undefined ? data.mobileNotifications : true,
          notifyDesktop: data.desktopNotifications !== undefined ? data.desktopNotifications : true,
        }));
        showAlert('Profile loaded successfully', 'success');
      } else {
        showAlert('Failed to load profile data', 'error');
      }
    } catch (error) {
      console.error('Error fetching trainer profile:', error);
      showAlert('Could not fetch profile information', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;

    // For name field, prevent typing numbers
    if (field === 'fullName') {
      const lastChar = value.slice(-1);
      if (/[0-9]/.test(lastChar)) return;
    }

    // For phone field, only allow numbers and basic phone characters
    if (field === 'phone') {
      const phoneRegex = /^[0-9+\- ]*$/;
      if (!phoneRegex.test(value)) return;
    }

    // Validate and set errors immediately
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'fullName':
        const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s-]{2,50}$/;
        if (!value) return 'Name is required';
        if (!nameRegex.test(value)) return 'Name should only contain letters';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        return '';

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
        if (value.length > 255) return 'Email must be less than 255 characters';
        return '';

      case 'phone':
        const phoneRegex = /^\+?[1-9][0-9\s-]{8,14}$/;
        if (!value) return 'Phone number is required';
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Invalid phone format (e.g., +90 532 123 4567)';
        }
        if (value.length > 255) return 'Phone number must be less than 255 characters';
        return '';

      case 'specialization':
        if (!value) return 'Specialization is required';
        if (value.length < 3) return 'Specialization must be at least 3 characters';
        if (value.length > 1000) return 'Specialization must be less than 1000 characters';
        return '';

      case 'bio':
        if (!value) return 'Bio is required';
        if (value.length < 10) return 'Bio must be at least 10 characters';
        if (value.length > 2000) return 'Bio must be less than 2000 characters';
        return '';

      default:
        return '';
    }
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

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    const newErrors = {};
    
    // Profile validation
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.specialization?.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.bio?.trim()) {
      newErrors.bio = 'Bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
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
      const trainerId = 3; // This should come from your auth context
      
      // Parse the full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Prepare data to send to backend
      const profileData = {
        firstName: firstName.substring(0, 255), // Ensure max length
        lastName: lastName ? lastName.substring(0, 255) : '',
        email: formData.email.substring(0, 255),
        phoneNumber: formData.phone.substring(0, 255),
        bio: formData.bio.substring(0, 2000),
        specialization: formData.specialization.substring(0, 1000),
        profilePhoto: formData.avatar
      };
      
      // Send update to backend
      const response = await axios.put(`http://localhost:8080/api/trainer/${trainerId}/profile`, profileData);
      
      if (response.status === 200) {
        showAlert('Profile updated successfully', 'success');
        
        // Notify parent component to update the navbar
        if (onSettingsUpdate) {
          onSettingsUpdate(response.data);
        }
      } else {
        showAlert('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Failed to update profile: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      const trainerId = 3; // This should come from your auth context
      
      const notificationSettings = {
        newClientNotifications: formData.notifyEmails,
        progressUpdateNotifications: formData.notifyClientProgress,
        mobileNotifications: formData.notifyMobile,
        desktopNotifications: formData.notifyDesktop
      };
      
      // Update trainer profile with notification settings
      const response = await axios.put(`http://localhost:8080/api/trainer/${trainerId}/profile`, notificationSettings);
      
      if (response.status === 200) {
        showAlert('Notification settings updated successfully', 'success');
      } else {
        showAlert('Failed to update notification settings', 'error');
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      showAlert('Failed to update notifications: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
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

      // Create a preview to show immediately in the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the file to the server
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      setLoading(true);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the file to the server
      const response = await axios.post('http://localhost:8080/api/upload/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.filePath) {
        // Store the path returned by the server
        setFormData(prev => ({
          ...prev,
          avatar: response.data.filePath
        }));
        showAlert('Photo uploaded successfully', 'success');
      } else {
        showAlert('Error uploading photo', 'error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showAlert(`Upload failed: ${error.response?.data?.error || error.message}`, 'error');
    } finally {
      setLoading(false);
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

  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleTabPanel = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {profileLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
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
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-error': {
                              '& fieldset': {
                                borderColor: 'error.main',
                                borderWidth: 2
                              }
                            },
                            '&:hover fieldset': {
                              borderColor: errors.fullName ? 'error.main' : '#ff4757',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.fullName ? 'error.main' : '#ff4757',
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        value={formData.specialization}
                        onChange={handleChange('specialization')}
                        error={!!errors.specialization}
                        helperText={errors.specialization}
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
                        error={!!errors.bio}
                        helperText={errors.bio}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                color: '#ff4757',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}>
                <Schedule /> Working Hours
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set your available working hours for each day of the week. Clients will be able to book sessions only during these hours.
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {Object.entries(workingHours).map(([day, hours], index) => (
                <Grid item xs={12} key={day}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Paper
                      elevation={hours.active ? 2 : 0}
                      sx={{
                        p: 2.5,
                        bgcolor: hours.active 
                          ? (isDarkMode ? 'rgba(255,71,87,0.15)' : 'rgba(255,71,87,0.07)')
                          : (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                        borderRadius: '16px',
                        borderLeft: '4px solid',
                        borderColor: hours.active ? '#ff4757' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: hours.active ? '0 6px 20px rgba(255,71,87,0.15)' : 'none'
                        }
                      }}
                    >
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={hours.active}
                                onChange={(e) => handleWorkingHoursChange(day, 'active', e.target.checked)}
                                color="primary"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#ff4757',
                                    '&:hover': {
                                      bgcolor: 'rgba(255, 71, 87, 0.08)',
                                    },
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    bgcolor: 'rgba(255, 71, 87, 0.5)',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ 
                                fontWeight: hours.active ? 600 : 400,
                                fontSize: '1rem',
                                color: hours.active 
                                  ? '#ff4757' 
                                  : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)')
                              }}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            opacity: hours.active ? 1 : 0.5
                          }}>
                            <Box sx={{ 
                              mr: 1, 
                              color: hours.active ? '#ff4757' : 'text.secondary',
                              display: 'flex'
                            }}>
                              <AccessTime fontSize="small" />
                            </Box>
                            <TextField
                              fullWidth
                              label="Start Time"
                              type="time"
                              value={hours.start}
                              onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                              disabled={!hours.active}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ step: 300 }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  transition: 'all 0.3s ease',
                                  '&:hover fieldset': {
                                    borderColor: hours.active ? '#ff4757' : 'rgba(0, 0, 0, 0.23)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#ff4757',
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            opacity: hours.active ? 1 : 0.5
                          }}>
                            <Box sx={{ 
                              mr: 1, 
                              color: hours.active ? '#ff4757' : 'text.secondary',
                              display: 'flex'
                            }}>
                              <AccessTime fontSize="small" />
                            </Box>
                            <TextField
                              fullWidth
                              label="End Time"
                              type="time"
                              value={hours.end}
                              onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                              disabled={!hours.active}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ step: 300 }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  transition: 'all 0.3s ease',
                                  '&:hover fieldset': {
                                    borderColor: hours.active ? '#ff4757' : 'rgba(0, 0, 0, 0.23)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#ff4757',
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                        
                        {hours.active && (
                          <Grid item xs={12}>
                            <Box sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              pt: 1
                            }}>
                              <Typography variant="caption" sx={{ 
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                fontWeight: 500
                              }}>
                                {`Available ${parseInt(hours.end) - parseInt(hours.start)} hours`}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }}>
              <Typography variant="body2" color="text.secondary">
                Your schedule will be visible to your clients
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={() => {
                  // Reset to default working hours
                  setWorkingHours({
                    monday: { active: true, start: '09:00', end: '17:00' },
                    tuesday: { active: true, start: '09:00', end: '17:00' },
                    wednesday: { active: true, start: '09:00', end: '17:00' },
                    thursday: { active: true, start: '09:00', end: '17:00' },
                    friday: { active: true, start: '09:00', end: '17:00' },
                    saturday: { active: false, start: '09:00', end: '13:00' },
                    sunday: { active: false, start: '09:00', end: '13:00' },
                  });
                }}>
                  Reset
                </Button>
              </Box>
            </Box>
          </motion.div>
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
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
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
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
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
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
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
