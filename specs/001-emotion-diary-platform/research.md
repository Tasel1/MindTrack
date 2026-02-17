# Research: MindTrack Analytics

## Overview
This document contains research findings for the MindTrack Analytics implementation, focusing on technology decisions, best practices, and solutions to support the new three-role system (Student/Psychologist/Administrator).

## Technology Decisions

### Frontend Architecture
**Decision**: Use React with functional components and hooks, combined with React Router for navigation and CSS Modules for styling.

**Rationale**: React is the most widely adopted frontend library with extensive community support. Functional components with hooks provide a modern, efficient approach to building UIs. CSS Modules offer scoped styling without the complexity of Tailwind CSS, meeting the requirement for clean CSS without external component libraries.

**Alternatives considered**:
- Vue.js: Popular alternative but less ecosystem support for this project's specific needs
- Angular: More complex framework than needed for this application
- Vanilla JavaScript: Would require more custom code for state management and UI updates

### State Management
**Decision**: Use React Context API with custom hooks for state management instead of Redux.

**Rationale**: For this application size and complexity, React's built-in Context API with custom hooks provides sufficient state management capabilities without introducing additional dependencies. The application doesn't require the advanced features of Redux.

### Charting Library
**Decision**: Use Chart.js for data visualization components.

**Rationale**: Chart.js is lightweight, well-documented, and provides the necessary chart types for mood trend visualization (line charts for trends, pie charts for emotion distribution). It integrates well with React and offers customization options.

**Alternatives considered**:
- D3.js: More powerful but overly complex for this use case
- Recharts: Good option but Chart.js has simpler API for basic charting needs

### Backend Architecture
**Decision**: Use Node.js with Express framework following MVC pattern.

**Rationale**: Node.js with Express provides a lightweight, flexible backend solution that pairs well with the React frontend. The MVC pattern ensures proper separation of concerns and maintainability.

### Authentication Strategy
**Decision**: JWT (JSON Web Tokens) with access and refresh tokens stored in httpOnly cookies or localStorage.

**Rationale**: JWT with role-based access control provides strong security while maintaining stateless authentication. Using both access and refresh tokens balances security with user experience.

### Database Schema
**Decision**: PostgreSQL with normalized schema including schools, users, entries, emotions, tags, and entry_tags tables.

**Rationale**: PostgreSQL provides robust relational data modeling, excellent performance for analytical queries, and strong data integrity guarantees. The normalized schema ensures data consistency and reduces redundancy.

## Best Practices Researched

### Multi-Tenant Architecture
**Decision**: School-based multi-tenancy with row-level security through user-school associations.

**Rationale**: Each school's data is logically separated through foreign key relationships, ensuring psychologists see only their school's data while administrators can access aggregated data across all schools.

### Data Anonymization
**Decision**: Aggregate statistics computed at query time with no student identifiers included in results.

**Rationale**: Computing statistics on-the-fly ensures data is always current and no cached data can accidentally expose identifiers. All aggregation queries use COUNT, AVG, GROUP BY without selecting user-specific fields.

### Role-Based Access Control (RBAC)
**Decision**: Three distinct roles (Student, Psychologist, Administrator) with middleware-based authorization.

**Rationale**: Clear separation of concerns with each role having specific permissions:
- **Student**: CRUDL on own entries only
- **Psychologist**: Read-only anonymized statistics for assigned school
- **Administrator**: Read-only aggregated statistics across all schools

## Solutions to Unknowns

### School Assignment
**Unknown**: How should users be associated with schools?
**Solution**: 
- Students select school during registration (required field)
- Psychologists are assigned to a specific school by administrator
- Administrators have system-wide access without school restriction

### Class/Grade Comparisons
**Unknown**: How to implement class comparisons for psychologists?
**Solution**: Add optional "class" or "grade" field to user profile, aggregate statistics by class/grade within school, display as comparative bar charts.

### Cross-School Aggregation
**Unknown**: How to aggregate data across multiple schools for administrators?
**Solution**: Use SQL GROUP BY with school_id, compute statistics per school, then compute overall averages. Ensure minimum school size thresholds to prevent identification of individual students.

## Security Considerations

### Data Privacy
- All passwords hashed with bcryptjs (12 rounds)
- JWT tokens with short expiration (15 minutes for access, 7 days for refresh)
- Role verification on every API request
- School isolation enforced at database query level

### Anonymization Thresholds
- Minimum 5 students per school before statistics are displayed
- Suppress categories with fewer than 5 entries
- Round percentages to nearest whole number to prevent reverse engineering

## Performance Optimization

### Database Indexing
- Index on user_id for entries table (fast student queries)
- Index on school_id for users table (fast school queries)
- Index on date for entries table (fast date range queries)
- Composite index on (school_id, date) for psychologist queries

### Query Optimization
- Use materialized views for expensive cross-school aggregations
- Cache administrator dashboard results for 5 minutes
- Paginate student entry lists (10-50 per page)

## Compliance Requirements

### COPPA Compliance
- Parental consent required for users under 13
- Data retention until student graduates or turns 18
- Deletion available upon parent request
- No third-party data sharing

### FERPA Compliance
- Educational records protected
- Access limited to authorized personnel
- Audit logging of all data access
- No personally identifiable information in statistics

## Conclusion
The research phase has resolved all unknowns from the technical context and established a solid foundation for implementing MindTrack Analytics. The chosen technologies align with the specified requirements while following industry best practices for security, performance, and maintainability. The three-role system (Student/Psychologist/Administrator) is fully supported by the architecture.