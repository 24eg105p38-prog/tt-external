import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function MyRegistrations({ onCancelRegistration }) {
  const [email, setEmail] = useState(() => localStorage.getItem('campushub_email') || '');
  const [registrations, setRegistrations] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email.trim()) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getRegistrationsByEmail(email.trim());
      setRegistrations(data);
      setSearched(true);
      localStorage.setItem('campushub_email', email.trim());
    } catch (err) {
      setError(err.message || 'Failed to find registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (participantId, eventName) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventName}"?`)) {
      return;
    }
    try {
      await api.cancelRegistration(participantId);
      setRegistrations(prev => prev.filter(r => r.id !== participantId));
      if (onCancelRegistration) onCancelRegistration();
    } catch (err) {
      alert(err.message || 'Failed to cancel registration');
    }
  };

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
    <div>
      <div className="hero-bar">
        <div>
          <h2>My Event Registrations</h2>
          <p>Look up all college events you are currently registered for using your email address.</p>
        </div>
      </div>

      <div className="lookup-card">
        <form onSubmit={handleSearch} className="lookup-form">
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="lookup-email">Enter Registered Email Address</label>
            <input
              id="lookup-email"
              type="email"
              placeholder="e.g. yourname@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Find My Registrations'}
          </button>
        </form>
        {error && <p className="error-text" style={{ marginTop: '0.5rem' }}>{error}</p>}
      </div>

      <div className="my-regs-grid">
        {!searched ? (
          <div className="empty-state">
            <h4>Search Your Registrations</h4>
            <p>Enter your college email address above to view your confirmed event passes.</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="empty-state">
            <h4>No Registrations Found</h4>
            <p>No confirmed event registrations were found for <strong>{email}</strong>.</p>
          </div>
        ) : (
          registrations.map(r => (
            <div key={r.id} className="event-card">
              <div>
                <div className="event-card-header">
                  <span className="badge badge-primary">Confirmed Pass</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    📅 {formatDate(r.eventDate)}
                  </span>
                </div>

                {/* Clearly making it clear which event the participant has registered for */}
                <h3 className="event-name">{r.eventName}</h3>

                <div className="event-venue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span><strong>Venue:</strong> {r.eventVenue}</span>
                </div>

                <div style={{
                  fontSize: '0.825rem',
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div><strong>Participant:</strong> {r.name}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                    Email: {r.email} • Pass: REG-{r.id.toString().padStart(5, '0')}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  className="btn btn-danger btn-xs"
                  onClick={() => handleCancel(r.id, r.eventName)}
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
