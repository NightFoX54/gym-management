import React from 'react';
import '../../styles/AdminPanels.css';

const MarketPanel = () => {
  return (
    <div className="panel-container">
      <div className="coming-soon-content">
        <i className="fas fa-store coming-soon-icon"></i>
        <h2>Market Panel - Coming Soon</h2>
        <p>We're working hard to bring you the best marketplace experience!</p>
        <div className="features-preview">
          <h3>Planned Features:</h3>
          <ul>
            <li><i className="fas fa-check"></i> Product Management</li>
            <li><i className="fas fa-check"></i> Inventory Tracking</li>
            <li><i className="fas fa-check"></i> Sales Analytics</li>
            <li><i className="fas fa-check"></i> Supplier Management</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketPanel; 