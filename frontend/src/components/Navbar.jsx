import React from 'react';

export default function Navbar({ activeTab, onTabChange, onOpenAddEvent }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-logo">🎓</div>
          <div>
            <h1 className="brand-title">
              CampusEventHub
              <span className="tech-badge">Spring Boot + React</span>
            </h1>
            <span className="brand-subtitle">College Event Registration & Attendee Tracker</span>
          </div>
        </div>

        <nav className="nav-tabs" role="tablist">
          <button
            className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => onTabChange('events')}
            role="tab"
          >
            📅 Available Events
          </button>
          <button
            className={`nav-tab ${activeTab === 'my-regs' ? 'active' : ''}`}
            onClick={() => onTabChange('my-regs')}
            role="tab"
          >
            🎟️ My Registrations
          </button>
        </nav>

        <div className="nav-actions">
          {/* Feature 1 trigger: Add an event */}
          <button className="btn btn-primary" onClick={onOpenAddEvent}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>+ Add New Event</span>
          </button>
        </div>
      </div>
    </header>
  );
}
