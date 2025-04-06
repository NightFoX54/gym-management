/**
 * Authentication utility functions for managing user session
 */

// Get the current authenticated user
const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Get just the auth token
const getToken = () => {
  const user = getUser();
  return user?.token;
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

// Get user role
const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Enhanced logout function
const logout = () => {
  // Clear user data from localStorage
  localStorage.removeItem('user');
  
  // Optional: Make API call to invalidate session on server
  // If your backend has a logout endpoint, you can call it here
  // Example: api.post('/auth/logout').catch(err => console.error('Logout error:', err));
  
  // Redirect to login page
  window.location.href = '/login';
};

// After successful signup, add this function
const setAuthUser = (userData) => {
  // Add a token if not provided by backend
  if (!userData.token && userData.userId) {
    // For simple apps without JWT, create a basic token
    userData.token = `TEMP_TOKEN_${userData.userId}_${Date.now()}`;
  }
  
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};

export { getUser, getToken, isAuthenticated, getUserRole, logout, setAuthUser }; 