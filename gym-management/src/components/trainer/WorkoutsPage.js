import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search,
  Add as AddIcon,
  FitnessCenter,
  Timer,
  LocalFireDepartment as FireIcon,  // Replace LocalFire with LocalFireDepartment
  FilterList,
  Edit,
  Delete,
  Speed,
  AccessTime,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const WorkoutsPage = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);

  const workouts = [
    {
      id: 1,
      name: 'Full Body Strength',
      type: 'strength',
      difficulty: 'intermediate',
      duration: 60,
      calories: 450,
      exercises: 12,
      completion: 85,
    },
    {
      id: 2,
      name: 'HIIT Cardio Blast',
      type: 'cardio',
      difficulty: 'advanced',
      duration: 45,
      calories: 600,
      exercises: 8,
      completion: 92,
    },
    // Add more workouts...
  ];

  const difficultyColors = {
    beginner: '#2ecc71',
    intermediate: '#f1c40f',
    advanced: '#ff4757',
  };

  const filterOptions = [
    { value: 'all', label: 'All Workouts' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
  ];

  const filteredWorkouts = workouts.filter(workout => 
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'all' || workout.type === selectedFilter)
  );

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff4757' }}>
            Workout Programs
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search workouts..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#ff4757' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'rgba(255,71,87,0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,71,87,0.5) !important',
                  },
                }
              }}
            />

            <Tooltip title="Filter Workouts">
              <IconButton 
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ 
                  color: '#ff4757',
                  bgcolor: 'rgba(255,71,87,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,71,87,0.2)' }
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 2,
              minWidth: 180,
            }
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem 
              key={option.value}
              onClick={() => {
                setSelectedFilter(option.value);
                setFilterAnchor(null);
              }}
              selected={selectedFilter === option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Workouts Grid */}
        <Grid container spacing={3}>
          {filteredWorkouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout.id}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  p: 2,
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                  background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,71,87,0.1)',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(255,71,87,0.1)',
                  }
                }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" sx={{ color: '#ff4757', fontWeight: 600 }}>
                      {workout.name}
                    </Typography>
                    <Box>
                      <IconButton size="small" sx={{ color: '#ff4757' }}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#666' }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={workout.difficulty}
                      size="small"
                      sx={{
                        bgcolor: `${difficultyColors[workout.difficulty]}15`,
                        color: difficultyColors[workout.difficulty],
                        mr: 1
                      }}
                    />
                    <Chip
                      label={workout.type}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,71,87,0.1)', color: '#ff4757' }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Timer sx={{ color: '#ff4757', mb: 0.5 }} />
                        <Typography variant="body2">{workout.duration} min</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <FireIcon sx={{ color: '#ff4757', mb: 0.5 }} />  // Use FireIcon instead of LocalFire
                        <Typography variant="body2">{workout.calories} cal</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <FitnessCenter sx={{ color: '#ff4757', mb: 0.5 }} />
                        <Typography variant="body2">{workout.exercises} ex</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Completion Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={workout.completion}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,71,87,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#ff4757',
                        }
                      }}
                    />
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Add Workout FAB */}
        <Tooltip title="Add New Workout">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: '#ff4757',
              '&:hover': {
                bgcolor: '#ff3747',
              }
            }}
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* Add Workout Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
            }
          }}
        >
          {/* ...Dialog content implementation... */}
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default WorkoutsPage;
