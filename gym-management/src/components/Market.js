import React, { useState, useEffect } from 'react';
import '../styles/Market.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
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
import { FaArrowLeft, FaTag, FaMoon, FaSun } from 'react-icons/fa';

const Market = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define default categories in case API fails
  const defaultCategories = [
    { id: 'all', name: 'All Products', icon: <FitnessCenter /> },
    { id: 'Supplement', name: 'Supplements', icon: <LocalDrink /> },
    { id: 'Equipment', name: 'Equipment', icon: <FitnessCenter /> },
    { id: 'Clothing', name: 'Clothing', icon: <Checkroom /> },
    { id: 'Accessories', name: 'Accessories', icon: <SportsTennis /> },
  ];

  // Fetch products and categories from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('http://localhost:8080/api/market/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8080/api/market/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        // Map categories to include icons
        const mappedCategories = [
          { id: 'all', name: 'All Products', icon: <FitnessCenter /> },
          ...categoriesData.map(category => {
            let icon = <FitnessCenter />;
            if (category.name === 'Supplement') icon = <LocalDrink />;
            else if (category.name === 'Clothing') icon = <Checkroom />;
            else if (category.name === 'Accessories') icon = <SportsTennis />;
            
            return {
              id: category.id,
              name: category.name,
              icon: icon
            };
          })
        ];
        
        setProducts(productsData);
        setCategories(mappedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category && product.category.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Cart operations
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

  const toggleDarkModeMember = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div 
      className={`container-animate ${isDarkMode ? 'dark-mode' : ''}`}
      style={{ 
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#121212' : '#ffffff'
      }}
    >
      <div className="member-page-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/member')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Fitness Market</h1>
        </div>

        <div className="member-discount-badge">
          <FaTag />
          <span>Member Discount: 15%</span>
        </div>

        <button 
          className={`dark-mode-toggle-trainingplan ${isDarkMode ? 'active' : ''}`} 
          onClick={toggleDarkModeMember}
        >
          <FaSun className="toggle-icon-trainingplan sun-trainingplan" />
          <div className="toggle-circle-trainingplan"></div>
          <FaMoon className="toggle-icon-trainingplan moon-trainingplan" />
        </button>
      </div>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
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
                    selected={selectedCategory === category.id.toString()}
                    onClick={() => setSelectedCategory(category.id.toString())}
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
                        color: selectedCategory === category.id.toString() 
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
                          color: selectedCategory === category.id.toString() 
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

          {/* Main Content */}
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

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress sx={{ color: '#ff4757' }} />
              </Box>
            ) : error ? (
              <Box sx={{ textAlign: 'center', my: 5, color: isDarkMode ? '#fff' : 'inherit' }}>
                <Typography variant="h6" color="error">{error}</Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2, bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff6b81' } }}
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card 
                          elevation={3}
                          sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
                            '&:hover': {
                              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            }
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={product.imagePath || '/placeholder.png'}
                            alt={product.productName}
                            sx={{ 
                              objectFit: 'contain',
                              p: 2,
                              bgcolor: isDarkMode ? '#2c2c2c' : '#f8f9fa'
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography 
                              gutterBottom 
                              variant="h6" 
                              component="div"
                              sx={{ 
                                color: isDarkMode ? '#fff' : 'inherit',
                                fontWeight: 'bold'
                              }}
                            >
                              {product.productName}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                mb: 2,
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                                minHeight: '40px'
                              }}
                            >
                              {product.description}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: '#ff4757',
                                fontWeight: 'bold',
                                mb: 2
                              }}
                            >
                              ₺{product.price.toFixed(2)}
                            </Typography>
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<Add />}
                              onClick={() => addToCart(product)}
                              sx={{
                                bgcolor: '#ff4757',
                                '&:hover': { bgcolor: '#ff6b81' },
                              }}
                            >
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      my: 5, 
                      color: isDarkMode ? '#fff' : 'inherit',
                      bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
                      p: 4,
                      borderRadius: 2,
                      minHeight: '50vh',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Typography variant="h6">No products found</Typography>
                      <Button 
                        variant="contained" 
                        sx={{ mt: 2, bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff6b81' } }}
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Shopping Cart Drawer */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
            color: isDarkMode ? '#fff' : 'inherit',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Your Cart</Typography>
            <IconButton onClick={() => setIsCartOpen(false)} sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
              <FaArrowLeft />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 5 }}>
              <ShoppingCart sx={{ fontSize: 60, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
              <Typography variant="h6">Your cart is empty</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2, bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff6b81' } }}
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ mb: 2 }}>
                {cart.map((item) => (
                  <ListItem 
                    key={item.id}
                    sx={{ 
                      mb: 2, 
                      bgcolor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Box 
                        component="img"
                        src={item.imagePath || '/placeholder.png'}
                        alt={item.productName}
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          objectFit: 'contain',
                          mr: 2,
                          bgcolor: '#fff',
                          borderRadius: 1,
                          p: 1
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 'bold' }}>
                          ₺{item.price.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => removeFromCart(item.id)}
                            sx={{ 
                              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              color: isDarkMode ? '#fff' : 'inherit',
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => addToCart(item)}
                            sx={{ 
                              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              color: isDarkMode ? '#fff' : 'inherit',
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => deleteFromCart(item.id)}
                            sx={{ 
                              ml: 'auto',
                              color: '#ff4757',
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>₺{getTotalPrice().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Discount (15%):</Typography>
                  <Typography color="#ff4757">-₺{(getTotalPrice() * 0.15).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₺{(getTotalPrice() * 0.85).toFixed(2)}</Typography>
                </Box>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#ff4757',
                  '&:hover': { bgcolor: '#ff6b81' },
                  py: 1.5,
                }}
              >
                Checkout
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default Market;