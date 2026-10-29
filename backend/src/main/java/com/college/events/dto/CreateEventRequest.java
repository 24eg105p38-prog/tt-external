package com.college.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateEventRequest {
    @NotBlank(message = "Event name is required")
    @Size(min = 2, max = 255, message = "Event name must be between 2 and 255 characters")
    private String name;

    @NotBlank(message = "Event date is required")
    private String date;

    @NotBlank(message = "Event venue is required")
    @Size(min = 2, max = 255, message = "Venue must be between 2 and 255 characters")
    private String venue;

    @NotBlank(message = "Short description is required")
    @Size(min = 5, max = 2000, message = "Description must be between 5 and 2000 characters")
    private String description;

    public CreateEventRequest() {}

    public CreateEventRequest(String name, String date, String venue, String description) {
        this.name = name;
        this.date = date;
        this.venue = venue;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
}
