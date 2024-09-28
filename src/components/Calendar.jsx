import React, { useState } from 'react';
import '../styles/calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [deadlines, setDeadlines] = useState({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateClick = (date) => {
    const deadlineTitle = prompt('Enter the deadline for this date:');
    if (deadlineTitle) {
      setDeadlines({ ...deadlines, [date]: deadlineTitle });
    }
    setSelectedDate(date);
  };

  const handleMonthChange = (index) => {
    setCurrentMonth(index);
    setSelectedDate(1);
  };

  return (
    <div className="calendar-wrapper">
      <h2 className="calendar-title">Calendar</h2>

      {/* Horizontal Scroll for Months */}
      <div className="calendar-months-scroll">
        {months.map((month, index) => (
          <div
            key={index}
            onClick={() => handleMonthChange(index)}
            className={`month-card ${index === currentMonth ? 'active-month' : ''}`}
          >
            {month}
          </div>
        ))}
      </div>

      <div className="calendar-date-header">
        <span className="current-date">{`${months[currentMonth]} ${selectedDate}`}</span>
      </div>

      <div className="calendar-dates-container">
        <div className="calendar-dates">
          {days.map((date, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                ${deadlines[date] ? 'deadline-date' : ''} 
                ${selectedDate === date ? 'selected-date' : ''}
              `}
              title={deadlines[date] || ''}
            >
              {date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
