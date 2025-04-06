import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  Badge,
  Tooltip,
  Rating,
} from '@mui/material';
import {
  Dashboard,
  People,
  EventNote,
  FitnessCenter,
  Assessment,
  Settings,
  Person,
  Menu as MenuIcon,
  Logout,
  DarkMode,
  LightMode,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';
import { logout } from '../../utils/auth';
import axios from 'axios';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: '#f5f5f5',
    color: '#757575',
    width: 240,
    boxSizing: 'border-box',
    borderRight: '1px solid #e0e0e0',
    '& .MuiListItemIcon-root': {
      color: '#757575',
    },
    '& .MuiListItemText-root': {
      color: '#757575',
    },
    '& .MuiListItem-root': {
      '&:hover': {
        backgroundColor: '#eeeeee',
      },
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  margin: '4px 8px',
  borderRadius: '8px',
  backgroundColor: selected ? '#e0e0e0' : 'transparent',
  '&:hover': {
    backgroundColor: '#eeeeee',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#eeeeee',
  color: '#757575',
  borderBottom: '1px solid #e0e0e0',
}));

const TrainerNavbar = React.forwardRef(({ isDarkMode, setIsDarkMode }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trainerData, setTrainerData] = useState({
    fullName: 'Trainer',
    firstName: 'Trainer',
    profilePhoto: null,
  });
  const [navLoading, setNavLoading] = useState(true);
  const [imageKey, setImageKey] = useState(Date.now()); // Add this state for forcing image reload
  const [trainerRating, setTrainerRating] = useState({
    averageRating: 0,
    totalRatings: 0
  });

  useEffect(() => {
    fetchTrainerData();
    fetchTrainerRatings();
  }, []);

  const fetchTrainerData = async () => {
    setNavLoading(true);
    try {
      const trainerId = 3; // This should be retrieved from authentication context
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/profile`);
      
      if (response.status === 200) {
        setTrainerData(response.data);
        setImageKey(Date.now()); // Update the key to force image reload
      }
    } catch (error) {
      console.error('Error fetching trainer data for navbar:', error);
    } finally {
      setNavLoading(false);
    }
  };

  // Add a function to refresh trainer data
  const refreshTrainerData = () => {
    fetchTrainerData();
  };
  
  // Expose the refreshTrainerData function to parent components
  React.useImperativeHandle(ref, () => ({
    refreshTrainerData
  }));

  // Add a function to fetch trainer ratings for the navbar
  const fetchTrainerRatings = async () => {
    try {
      const trainerId = 3; // This should be retrieved from authentication context
      // In a real application, you would call your API endpoint
      // For now, we'll simulate a response with mock data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for demonstration
      const mockRatingData = {
        averageRating: 4.7,
        totalRatings: 58
      };
      
      setTrainerRating(mockRatingData);
    } catch (error) {
      console.error('Error fetching trainer ratings for navbar:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/trainer' },
    { text: 'Clients', icon: <People />, path: '/trainer/clients' },
    { text: 'Schedule', icon: <EventNote />, path: '/trainer/schedule' },
    { text: 'Workouts', icon: <FitnessCenter />, path: '/trainer/workouts' },
    { text: 'Progress Reports', icon: <Assessment />, path: '/trainer/reports' },
    { text: 'Settings', icon: <Settings />, path: '/trainer/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <Box sx={{ 
      height: '95vh',
      margin: '20px',
      marginLeft: '10px',
      bgcolor: isDarkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '25px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      '& .MuiListItemIcon-root': {
        color: isDarkMode ? '#fff' : '#2c3e50',
        minWidth: '40px'
      },
      '& .MuiListItemText-root': {
        '& .MuiTypography-root': {
          color: isDarkMode ? '#fff' : '#2c3e50',
        }
      },
      '& .MuiTypography-root': {
        color: isDarkMode ? '#fff' : '#2c3e50',
      }
    }}>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          p: 3,
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -20,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,71,87,0.5), transparent)',
          }
        }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={
                <Tooltip 
                  title={`${trainerRating.averageRating.toFixed(1)} stars (${trainerRating.totalRatings} reviews)`}
                  arrow
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.5
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: '#ff4757',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: isDarkMode ? '#1a1a2e' : 'white',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => navigate('/trainer')}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {trainerRating.averageRating.toFixed(1)}
                      </Typography>
                    </Box>
                  </motion.div>
                </Tooltip>
              }
            >
              <Avatar
                className="trainer-avatar"
                src={`${trainerData.profilePhoto}?v=${imageKey}`} // Add key as query param to force reload
                sx={{ 
                  width: 80,
                  height: 80,
                  bgcolor: '#ff4757',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '3px solid',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,71,87,0.2)',
                }}
                onClick={() => handleNavigation('/trainer')}
              >
                {navLoading ? (
                  <CircularProgress size={40} sx={{ color: 'white' }} />
                ) : (
                  <>{!trainerData.profilePhoto && trainerData.firstName?.[0]}</>
                )}
              </Avatar>
            </Badge>
          </motion.div>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#ffffff' : '#2c3e50',
              }}
            >
              {navLoading ? 'Loading...' : (trainerData.fullName || 'Trainer')}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 0.5 
            }}>
              <Rating 
                value={trainerRating.averageRating} 
                readOnly 
                size="small"
                precision={0.5}
                icon={<StarIcon sx={{ color: '#ff4757', fontSize: '16px' }} />}
                emptyIcon={<StarBorderIcon sx={{ color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', fontSize: '16px' }} />}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#666666',
                  fontWeight: 500
                }}
              >
                ({trainerRating.totalRatings})
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#666666',
                fontSize: '0.9rem',
                opacity: 0.8,
                mt: 0.5
              }}
            >
              Senior Trainer
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <List sx={{ 
        px: 2,
        '& .MuiListItem-root': {
          mb: 1,
          borderRadius: '12px',
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 71, 87, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 71, 87, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isDarkMode 
              ? 'rgba(255, 71, 87, 0.15)'
              : 'rgba(255, 71, 87, 0.1)',
            '& .MuiListItemText-primary': {
              color: '#ff4757 !important',
            },
            '& .MuiListItemIcon-root': {
              color: '#ff4757 !important',
            }
          }
        }
      }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.text}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  background: isActive 
                    ? 'rgba(255, 71, 87, 0.15)'
                    : 'transparent',
                  borderLeft: isActive 
                    ? '4px solid #ff4757'
                    : '4px solid transparent',
                  pl: isActive ? '12px' : '16px',
                  '& .MuiListItemText-primary': {
                    color: isActive 
                      ? '#ff4757 !important'
                      : isDarkMode ? '#fff' : '#2c3e50',
                    transition: 'color 0.3s ease',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? '#ff4757' : isDarkMode ? '#e0e0e0' : '#2c3e50',
                    opacity: isActive ? 1 : 0.8,
                    minWidth: '40px',
                    transition: 'transform 0.3s ease',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ff4757' : isDarkMode ? '#e0e0e0' : '#2c3e50',
                      fontSize: '0.95rem',
                    }
                  }}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '70%',
                      width: '4px',
                      backgroundColor: '#ff4757',
                      borderRadius: '4px',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                      mass: 2,
                      duration: 0.7
                    }}
                    whileHover={{
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                  />
                )}
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Box sx={{ 
        position: 'absolute', 
        bottom: 70, // Position above logout button
        left: 0, 
        right: 0, 
        p: 2,
      }}>
        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
          <ListItem
            button
            onClick={handleThemeToggle}
            sx={{
              borderRadius: '12px',
              color: isDarkMode ? '#ffffff' : '#2c3e50',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,71,87,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isDarkMode ? '#ffffff' : '#2c3e50',
              minWidth: '40px'
            }}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </ListItemIcon>
            <ListItemText 
              primary={isDarkMode ? "Light Mode" : "Dark Mode"}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 500,
                  color: isDarkMode ? '#ffffff' : '#2c3e50',
                }
              }}
            />
          </ListItem>
        </motion.div>
      </Box>

      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2,
        borderTop: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,71,87,0.05)',
      }}>
        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              color: '#ff4757',
              '&:hover': {
                bgcolor: 'rgba(255,71,87,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#ff4757', minWidth: '40px' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Çıkış Yap"
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 500,
                  color: '#ff4757',
                }
              }}
            />
          </ListItem>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        sx={{ 
          color: '#ff4757',
          mr: 2,
          display: { sm: 'none' },
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 1200,
          bgcolor: isDarkMode ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(26,26,26,1)' : 'rgba(255,255,255,1)',
          }
        }}
        edge="start"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{ 
          width: { sm: 260 }, // Increased from 240px
          flexShrink: { sm: 0 },
          position: 'fixed',
          height: '100%',
          '& .MuiDrawer-paper': {
            width: 260, // Increased from 240px
            boxSizing: 'border-box',
            border: 'none',
            background: 'transparent',
          }
        }}
      >
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </StyledDrawer>
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
    </>
  );
});

export default TrainerNavbar;
