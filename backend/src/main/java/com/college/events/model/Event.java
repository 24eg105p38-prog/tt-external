package com.college.events.model;

import java.time.LocalDateTime;

public class Event {
    private Long id;
    private String name;
    private String eventDate;
    private String venue;
    private String description;
    private LocalDateTime createdAt;
    private int totalRegistrations;

    public Event() {}

    public Event(Long id, String name, String eventDate, String venue, String description, LocalDateTime createdAt, int totalRegistrations) {
        this.id = id;
        this.name = name;
        this.eventDate = eventDate;
        this.venue = venue;
        this.description = description;
        this.createdAt = createdAt;
        this.totalRegistrations = totalRegistrations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(int totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }
}
