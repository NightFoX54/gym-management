import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';

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

const TrainerNavbar = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        color: isDarkMode ? '#e0e0e0' : '#2c3e50',
        minWidth: '40px'
      },
      '& .MuiListItemText-root': {
        color: isDarkMode ? '#e0e0e0' : '#2c3e50',
      },
      '& .MuiTypography-root': {
        color: isDarkMode ? '#e0e0e0' : '#2c3e50',
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
            <Avatar
              className="trainer-avatar"
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
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
          </motion.div>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#ffffff' : '#2c3e50',
              }}
            >
              John Trainer
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#666666',
                fontSize: '0.9rem',
                opacity: 0.8
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
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 71, 87, 0.1)',
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
                    transition={{ duration: 0.3 }}
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
};

export default TrainerNavbar;
