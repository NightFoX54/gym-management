import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminPanels.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/admin${path}`);
  };

  return (
    <div className="panel-container welcome-panel">
      <div className="welcome-content">
        <h1>Welcome to Admin Panel</h1>
        <p>Please select a section from the sidebar to manage your gym:</p>
        <div className="feature-list">
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/customers')}
          >
            <i className="fas fa-users"></i>
            <h3>Customers</h3>
            <p>Manage gym customers and their memberships</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/membership')}
          >
            <i className="fas fa-id-card"></i>
            <h3>Membership and Pricing</h3>
            <p>Manage membership plans and service prices</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/market')}
          >
            <i className="fas fa-shopping-cart"></i>
            <h3>Market</h3>
            <p>Manage product inventory and sales</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/employees')}
          >
            <i className="fas fa-user-tie"></i>
            <h3>Trainers</h3>
            <p>Handle staff records and schedules</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/expenses')}
          >
            <i className="fas fa-receipt"></i>
            <h3>Expenses</h3>
            <p>Track and manage your gym expenses</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/financial')}
          >
            <i className="fas fa-chart-line"></i>
            <h3>Financial</h3>
            <p>Track revenue, expenses and generate reports</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/contact')}
          >
            <i className="fas fa-envelope"></i>
            <h3>Contact Messages</h3>
            <p>View and manage contact form messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 