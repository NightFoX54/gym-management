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
            onClick={() => handleNavigation('/market')}
          >
            <i className="fas fa-store"></i>
            <h3>Market</h3>
            <p>Manage products, inventory and supplier relations</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/customers')}
          >
            <i className="fas fa-users"></i>
            <h3>Customers</h3>
            <p>Manage memberships and customer information</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/employees')}
          >
            <i className="fas fa-user-tie"></i>
            <h3>Employees</h3>
            <p>Handle staff records and schedules</p>
          </div>
          <div 
            className="feature-item clickable" 
            onClick={() => handleNavigation('/financial')}
          >
            <i className="fas fa-chart-line"></i>
            <h3>Financial</h3>
            <p>Track revenue, expenses and generate reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 