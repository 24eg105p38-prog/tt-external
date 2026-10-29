import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';
import AddEventModal from './components/AddEventModal';
import RegisterModal from './components/RegisterModal';
import ParticipantsModal from './components/ParticipantsModal';
import MyRegistrations from './components/MyRegistrations';
import { api } from './services/api';

export default function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0 });
  const [activeTab, setActiveTab] = useState('events');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [participantsEvent, setParticipantsEvent] = useState(null);

  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load events and stats
  const loadData = async () => {
    try {
      const [eventsList, statsData] = await Promise.all([
        api.getEvents(),
        api.getStats().catch(() => ({ totalEvents: 0, totalRegistrations: 0 }))
      ]);
      setEvents(eventsList);
      setStats(statsData);
    } catch (err) {
      addToast(err.message || 'Failed to load events from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Feature 1: Add an event with name, date, venue, short description
  const handleCreateEvent = async (eventData) => {
    try {
      const res = await api.createEvent(eventData);
      addToast(`Event "${eventData.name}" added successfully!`, 'success');
      await loadData();
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Feature 3: Register participant using name and email address for selected event
  const handleRegister = async (eventId, participantData) => {
    try {
      const res = await api.registerParticipant(eventId, participantData);
      addToast(`Registered "${participantData.name}" for "${res.eventName || 'event'}"!`, 'success');
      await loadData();
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Delete event
  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete event "${name}"? All registered participants will also be removed.`)) {
      return;
    }
    try {
      await api.deleteEvent(id);
      addToast(`Event "${name}" deleted successfully.`, 'success');
      await loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Filter events
  const filteredEvents = events.filter(e =>
    (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.venue || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>&times;</button>
          </div>
        ))}
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddEvent={() => setIsAddEventOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'events' ? (
          <div>
            {/* Hero Bar */}
            <div className="hero-bar">
              <div>
                <h2>College Events Hub</h2>
                <p>Browse available campus events, register with your name & email, and track participant rosters in real time.</p>
              </div>
              <div className="hero-stats">
                <div className="stat-pill">
                  <span className="stat-pill-label">Total Events:</span>
                  <strong>{stats.totalEvents || events.length}</strong>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill-label">Total Registrations:</span>
                  <strong>{stats.totalRegistrations || 0}</strong>
                </div>
              </div>
            </div>

            {/* Search Bar & Add Button */}
            <div className="filter-bar">
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search available events by name, venue, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-btn" onClick={() => setSearch('')}>&times;</button>
                )}
              </div>

              <button className="btn btn-primary" onClick={() => setIsAddEventOpen(true)}>
                + Add New Event
              </button>
            </div>

            {/* Feature 2: Display the list of available events */}
            <div className="events-grid-header">
              <h3>Available College Events</h3>
              <span className="badge badge-default">
                {filteredEvents.length} Event{filteredEvents.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                Connecting to Spring Boot backend...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="empty-state">
                <h4>No Events Found</h4>
                <p>{search ? 'No events matched your search query.' : 'Click "+ Add New Event" to publish the first event!'}</p>
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={(ev) => setRegisterEvent(ev)}
                    onViewParticipants={(ev) => setParticipantsEvent(ev)}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <MyRegistrations onCancelRegistration={loadData} />
        )}
      </main>

      {/* Feature 1: Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onEventCreated={handleCreateEvent}
      />

      {/* Feature 3: Register Participant Modal */}
      <RegisterModal
        isOpen={Boolean(registerEvent)}
        event={registerEvent}
        onClose={() => setRegisterEvent(null)}
        onRegisterSuccess={handleRegister}
      />

      {/* Feature 4: Display Participants Registered for Event */}
      <ParticipantsModal
        isOpen={Boolean(participantsEvent)}
        event={participantsEvent}
        onClose={() => setParticipantsEvent(null)}
        onParticipantRemoved={loadData}
      />

      <footer className="footer">
        <div className="footer-container">
          <div>
            <strong>CampusEventHub</strong> — React.js Frontend • Java Spring Boot REST API • H2 Database
          </div>
          <div>
            Active Port: <code>8080</code> (API) • <code>5173</code> (Vite)
          </div>
        </div>
      </footer>
    </div>
  );
}
