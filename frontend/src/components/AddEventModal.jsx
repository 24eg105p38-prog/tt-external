import React, { useState } from 'react';

export default function AddEventModal({ isOpen, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    venue: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.date.trim()) newErrors.date = 'Event date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Event venue is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEventCreated({
        name: formData.name.trim(),
        date: formData.date.trim(),
        venue: formData.venue.trim(),
        description: formData.description.trim()
      });
      setFormData({ name: '', date: '', venue: '', description: '' });
      setErrors({});
      onClose();
    } catch (err) {
      // Backend validation error message handled by parent toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3>Add New College Event</h3>
            <p className="modal-subtitle">Fill in all required fields to list an event for student registration.</p>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-body">
            {/* Required Feature 1: Name */}
            <div className="form-group">
              <label htmlFor="event-name">
                Event Name <span className="required">*</span>
              </label>
              <input
                id="event-name"
                name="name"
                type="text"
                className={errors.name ? 'input-error' : ''}
                placeholder="e.g. Annual AI & Robotics Hackathon 2026"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Required Feature 1: Date */}
            <div className="form-group">
              <label htmlFor="event-date">
                Date <span className="required">*</span>
              </label>
              <input
                id="event-date"
                name="date"
                type="date"
                className={errors.date ? 'input-error' : ''}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            {/* Required Feature 1: Venue */}
            <div className="form-group">
              <label htmlFor="event-venue">
                Venue / Campus Location <span className="required">*</span>
              </label>
              <input
                id="event-venue"
                name="venue"
                type="text"
                className={errors.venue ? 'input-error' : ''}
                placeholder="e.g. Main Auditorium, Block C or CS Lab 2"
                value={formData.venue}
                onChange={handleChange}
              />
              {errors.venue && <span className="error-text">{errors.venue}</span>}
            </div>

            {/* Required Feature 1: Short Description */}
            <div className="form-group">
              <label htmlFor="event-description">
                Short Description <span className="required">*</span>
              </label>
              <textarea
                id="event-description"
                name="description"
                rows="3"
                className={errors.description ? 'input-error' : ''}
                placeholder="Brief summary of event agenda, eligibility, or prizes..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Listing Event...' : 'List Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
