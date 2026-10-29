package com.college.events;

import com.college.events.dto.CreateEventRequest;
import com.college.events.dto.RegisterParticipantRequest;
import com.college.events.exception.DuplicateRegistrationException;
import com.college.events.model.Event;
import com.college.events.model.Participant;
import com.college.events.service.EventService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EventSystemTests {

    @Autowired
    private EventService eventService;

    @Test
    void test1_addEventWithRequiredFields() {
        CreateEventRequest req = new CreateEventRequest(
                "Spring Boot & React Conference 2026",
                "2026-12-05",
                "Computer Science Seminar Hall",
                "Comprehensive conference exploring modern enterprise fullstack development."
        );

        Event created = eventService.createEvent(req);
        assertNotNull(created.getId(), "Event ID should be generated");
        assertEquals("Spring Boot & React Conference 2026", created.getName());
        assertEquals("2026-12-05", created.getEventDate());
        assertEquals("Computer Science Seminar Hall", created.getVenue());
        assertEquals(0, created.getTotalRegistrations());
    }

    @Test
    void test2_validateRequiredFieldsOnEventCreation() {
        // Missing name
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new CreateEventRequest("", "2026-12-01", "Hall A", "Description"));
        });

        // Missing date
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new CreateEventRequest("Name", "", "Hall A", "Description"));
        });

        // Missing venue
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new CreateEventRequest("Name", "2026-12-01", "", "Description"));
        });

        // Missing description
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new CreateEventRequest("Name", "2026-12-01", "Hall A", ""));
        });
    }

    @Test
    void test3_registerParticipantAndValidateEmailFormat() {
        // Create an event first
        Event event = eventService.createEvent(new CreateEventRequest(
                "Cyber Security Hackathon",
                "2026-12-10",
                "Cyber Lab 1",
                "Hands on capture the flag cyber security competition."
        ));

        // Invalid email format test
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.registerParticipant(event.getId(), new RegisterParticipantRequest("John Doe", "invalid-email"));
        });

        assertThrows(IllegalArgumentException.class, () -> {
            eventService.registerParticipant(event.getId(), new RegisterParticipantRequest("John Doe", "no-at-sign.com"));
        });

        // Valid registration
        Participant p1 = eventService.registerParticipant(
                event.getId(),
                new RegisterParticipantRequest("John Doe", "john.doe@college.edu")
        );

        assertNotNull(p1.getId());
        assertEquals("John Doe", p1.getName());
        assertEquals("john.doe@college.edu", p1.getEmail());

        // Verify clear event linkage
        assertEquals(event.getId(), p1.getEventId());
        assertEquals("Cyber Security Hackathon", p1.getEventName());
        assertEquals("2026-12-10", p1.getEventDate());
        assertEquals("Cyber Lab 1", p1.getEventVenue());
    }

    @Test
    void test4_preventDuplicateRegistrationForSameEvent() {
        Event event = eventService.createEvent(new CreateEventRequest(
                "Web3 Dev Summit",
                "2026-12-15",
                "Innovation Block",
                "Exploring decentralized protocols and smart contract audits."
        ));

        // First registration succeeds
        eventService.registerParticipant(event.getId(), new RegisterParticipantRequest("Alice", "alice@college.edu"));

        // Duplicate registration with same email should throw DuplicateRegistrationException
        assertThrows(DuplicateRegistrationException.class, () -> {
            eventService.registerParticipant(event.getId(), new RegisterParticipantRequest("Alice Smith", "alice@college.edu"));
        });
    }

    @Test
    void test5_displayParticipantsAndTotalRegistrationsForEvent() {
        Event event = eventService.createEvent(new CreateEventRequest(
                "Drone Racing Challenge",
                "2026-12-20",
                "College Sports Ground",
                "High speed autonomous and FPV drone racing event."
        ));

        eventService.registerParticipant(event.getId(), new RegisterParticipantRequest("Participant One", "one@college.edu"));
        eventService.registerParticipant(event.getId(), new RegisterParticipantRequest("Participant Two", "two@college.edu"));

        Map<String, Object> data = eventService.getEventParticipants(event.getId());
        assertEquals(2, data.get("totalRegistrations"));

        @SuppressWarnings("unchecked")
        List<Participant> participants = (List<Participant>) data.get("participants");
        assertEquals(2, participants.size());

        // Verify each participant explicitly shows which event they are registered for
        for (Participant p : participants) {
            assertEquals("Drone Racing Challenge", p.getEventName());
            assertEquals("2026-12-20", p.getEventDate());
            assertEquals("College Sports Ground", p.getEventVenue());
        }
    }
}
