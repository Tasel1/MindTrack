<!-- 
SYNC IMPACT REPORT:
Version change: N/A (initial creation) → 1.0.0
Modified principles: N/A
Added sections: All principles and sections (initial creation)
Removed sections: N/A
Templates requiring updates: 
  - .specify/templates/plan-template.md ✅ Updated 
  - .specify/templates/spec-template.md ✅ Updated 
  - .specify/templates/tasks-template.md ✅ Updated
Follow-up TODOs: None
-->
# MindTrack Constitution

## Core Principles

### I. Privacy and Security
User data, especially that of minors, must be protected with the highest security standards. Psychologists may only access anonymized statistics, never personally identifiable information. All data transmission must be encrypted, and access controls must be strictly enforced.

### II. Code Quality
Code must be clean, well-structured, and properly commented where necessary. Follow consistent naming conventions, maintain modular architecture, and ensure comprehensive documentation. All code must pass static analysis and review before merging.

### III. User Experience
The interface must be intuitive and accessible for teenagers aged 10-18. Use simple, clean design without unnecessary decorations. Prioritize usability, accessibility, and responsive design to ensure the application works well across devices and for users with varying technical proficiency.

### IV. Reliability
The application must handle errors gracefully and account for edge cases. Implement proper error boundaries, fallback mechanisms, and comprehensive error logging. Ensure robust input validation and graceful degradation when services are unavailable.

### V. Specification Compliance
Strictly adhere to defined functional requirements: CRUDL operations for students, anonymized statistics for psychologists, and all specified features. Any deviation from the specification must be formally reviewed and approved.

## Technology Stack Requirements

Frontend: React with standard CSS or CSS Modules (no Tailwind CSS)
Backend: Node.js/Express
Database: PostgreSQL
All technology choices must align with the specified stack and meet performance, scalability, and security requirements.

## Development Workflow

All features must follow the specification requirements. Code reviews must verify compliance with privacy requirements, user experience guidelines, and security standards. Automated tests must cover all critical user flows, edge cases, and security scenarios.

## Governance

This constitution supersedes all other development practices. Amendments require formal documentation, team approval, and migration planning. All pull requests and reviews must verify compliance with constitutional principles. Code that violates these principles will not be merged regardless of functionality.

**Version**: 1.0.0 | **Ratified**: 2026-02-15 | **Last Amended**: 2026-02-15