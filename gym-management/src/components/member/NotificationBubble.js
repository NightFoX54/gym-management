import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/NotificationBubble.css';

const NotificationBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (userInfo.id) {
            fetchNotifications();
            fetchNotificationCount();
            
            // Set up polling for new notifications
            const interval = setInterval(() => {
                fetchNotificationCount();
                if (isOpen) {
                    fetchNotifications();
                }
            }, 10000); // Poll every 10 seconds

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/${userInfo.id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/count/${userInfo.id}`);
            setNotificationCount(response.data);
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        // First delete the notification
        try {
            await axios.delete(`http://localhost:8080/api/notifications/${notification.id}`);
            
            // Remove from local state
            setNotifications(notifications.filter(n => n.id !== notification.id));
            setNotificationCount(prevCount => Math.max(0, prevCount - 1));
            
            // Navigate based on notification type
            switch(notification.notificationType) {
                case 'trainer_request':
                    console.log('trainer_request');
                    navigate('/member/personal-trainers');
                    break;
                case 'forum':
                    console.log('forum');
                    navigate(`/member/forum/thread/${notification.forumThreadId}`);
                    break;
                case 'friendship_request':
                    console.log('friendship_request');
                    navigate('/member/friends');
                    break;
                default:
                    // Default case - just close the notification panel
                    setIsOpen(false);
            }
        } catch (error) {
            console.error('Error handling notification:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        
        // If it's today, show time
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // If it's yesterday, show "Yesterday"
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        
        // Otherwise show date
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-bubble-container">
            {/* Notification Button with Count */}
            <button 
                className={`notification-bubble-button ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaBell />
                {notificationCount > 0 && (
                    <span className="notification-count">{notificationCount}</span>
                )}
            </button>

            {/* Notification Modal */}
            {isOpen && (
                <div className="notification-modal">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <button className="notification-close-button" onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="notification-content">
                        {console.log(notifications)}
                        {notifications.length > 0 ? (
                            <div className="notification-list">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className="notification-item"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-item-content">
                                            <p className="notification-message">{notification.message}</p>
                                            <span className="notification-time">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        <FaChevronRight className="notification-arrow" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-notifications-message">
                                No notifications
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBubble; 