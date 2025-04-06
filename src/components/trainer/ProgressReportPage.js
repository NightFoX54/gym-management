import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Chip,
  Avatar,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { AccountCircle, TrendingUp, AccessTime, Speed } from '@mui/icons-material';

const ProgressReportPage = ({ isDarkMode }) => {
  const [selectedClient, setSelectedClient] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Add new chart data
  const chartData = {
    weightProgress: {
      series: [{
        name: 'Weight',
        data: [85, 84, 83.2, 82.5, 81.8, 81, 80.5]
      }],
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
    },
    performance: {
      series: [{
        name: 'Current Week',
        data: [85, 75, 80, 70, 90, 85]
      }],
      categories: ['Strength', 'Cardio', 'Flexibility', 'Endurance', 'Balance', 'Power']
    },
    attendance: {
      series: [{
        name: 'Sessions Attended',
        data: [12, 15, 14, 16, 13, 18, 20]
      }],
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    calories: {
      series: [75],
      labels: ['Daily Goal']
    }
  };

  // Enhanced chart configurations
  const chartConfigs = {
    weightProgress: {
      chart: {
        type: 'area',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        toolbar: { show: false },
        background: 'transparent',
      },
      stroke: {
        curve: 'smooth',
        width: 4
      },
      colors: ['#ff4757'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#ff4757',
              opacity: 0.4
            },
            {
              offset: 100,
              color: '#ff4757',
              opacity: 0.1
            }
          ]
        }
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        strokeDashArray: 5,
      },
      xaxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        labels: {
          style: { colors: isDarkMode ? '#fff' : '#666' }
        }
      },
      yaxis: {
        labels: {
          style: { colors: isDarkMode ? '#fff' : '#666' }
        }
      },
      theme: { mode: isDarkMode ? 'dark' : 'light' }
    },

    attendance: {
      chart: {
        type: 'bar',
        animations: {
          enabled: true,
          speed: 500,
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          distributed: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      colors: ['#ff4757', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6', '#e74c3c', '#1abc9c'],
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}`,
        style: {
          colors: ['#333']
        }
      },
      xaxis: {
        categories: chartData.attendance.categories,
        labels: {
          style: {
            colors: isDarkMode ? new Array(7).fill('#fff') : new Array(7).fill('#666')
          }
        }
      }
    },

    performance: {
      chart: {
        type: 'radar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        },
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: ['#ff4757', '#2ecc71', '#3498db'],
      markers: { size: 4 },
      fill: { opacity: 0.4 },
      stroke: { width: 2 },
      grid: {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
      },
      theme: { mode: isDarkMode ? 'dark' : 'light' }
    },

    nutrition: {
      chart: {
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        },
        toolbar: { show: false },
        background: 'transparent',
      },
    },

    goalProgress: {
      chart: {
        type: 'radialBar',
        background: 'transparent',
      },
      colors: ['#ff4757', '#2ecc71', '#3498db', '#f1c40f'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '50%',
          },
          dataLabels: {
            name: { show: true },
            value: {
              fontSize: '16px',
              formatter: (val) => `${val}%`
            },
          },
        },
      },
      theme: { mode: isDarkMode ? 'dark' : 'light' }
    },

    calories: {
      chart: {
        type: 'radialBar',
        height: 250,
        animations: {
          enabled: true,
          speed: 1000,
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 15,
            size: '70%'
          },
          track: {
            background: isDarkMode ? '#333' : '#e0e0e0',
            strokeWidth: '97%',
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.15,
              blur: 3
            }
          },
          dataLabels: {
            name: {
              show: true,
              color: isDarkMode ? '#fff' : '#333',
              fontSize: '16px'
            },
            value: {
              offsetY: 10,
              color: isDarkMode ? '#fff' : '#333',
              fontSize: '24px',
              show: true
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#ff4757'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      }
    }
  };

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
              Progress Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Track and analyze client performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ 
              minWidth: 150,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiSelect-root': {
                color: isDarkMode ? '#fff' : '#000',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(253, 253, 253, 0.93)' : 'rgba(255, 255, 255, 0.98)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff4757',
              },
            }}>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                label="Client"
              >
                <MenuItem value="all">All Clients</MenuItem>
                <MenuItem value="faruk">Faruk Yılmaz</MenuItem>
                <MenuItem value="jane">Mahmut Mahmutoğlu</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ 
              minWidth: 150,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiSelect-root': {
                color: isDarkMode ? '#fff' : '#000',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(248, 246, 246, 0.98)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff4757',
              },
            }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Stats Cards with improved styling */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Active Clients', value: '24', icon: <AccountCircle />, color: '#ff4757', 
              subtitle: '+3 this week', trend: 'up' },
            { title: 'Progress Rate', value: '87%', icon: <TrendingUp />, color: '#2ecc71',
              subtitle: '5% increase', trend: 'up' },
            { title: 'Session Hours', value: '128', icon: <AccessTime />, color: '#3498db',
              subtitle: '32 this week', trend: 'neutral' },
            { title: 'Goal Completion', value: '92%', icon: <Speed />, color: '#f1c40f',
              subtitle: 'On track', trend: 'up' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div 
                whileHover={{ y: -5 }} 
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  p: 3,
                  background: isDarkMode 
                    ? `linear-gradient(135deg, ${stat.color}22, ${stat.color}11)`
                    : `linear-gradient(135deg, ${stat.color}11, ${stat.color}22)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${stat.color}33`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Add decorative elements */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `linear-gradient(135deg, ${stat.color}11, transparent)`,
                    borderRadius: '50%',
                    transform: 'translate(50%, -50%)'
                  }} />
                  
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: `${stat.color}22`,
                        color: stat.color,
                        mr: 2 
                      }}>
                        {stat.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ color: stat.color }}>
                        {stat.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h4" sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#333',
                      mb: 1
                    }}>
                      {stat.value}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      {stat.subtitle}
                      {stat.trend === 'up' && <TrendingUp sx={{ color: '#2ecc71', fontSize: 16 }} />}
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Grid with enhanced styling */}
        <Grid container spacing={3}>
          {/* Weight Progress Chart */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" sx={{ 
                  color: '#ff4757',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TrendingUp /> Weight Progress
                </Typography>
                <Chart
                  options={chartConfigs.weightProgress}
                  series={[{ name: 'Weight', data: [85, 84, 83.2, 82.5, 81.8, 81] }]}
                  type="area"
                  height={350}
                />
              </Paper>
            </motion.div>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
                  Performance Metrics
                </Typography>
                <Chart
                  options={chartConfigs.performance}
                  series={[
                    {
                      name: 'Current Week',
                      data: [85, 75, 80, 70, 90],
                    }
                  ]}
                  type="radar"
                  height={350}
                />
                </Paper>
            </motion.div>
          </Grid>

          {/* Goal Progress */}
          <Grid item xs={12}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Paper
                sx={{
                  p: 3,
                  background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
                  Goal Progress
                </Typography>
                <Chart
                  options={chartConfigs.goalProgress}
                  series={[75, 60, 85, 65]}
                  type="radialBar"
                  height={350}
                />
              </Paper>
            </motion.div>
          </Grid>

          {/* New Attendance Chart */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Paper sx={{
                p: 3,
                borderRadius: '16px',
                background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#ff4757' }}>
                  Weekly Attendance
                </Typography>
                <Chart
                  options={chartConfigs.attendance}
                  series={chartData.attendance.series}
                  type="bar"
                  height={350}
                />
              </Paper>
            </motion.div>
          </Grid>

          {/* Calories Progress */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Paper sx={{
                p: 3,
                borderRadius: '16px',
                background: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#ff4757' }}>
                  Calories Goal Progress
                </Typography>
                <Chart
                  options={chartConfigs.calories}
                  series={chartData.calories.series}
                  type="radialBar"
                  height={350}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ProgressReportPage;
