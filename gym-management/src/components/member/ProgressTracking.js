import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
  Stack,
  LinearProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent
} from '@mui/lab';
import {
  FaArrowLeft,
  FaSun,
  FaMoon,
  FaChartLine,
  FaDumbbell,
  FaWeight,
  FaRunning
} from 'react-icons/fa';
import '../../styles/ProgressTracking.css';

const ProgressTracking = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [progressData, setProgressData] = useState({
    statisticsHistory: [],
    goal: null
  });
  const [exerciseProgress, setExerciseProgress] = useState({
    goals: [],
    progress: []
  });
  const [loading, setLoading] = useState(true);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [statFormOpen, setStatFormOpen] = useState(false);
  const [exerciseGoalFormOpen, setExerciseGoalFormOpen] = useState(false);
  const [exerciseProgressFormOpen, setExerciseProgressFormOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [newGoal, setNewGoal] = useState({
    targetWeight: '',
    targetBodyFat: '',
    notes: ''
  });

  const [newStat, setNewStat] = useState({
    weight: '',
    bodyFat: '',
    height: '',
    notes: ''
  });

  const [newExerciseGoal, setNewExerciseGoal] = useState({
    exerciseName: '',
    targetWeight: '',
    targetReps: '',
    targetDuration: '',
    targetDistance: '',
    notes: '',
    goalDate: new Date().toISOString().slice(0, 10)
  });

  const [newExerciseProgress, setNewExerciseProgress] = useState({
    exerciseName: '',
    weight: '',
    reps: '',
    duration: '',
    distance: '',
    notes: '',
    entryDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    fetchUserProgress();
    fetchExerciseProgress();
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

  const fetchUserProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/member-progress/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch progress data');
      
      const data = await response.json();
      setProgressData(data || { statisticsHistory: [], goal: null });
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressData({ statisticsHistory: [], goal: null });
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/member-exercise-progress/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch exercise progress');
      
      const data = await response.json();
      setExerciseProgress(data || { goals: [], progress: [] });
    } catch (error) {
      console.error('Error fetching exercise progress:', error);
      setExerciseProgress({ goals: [], progress: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSetGoal = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) return;

      const response = await fetch('http://localhost:8080/api/member-progress/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGoal,
          userId: user.id,
          setBy: user.id,
          goalDate: new Date().toISOString().slice(0, 10)
        })
      });

      if (!response.ok) throw new Error('Failed to set goal');
      
      setGoalFormOpen(false);
      setNewGoal({ targetWeight: '', targetBodyFat: '', notes: '' });
      fetchUserProgress();
    } catch (error) {
      console.error('Error setting goal:', error);
    }
  };

  const handleAddStat = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) return;

      const response = await fetch('http://localhost:8080/api/member-progress/statistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newStat,
          userId: user.id,
          enteredBy: user.id,
          entryDate: new Date().toISOString().slice(0, 10)
        })
      });

      if (!response.ok) throw new Error('Failed to add progress entry');
      
      setStatFormOpen(false);
      setNewStat({ weight: '', bodyFat: '', height: '', notes: '' });
      fetchUserProgress();
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const handleSetExerciseGoal = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) return;

      const response = await fetch('http://localhost:8080/api/member-exercise-progress/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExerciseGoal,
          userId: user.id,
          setBy: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to set exercise goal');
      
      setExerciseGoalFormOpen(false);
      setNewExerciseGoal({
        exerciseName: '',
        targetWeight: '',
        targetReps: '',
        targetDuration: '',
        targetDistance: '',
        notes: '',
        goalDate: new Date().toISOString().slice(0, 10)
      });
      fetchExerciseProgress();
    } catch (error) {
      console.error('Error setting exercise goal:', error);
    }
  };

  const handleAddExerciseProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) return;

      const response = await fetch('http://localhost:8080/api/member-exercise-progress/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExerciseProgress,
          userId: user.id,
          enteredBy: user.id,
          exerciseName: selectedExercise
        })
      });

      if (!response.ok) throw new Error('Failed to add exercise progress');
      
      setExerciseProgressFormOpen(false);
      setNewExerciseProgress({
        exerciseName: '',
        weight: '',
        reps: '',
        duration: '',
        distance: '',
        notes: '',
        entryDate: new Date().toISOString().slice(0, 10)
      });
      fetchExerciseProgress();
    } catch (error) {
      console.error('Error adding exercise progress:', error);
    }
  };

  return (
    <div className={`progress-tracking-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="progress-header">
        <button className="back-button" onClick={() => navigate('/member')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
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

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab 
              icon={<FaWeight />} 
              label="Weight Progress" 
              iconPosition="start"
            />
            <Tab 
              icon={<FaDumbbell />} 
              label="Exercise Progress" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : progressData && !progressData.goal ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="error" gutterBottom>
                  No goal set. Please set a goal to start tracking progress.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setGoalFormOpen(true)}>
                  Set Goal
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '10px', border: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#ff6b81', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaChartLine /> Weight Progress
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mt: 3, mb: 4, height: 20, width: '100%', bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 5, position: 'relative', overflow: 'hidden', border: '1px solid', borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(() => {
                          const stats = progressData.statisticsHistory;
                          if (!stats || stats.length === 0) return 0;
                          const start = stats[0].weight;
                          const current = stats[stats.length - 1].weight;
                          const target = progressData.goal.targetWeight;
                          if (!start || !current || !target || start === target) return 0;
                          return ((start - current) / (start - target)) * 100;
                        })()}
                        sx={{ height: '100%', borderRadius: 5, backgroundColor: 'transparent', '& .MuiLinearProgress-bar': { backgroundColor: '#ff4757' } }}
                      />
                      <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          {(() => {
                            const stats = progressData.statisticsHistory;
                            if (!stats || stats.length === 0) return '0%';
                            const start = stats[0].weight;
                            const current = stats[stats.length - 1].weight;
                            const target = progressData.goal.targetWeight;
                            if (!start || !current || !target || start === target) return '0%';
                            return Math.round(((start - current) / (start - target)) * 100) + '%';
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Starting</Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                          {progressData.statisticsHistory.length > 0 ? progressData.statisticsHistory[0].weight : '-'} kg
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Current</Typography>
                        <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600 }}>
                          {progressData.statisticsHistory.length > 0 ? progressData.statisticsHistory[progressData.statisticsHistory.length - 1].weight : '-'} kg
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Target</Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                          {progressData.goal.targetWeight} kg
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#ff6b81' : '#ff4757', mt: 4, mb: 1, fontWeight: 600 }}>
                      Weight Loss Stats
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">Total Loss</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {(() => {
                            const stats = progressData.statisticsHistory;
                            if (!stats || stats.length === 0) return '-';
                            const start = stats[0].weight;
                            const current = stats[stats.length - 1].weight;
                            return (start - current).toFixed(1) + ' kg';
                          })()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">Still To Go</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {(() => {
                            const stats = progressData.statisticsHistory;
                            if (!stats || stats.length === 0) return '-';
                            const current = stats[stats.length - 1].weight;
                            const target = progressData.goal.targetWeight;
                            return (current - target).toFixed(1) + ' kg';
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => setGoalFormOpen(true)}>
                        Update Goal
                      </Button>
                      <Button variant="contained" color="primary" onClick={() => setStatFormOpen(true)}>
                        Add Progress Entry
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '10px', border: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#ff6b81', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaWeight /> Progress History
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Timeline position="right" sx={{ p: 0 }}>
                      {progressData.statisticsHistory && progressData.statisticsHistory.length > 0 ? progressData.statisticsHistory.map((progress, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent sx={{ flex: 0.2, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                            {progress.entryDate}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot sx={{ bgcolor: '#ff4757', boxShadow: '0 0 0 4px rgba(255,71,87,0.2)' }}>
                              <FaWeight />
                            </TimelineDot>
                            {index < progressData.statisticsHistory.length - 1 && (
                              <TimelineConnector sx={{ bgcolor: isDarkMode ? 'rgba(255,71,87,0.4)' : 'rgba(255,71,87,0.3)', height: 40 }} />
                            )}
                          </TimelineSeparator>
                          <TimelineContent sx={{ py: '10px', px: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                              {progress.weight} kg
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {progress.notes}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      )) : (
                        <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
                          No progress entries yet
                        </Typography>
                      )}
                    </Timeline>
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Goal Form Dialog */}
            <Dialog open={goalFormOpen} onClose={() => setGoalFormOpen(false)}>
              <DialogTitle>Set Progress Goal</DialogTitle>
              <DialogContent>
                <TextField
                  label="Target Weight (kg)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newGoal.targetWeight}
                  onChange={e => setNewGoal({ ...newGoal, targetWeight: e.target.value })}
                />
                <TextField
                  label="Target Body Fat (%)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newGoal.targetBodyFat}
                  onChange={e => setNewGoal({ ...newGoal, targetBodyFat: e.target.value })}
                />
                <TextField
                  label="Notes"
                  fullWidth
                  margin="normal"
                  value={newGoal.notes}
                  onChange={e => setNewGoal({ ...newGoal, notes: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setGoalFormOpen(false)}>Cancel</Button>
                <Button onClick={handleSetGoal} variant="contained" color="primary">Save Goal</Button>
              </DialogActions>
            </Dialog>

            {/* Progress Entry Form Dialog */}
            <Dialog open={statFormOpen} onClose={() => setStatFormOpen(false)}>
              <DialogTitle>Add Progress Entry</DialogTitle>
              <DialogContent>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newStat.weight}
                  onChange={e => setNewStat({ ...newStat, weight: e.target.value })}
                />
                <TextField
                  label="Body Fat (%)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newStat.bodyFat}
                  onChange={e => setNewStat({ ...newStat, bodyFat: e.target.value })}
                />
                <TextField
                  label="Height (cm)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newStat.height}
                  onChange={e => setNewStat({ ...newStat, height: e.target.value })}
                />
                <TextField
                  label="Notes"
                  fullWidth
                  margin="normal"
                  value={newStat.notes}
                  onChange={e => setNewStat({ ...newStat, notes: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setStatFormOpen(false)}>Cancel</Button>
                <Button onClick={handleAddStat} variant="contained" color="primary">Save Progress</Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2.5, 
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      color: '#ff6b81',
                      fontWeight: 600,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FaDumbbell /> Exercise Goals
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {exerciseProgress?.goals?.length > 0 ? (
                      <Stack spacing={2}>
                        {exerciseProgress.goals.map((goal, index) => (
                          <Box key={index} sx={{ 
                            p: 2, 
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#ff4757', mb: 1 }}>
                              {goal.exerciseName}
                            </Typography>
                            <Grid container spacing={1}>
                              {goal.targetWeight && (
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Target Weight: {goal.targetWeight} kg
                                  </Typography>
                                </Grid>
                              )}
                              {goal.targetReps && (
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Target Reps: {goal.targetReps}
                                  </Typography>
                                </Grid>
                              )}
                              {goal.targetDuration && (
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Target Duration: {goal.targetDuration} min
                                  </Typography>
                                </Grid>
                              )}
                              {goal.targetDistance && (
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Target Distance: {goal.targetDistance} km
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                            {goal.notes && (
                              <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                {goal.notes}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
                        No exercise goals set yet
                      </Typography>
                    )}
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      onClick={() => setExerciseGoalFormOpen(true)}
                    >
                      Set New Goal
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2.5, 
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      color: '#ff6b81',
                      fontWeight: 600,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FaRunning /> Exercise Progress
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {exerciseProgress?.goals?.length > 0 ? (
                      <>
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>Select Exercise</InputLabel>
                          <Select
                            value={selectedExercise || ''}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            label="Select Exercise"
                          >
                            {exerciseProgress.goals.map((goal, index) => (
                              <MenuItem key={index} value={goal.exerciseName}>
                                {goal.exerciseName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {selectedExercise && (
                          <>
                            <Timeline position="right" sx={{ p: 0 }}>
                              {exerciseProgress.progress
                                .filter(p => p.exerciseName === selectedExercise)
                                .map((progress, index) => (
                                  <TimelineItem key={index}>
                                    <TimelineOppositeContent sx={{ flex: 0.2, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                      {progress.entryDate}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                      <TimelineDot sx={{ bgcolor: '#ff4757' }}>
                                        <FaDumbbell />
                                      </TimelineDot>
                                      {index < exerciseProgress.progress.length - 1 && (
                                        <TimelineConnector sx={{ bgcolor: 'rgba(255,71,87,0.3)' }} />
                                      )}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                      <Box sx={{ p: 1 }}>
                                        <Grid container spacing={1}>
                                          {progress.weight && (
                                            <Grid item xs={6}>
                                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                Weight: {progress.weight} kg
                                              </Typography>
                                            </Grid>
                                          )}
                                          {progress.reps && (
                                            <Grid item xs={6}>
                                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                Reps: {progress.reps}
                                              </Typography>
                                            </Grid>
                                          )}
                                          {progress.duration && (
                                            <Grid item xs={6}>
                                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                Duration: {progress.duration} min
                                              </Typography>
                                            </Grid>
                                          )}
                                          {progress.distance && (
                                            <Grid item xs={6}>
                                              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                Distance: {progress.distance} km
                                              </Typography>
                                            </Grid>
                                          )}
                                        </Grid>
                                        {progress.notes && (
                                          <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                            {progress.notes}
                                          </Typography>
                                        )}
                                      </Box>
                                    </TimelineContent>
                                  </TimelineItem>
                                ))}
                            </Timeline>

                            <Button 
                              variant="contained" 
                              fullWidth 
                              sx={{ mt: 2 }}
                              onClick={() => setExerciseProgressFormOpen(true)}
                            >
                              Add Progress Entry
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" color="rgba(255,255,255,0.5)" align="center">
                        Set an exercise goal to start tracking progress
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Exercise Goal Form Dialog */}
            <Dialog 
              open={exerciseGoalFormOpen} 
              onClose={() => setExerciseGoalFormOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Set Exercise Goal</DialogTitle>
              <DialogContent>
                <TextField
                  label="Exercise Name"
                  fullWidth
                  margin="normal"
                  value={newExerciseGoal.exerciseName}
                  onChange={e => setNewExerciseGoal({ ...newExerciseGoal, exerciseName: e.target.value })}
                />
                <TextField
                  label="Target Weight (kg)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseGoal.targetWeight}
                  onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetWeight: e.target.value })}
                />
                <TextField
                  label="Target Reps"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseGoal.targetReps}
                  onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetReps: e.target.value })}
                />
                <TextField
                  label="Target Duration (minutes)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseGoal.targetDuration}
                  onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetDuration: e.target.value })}
                />
                <TextField
                  label="Target Distance (km)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseGoal.targetDistance}
                  onChange={e => setNewExerciseGoal({ ...newExerciseGoal, targetDistance: e.target.value })}
                />
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={newExerciseGoal.notes}
                  onChange={e => setNewExerciseGoal({ ...newExerciseGoal, notes: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setExerciseGoalFormOpen(false)}>Cancel</Button>
                <Button onClick={handleSetExerciseGoal} variant="contained" color="primary">Save Goal</Button>
              </DialogActions>
            </Dialog>

            {/* Exercise Progress Form Dialog */}
            <Dialog 
              open={exerciseProgressFormOpen} 
              onClose={() => setExerciseProgressFormOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add Progress Entry</DialogTitle>
              <DialogContent>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseProgress.weight}
                  onChange={e => setNewExerciseProgress({ ...newExerciseProgress, weight: e.target.value })}
                />
                <TextField
                  label="Reps"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseProgress.reps}
                  onChange={e => setNewExerciseProgress({ ...newExerciseProgress, reps: e.target.value })}
                />
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseProgress.duration}
                  onChange={e => setNewExerciseProgress({ ...newExerciseProgress, duration: e.target.value })}
                />
                <TextField
                  label="Distance (km)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newExerciseProgress.distance}
                  onChange={e => setNewExerciseProgress({ ...newExerciseProgress, distance: e.target.value })}
                />
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={newExerciseProgress.notes}
                  onChange={e => setNewExerciseProgress({ ...newExerciseProgress, notes: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setExerciseProgressFormOpen(false)}>Cancel</Button>
                <Button onClick={handleAddExerciseProgress} variant="contained" color="primary">Save Progress</Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </Box>
    </div>
  );
};

export default ProgressTracking; 