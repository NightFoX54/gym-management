import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import CustomersPanel from './admin/CustomersPanel';
import EmployeesPanel from './admin/EmployeesPanel';
import MarketPanel from './admin/MarketPanel';
import FinancialPanel from './admin/FinancialPanel';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const location = useLocation();

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'active' : ''}>
          Customers
        </NavLink>
        <NavLink to="/admin/employees" className={({ isActive }) => isActive ? 'active' : ''}>
          Employees
        </NavLink>
        <NavLink to="/admin/market" className={({ isActive }) => isActive ? 'active' : ''}>
          Market
        </NavLink>
        <NavLink to="/admin/financial" className={({ isActive }) => isActive ? 'active' : ''}>
          Financial
        </NavLink>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="/customers" element={<CustomersPanel />} />
          <Route path="/employees" element={<EmployeesPanel />} />
          <Route path="/market" element={<MarketPanel />} />
          <Route path="/financial" element={<FinancialPanel />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel; 