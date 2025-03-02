import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add as AddIcon,
  WhatsApp,
  Mail,
  Person,
  Phone,
  Email,
  FitnessCenter,
  CalendarToday,
  AccessTime,
  PersonAdd, // Add this import
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ClientsPage = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    startDate: '',
    scheduleTime: ''
  });

  const clients = [
    {
      id: 1,
      name: 'John Doe',
      avatar: null,
      phone: '+90 532 123 4567',
      email: 'john@example.com',
      program: 'Weight Training',
      status: 'Active',
      startDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: null,
      phone: '+90 533 234 5678',
      email: 'jane@example.com',
      program: 'Cardio',
      status: 'On Hold',
      startDate: '2024-02-01',
    },
    // Add more mock data as needed
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event) => {
    setNewClient({
      ...newClient,
      [event.target.name]: event.target.value
    });
  };

  const handleAddClient = () => {
    // Add validation here
    console.log('New client:', newClient);
    setOpenDialog(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      program: '',
      startDate: '',
      scheduleTime: ''
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff4757' }}>
            Clients Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#ff4757',
              '&:hover': { bgcolor: '#ff3747' }
            }}
            onClick={() => setOpenDialog(true)}
          >
            Add New Client
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#ff4757' }}>
                <TableCell sx={{ color: 'white' }}>Client</TableCell>
                <TableCell sx={{ color: 'white' }}>Contact</TableCell>
                <TableCell sx={{ color: 'white' }}>Program</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Start Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow 
                  key={client.id}
                  sx={{ '&:hover': { bgcolor: 'rgba(255, 71, 87, 0.04)' } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={client.avatar}>{client.name[0]}</Avatar>
                      <Typography>{client.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#25D366' }}>
                        <WhatsApp />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#ff4757' }}>
                        <Mail />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{client.program}</TableCell>
                  <TableCell>
                    <Chip
                      label={client.status}
                      color={client.status === 'Active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{client.startDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#ff4757' }}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#666' }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add New Client Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
              backgroundImage: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
            color: 'white',
            borderRadius: '16px 16px 0 0',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAdd />
              Add New Client
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#ff4757',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff4757',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newClient.phone}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Program</InputLabel>
                  <Select
                    name="program"
                    value={newClient.program}
                    onChange={handleInputChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <FitnessCenter sx={{ color: '#ff4757', ml: 2 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Weight Training">Weight Training</MenuItem>
                    <MenuItem value="Cardio">Cardio</MenuItem>
                    <MenuItem value="Yoga">Yoga</MenuItem>
                    <MenuItem value="CrossFit">CrossFit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={newClient.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Time"
                  name="scheduleTime"
                  type="time"
                  value={newClient.scheduleTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime sx={{ color: '#ff4757' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{
                borderColor: '#ff4757',
                color: '#ff4757',
                '&:hover': {
                  borderColor: '#ff3747',
                  backgroundColor: 'rgba(255,71,87,0.1)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              variant="contained"
              sx={{
                bgcolor: '#ff4757',
                '&:hover': {
                  bgcolor: '#ff3747',
                }
              }}
            >
              Add Client
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default ClientsPage;
