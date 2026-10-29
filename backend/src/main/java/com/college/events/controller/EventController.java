package com.college.events.controller;

import com.college.events.dto.CreateEventRequest;
import com.college.events.dto.RegisterParticipantRequest;
import com.college.events.model.Event;
import com.college.events.model.Participant;
import com.college.events.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Feature 2: Display the list of available events
     * Feature 5: Show the total no of registrations for each event
     */
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * Get specific event by ID
     */
    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    /**
     * Feature 1: Add an event with name, date, venue, and a short description
     * Validates required fields using @Valid
     */
    @PostMapping("/events")
    public ResponseEntity<Map<String, Object>> createEvent(@Valid @RequestBody CreateEventRequest request) {
        Event created = eventService.createEvent(request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Event added successfully!");
        response.put("event", created);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Delete an event
     */
    @DeleteMapping("/events/{id}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Event deleted successfully.");
        return ResponseEntity.ok(response);
    }

    /**
     * Feature 4: Display the participants registered for the event
     * Feature 5: Show total registrations count
     */
    @GetMapping("/events/{id}/participants")
    public ResponseEntity<Map<String, Object>> getEventParticipants(@PathVariable Long id) {
        Map<String, Object> data = eventService.getEventParticipants(id);
        return ResponseEntity.ok(data);
    }

    /**
     * Feature 3: Register a participant using name and email address for selected events
     * Validates required fields and email format using @Valid
     */
    @PostMapping("/events/{id}/register")
    public ResponseEntity<Map<String, Object>> registerParticipant(
            @PathVariable Long id,
            @Valid @RequestBody RegisterParticipantRequest request) {

        Participant participant = eventService.registerParticipant(id, request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful!");
        response.put("participant", participant);
        response.put("eventName", participant.getEventName());
        response.put("eventDate", participant.getEventDate());
        response.put("eventVenue", participant.getEventVenue());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * View all events a participant has registered for (by email)
     * Clearly shows which event each participant has registered for
     */
    @GetMapping("/participants")
    public ResponseEntity<List<Participant>> getRegistrationsByEmail(@RequestParam String email) {
        List<Participant> registrations = eventService.getParticipantsByEmail(email);
        return ResponseEntity.ok(registrations);
    }

    /**
     * Cancel / remove a participant registration
     */
    @DeleteMapping("/participants/{id}")
    public ResponseEntity<Map<String, Object>> cancelRegistration(@PathVariable Long id) {
        eventService.cancelRegistration(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration cancelled successfully.");
        return ResponseEntity.ok(response);
    }

    /**
     * Summary dashboard statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(eventService.getStats());
    }
}
