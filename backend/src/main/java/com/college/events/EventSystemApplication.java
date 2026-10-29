package com.college.events;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EventSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventSystemApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🎓 College Event System - Spring Boot Backend Live");
        System.out.println("🌐 Server running on: http://localhost:8080");
        System.out.println("💾 H2 Console available at: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
