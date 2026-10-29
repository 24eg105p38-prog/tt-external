import React, { useState } from 'react';

export default function RegisterModal({ isOpen, event, onClose, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('campushub_email') || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  if (!isOpen || !event) return null;

  // Strict email regex validation
  const EMAIL_REGEX = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Participant name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. student@college.edu)';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await onRegisterSuccess(event.id, {
        name: name.trim(),
        email: email.trim().toLowerCase()
      });

      // Save email for student convenience
      localStorage.setItem('campushub_email', email.trim().toLowerCase());

      // Show confirmed pass
      setConfirmedTicket(response);
    } catch (err) {
      // Handled by toast in App.jsx
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedTicket(null);
    setErrors({});
    setName('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="badge badge-primary">Register for Event</span>
            {/* Make it clear which event the participant is registering for */}
            <h3>{event.name}</h3>
            <p className="modal-subtitle">
              📅 Date: {event.eventDate || event.date} • 📍 Venue: {event.venue}
            </p>
          </div>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>

        {confirmedTicket ? (
          <div>
            <div style={{ textAlign: 'center', padding: '1.5rem 1.5rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ color: 'var(--success-text)' }}>Registration Confirmed!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                You have officially registered for this college event.
              </p>
            </div>

            {/* Clear Event Registration Pass */}
            <div className="ticket-confirmation-card">
              <div className="ticket-field">
                <span className="ticket-field-label">Registered Event:</span>
                <span className="ticket-field-val" style={{ color: 'var(--primary)' }}>
                  {confirmedTicket.eventName || event.name}
                </span>
              </div>
              <div className="ticket-field">
                <span className="ticket-field-label">Date & Venue:</span>
                <span className="ticket-field-val">
                  {confirmedTicket.eventDate || event.eventDate || event.date} • {confirmedTicket.eventVenue || event.venue}
                </span>
              </div>
              <div className="ticket-field">
                <span className="ticket-field-label">Participant Name:</span>
                <span className="ticket-field-val">
                  {confirmedTicket.participant ? confirmedTicket.participant.name : name}
                </span>
              </div>
              <div className="ticket-field">
                <span className="ticket-field-label">Email Address:</span>
                <span className="ticket-field-val">
                  {confirmedTicket.participant ? confirmedTicket.participant.email : email}
                </span>
              </div>
              <div className="ticket-field">
                <span className="ticket-field-label">Registration Code:</span>
                <span className="ticket-field-val font-mono">
                  REG-{confirmedTicket.participant ? confirmedTicket.participant.id.toString().padStart(5, '0') : '00001'}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-body">
              <div className="notice-box">
                ℹ️ Registering for <strong>"{event.name}"</strong> on <strong>{event.eventDate || event.date}</strong> at <strong>{event.venue}</strong>.
              </div>

              {/* Feature 3: Name */}
              <div className="form-group">
                <label htmlFor="reg-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  className={errors.name ? 'input-error' : ''}
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                  }}
                  autoFocus
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Feature 3: Email Address (Strictly validated) */}
              <div className="form-group">
                <label htmlFor="reg-email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className={errors.email ? 'input-error' : ''}
                  placeholder="e.g. maya.l@college.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
