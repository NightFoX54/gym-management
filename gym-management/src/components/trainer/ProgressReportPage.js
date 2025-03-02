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
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { AccountCircle, TrendingUp, AccessTime, Speed } from '@mui/icons-material';

const ProgressReportPage = ({ isDarkMode }) => {
  const [selectedClient, setSelectedClient] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Weight Progress Chart Config
  const weightChartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: ['#ff4757'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
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
  };

  // Performance Metrics Chart Config
  const performanceChartOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#ff4757', '#2ecc71', '#3498db'],
    markers: { size: 4 },
    fill: { opacity: 0.4 },
    stroke: { width: 2 },
    grid: {
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    theme: { mode: isDarkMode ? 'dark' : 'light' }
  };

  // Goal Progress Chart Config
  const goalChartOptions = {
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
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff4757' }}>
            Progress Reports
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                label="Client"
              >
                <MenuItem value="all">All Clients</MenuItem>
                <MenuItem value="john">John Doe</MenuItem>
                <MenuItem value="jane">Jane Smith</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
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

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Active Clients', value: '24', icon: <AccountCircle />, color: '#ff4757' },
            { title: 'Progress Rate', value: '87%', icon: <TrendingUp />, color: '#2ecc71' },
            { title: 'Session Hours', value: '128', icon: <AccessTime />, color: '#3498db' },
            { title: 'Goal Completion', value: '92%', icon: <Speed />, color: '#f1c40f' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}11)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${stat.color}33`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: stat.color }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Grid */}
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
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
                  Weight Progress
                </Typography>
                <Chart
                  options={weightChartOptions}
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
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
                  Performance Metrics
                </Typography>
                <Chart
                  options={performanceChartOptions}
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
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
                  Goal Progress
                </Typography>
                <Chart
                  options={goalChartOptions}
                  series={[75, 60, 85, 65]}
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
