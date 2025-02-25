import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SettingsPage = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Trainer',
    email: 'john@gymflex.com',
    phone: '+90 532 123 4567',
    specialization: 'Weight Training',
    bio: 'Professional trainer with 5 years of experience...',
    notifyEmails: true,
    notifyMessages: true,
    notifyUpdates: false,
    language: 'English',
    timezone: 'UTC+3',
    availability: '09:00 - 18:00',
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabPanels = [
    {
      label: 'Profile',
      icon: <EditIcon />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    margin: '0 auto',
                    border: '4px solid',
                    borderColor: isDarkMode ? 'rgba(255,71,87,0.3)' : 'rgba(255,71,87,0.2)',
                  }}
                >
                  <Typography variant="h3">JT</Typography>
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#ff4757',
                    '&:hover': { bgcolor: '#ff6b81' },
                  }}
                >
                  <CameraIcon />
                </IconButton>
              </motion.div>
              <Typography variant="h6" sx={{ mt: 2 }}>Profile Picture</Typography>
            </Box>
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
      ),
    },
    {
      label: 'Notifications',
      icon: <Notifications />,
      content: (
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyEmails}
                    onChange={(e) => setFormData({ ...formData, notifyEmails: e.target.checked })}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyMessages}
                    onChange={(e) => setFormData({ ...formData, notifyMessages: e.target.checked })}
                  />
                }
                label="Message Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyUpdates}
                    onChange={(e) => setFormData({ ...formData, notifyUpdates: e.target.checked })}
                  />
                }
                label="System Updates"
              />
            </Grid>
          </Grid>
        </Card>
      ),
    },
    {
      label: 'Schedule',
      icon: <Schedule />,
      content: (
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
            {/* Add more schedule settings here */}
          </Grid>
        </Card>
      ),
    },
    {
      label: 'Security',
      icon: <Security />,
      content: (
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
              />
            </Grid>
          </Grid>
        </Card>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#ff4757' }}>
          Settings
        </Typography>

        {showSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings updated successfully!
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
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
              },
            }}
          >
            {tabPanels.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                sx={{
                  '&.Mui-selected': {
                    color: '#ff4757',
                  },
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabPanels[activeTab].content}
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#ff4757',
              '&:hover': { bgcolor: '#ff3747' }
            }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default SettingsPage;
