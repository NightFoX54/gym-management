import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import CustomersPanel from './admin/CustomersPanel';
import EmployeesPanel from './admin/EmployeesPanel';
import MarketPanel from './admin/MarketPanel';
import Dashboard from './admin/dashboard';
import FinancialPanel from './admin/FinancialPanel';
import '../styles/AdminPanel.css';

const AdminPanel = ({ isDarkMode, setIsDarkMode }) => {
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`admin-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <nav className="admin-nav">
        <NavLink to="/admin" end>
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/market">
          <i className="fas fa-store"></i>
          <span>Market</span>
        </NavLink>
        <NavLink to="/admin/customers">
          <i className="fas fa-users"></i>
          <span>Customers</span>
        </NavLink>
        <NavLink to="/admin/employees">
          <i className="fas fa-user-tie"></i>
          <span>Employees</span>
        </NavLink>
        <NavLink to="/admin/financial">
          <i className="fas fa-chart-line"></i>
          <span>Financial</span>
        </NavLink>
        <div className="dark-mode-toggle-container">
          <i className="fas fa-sun"></i>
          <div 
            className="dark-mode-toggle-switch"
            onClick={toggleDarkMode}
          >
            <div className="dark-mode-toggle-slider"></div>
          </div>
          <i className="fas fa-moon"></i>
        </div>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/market" element={<MarketPanel />} />
          <Route path="/customers" element={<CustomersPanel />} />
          <Route path="/employees" element={<EmployeesPanel />} />
          <Route path="/financial" element={<FinancialPanel />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel; 