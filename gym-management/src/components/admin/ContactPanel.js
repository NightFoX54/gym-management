import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import '../../styles/AdminPanels.css';

const ContactPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(15);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'read', 'unread'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [sortOrder, filterStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const endpoint = filterStatus === 'all' 
        ? `/api/contact/all?sort=${sortOrder}` 
        : `/api/contact/${filterStatus}?sort=${sortOrder}`;
      
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/contact/${id}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      // Update the local state to reflect the change
      setMessages(messages.map(message => 
        message.id === id ? { ...message, isRead: true } : message
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sort order changes
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter(message => {
    return (
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Contact Messages</h2>
        <div className="search-and-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      
      <div className="filter-controls">
        <div className="filter-buttons">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => handleFilterChange('all')}
          >
            All Messages
          </button>
          <button 
            className={filterStatus === 'read' ? 'active' : ''} 
            onClick={() => handleFilterChange('read')}
          >
            Read
          </button>
          <button 
            className={filterStatus === 'unread' ? 'active' : ''} 
            onClick={() => handleFilterChange('unread')}
          >
            Unread
          </button>
        </div>
        <div className="sort-controls">
          <label>Sort by: </label>
          <select 
            value={sortOrder} 
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {currentMessages.length === 0 ? (
          <div className="empty-table-message">No messages found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((message) => (
                <tr key={message.id} className={!message.isRead ? 'unread-row' : ''}>
                  <td>
                    <span className={`status-indicator ${message.isRead ? 'read' : 'unread'}`}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td>{message.dateCreated ? format(parseISO(message.dateCreated), 'dd/MM/yyyy HH:mm') : 'N/A'}</td>
                  <td>{message.name}</td>
                  <td>
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                  </td>
                  <td>{message.subject || 'No Subject'}</td>
                  <td className="message-cell">
                    <div className="message-content">{message.message}</div>
                  </td>
                  <td>
                    {!message.isRead && (
                      <button 
                        className="mark-read-button"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &laquo; Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? 'active pagination-number' : 'pagination-number'}
              >
                {number}
              </button>
            ))}
          </div>
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactPanel; 