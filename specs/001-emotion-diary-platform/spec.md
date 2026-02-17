# Feature Specification: MindTrack Analytics

**Feature Branch**: `001-emotion-diary-platform`
**Created**: 2026-02-15
**Updated**: 2026-02-16
**Status**: Draft
**Input**: User description: "Обновить концепцию MindTrack: - Проект теперь называется MindTrack Analytics. - Цель: сбор обезличенной статистики о психоэмоциональном состоянии учащихся для психологов и администраторов образования. - Ученики ведут дневник эмоций (как раньше). - Психологи получают доступ к дашборду с аналитикой по своей школе (динамика, распределение эмоций, популярные теги, сравнение классов). - Администратор системы (например, из департамента) видит сводную статистику по всем школам, может сравнивать их и выгружать отчёты. - Добавить сущность School, привязать к ней пользователей. - Убрать функционал анонимных вопросов и прямых сообщений психологу. - Все данные учеников обезличены в статистике (никакие имена не передаются)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Registration and Mood Entry (Priority: P1)

As a student, I want to register and login to the system so that I can start tracking my emotions and mood patterns.

**Why this priority**: This is the foundational functionality that enables all other features. Without the ability to register and login, students cannot access any other functionality in the system.

**Independent Test**: Can be fully tested by registering a new student account, logging in successfully, and verifying access to the mood entry interface. This delivers the core value of enabling mood tracking.

**Acceptance Scenarios**:

1. **Given** a new student visits the application, **When** they complete the registration form with valid information including school selection, **Then** they receive a confirmation and can login to the system
2. **Given** a registered student accesses the application, **When** they enter valid credentials, **Then** they are authenticated and directed to their dashboard
3. **Given** a logged-in student, **When** they navigate to the mood entry screen, **Then** they can create a new mood record with all required fields

---

### User Story 2 - Student Mood Tracking (Priority: P2)

As a student, I want to create, view, edit, and delete my mood entries so that I can track my emotional patterns over time.

**Why this priority**: This is the core functionality that provides value to students by allowing them to record and manage their emotional states with associated details.

**Independent Test**: Can be fully tested by creating mood entries with all specified fields (date, emotion, intensity, note, tags), viewing them in a list, editing existing entries, and deleting entries. This delivers the core value of mood tracking.

**Acceptance Scenarios**:

1. **Given** a logged-in student, **When** they create a new mood entry with all required fields, **Then** the entry is saved and visible in their feed
2. **Given** a student with existing mood entries, **When** they view their mood feed, **Then** they see all their entries in chronological order
3. **Given** a student viewing their mood entry, **When** they choose to edit it, **Then** they can modify all fields and save the changes
4. **Given** a student viewing their mood entry, **When** they choose to delete it, **Then** the entry is removed from their feed

---

### User Story 3 - Student Analytics and Visualization (Priority: P3)

As a student, I want to view my mood trends through graphs and calendar visualization so that I can understand my emotional patterns over time.

**Why this priority**: This provides valuable insights to students based on their recorded mood data, helping them identify patterns and triggers.

**Independent Test**: Can be fully tested by creating multiple mood entries over time and verifying that the trend graph and calendar visualization accurately display the data. This delivers the value of insight generation from collected data.

**Acceptance Scenarios**:

1. **Given** a student with multiple mood entries over time, **When** they view the trend graph, **Then** they see a linear graph showing average mood scores over weeks/months
2. **Given** a student with mood entries on various dates, **When** they view the calendar, **Then** they see days with entries highlighted appropriately

---

### User Story 4 - Psychologist School Analytics Dashboard (Priority: P4)

As a school psychologist, I want to access an analytics dashboard with anonymized statistics for selected schools so that I can monitor student emotional wellbeing and identify trends without compromising individual privacy.

**Why this priority**: This provides value to psychologists while maintaining strict privacy requirements for student data. The dashboard provides actionable insights through visualizations and comparisons across multiple schools.

**Independent Test**: Can be fully tested by logging in as a psychologist, selecting one or more schools from a dropdown, accessing the dashboard with date filters, viewing all statistics (active students, emotion distribution, mood trends, popular tags, school comparisons), and verifying all data is anonymized with no student identifiers visible.

**Acceptance Scenarios**:

1. **Given** a psychologist visits the application, **When** they login with valid credentials, **Then** they are authenticated and directed to the school selection dashboard
2. **Given** a logged-in psychologist, **When** they view the dashboard, **Then** they see a school selector dropdown with all available schools
3. **Given** a psychologist with selected schools, **When** they view the dashboard, **Then** they see date filter options (preset periods: week, month, custom range)
4. **Given** a psychologist with selected date range, **When** they view the dashboard, **Then** they see: count of active students, average mood intensity, emotion distribution chart, popular tags table, and school comparisons
5. **Given** a psychologist viewing any statistics, **When** they inspect the data, **Then** no student identifiers (names, emails, IDs) are visible anywhere in the interface
6. **Given** a psychologist viewing statistics, **When** they click export button, **Then** they can download anonymized statistics in Excel format

