import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMoon, FaSun, FaChevronLeft, FaChevronRight, FaBell, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/WeeklySchedule.css';
import axios from 'axios';

const WeeklySchedule = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);
  const [lastDayOfMonth, setLastDayOfMonth] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userSessions, setUserSessions] = useState({
    trainerSessions: [],
    groupSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get user ID from local storage
  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch user's sessions
  const fetchUserSessions = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/user-sessions/${userId}`);
      setUserSessions(response.data);
      
      // Transform sessions into notifications format
      const allNotifications = [
        ...response.data.trainerSessions.map(session => ({
          id: `trainer-${session.id}`,
          date: new Date(session.date),
          message: `Personal Training with ${session.trainerName} at ${session.time} - ${session.sessionType}`,
          isRead: false,
          type: 'trainer',
          color: '#4e73df',
          details: session
        })),
        ...response.data.groupSessions.map(session => ({
          id: `group-${session.id}`,
          date: new Date(session.date),
          message: `Group Workout: ${session.title} at ${session.time}`,
          isRead: false,
          type: 'group',
          color: '#1cc88a',
          details: session
        }))
      ];
      
      setNotifications(allNotifications);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSessions();
  }, []);

  useEffect(() => {
    updateCalendarDays();
  }, [currentDate]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [setIsDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const updateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Calculate days in month
    const lastDay = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(lastDay);

    // Calculate first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    setFirstDayOfMonth(firstDay);

    // Calculate last day of month (0 = Sunday, 1 = Monday, etc.)
    const lastDayOfWeek = new Date(year, month, lastDay).getDay();
    setLastDayOfMonth(lastDayOfWeek);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const getNotificationsForDate = (date) => {
    if (!date) return [];
    
    return notifications.filter(notification => {
      const notificationDate = notification.date;
      return notificationDate.getDate() === date &&
             notificationDate.getMonth() === currentDate.getMonth() &&
             notificationDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth + firstDayOfMonth + (6 - lastDayOfMonth);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const dayNotifications = getNotificationsForDate(day);
      const hasUnreadNotifications = dayNotifications.some(n => !n.isRead);
      
      // Count different types of sessions
      const trainerSessions = dayNotifications.filter(n => n.type === 'trainer');
      const groupSessions = dayNotifications.filter(n => n.type === 'group');

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${hasUnreadNotifications ? 'has-notifications' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          <div className="day-content">
            {dayNotifications.length > 0 && (
              <div className="day-notifications">
                {trainerSessions.length > 0 && (
                  <div className="trainer-sessions-indicator">
                    <span className="session-dot" style={{backgroundColor: '#4e73df'}}></span>
                    <span className="session-count">{trainerSessions.length}</span>
                  </div>
                )}
                {groupSessions.length > 0 && (
                  <div className="group-sessions-indicator">
                    <span className="session-dot" style={{backgroundColor: '#1cc88a'}}></span>
                    <span className="session-count">{groupSessions.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Add empty cells for days after the last day of the month
    for (let i = lastDayOfMonth + 1; i < 7; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    return days;
  };

  return (
    <div className={`weekly-schedule-container-weeklyschedule container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="schedule-content-weeklyschedule">
        <div className="schedule-header-weeklyschedule">
          <button className="back-button-weeklyschedule" onClick={() => navigate('/member')}>
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <button 
            className={`dark-mode-toggle-weeklyschedule ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkMode}
          >
            <FaSun className="toggle-icon-weeklyschedule sun-weeklyschedule" />
            <div className="toggle-circle-weeklyschedule"></div>
            <FaMoon className="toggle-icon-weeklyschedule moon-weeklyschedule" />
          </button>
        </div>

        <div className="calendar-header-weeklyschedule">
          <button className="calendar-nav-button" onClick={handlePrevMonth}>
            <span><FaChevronLeft /></span>
          </button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button className="calendar-nav-button" onClick={handleNextMonth}>
            <span><FaChevronRight /></span>
          </button>
        </div>

        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid-weeklyschedule">
          {renderCalendarDays()}
        </div>

        {selectedDate && (
          <div className="selected-date-details-weeklyschedule">
            <h3>Schedule for {selectedDate.toLocaleDateString()}</h3>
            
            {isLoading ? (
              <div className="loading-message">Loading sessions...</div>
            ) : (
              <div className="selected-date-notifications">
                {getNotificationsForDate(selectedDate.getDate()).length === 0 ? (
                  <div className="no-sessions-message">No sessions scheduled for this day.</div>
                ) : (
                  getNotificationsForDate(selectedDate.getDate()).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                      style={{borderLeft: `4px solid ${notification.color}`}}
                    >
                      <div className="notification-icon-container">
                        <FaBell className="notification-icon" />
                      </div>
                      
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        
                        {notification.type === 'trainer' && (
                          <div className="session-details">
                            <div className="session-detail-item">
                              <FaCalendarAlt className="detail-icon" />
                              <span>Session Type: {notification.details.sessionType}</span>
                            </div>
                            {notification.details.notes && (
                              <div className="session-detail-item">
                                <span className="session-notes">Notes: {notification.details.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {notification.type === 'group' && (
                          <div className="session-details">
                            <div className="session-detail-item">
                              <FaClock className="detail-icon" />
                              <span>{notification.details.duration} • {notification.details.level}</span>
                            </div>
                            {notification.details.image && (
                              <div className="workout-image-container">
                                <img 
                                  src={notification.details.image} 
                                  alt={notification.details.title}
                                  className="workout-thumbnail"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedule; 
