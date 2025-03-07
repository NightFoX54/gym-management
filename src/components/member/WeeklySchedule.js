import React, { useState } from 'react';
import { FaArrowLeft, FaMoon, FaSun, FaChevronLeft, FaChevronRight, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/WeeklySchedule.css';
import '../../styles/PageTransitions.css';

const WeeklySchedule = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Bildirim verilerini ekleyelim
  const notifications = [
    {
      id: 1,
      message: "Your next training session is tomorrow at 10:00 AM",
      type: "reminder",
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Yarın
      isRead: false
    },
    {
      id: 2,
      message: "New class schedule available for next week",
      type: "info",
      date: new Date(new Date().setDate(new Date().getDate() + 7)), // Bir hafta sonra
      isRead: false
    },
    {
      id: 3,
      message: "Personal training session with Berkay at 2:00 PM",
      type: "reminder",
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 gün sonra
      isRead: false
    },
    {
      id: 4,
      message: "Group yoga class at 9:00 AM",
      type: "reminder",
      date: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 gün sonra
      isRead: false
    }
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
  };

  const toggleDarkModeMember = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getNotificationsForDate = (date) => {
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.date);
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
                <FaBell className="notification-icon" />
                <span className="notification-count">{dayNotifications.length}</span>
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
            onClick={toggleDarkModeMember}
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
            <div className="selected-date-notifications">
              {getNotificationsForDate(selectedDate.getDate()).map(notification => (
                <div key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                  <FaBell className="notification-icon" />
                  <p>{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedule; 
