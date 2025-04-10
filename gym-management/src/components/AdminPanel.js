import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import CustomersPanel from './admin/CustomersPanel';
import EmployeesPanel from './admin/EmployeesPanel';
import MarketPanel from './admin/MarketPanel';
import Dashboard from './admin/dashboard';
import FinancialPanel from './admin/FinancialPanel';
import MembershipPanel from './admin/MembershipPanel';
import ExpensesPanel from './admin/ExpensesPanel';
import ContactPanel from './admin/ContactPanel';
import '../styles/AdminPanel.css';
import { logout } from '../utils/auth';

const AdminPanel = ({ children, activeTab = 'dashboard', isDarkMode, setIsDarkMode }) => {
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt', path: '/admin' },
    { id: 'customers', label: 'Customers', icon: 'fa-users', path: '/admin/customers' },
    { id: 'membership', label: 'Membership and Pricing', icon: 'fa-id-card', path: '/admin/membership' },
    { id: 'market', label: 'Market', icon: 'fa-shopping-cart', path: '/admin/market' },
    { id: 'employees', label: 'Trainers', icon: 'fa-user-tie', path: '/admin/employees' },
    { id: 'expenses', label: 'Expenses', icon: 'fa-receipt', path: '/admin/expenses' },
    { id: 'financial', label: 'Financial', icon: 'fa-chart-line', path: '/admin/financial' },
    { id: 'contact', label: 'Contact Messages', icon: 'fa-envelope', path: '/admin/contact' },
  ];

  return (
    <div className={`admin-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <nav className="admin-nav">
        {navItems.map(item => (
          <NavLink key={item.id} to={item.path} end>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="dark-mode-toggle-container1">
          <i className="fas fa-sun"></i>
          <div 
            className="dark-mode-toggle-switch1"
            onClick={toggleDarkMode}
          >
            <div className="dark-mode-toggle-slider1"></div>
          </div>
          <i className="fas fa-moon"></i>
        </div>
        
        <div className="admin-nav-footer">
          <button className="admin-logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/market" element={<MarketPanel />} />
          <Route path="/customers" element={<CustomersPanel />} />
          <Route path="/employees" element={<EmployeesPanel />} />
          <Route path="/financial" element={<FinancialPanel />} />
          <Route path="/membership" element={<MembershipPanel />} />
          <Route path="/expenses" element={<ExpensesPanel />} />
          <Route path="/contact" element={<ContactPanel />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel; 