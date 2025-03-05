import React, { useState } from 'react';
import { FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/WeeklySchedule.css';
import '../../styles/PageTransitions.css';

const WeeklySchedule = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          <div className="day-content">
            {/* Add your daily schedule content here */}
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

        <div className="calendar-header-weeklyschedule card-animate stagger-3">
          <button className="calendar-nav-button" onClick={handlePrevMonth}>
            <span>←</span>
          </button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button className="calendar-nav-button" onClick={handleNextMonth}>
            <span>→</span>
          </button>
        </div>

        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid-weeklyschedule card-animate stagger-4">
          {renderCalendarDays()}
        </div>

        {selectedDate && (
          <div className="selected-date-details-weeklyschedule card-animate stagger-5">
            <h3>Schedule for {selectedDate.toLocaleDateString()}</h3>
            {/* Add your selected date schedule content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedule; 