const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || data.error || 'Server request failed';
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Feature 2: Display list of available events
  getEvents: () => request('/events'),

  // Get single event
  getEvent: (id) => request(`/events/${id}`),

  // Feature 1: Add an event with name, date, venue, and short description
  createEvent: (eventData) => request('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),

  // Delete event
  deleteEvent: (id) => request(`/events/${id}`, {
    method: 'DELETE'
  }),

  // Feature 4: Display participants registered for the event
  getEventParticipants: (eventId) => request(`/events/${eventId}/participants`),

  // Feature 3: Register participant using name and email address for selected events
  registerParticipant: (eventId, participantData) => request(`/events/${eventId}/register`, {
    method: 'POST',
    body: JSON.stringify(participantData)
  }),

  // Lookup registrations by participant email (clearly shows which event each participant registered for)
  getRegistrationsByEmail: (email) => request(`/participants?email=${encodeURIComponent(email)}`),

  // Cancel participant registration
  cancelRegistration: (participantId) => request(`/participants/${participantId}`, {
    method: 'DELETE'
  }),

  // Stats
  getStats: () => request('/stats')
};
