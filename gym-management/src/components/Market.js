import React, { useState } from 'react';
import Navbar from './Navbar';
import '../styles/Market.css';
import { motion } from 'framer-motion';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Box,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Add,
  Remove,
  Delete,
  FitnessCenter,
  LocalDrink,
  Checkroom,
  SportsTennis,
} from '@mui/icons-material';

const Market = ({ isDarkMode, setIsDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products', icon: <FitnessCenter /> },
    { id: 'Supplement', name: 'Supplements', icon: <LocalDrink /> },
    { id: 'Equipment', name: 'Equipment', icon: <FitnessCenter /> },
    { id: 'Clothing', name: 'Clothing', icon: <Checkroom /> },
    { id: 'Accessories', name: 'Accessories', icon: <SportsTennis /> },
  ];

  // Örnek ürün verileri
  const products = [
    // Supplements
    {
      id: 1,
      name: 'Whey Protein Powder',
      category: 'Supplement',
      price: 599.99,
      image: '/protein.png',
      description: 'High-quality whey protein powder for muscle recovery - 2000g'
    },
    {
      id: 2,
      name: 'BCAA Amino Acids',
      category: 'Supplement',
      price: 299.99,
      image: '/bcaa.png',
      description: 'Essential amino acids for muscle growth and recovery - 400g'
    },
    {
      id: 3,
      name: 'Pre-Workout Energy',
      category: 'Supplement',
      price: 349.99,
      image: '/preworkout.png',
      description: 'Advanced pre-workout formula for maximum performance - 300g'
    },

    // Equipment
    {
      id: 4,
      name: 'Premium Yoga Mat',
      category: 'Equipment',
      price: 199.99,
      image: '/yoga-mat.png',
      description: 'Non-slip, eco-friendly yoga mat with alignment lines'
    },
    {
      id: 5,
      name: 'Adjustable Dumbbell Set',
      category: 'Equipment',
      price: 1499.99,
      image: '/dumbbells.png',
      description: 'Space-saving adjustable dumbbells 2-24kg each'
    },
    {
      id: 6,
      name: 'Resistance Bands Set',
      category: 'Equipment',
      price: 249.99,
      image: '/bands.png',
      description: 'Set of 5 resistance bands with different strength levels'
    },

    // Clothing
    {
      id: 7,
      name: 'Performance T-Shirt',
      category: 'Clothing',
      price: 149.99,
      image: '/tshirt.png',
      description: 'Moisture-wicking, breathable training t-shirt'
    },
    {
      id: 8,
      name: 'Training Shorts',
      category: 'Clothing',
      price: 179.99,
      image: '/shorts.png',
      description: 'Flexible, quick-dry training shorts with pockets'
    },
    {
      id: 9,
      name: 'Compression Leggings',
      category: 'Clothing',
      price: 229.99,
      image: '/leggings.png',
      description: 'High-waist compression leggings with phone pocket'
    },

    // Accessories
    {
      id: 10,
      name: 'Sports Water Bottle',
      category: 'Accessories',
      price: 89.99,
      image: '/bottle.png',
      description: 'BPA-free sports water bottle with time markings - 1L'
    },
    {
      id: 11,
      name: 'Gym Bag',
      category: 'Accessories',
      price: 259.99,
      image: '/gym-bag.png',
      description: 'Spacious gym bag with wet compartment and shoe pocket'
    },
    {
      id: 12,
      name: 'Lifting Gloves',
      category: 'Accessories',
      price: 129.99,
      image: '/gloves.png',
      description: 'Premium weightlifting gloves with wrist support'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sepet işlemleri
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const deleteFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <Container maxWidth="xl" sx={{ mt: 12, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Sol Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={3}
              sx={{
                p: 2,
                position: 'sticky',
                top: '100px',
                bgcolor: isDarkMode ? '#1a1a1a' : '#fff'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
              <List>
                {categories.map((category) => (
                  <ListItem
                    button
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    sx={{
                      borderRadius: '8px',
                      mb: 1,
                      '&.Mui-selected': {
                        bgcolor: isDarkMode ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.1)',
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255, 71, 87, 0.3)' : 'rgba(255, 71, 87, 0.2)',
                        }
                      },
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: selectedCategory === category.id 
                          ? '#ff4757' 
                          : isDarkMode 
                            ? '#fff' 
                            : 'inherit'
                      }}
                    >
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: selectedCategory === category.id 
                            ? '#ff4757' 
                            : isDarkMode 
                              ? '#fff' 
                              : 'inherit'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => setIsCartOpen(true)}
                sx={{
                  bgcolor: '#ff4757',
                  '&:hover': { bgcolor: '#ff6b81' },
                  py: 1.5,
                  mt: 2
                }}
              >
                <Badge 
                  badgeContent={getTotalItems()} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#fff',
                      color: '#ff4757',
                      transform: 'translate(35px, 2px)',
                    }
                  }}
                >
                  <Typography variant="button">
                    View Cart
                  </Typography>
                </Badge>
              </Button>
            </Paper>
          </Grid>

          {/* Ana İçerik */}
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                mb: 3,
                '& .MuiInputBase-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: isDarkMode ? '#fff' : 'inherit' }} />
                  </InputAdornment>
                ),
                sx: {
                  '&::placeholder': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'inherit',
                  },
                }
              }}
            />

            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        bgcolor: isDarkMode ? '#2c2c2c' : '#fff',
                        minHeight: 450,
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 250,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          bgcolor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            p: 2,
                          }}
                        />
                      </Box>
                      <CardContent 
                        sx={{ 
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          p: 3,
                        }}
                      >
                        <Box>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="h2"
                            sx={{
                              color: isDarkMode ? '#fff' : 'inherit',
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              color: isDarkMode ? '#aaa' : 'text.secondary',
                            }}
                          >
                            {product.description}
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 'auto',
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#ff4757',
                              fontWeight: 600,
                            }}
                          >
                            ₺{product.price.toFixed(2)}
                          </Typography>
                          <Button 
                            variant="contained" 
                            onClick={() => addToCart(product)}
                            sx={{
                              bgcolor: '#ff4757',
                              '&:hover': { bgcolor: '#ff6b81' },
                              textTransform: 'none',
                              px: 2,
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Sepet Drawer */}
        <Drawer
          anchor="right"
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          PaperProps={{
            sx: {
              width: 350,
              bgcolor: 'transparent',
            }
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
              borderRadius: 0,
            }}
          >
            <Box 
              sx={{ 
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? '#ffffff' : '#000000' }}>
                Shopping Cart
              </Typography>
              
              <Box sx={{ 
                flexGrow: 1, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: isDarkMode ? '#2c2c2c' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: isDarkMode ? '#555' : '#888',
                  borderRadius: '4px',
                },
              }}>
                <List>
                  {cart.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={item.name}
                        secondary={`₺${item.price.toFixed(2)} x ${item.quantity}`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: isDarkMode ? '#ffffff' : '#000000'
                          },
                          '& .MuiListItemText-secondary': {
                            color: isDarkMode ? '#aaaaaa' : '#666666'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => removeFromCart(item.id)}
                          sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => addToCart(item)}
                          sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                        >
                          <Add />
                        </IconButton>
                        <IconButton 
                          onClick={() => deleteFromCart(item.id)}
                          sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ 
                mt: 2, 
                pt: 2, 
                borderTop: 1, 
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
              }}>
                <Typography variant="h6" sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  Total: ₺{getTotalPrice().toFixed(2)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: '#ff4757',
                    '&:hover': { bgcolor: '#ff6b81' }
                  }}
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </Paper>
        </Drawer>
      </Container>
    </div>
  );
};

export default Market; 