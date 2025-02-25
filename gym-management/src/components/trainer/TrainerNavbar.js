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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TrainerNavbar = ({ isDarkMode }) => {
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

  const drawer = (
    <Box sx={{ 
      height: '95vh',
      margin: '20px',
      marginLeft: '40px', // Added margin to move navbar right
      bgcolor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: '25px',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${isDarkMode ? 'rgba(255,71,87,0.2)' : 'rgba(255,71,87,0.15)'}`,
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(255,71,87,0.2), inset 0 2px 15px rgba(255,71,87,0.1)' 
        : '0 8px 32px rgba(255,71,87,0.15), inset 0 2px 15px rgba(255,71,87,0.05)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `linear-gradient(135deg, rgba(255,71,87,${isDarkMode ? '0.15' : '0.1'}) 0%, transparent 100%)`,
        borderRadius: 'inherit',
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
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
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
                background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              John Trainer
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDarkMode ? '#aaa' : '#666',
                fontSize: '0.9rem'
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
          background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,71,87,0.03)',
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(255,71,87,0.3)',
            background: isDarkMode ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.08)',
            transform: 'translateX(8px)',
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
                  background: isActive ? `rgba(255,71,87,${isDarkMode ? '0.15' : '0.1'})` : 'transparent',
                  borderLeft: isActive ? '4px solid #ff4757' : '4px solid transparent',
                  pl: isActive ? '12px' : '16px',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? '#ff4757' : isDarkMode ? '#fff' : '#666',
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
                      color: isActive ? '#ff4757' : 'inherit',
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
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2,
        borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
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
          width: { sm: 360 }, // Increased width for more margin
          flexShrink: { sm: 0 },
          '& .MuiDrawer-paper': {
            width: 360,
            boxSizing: 'border-box',
            border: 'none',
            background: 'transparent',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
          }
        }}
      >
        <Drawer
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
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default TrainerNavbar;
