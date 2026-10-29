# TT External — College Event Registration System 🎓

Full-stack college event registration application built for the **TT External** lab / practical project.

* **Frontend**: **React.js 18** (Vite, Hooks, Modular Components)
* **Backend**: **Java 21 & Spring Boot 3.2.5** REST API
* **Database**: **H2 Database** (persistent, relational storage with foreign keys & unique constraints)

---

## 💻 How to Open and Run in VS Code

### Step 1: Open Folder in VS Code
Open VS Code, click **File ➔ Open Folder...**, and select:
```
/Users/gadevinay/.gemini/antigravity/scratch/TT external
```
*(Or in terminal, simply run `code "/Users/gadevinay/.gemini/antigravity/scratch/TT external"`)*

### Step 2: Run the Project

You can run the application using any of the following methods in VS Code:

#### Option A: One-Click Startup Script (Terminal)
Open the integrated terminal (`Ctrl + \`` or `Cmd + \``) and run:
```bash
./start.sh
```
This automatically compiles and starts both the **Spring Boot Backend** and **React Frontend**!

#### Option B: VS Code Tasks
Press `Ctrl + Shift + B` (or `Cmd + Shift + B` on Mac) and select:
* `4. Start Full Application (Backend + Frontend)`
* Or run individual services:
  * `1. Run Spring Boot Backend (Port 8080)`
  * `2. Run React Frontend (Port 5173)`

#### Option C: Run Separately in Two Terminals
* **Terminal 1 (Backend)**:
  ```bash
  ./run-backend.sh
  ```
* **Terminal 2 (Frontend)**:
  ```bash
  ./run-frontend.sh
  ```

---

## 🌐 Application URLs

* **React Frontend**: **[http://localhost:5173](http://localhost:5173)** *(Dev Server with Fast Refresh)*
* **Spring Boot Fullstack**: **[http://localhost:8080](http://localhost:8080)** *(API + Embedded React App)*
* **H2 Database Console**: **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)**  
  *(JDBC URL: `jdbc:h2:file:./data/eventsdb`, User: `sa`, Password: blank)*

---

## 🎯 Features Implemented & Verification

### 1. ➕ Add an Event
* Organizers can create an event by providing:
  * **Event Name**
  * **Date**
  * **Venue**
  * **Short Description**
* **Validation**:
  * Spring Boot DTO `@Valid` annotations enforce `@NotBlank` and `@Size`.
  * React form displays inline validation warnings if any field is left empty.

### 2. 📋 Display the List of Available Events
* The home screen displays all available college events with:
  * Event Name
  * Scheduled Date
  * Venue
  * Short Description
  * Total number of registrations badge
* Includes real-time search filtering.

### 3. ✍️ Register for Selected Events Using Name & Email Address
* Clicking **"✍️ Register Now"** on any available event opens the registration modal.
* **Validation**:
  * **Required fields**: Name and Email address are required.
  * **Email format**: Strict regex pattern and `@Email` validation reject invalid email addresses (e.g. `bad-email`, `@test.com`, `user@`).
  * **Duplicate Prevention**: Database unique constraint (`uq_event_email`) prevents duplicate registrations for the same event with the same email.

### 4. 👥 Display Participants Registered for the Event
* Clicking **"👥 Participants (N)"** on any event card opens the attendee roster modal.
* Displays:
  * Participant Name
  * Email Address
  * Registration Date/Time
  * **Clear Event Linkage**: Shows the event name, date, and venue for every participant record.
* Includes participant search, cancellation/removal, and one-click **Export to CSV**.

### 5. 🔢 Show the Total Number of Registrations for Each Event
* Conspicuously displayed on every single event card in a blue badge:  
  `👥 Total Registrations: X students`
* Highlighted at the top of the attendee roster modal and in the dashboard hero banner.

---

## 📁 Project Directory Structure

```
TT external/
├── .vscode/
│   ├── launch.json              # VS Code run/debug configurations
│   ├── settings.json            # VS Code Java & formatting settings
│   └── tasks.json               # VS Code build & run tasks
├── backend/
│   ├── pom.xml                  # Spring Boot 3.2.5 Maven configuration
│   ├── src/main/java/com/college/events/
│   │   ├── EventSystemApplication.java        # Main Spring Boot entry
│   │   ├── config/
│   │   │   ├── CorsConfig.java                # CORS settings
│   │   │   └── GlobalExceptionHandler.java    # Error handling for validations & duplicates
│   │   ├── controller/
│   │   │   └── EventController.java           # REST API endpoints
│   │   ├── dto/
│   │   │   ├── CreateEventRequest.java        # Validation rules for event creation
│   │   │   └── RegisterParticipantRequest.java# Validation rules & email regex
│   │   ├── exception/
│   │   │   ├── DuplicateRegistrationException.java
│   │   │   └── ResourceNotFoundException.java
│   │   ├── model/
│   │   │   ├── Event.java                     # Event entity
│   │   │   └── Participant.java               # Participant entity (with event metadata)
│   │   ├── repository/
│   │   │   ├── EventRepository.java           # SQL queries for events & total counts
│   │   │   └── ParticipantRepository.java     # SQL queries for participants & email checks
│   │   └── service/
│   │       └── EventService.java              # Business logic & email format check
│   └── src/main/resources/
│       ├── application.properties             # H2 database configuration (Port 8080)
│       ├── schema.sql                         # DDL table creation with foreign keys
│       ├── data.sql                           # Seed data
│       └── static/                            # Built React production assets
├── frontend/
│   ├── package.json             # React 18 & Vite configuration
│   ├── vite.config.js           # Proxy configuration to port 8080
│   ├── index.html               # Frontend HTML5 entry
│   └── src/
│       ├── App.jsx              # Main React application controller
│       ├── index.css            # Responsive CSS styles
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── EventCard.jsx    # Event card with total registrations badge
│       │   ├── AddEventModal.jsx# Form with field validations
│       │   ├── RegisterModal.jsx# Form with name & email validation
│       │   ├── ParticipantsModal.jsx # Attendee roster with event linkage
│       │   └── MyRegistrations.jsx   # Ticket lookup by email
│       └── services/
│           └── api.js           # REST API fetch client
├── start.sh                     # One-click startup script (starts both backend & frontend)
├── run-backend.sh               # Starts Spring Boot backend
├── run-frontend.sh              # Starts React frontend
├── package.json                 # Root package scripts
└── README.md                    # Project documentation
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List all available events with `totalRegistrations` |
| `GET` | `/api/events/{id}` | Get event details by ID |
| `POST` | `/api/events` | Add event (validates `name`, `date`, `venue`, `description`) |
| `DELETE` | `/api/events/{id}` | Delete event and cascade delete participants |
| `GET` | `/api/events/{id}/participants` | Display participants registered for the event |
| `POST` | `/api/events/{id}/register` | Register participant (validates `name` and `email` format) |
| `GET` | `/api/participants?email=...` | List all events a participant has registered for |
| `DELETE` | `/api/participants/{id}` | Cancel participant registration |
| `GET` | `/api/stats` | Summary statistics (total events and registrations) |