---

### Edge Cases

- What happens when a student tries to create a mood entry with invalid intensity values (outside 1-10 range)?
- How does the system handle duplicate mood entries for the same day?
- What occurs when a student attempts to access another student's mood entries?
- How does the system behave when a psychologist tries to access individual student records?
- What happens when the system experiences high load during peak usage times?
- How does the system handle network interruptions during mood entry?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow students to register with unique credentials and login securely with school selection
- **FR-002**: System MUST display a feed of the logged-in student's mood entries in chronological order
- **FR-003**: Students MUST be able to create new mood entries specifying: date (defaulting to today), emotion (from predefined list), intensity (1-10 scale), optional text note, and tags (from predefined list)
- **FR-004**: Students MUST be able to view detailed information for any of their mood entries
- **FR-005**: Students MUST be able to edit all fields of their existing mood entries
- **FR-006**: Students MUST be able to delete their own mood entries
- **FR-007**: Students MUST be able to view a linear graph showing average mood scores over weekly and monthly periods
- **FR-008**: Students MUST be able to view a calendar with days containing mood entries highlighted
- **FR-009**: System MUST allow psychologists to login through a dedicated login page with school-specific credentials
- **FR-010**: Psychologists MUST see a school selector dropdown to choose which schools to view
- **FR-011**: Psychologists MUST see the following anonymized statistics for selected schools: count of active students, average mood intensity, emotion distribution chart, popular tags table, and school comparisons
- **FR-012**: Psychologists MUST be able to export anonymized statistics in Excel format
- **FR-013**: System MUST ensure all psychologist views contain zero student identifiers (names, emails, IDs)
- **FR-014**: System MUST associate all users with a School entity
- **FR-020**: System MUST store all data in PostgreSQL database
- **FR-021**: System MUST expose a RESTful API for client-server communication
- **FR-022**: System interface MUST be responsive and work on tablets and mobile devices
- **FR-023**: System MUST use CSS (without Tailwind CSS) or CSS Modules for styling
- **FR-024**: System MUST NOT include anonymous questions or direct messaging features between students and psychologists

## Clarifications

### Session 2026-02-15

- Q: Should the system include password reset functionality? → A: Yes, include password reset via email with security questions
- Q: Which export formats should be supported for psychologists? → A: Support both PDF and XLSX formats
- Q: What session management policy should be implemented? → A: Automatic logout after 30 minutes of inactivity
- Q: What backup and recovery policy should be implemented? → A: Daily automated backups with 30-day retention
- Q: How should age verification be handled for student registration? → A: Standard registration for all users (no special age verification)

*Example of marking unclear requirements:*

- **FR-016**: System MUST implement privacy controls with data retention until student graduates or turns 18, with deletion available upon parent request
- **FR-017**: System MUST support up to 500 concurrent users
- **FR-018**: System MUST provide password reset functionality via email with security questions for account recovery

### Key Entities

- **Student**: Represents a student user with unique identifier, credentials, profile information, and associated mood entries
- **MoodEntry**: Represents a single mood recording with date, emotion, intensity (1-10), optional text note, tags, and reference to the owning student
- **Psychologist**: Represents a psychologist user with credentials and access to anonymized aggregate statistics
- **School**: Represents an educational institution with associated students and aggregate statistics
- **Emotion**: Represents a predefined emotion type (радость, грусть, гнев, страх, спокойствие, удивление, вина, стыд)
- **Tag**: Represents a predefined category for mood entries (учёба, друзья, семья, здоровье, хобби, будущее, одиночество)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can complete registration and login within 2 minutes
- **SC-002**: Students can create a new mood entry in under 30 seconds
- **SC-003**: Students can view their mood history and analytics with 99% uptime
- **SC-004**: Psychologists can access anonymized school statistics without seeing any personally identifiable student information
- **SC-005**: Exported reports contain only aggregate data without individual student identifiers
- **SC-006**: The interface is usable on devices ranging from 320px (mobile) to 1200px (desktop) width
- **SC-007**: Students report satisfaction with the simplicity and intuitiveness of the interface (target: 80% positive feedback)
- **SC-008**: Psychologists can generate and download school statistics reports in under 10 seconds
- **SC-009**: School dashboard statistics load within 3 seconds for date ranges up to 1 year
- **SC-010**: Psychologists can select and compare multiple schools simultaneously