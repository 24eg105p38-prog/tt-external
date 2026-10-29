package com.college.events.service;

import com.college.events.dto.CreateEventRequest;
import com.college.events.dto.RegisterParticipantRequest;
import com.college.events.exception.DuplicateRegistrationException;
import com.college.events.exception.ResourceNotFoundException;
import com.college.events.model.Event;
import com.college.events.model.Participant;
import com.college.events.repository.EventRepository;
import com.college.events.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class EventService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    private final EventRepository eventRepository;
    private final ParticipantRepository participantRepository;

    public EventService(EventRepository eventRepository, ParticipantRepository participantRepository) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllWithRegistrationCounts();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
    }

    @Transactional
    public Event createEvent(CreateEventRequest req) {
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Event name cannot be empty");
        }
        if (req.getDate() == null || req.getDate().trim().isEmpty()) {
            throw new IllegalArgumentException("Event date cannot be empty");
        }
        if (req.getVenue() == null || req.getVenue().trim().isEmpty()) {
            throw new IllegalArgumentException("Event venue cannot be empty");
        }
        if (req.getDescription() == null || req.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Event description cannot be empty");
        }

        return eventRepository.save(req);
    }

    @Transactional
    public boolean deleteEvent(Long id) {
        Event event = getEventById(id);
        return eventRepository.deleteById(event.getId());
    }

    public Map<String, Object> getEventParticipants(Long eventId) {
        Event event = getEventById(eventId);
        List<Participant> participants = participantRepository.findByEventId(eventId);

        Map<String, Object> result = new HashMap<>();
        result.put("event", event);
        result.put("totalRegistrations", participants.size());
        result.put("participants", participants);
        return result;
    }

    @Transactional
    public Participant registerParticipant(Long eventId, RegisterParticipantRequest req) {
        Event event = getEventById(eventId);

        String trimmedName = (req.getName() != null) ? req.getName().trim() : "";
        String normalizedEmail = (req.getEmail() != null) ? req.getEmail().trim().toLowerCase() : "";

        if (trimmedName.isEmpty()) {
            throw new IllegalArgumentException("Participant name is required");
        }
        if (normalizedEmail.isEmpty()) {
            throw new IllegalArgumentException("Email address is required");
        }

        // Validate email format
        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            throw new IllegalArgumentException("Invalid email format: '" + req.getEmail() + "'. Please enter a valid email address.");
        }

        // Check duplicate email for this specific event
        if (participantRepository.existsByEventIdAndEmail(eventId, normalizedEmail)) {
            throw new DuplicateRegistrationException(
                    "Participant '" + trimmedName + "' (" + normalizedEmail + ") is already registered for event: '" + event.getName() + "'"
            );
        }

        // Store registration record in backend database
        return participantRepository.register(eventId, trimmedName, normalizedEmail);
    }

    public List<Participant> getParticipantsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required to search registrations");
        }
        return participantRepository.findByEmail(email.trim());
    }

    @Transactional
    public boolean cancelRegistration(Long participantId) {
        Participant p = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration record not found with ID: " + participantId));
        return participantRepository.deleteById(p.getId());
    }

    public Map<String, Object> getStats() {
        int totalEvents = eventRepository.countAll();
        int totalRegistrations = participantRepository.countAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", totalEvents);
        stats.put("totalRegistrations", totalRegistrations);
        return stats;
    }
}
