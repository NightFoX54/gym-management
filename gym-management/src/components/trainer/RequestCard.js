import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  Button,
  Avatar,
  Badge,
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  PersonAdd,
  Check,
  Close,
  AccessTimeFilled,
  CalendarToday,
  AccessTime,
  Email,
  Phone,
  MonitorWeight,
  FitnessCenter,
  Notifications,
  Event,
  StarBorder,
  Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const RequestCard = ({ 
  request, 
  type, 
  index, 
  isDarkMode, 
  handleAccept, 
  handleDecline,
  actionLoading 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Generate a consistent avatar color based on name
  const getAvatarColor = (name) => {
    // Colors that match the client page theme
    const colors = [
      '#ff4757', '#ff6b81', '#ff7f50', '#ffb6c1', 
      '#ff6b6b', '#ff7979', '#ff8a8a', '#ff9b9b', 
      '#ffac9c', '#ffbd9d', '#ffce9e', '#ffdfba'
    ];
    
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.19, 1.0, 0.22, 1.0] // Expo easing for smoother animation
      }
    },
    hover: {
      y: -15,
      boxShadow: isDarkMode 
        ? "0px 20px 35px -5px rgba(0, 0, 0, 0.6), 0px 0px 20px rgba(255, 107, 129, 0.35)"
        : "0px 20px 35px -5px rgba(0, 0, 0, 0.35), 0px 0px 20px rgba(255, 71, 87, 0.25)",
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0px 10px 15px -5px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.15 } 
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: { duration: 0.3 }
    }
  };

  // Flip animation variants
  const flipVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }
    }
  };

  // Message animations
  const messageVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  // Button animations
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, type: "spring", stiffness: 400 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 } 
    }
  };
  
  // Glowing effect animation
  const glowVariants = {
    initial: { opacity: 0.2 },
    animate: { 
      opacity: 0.7,
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        repeatType: "reverse", 
        ease: "easeInOut" 
      }
    }
  };

  // Card styling based on request type
  let cardStyle = {};
  let labelText = '';
  let icon = null;
  let gradientColors = {};

  // Theme colors based on ClientsPage
  const themeAccent = isDarkMode ? '#ff6b81' : '#ff4757';
  const themeAccentLight = isDarkMode ? 'rgba(255, 107, 129, 0.3)' : 'rgba(255, 71, 87, 0.3)';
  const themeAccentVeryLight = isDarkMode ? 'rgba(255, 107, 129, 0.1)' : 'rgba(255, 71, 87, 0.1)';
  const themeGradient = {
    light: 'linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 71, 87, 0.05) 100%)',
    dark: 'linear-gradient(135deg, rgba(255, 107, 129, 0.3) 0%, rgba(255, 107, 129, 0.15) 100%)'
  };

  switch (type) {
    case 'registration':
      cardStyle = {
        borderLeft: `4px solid ${themeAccent}`,
        border: `1px solid ${themeAccentLight}`
      };
      gradientColors = themeGradient;
      labelText = 'REGISTRATION';
      icon = <PersonAdd sx={{ color: themeAccent, fontSize: '1.1rem' }} />;
      break;
    case 'session':
      cardStyle = {
        borderLeft: `4px solid ${themeAccent}`,
        border: `1px solid ${themeAccentLight}`
      };
      gradientColors = themeGradient;
      labelText = request.isFreeSession ? 'FREE SESSION' : 'SESSION';
      icon = <AccessTimeFilled sx={{ color: themeAccent, fontSize: '1.1rem' }} />;
      break;
    case 'reschedule':
      cardStyle = {
        borderLeft: `4px solid ${themeAccent}`,
        border: `1px solid ${themeAccentLight}`
      };
      gradientColors = themeGradient;
      labelText = 'RESCHEDULE';
      icon = <CalendarToday sx={{ color: themeAccent, fontSize: '1.1rem' }} />;
      break;
    default:
      break;
  }

  // Get the color scheme based on request type - update to theme colors
  let chipColor, btnColor, btnHoverColor, btnBgColor, tagBgColor, accentColor;
  
  // Common settings for all card types to match theme
  chipColor = isDarkMode ? '#ff6b81' : '#ff4757';
  btnColor = isDarkMode ? '#ff6b81' : '#ff4757';
  btnHoverColor = isDarkMode ? '#ff5a70' : '#ff3747';
  btnBgColor = themeAccentVeryLight;
  tagBgColor = isDarkMode ? '#ff6b81' : '#ff4757';
  accentColor = isDarkMode ? '#ff6b81' : '#ff4757';
  
  // Apply special styling for free sessions
  if (type === 'session' && request.isFreeSession) {
    tagBgColor = '#ff9800'; // Keep the orange highlight for free sessions
  }
  
  // Handle message content with character limit
  const messageKey = type === 'reschedule' ? 'reason' : 'message';
  const message = request[messageKey];
  const messageLabel = type === 'reschedule' ? 'Reason:' : 'Message:';

  // Render content based on request type
  const renderContent = () => {
    switch (type) {
      case 'registration':
        return (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  icon={<FitnessCenter sx={{ fontSize: '0.9rem !important' }} />}
                  label={request.program || "Personal Training"}
                  sx={{
                    bgcolor: themeAccentVeryLight,
                    color: chipColor,
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: chipColor,
                    }
                  }}
                />
                <Chip
                  size="small"
                  icon={<Event sx={{ fontSize: '0.9rem !important' }} />}
                  label={formatDate(request.requestDate || request.meetingDate)}
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#fff' : '#000',
                    '& .MuiChip-icon': {
                      color: isDarkMode ? '#fff' : '#000',
                    }
                  }}
                />
                {(request.preferredTime || request.meetingTime) && (
                  <Chip
                    size="small"
                    icon={<AccessTime sx={{ fontSize: '0.9rem !important' }} />}
                    label={request.preferredTime || request.meetingTime}
                    sx={{
                      bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0, 0, 0, 0.05)',
                      color: isDarkMode ? '#fff' : '#000',
                      '& .MuiChip-icon': {
                        color: isDarkMode ? '#fff' : '#000',
                      }
                    }}
                  />
                )}
              </Box>
            </motion.div>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0,0,0,0.03)',
                    p: 1.5,
                    borderRadius: '12px',
                    border: `1px solid ${themeAccentLight}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <Box 
                      component={motion.div}
                      variants={glowVariants}
                      initial="initial"
                      animate="animate"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 50% 50%, ${themeAccent}20, transparent 70%)`,
                        zIndex: 0
                      }}
                    />
                    <Email fontSize="small" sx={{ 
                      mr: 1, 
                      color: chipColor,
                      position: 'relative',
                      zIndex: 1
                    }} />
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {request.email}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={6}>
                {request.phone && (
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -3 }} 
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0,0,0,0.03)',
                      p: 1.5,
                      borderRadius: '12px',
                      height: '100%',
                      border: `1px solid ${themeAccentLight}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component={motion.div}
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at 50% 50%, ${themeAccent}20, transparent 70%)`,
                          zIndex: 0
                        }}
                      />
                      <Phone fontSize="small" sx={{ 
                        mr: 1, 
                        color: chipColor,
                        position: 'relative',
                        zIndex: 1
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: isDarkMode ? '#fff' : '#000',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {request.phone}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Grid>
            </Grid>
          </>
        );
      case 'session':
        return (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                icon={<Event sx={{ fontSize: '0.9rem !important' }} />}
                label={formatDate(request.date)}
                sx={{
                  bgcolor: themeAccentVeryLight,
                  color: chipColor,
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: chipColor,
                  }
                }}
              />
              <Chip
                size="small"
                icon={<AccessTime sx={{ fontSize: '0.9rem !important' }} />}
                label={request.time || 'Not specified'}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDarkMode ? '#fff' : '#000',
                  '& .MuiChip-icon': {
                    color: isDarkMode ? '#fff' : '#000',
                  }
                }}
              />
              {request.isFreeSession && (
                <Badge 
                  badgeContent={<StarBorder sx={{ fontSize: '0.7rem', color: '#fff' }} />} 
                  color="warning"
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%',
                      minWidth: 'auto'
                    }
                  }}
                >
                  <Chip
                    size="small"
                    label="Free Trial"
                    sx={{
                      bgcolor: 'rgba(255, 152, 0, 0.15)',
                      color: isDarkMode ? '#ffb74d' : '#e65100',
                      fontWeight: 600
                    }}
                  />
                </Badge>
              )}
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0,0,0,0.03)',
                    p: 1.5,
                    borderRadius: '12px',
                    border: `1px solid ${themeAccentLight}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box 
                      component={motion.div}
                      variants={glowVariants}
                      initial="initial"
                      animate="animate"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 50% 50%, ${themeAccent}20, transparent 70%)`,
                        zIndex: 0
                      }}
                    />
                    <Email fontSize="small" sx={{ 
                      mr: 1, 
                      color: chipColor,
                      position: 'relative',
                      zIndex: 1
                    }} />
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {request.email}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={6}>
                {request.phone && (
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -3 }} 
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0,0,0,0.03)',
                      p: 1.5,
                      borderRadius: '12px',
                      height: '100%',
                      border: `1px solid ${themeAccentLight}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component={motion.div}
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at 50% 50%, ${themeAccent}20, transparent 70%)`,
                          zIndex: 0
                        }}
                      />
                      <Phone fontSize="small" sx={{ 
                        mr: 1, 
                        color: chipColor,
                        position: 'relative',
                        zIndex: 1
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: isDarkMode ? '#fff' : '#000',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {request.phone}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Grid>
            </Grid>
          </>
        );
      case 'reschedule':
        return (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0,0,0,0.03)',
                    p: 1.5,
                    borderRadius: '12px',
                    border: `1px solid ${themeAccentLight}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box 
                      component={motion.div}
                      variants={glowVariants}
                      initial="initial"
                      animate="animate"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 50% 50%, ${themeAccent}20, transparent 70%)`,
                        zIndex: 0
                      }}
                    />
                    <Email fontSize="small" sx={{ 
                      mr: 1, 
                      color: chipColor,
                      position: 'relative',
                      zIndex: 1
                    }} />
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {request.email}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={6}>
                {request.phone && (
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -3 }} 
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0,0,0,0.03)',
                      p: 1.5,
                      borderRadius: '12px',
                      height: '100%',
                      border: `1px solid ${themeAccentLight}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component={motion.div}
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at 50% 50%, ${themeAccent}20, transparent 70%)`,
                          zIndex: 0
                        }}
                      />
                      <Phone fontSize="small" sx={{ 
                        mr: 1, 
                        color: chipColor,
                        position: 'relative',
                        zIndex: 1
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: isDarkMode ? '#fff' : '#000',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {request.phone}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Grid>
            </Grid>
            
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              mb: 2,
            }}>
              <Box sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '1px',
                height: '40px',
                bgcolor: 'rgba(156, 39, 176, 0.3)',
                zIndex: 0,
                display: { xs: 'none', sm: 'block' }
              }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -1, y: -3 }}
                    style={{ width: '100%' }}
                  >
                    <Box sx={{ 
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: isDarkMode ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.05)',
                      border: isDarkMode ? '1px solid rgba(156, 39, 176, 0.2)' : '1px solid rgba(156, 39, 176, 0.1)',
                      textAlign: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component={motion.div}
                        animate={{ 
                          opacity: [0.1, 0.15, 0.1],
                          scale: [1, 1.05, 1]
                        }} 
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          repeatType: "mirror"
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at 50% 50%, ${accentColor}20, transparent 80%)`,
                          zIndex: 0
                        }}
                      />
                      
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? '#ce93d8' : '#7b1fa2',
                        display: 'block',
                        fontWeight: 500,
                        mb: 0.5,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        Current
                      </Typography>
                      
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        <Typography variant="body2" sx={{ 
                          color: isDarkMode ? '#e1bee7' : '#4a148c',
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          {formatDate(request.currentDate)}
                        </Typography>
                      </motion.div>
                      
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {request.currentTime}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} sm={2}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%' 
                  }}>
                    <motion.div 
                      animate={{ 
                        rotate: [0, 15, 0, -15, 0], 
                        scale: [1, 1.1, 1.05, 1.1, 1] 
                      }} 
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "mirror", 
                        ease: "easeInOut",
                        repeatDelay: 1
                      }}
                    >
                      <Box sx={{
                        width: 36,
                        height: 36,
                        bgcolor: isDarkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        border: isDarkMode ? '2px solid rgba(156, 39, 176, 0.4)' : '2px solid rgba(156, 39, 176, 0.3)',
                        position: 'relative',
                        boxShadow: '0 0 10px rgba(156, 39, 176, 0.3)',
                        '&::before, &::after': {
                          content: '""',
                          position: 'absolute',
                          width: '16px',
                          height: '3px',
                          bgcolor: isDarkMode ? '#e1bee7' : '#7b1fa2',
                        },
                        '&::before': {
                          transform: 'rotate(-45deg)'
                        },
                        '&::after': {
                          transform: 'rotate(45deg)'
                        }
                      }}/>
                    </motion.div>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={5}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 1, y: -3 }}
                    style={{ width: '100%' }}
                  >
                    <Box sx={{ 
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: isDarkMode ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
                      border: isDarkMode ? '1px solid rgba(255, 152, 0, 0.2)' : '1px solid rgba(255, 152, 0, 0.1)',
                      textAlign: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component={motion.div}
                        animate={{ 
                          opacity: [0.1, 0.15, 0.1],
                          scale: [1, 1.05, 1]
                        }} 
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 0.5
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.2), transparent 80%)',
                          zIndex: 0
                        }}
                      />
                      
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? '#ffb74d' : '#e65100',
                        display: 'block',
                        fontWeight: 500,
                        mb: 0.5,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        Requested
                      </Typography>
                      
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <Typography variant="body2" sx={{ 
                          color: isDarkMode ? '#ffe0b2' : '#ff6f00',
                          fontWeight: 600,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          {formatDate(request.newDate)}
                        </Typography>
                      </motion.div>
                      
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {request.newTime}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  // Modified rendering for white background and colored accents
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      exit="exit"
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: '16px',
          background: '#ffffff', // Always white background
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 6px rgba(0, 0, 0, 0.05)',
          ...cardStyle
        }}
      >
        {/* Decorative corner element */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: 40, 
          height: 40,
          background: `conic-gradient(from 0deg at 0% 0%, transparent 75%, ${accentColor}50)`
        }}/>
        
        {/* Type label ribbon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            bgcolor: tagBgColor,
            color: 'white',
            px: 2,
            py: 0.5,
            borderBottomLeftRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            zIndex: 1,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3)`,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            borderTopRightRadius: '15px'
          }}>
            {labelText}
          </Box>
        </motion.div>
        
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          p: 3,
          height: '100%',
          position: 'relative',
          zIndex: 2
        }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: getAvatarColor(request.name),
                  width: 40,
                  height: 40,
                  boxShadow: `0 0 0 3px ${accentColor}30`
                }}
              >
                {request.name ? request.name[0].toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: '#333', // Dark text for white background
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {request.name}
              </Typography>
            </Box>
            
            {/* Decorative icon */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: `${accentColor}15`,
              border: `1px solid ${accentColor}30`
            }}>
              {icon}
            </Box>
          </Box>
          
          <Divider sx={{ 
            mb: 2, 
            mt: 1,
            background: `linear-gradient(90deg, transparent 0%, ${accentColor}50 50%, transparent 100%)`
          }} />
          
          {/* Content is type specific so we keep using the renderContent function */}
          {renderContent()}
          
          {message && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              <Box sx={{ 
                mb: 2,
                p: 1.8, 
                borderRadius: '12px',
                bgcolor: 'rgba(0,0,0,0.02)', // Very light gray background for message
                borderLeft: '3px solid',
                borderColor: accentColor,
                boxShadow: `inset 0 1px 3px ${accentColor}15`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box 
                  component={motion.div}
                  animate={{ 
                    opacity: [0.03, 0.06, 0.03],
                  }} 
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, ${accentColor}10, transparent 70%)`,
                    zIndex: 0
                  }}
                />
                <Typography variant="caption" sx={{ 
                  color: chipColor,
                  fontWeight: 500,
                  display: 'block',
                  mb: 0.5,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {messageLabel}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#000', // Black text for message
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  position: 'relative',
                  zIndex: 1
                }}>
                  "{message}"
                </Typography>
              </Box>
            </motion.div>
          )}
          
          <Box sx={{ mt: 'auto', display: 'flex', gap: 1.5, pt: 1 }}>
            <motion.div 
              variants={buttonVariants} 
              whileHover="hover" 
              whileTap="tap" 
              style={{ width: '100%' }}
              initial="initial"
            >
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                startIcon={<Check />}
                onClick={() => handleAccept(request.id, request)}
                loading={actionLoading}
                sx={{
                  bgcolor: btnColor,
                  color: '#fff',
                  '&:hover': { bgcolor: btnHoverColor },
                  fontWeight: 600,
                  borderRadius: '10px',
                  boxShadow: `0 4px 12px ${btnColor}50`,
                  textTransform: 'none',
                  height: 48
                }}
              >
                Accept
              </LoadingButton>
            </motion.div>
            
            <motion.div 
              variants={buttonVariants} 
              whileHover="hover" 
              whileTap="tap" 
              style={{ width: '100%' }}
              initial="initial"
            >
              <Button 
                fullWidth
                size="large"
                variant="outlined"
                startIcon={<Close />}
                onClick={() => handleDecline(request.id)}
                disabled={actionLoading}
                sx={{
                  borderRadius: '10px',
                  borderColor: 'rgba(244, 67, 54, 0.5)',
                  color: '#f44336',
                  fontWeight: 600,
                  textTransform: 'none',
                  height: 48,
                  '&:hover': {
                    borderColor: '#d32f2f',
                    bgcolor: 'rgba(244, 67, 54, 0.04)'
                  }
                }}
              >
                Decline
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RequestCard;
