import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ParticipantsModal({ isOpen, event, onClose, onParticipantRemoved }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen && event) {
      loadParticipants();
    }
  }, [isOpen, event]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const data = await api.getEventParticipants(event.id);
      setParticipants(data.participants || []);
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const filtered = participants.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (participantId, participantName) => {
    if (!window.confirm(`Are you sure you want to remove "${participantName}" from "${event.name}"?`)) {
      return;
    }
    try {
      await api.cancelRegistration(participantId);
      await loadParticipants();
      if (onParticipantRemoved) onParticipantRemoved();
    } catch (err) {
      alert(err.message || 'Failed to remove participant');
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (participants.length === 0) return;

    const headers = ['#', 'Event Name', 'Event Date', 'Participant Name', 'Email Address', 'Registration Time'];
    const rows = participants.map((p, i) => [
      i + 1,
      `"${(p.eventName || event.name).replace(/"/g, '""')}"`,
      `"${p.eventDate || event.eventDate || event.date}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email}"`,
      `"${p.registeredAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `participants_${event.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Format date helper
  const formatDateTime = (dtStr) => {
    if (!dtStr) return '';
    try {
      const d = new Date(dtStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dtStr;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-lg">
        {/* Header making it clear which event participants are registered for */}
        <div className="modal-header">
          <div>
            <span className="badge badge-primary">Event Attendee Roster</span>
            <h3>{event.name}</h3>
            <p className="modal-subtitle">
              📅 {event.eventDate || event.date} • 📍 {event.venue}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Feature 5: Show the total number of registrations for each event */}
        <div className="participant-ribbon">
          <div className="ribbon-metric">
            <span className="ribbon-label">Total Number of Registrations</span>
            <span className="ribbon-count">
              {participants.length} Student{participants.length === 1 ? '' : 's'}
            </span>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={handleExportCsv}
            disabled={participants.length === 0}
          >
            ⬇️ Export CSV
          </button>
        </div>

        {/* Search inside participants */}
        <div className="participant-search-wrap">
          <input
            type="text"
            placeholder="Search participants by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Feature 4: Display the participants register for the event */}
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--gray-500)' }}>
              Loading registered participants...
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participant Name</th>
                  <th>Email Address</th>
                  <th>Registered Event</th>
                  <th>Registration Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gray-500)' }}>
                      <strong>No Registered Participants Found</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {search ? 'No participants match your filter.' : 'Be the first participant to register for this event!'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, idx) => (
                    <tr key={p.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{p.name}</strong></td>
                      <td>
                        <a href={`mailto:${p.email}`}>{p.email}</a>
                      </td>
                      {/* Clearly display which event each participant registered for */}
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {p.eventName || event.name}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {formatDateTime(p.registeredAt)}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => handleRemove(p.id, p.name)}
                          title="Remove Participant"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
