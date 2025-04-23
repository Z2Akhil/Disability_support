import { useState } from 'react';
import {
  format, addMonths, subMonths,
  isSameMonth, isSameDay
} from 'date-fns';

const EventCalendar = ({ events = [], onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <button
        onClick={prevMonth}
        className="btn btn-light btn-sm rounded-circle shadow-sm"
        aria-label="Previous month"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <h2 className="h4 mb-0 text-primary fw-bold">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>

      <button
        onClick={nextMonth}
        className="btn btn-light btn-sm rounded-circle shadow-sm"
        aria-label="Next month"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(i);
      days.push(
        <div key={i} className="text-center text-secondary small fw-semibold">
          {format(day, dateFormat)}
        </div>
      );
    }

    return <div className="row row-cols-7 mb-2 g-0">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const rows = [];
    let days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const dayEvents = events.filter(event => isSameDay(new Date(event.date), cloneDay));

        days.push(
          <div key={day} className="col border border-light-subtle bg-light-subtle">
            <div className={`p-2 h-100 rounded-2 ${isSameMonth(day, monthStart) ? 'bg-white' : 'bg-light text-muted'}`}>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <span className={`small fw-semibold ${isSameDay(day, new Date()) ? 'badge text-bg-primary rounded-circle px-2 py-1' : ''}`}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="overflow-auto" style={{ maxHeight: '80px' }}>
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(cloneDay);
                      onEventClick(event);
                    }}
                    className="text-truncate small px-2 py-1 rounded mb-1 cursor-pointer"
                    style={{
                      backgroundColor: event.color || '#E7F1FF',
                      color: event.textColor || '#084298',
                      cursor: 'pointer'
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }

      rows.push(
        <div className="row row-cols-7 g-0" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="mb-4">{rows}</div>;
  };

  const renderSelectedEvents = () => {
    const selectedEvents = events.filter(event =>
      isSameDay(new Date(event.date), selectedDate)
    );

    if (selectedEvents.length === 0) {
      return (
        <div className="alert alert-secondary text-center" role="alert">
          No events for {format(selectedDate, 'MMMM d, yyyy')}
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h5 className="fw-semibold text-primary mb-3">
          Events on {format(selectedDate, 'MMMM d, yyyy')}
        </h5>

        <div className="list-group">
          {selectedEvents.map((event, idx) => (
            <button
              key={idx}
              onClick={() => onEventClick(event)}
              className="list-group-item list-group-item-action border rounded-2 mb-2"
            >
              <div className="d-flex align-items-start">
                <div
                  className="me-3 mt-1 rounded-circle"
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: event.color || '#0d6efd'
                  }}
                ></div>
                <div>
                  <div className="fw-medium small">{event.title}</div>
                  <div className="text-muted small">
                    {format(new Date(event.date), 'h:mm a')} • {event.location}
                  </div>
                  {event.description && (
                    <div className="text-muted small mt-1 text-truncate">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-5">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderSelectedEvents()}
    </div>
  );
};

EventCalendar.defaultProps = {
  events: [],
  onEventClick: () => {}
};

export default EventCalendar;
