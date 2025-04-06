import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

/**
 * Protected route component that redirects to login page
 * if user is not authenticated or doesn't have the required role
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const userRole = getUserRole();
    if (userRole !== requiredRole) {
      // Redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute; 