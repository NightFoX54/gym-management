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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { FaArrowLeft, FaTag, FaMoon, FaSun, FaCreditCard, FaLock } from 'react-icons/fa';
import withChatAndNotifications from './member/withChatAndNotifications';

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [memberDiscount, setMemberDiscount] = useState(0);
  const [discountPlanName, setDiscountPlanName] = useState('');
  const [loadingDiscount, setLoadingDiscount] = useState(true);
  const [discountError, setDiscountError] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [isPreviousOrdersOpen, setIsPreviousOrdersOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentErrors, setPaymentErrors] = useState({});

  // Get user info from localStorage with better debugging
  const userInfoString = localStorage.getItem('user');
  console.log('Raw user info from localStorage:', userInfoString);
  
  const userInfo = JSON.parse(userInfoString || '{}');
  console.log('Parsed user info:', userInfo);
  
  const userId = userInfo.id;
  console.log('User ID extracted:', userId);

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

  // Fetch member's discount rate
  useEffect(() => {
    const fetchMemberDiscount = async () => {
      if (!userId) {
        setLoadingDiscount(false);
        return;
      }

      try {
        console.log(`Fetching discount for user ID: ${userId}`);
        const response = await fetch(`http://localhost:8080/api/members/${userId}/discount`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });
        
        console.log('Discount API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Discount API error:', errorText);
          throw new Error(`Failed to fetch discount: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Member discount data:', data);
        
        if (data && typeof data.marketDiscount === 'number') {
          setMemberDiscount(data.marketDiscount);
          setDiscountPlanName(data.planName || '');
        } else {
          console.error('Invalid discount data format:', data);
          setDiscountError('Invalid discount data received');
        }
      } catch (err) {
        console.error('Error fetching member discount:', err);
        setDiscountError(err.message);
        
        setMemberDiscount(0);
      } finally {
        setLoadingDiscount(false);
      }
    };

    fetchMemberDiscount();
  }, [userId, userInfo.token]);

  // Add this useEffect near your other useEffect hooks
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category && product.category.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (product) => {
    // Check if product is out of stock
    if (product.stock <= 0) {
      return; // Prevent adding out-of-stock items
    }
    
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

  // Calculate the discounted price
  const getDiscountedPrice = () => {
    const subtotal = getTotalPrice();
    const discountAmount = subtotal * (memberDiscount / 100);
    return subtotal - discountAmount;
  };

  const toggleDarkModeMember = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Format card number with spaces after every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Handle input changes with appropriate validation
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    
    if (paymentErrors.cardNumber && formattedValue.replace(/\s/g, '').length === 16) {
      setPaymentErrors({...paymentErrors, cardNumber: ''});
    }
  };
  
  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setCardExpiry(formattedValue);
    
    if (paymentErrors.cardExpiry && formattedValue.length === 5) {
      setPaymentErrors({...paymentErrors, cardExpiry: ''});
    }
  };
  
  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCardCVC(value);
    
    if (paymentErrors.cardCVC && value.length >= 3) {
      setPaymentErrors({...paymentErrors, cardCVC: ''});
    }
  };
  
  const handleCardNameChange = (e) => {
    setCardName(e.target.value);
    
    if (paymentErrors.cardName && e.target.value.trim().length > 0) {
      setPaymentErrors({...paymentErrors, cardName: ''});
    }
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const errors = {};
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!cardExpiry || cardExpiry.length < 5) {
      errors.cardExpiry = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = cardExpiry.split('/');
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.cardExpiry = 'Month must be between 1-12';
      }
      
      const currentYear = new Date().getFullYear() % 100;
      if (parseInt(year) < currentYear) {
        errors.cardExpiry = 'Card has expired';
      }
    }
    
    if (!cardCVC || cardCVC.length < 3) {
      errors.cardCVC = 'Please enter a valid CVC (3-4 digits)';
    }
    
    if (!cardName.trim()) {
      errors.cardName = 'Please enter the name on card';
    }
    
    return errors;
  };
  
  // Submit payment and complete checkout
  const handlePaymentSubmit = () => {
    const errors = validatePaymentForm();
    
    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }
    
    // Close payment dialog and process order
    setIsPaymentDialogOpen(false);
    
    // Reset payment form
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
    setCardName('');
    setPaymentErrors({});
    
    // Process the actual checkout
    processCheckout();
  };

  // Modified checkout flow
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Check if user is logged in
    if (!userId) {
      setCheckoutError('You must be logged in to checkout. Please log in and try again.');
      return;
    }
    
    // Open payment dialog instead of directly processing
    setIsPaymentDialogOpen(true);
  };
  
  // Process actual checkout (after payment)
  const processCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    
    try {
      // Apply member's discount rate
      const discountedTotal = getDiscountedPrice();
      
      console.log('Checkout payload:', {
        userId: userId,
        cartItems: cart,
        totalPrice: discountedTotal
      });
      
      const response = await fetch('http://localhost:8080/api/market/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          cartItems: cart,
          totalPrice: discountedTotal
        }),
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Checkout failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        throw new Error(errorMessage);
      }
      
      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        // Only parse if there's actual content
        const data = text ? JSON.parse(text) : { success: true };
        
        if (!data.success) {
          throw new Error(data.message || 'Checkout failed');
        }
      }
      
      // Clear cart and show success message
      setCart([]);
      setCheckoutSuccess(true);
      
      // Close success message after 3 seconds
      setTimeout(() => {
        setCheckoutSuccess(false);
        setIsCartOpen(false);
      }, 3000);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Failed to process your order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Fetch previous orders
  const fetchPreviousOrders = async () => {
    if (!userId) {
      setOrdersError('You must be logged in to view your orders');
      return;
    }

    try {
      setLoadingOrders(true);
      setOrdersError(null);
      
      console.log(`Fetching previous orders for user ID: ${userId}`);
      const response = await fetch(`http://localhost:8080/api/market/purchases/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch previous orders');
      }
      
      const data = await response.json();
      console.log('Previous orders data:', data);
      
      setPreviousOrders(data);
    } catch (err) {
      console.error('Error fetching previous orders:', err);
      setOrdersError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Open previous orders drawer and fetch data
  const handleOpenPreviousOrders = () => {
    setIsPreviousOrdersOpen(true);
    fetchPreviousOrders();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
          <button className="back-button-trainingplan" onClick={() => navigate('/member')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Fitness Market</h1>
        </div>

        <div className="member-discount-badge">
          {loadingDiscount ? (
            <>
              <FaTag />
              <span>Loading discount...</span>
            </>
          ) : discountError ? (
            <>
              <FaTag />
              <span>No discount available</span>
            </>
          ) : (
            <>
              <FaTag />
              <span>Member Discount: {memberDiscount}% ({discountPlanName})</span>
            </>
          )}
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
                  mb: 2
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

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FaTag />}
                onClick={handleOpenPreviousOrders}
                sx={{
                  borderColor: '#ff4757',
                  color: '#ff4757',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 71, 87, 0.1)',
                    borderColor: '#ff6b81' 
                  },
                  py: 1.5
                }}
              >
                <Typography variant="button">
                  Previous Orders
                </Typography>
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
                            position: 'relative', // Added for sold out overlay
                            '&:hover': {
                              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            }
                          }}
                        >
                          {/* Sold Out Overlay */}
                          {product.stock <= 0 && (
                            <Box 
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  bgcolor: 'rgba(0,0,0,0.5)',
                                  borderRadius: '4px'
                                }
                              }}
                            >
                              <Typography 
                                variant="h5" 
                                sx={{ 
                                  color: 'white', 
                                  fontWeight: 'bold',
                                  px: 3,
                                  py: 1,
                                  bgcolor: '#ff4757',
                                  borderRadius: '4px',
                                  transform: 'rotate(-15deg)',
                                  zIndex: 2
                                }}
                              >
                                SOLD OUT
                              </Typography>
                            </Box>
                          )}
                          
                          <CardMedia
                            component="img"
                            height="200"
                            image={product.imagePath || '/placeholder.png'}
                            alt={product.productName}
                            sx={{ 
                              objectFit: 'contain',
                              p: 2,
                              bgcolor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                              opacity: product.stock <= 0 ? 0.6 : 1 // Dim the image if out of stock
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  color: '#ff4757',
                                  fontWeight: 'bold',
                                }}
                              >
                                ₺{product.price.toFixed(2)}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: product.stock <= 0 
                                    ? '#ff4757' 
                                    : product.stock < 5 
                                      ? '#ffa502' 
                                      : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                  fontWeight: product.stock < 5 ? 'bold' : 'normal'
                                }}
                              >
                                {product.stock <= 0 
                                  ? 'Out of stock' 
                                  : product.stock < 5 
                                    ? `Only ${product.stock} left` 
                                    : `Stock: ${product.stock}`
                                }
                              </Typography>
                            </Box>
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<Add />}
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              sx={{
                                bgcolor: product.stock <= 0 ? 'rgba(255,71,87,0.5)' : '#ff4757',
                                '&:hover': { 
                                  bgcolor: product.stock <= 0 ? 'rgba(255,71,87,0.5)' : '#ff6b81' 
                                },
                                '&.Mui-disabled': {
                                  color: 'white',
                                  opacity: 0.7
                                }
                              }}
                            >
                              {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
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
            bgcolor: isDarkMode ? '#1a1a1a !important' : '#fff !important',
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
          
          {checkoutSuccess && (
            <Box sx={{ 
              textAlign: 'center', 
              my: 2, 
              p: 2, 
              bgcolor: 'rgba(46, 204, 113, 0.2)', 
              borderRadius: 2,
              color: isDarkMode ? '#fff' : 'inherit'
            }}>
              <Typography variant="subtitle1">
                Order placed successfully! Thank you for your purchase.
              </Typography>
            </Box>
          )}
          
          {checkoutError && (
            <Box sx={{ 
              textAlign: 'center', 
              my: 2, 
              p: 2, 
              bgcolor: 'rgba(231, 76, 60, 0.2)', 
              borderRadius: 2,
              color: isDarkMode ? '#fff' : 'inherit'
            }}>
              <Typography variant="subtitle1" color="error">
                {checkoutError}
              </Typography>
            </Box>
          )}
          
          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 5 }}>
              <ShoppingCart sx={{ fontSize: 60, color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', mb: 2 }} />
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
                  <Typography>Discount ({memberDiscount}%):</Typography>
                  <Typography color="#ff4757">-₺{(getTotalPrice() * (memberDiscount / 100)).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₺{(getTotalPrice() * (1 - memberDiscount / 100)).toFixed(2)}</Typography>
                </Box>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                disabled={checkoutLoading}
                onClick={handleCheckout}
                sx={{
                  bgcolor: '#ff4757',
                  '&:hover': { bgcolor: '#ff6b81' },
                  py: 1.5,
                }}
              >
                {checkoutLoading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  'Checkout'
                )}
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Previous Orders Drawer */}
      <Drawer
        anchor="right"
        open={isPreviousOrdersOpen}
        onClose={() => setIsPreviousOrdersOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 450 },
            bgcolor: isDarkMode ? '#1a1a1a !important' : '#fff !important',
            color: isDarkMode ? '#fff' : 'inherit',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Your Previous Orders</Typography>
            <IconButton onClick={() => setIsPreviousOrdersOpen(false)} sx={{ color: isDarkMode ? '#fff' : 'inherit' }}>
              <FaArrowLeft />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {loadingOrders ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#ff4757' }} />
            </Box>
          ) : ordersError ? (
            <Box sx={{ 
              textAlign: 'center', 
              my: 2, 
              p: 2, 
              bgcolor: 'rgba(231, 76, 60, 0.2)', 
              borderRadius: 2,
              color: isDarkMode ? '#fff' : 'inherit'
            }}>
              <Typography variant="subtitle1" color="error">
                {ordersError}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2, bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff6b81' } }}
                onClick={fetchPreviousOrders}
              >
                Try Again
              </Button>
            </Box>
          ) : previousOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 5 }}>
              <FaTag style={{ fontSize: 60, color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', marginBottom: 16 }} />
              <Typography variant="h6">You haven't made any purchases yet</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2, bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff6b81' } }}
                onClick={() => setIsPreviousOrdersOpen(false)}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <List>
              {previousOrders.map((order) => (
                <Paper 
                  key={order.id}
                  elevation={2}
                  sx={{ 
                    mb: 3,
                    overflow: 'hidden',
                    bgcolor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#ff4757', 
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center' 
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Order #{order.orderNo || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(order.saleDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Items:</Typography>
                      <Typography variant="body2">{order.totalItems}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₺{order.totalPrice.toFixed(2)}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Products:
                    </Typography>
                    
                    <List sx={{ p: 0 }}>
                      {order.productSales && order.productSales.map((sale) => (
                        <ListItem key={sale.id} sx={{ px: 0, py: 1 }}>
                          <ListItemText
                            primary={sale.product.productName}
                            secondary={`Quantity: ${sale.quantity}`}
                          />
                          <Typography variant="body2">
                            ₺{(sale.product.price * sale.quantity).toFixed(2)}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

      {/* Payment Dialog */}
      <Dialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: 400 },
            maxWidth: '450px',
            bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
            color: isDarkMode ? '#fff' : 'inherit',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}>
          <FaCreditCard style={{ marginRight: '8px' }} />
          Payment Details
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="subtitle1">Total Amount:</Typography>
            <Typography variant="h6" sx={{ color: '#ff4757', fontWeight: 'bold' }}>
              ₺{(getTotalPrice() * (1 - memberDiscount / 100)).toFixed(2)}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            label="Name on Card"
            value={cardName}
            onChange={handleCardNameChange}
            margin="dense"
            error={!!paymentErrors.cardName}
            helperText={paymentErrors.cardName}
            sx={{
              mb: 2,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : undefined,
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : undefined,
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff4757',
                },
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#fff' : undefined,
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Card Number"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            inputProps={{ maxLength: 19 }}
            margin="dense"
            error={!!paymentErrors.cardNumber}
            helperText={paymentErrors.cardNumber}
            sx={{
              mb: 2,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : undefined,
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : undefined,
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff4757',
                },
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#fff' : undefined,
              },
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Expiry Date"
              value={cardExpiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              inputProps={{ maxLength: 5 }}
              margin="dense"
              error={!!paymentErrors.cardExpiry}
              helperText={paymentErrors.cardExpiry}
              sx={{
                width: '50%',
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : undefined,
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : undefined,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff4757',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
              }}
            />
            
            <TextField
              label="CVC"
              value={cardCVC}
              onChange={handleCVCChange}
              placeholder="123"
              inputProps={{ maxLength: 4 }}
              margin="dense"
              error={!!paymentErrors.cardCVC}
              helperText={paymentErrors.cardCVC}
              sx={{
                width: '50%',
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : undefined,
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : undefined,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff4757',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : undefined,
                },
              }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mt: 3,
            p: 1,
            borderRadius: 1,
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
          }}>
            <FaLock style={{ marginRight: '8px', color: '#ff4757' }} />
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
              Your payment information is secure and encrypted
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setIsPaymentDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
              color: isDarkMode ? '#fff' : 'inherit',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePaymentSubmit}
            variant="contained"
            sx={{
              bgcolor: '#ff4757',
              '&:hover': { bgcolor: '#ff6b81' },
              ml: 2
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withChatAndNotifications(Market);