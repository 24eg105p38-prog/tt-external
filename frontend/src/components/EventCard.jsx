import React from 'react';

export default function EventCard({ event, onRegister, onViewParticipants, onDelete }) {
  const totalRegs = event.totalRegistrations !== undefined ? event.totalRegistrations : 0;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="event-card">
      <div>
        <div className="event-card-header">
          <span className="event-date-chip">
            📅 {formatDate(event.eventDate || event.date)}
          </span>
        </div>

        {/* Feature 1 & 2: Event Name */}
        <h3 className="event-name">{event.name}</h3>

        {/* Feature 1 & 2: Venue */}
        <div className="event-venue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span><strong>Venue:</strong> {event.venue}</span>
        </div>

        {/* Feature 1 & 2: Short Description */}
        <p className="event-desc">{event.description}</p>

        {/* Feature 5: Show the total number of registrations for each event */}
        <div className="event-reg-count-box">
          <span className="reg-count-label">👥 Total Registrations</span>
          <span className="reg-count-value">
            {totalRegs} student{totalRegs === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="event-card-actions">
        {/* Feature 3: Register participant using name and email */}
        <button
          className="btn btn-primary"
          onClick={() => onRegister(event)}
        >
          ✍️ Register Now
        </button>

        {/* Feature 4: Display participants registered for this event */}
        <button
          className="btn btn-outline"
          onClick={() => onViewParticipants(event)}
        >
          👥 Participants ({totalRegs})
        </button>

        {/* Delete event */}
        <button
          className="btn btn-danger btn-xs"
          onClick={() => onDelete(event.id, event.name)}
          title="Delete Event"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
