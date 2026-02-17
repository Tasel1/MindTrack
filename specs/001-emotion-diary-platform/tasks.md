---

description: "Task list for MindTrack Analytics implementation"
---

# Tasks: MindTrack Analytics

**Input**: Design documents from `/specs/001-emotion-diary-platform/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume web app structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project root directory structure with backend/ and frontend/ folders
- [X] T002 [P] Initialize backend package.json with Express, JWT, bcryptjs, pg, exceljs dependencies
- [X] T003 [P] Initialize frontend package.json with React, React Router, Chart.js, CSS Modules dependencies
- [X] T004 [P] Create initial .gitignore for both backend and frontend
- [X] T005 [P] Set up basic Vite configuration for frontend in frontend/vite.config.js
- [X] T006 [P] Create .env.example files for both backend and frontend
- [X] T007 [P] Create Docker configuration files (docker-compose.yml, backend/Dockerfile, frontend/Dockerfile)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 [P] Create database configuration in backend/src/config/database.js
- [X] T009 [P] Create JWT configuration in backend/src/config/jwt.js
- [X] T010 [P] Create School model in backend/src/models/School.js
- [X] T011 [P] Create User model in backend/src/models/User.js
- [X] T012 [P] Create Emotion model in backend/src/models/Emotion.js
- [X] T013 [P] Create Tag model in backend/src/models/Tag.js
- [X] T014 [P] Create Entry model in backend/src/models/Entry.js
- [X] T015 [P] Create EntryTag model in backend/src/models/EntryTag.js
- [X] T016 Create database migrations in backend/migrations/ (001-006 for all tables)
- [X] T017 Create migration runner script in backend/migrations/run-migrations.js
- [X] T018 [P] Implement authentication middleware in backend/src/middleware/auth.js
- [X] T019 [P] Implement validation middleware in backend/src/middleware/validation.js
- [X] T020 [P] Implement error handling middleware in backend/src/middleware/errorHandler.js
- [X] T021 [P] Setup API routing structure in backend/src/routes/
- [X] T022 [P] Create base Express app in backend/src/app.js
- [X] T023 [P] Create server entry point in backend/server.js
- [X] T024 [P] Create authentication service in backend/src/services/authService.js
- [X] T025 [P] Create user service in backend/src/services/userService.js
- [X] T026 [P] Create school service in backend/src/services/schoolService.js
- [X] T027 [P] Create auth controller in backend/src/controllers/authController.js
- [X] T028 [P] Create authentication routes in backend/src/routes/auth.js
- [X] T029 [P] Create frontend API service in frontend/src/services/api.js
- [X] T030 [P] Create authentication service in frontend/src/services/authService.js
- [X] T031 [P] Create useAuth hook in frontend/src/hooks/useAuth.jsx
- [X] T032 [P] Create global styles in frontend/src/styles/globals.css
- [X] T033 [P] Create App component structure in frontend/src/App.jsx
- [X] T034 [P] Create Header component in frontend/src/components/common/Header.jsx
- [X] T035 [P] Create Login page in frontend/src/pages/Login.jsx
- [X] T036 [P] Create Register page in frontend/src/pages/Register.jsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Student Registration and Mood Entry (Priority: P1) 🎯 MVP

**Goal**: Enable students to register, login, and create their first mood entry

**Independent Test**: Can be fully tested by registering a new student account, logging in successfully, and verifying access to the mood entry interface. This delivers the core value of enabling mood tracking.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T037 [P] [US1] Unit test for User model in backend/tests/unit/User.test.js
- [ ] T038 [P] [US1] Unit test for School model in backend/tests/unit/School.test.js
- [ ] T039 [P] [US1] Contract test for auth registration endpoint in backend/tests/api/auth.test.js
- [ ] T040 [P] [US1] Contract test for auth login endpoint in backend/tests/api/auth.test.js
- [ ] T041 [P] [US1] Integration test for authentication flow in backend/tests/integration/auth-flow.test.js

### Implementation for User Story 1

- [ ] T042 [US1] Add school selection to registration form in frontend/src/pages/Register.jsx
- [ ] T043 [US1] Add school_id validation in backend/src/controllers/authController.js
- [ ] T044 [US1] Create student controller in backend/src/controllers/studentController.js
- [ ] T045 [US1] Create student routes in backend/src/routes/students.js
- [ ] T046 [US1] Create student profile page in frontend/src/pages/Profile.jsx
- [ ] T047 [US1] Create student dashboard page in frontend/src/pages/Dashboard.jsx
- [ ] T048 [US1] Update Header component to show student-specific navigation in frontend/src/components/Header.jsx
- [ ] T049 [US1] Update App routing to include student routes in frontend/src/App.jsx
- [ ] T050 [US1] Add role-based access control in frontend/src/hooks/useAuth.jsx
- [ ] T051 [US1] Add school seed data in backend/seeds/seed-data.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Student Mood Tracking (Priority: P2)

**Goal**: Enable students to create, view, edit, and delete their mood entries

**Independent Test**: Can be fully tested by creating mood entries with all specified fields (date, emotion, intensity, note, tags), viewing them in a list, editing existing entries, and deleting entries. This delivers the core value of mood tracking.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T052 [P] [US2] Unit test for Entry model in backend/tests/unit/Entry.test.js
- [ ] T053 [P] [US2] Unit test for EntryTag model in backend/tests/unit/EntryTag.test.js
- [ ] T054 [P] [US2] Contract test for entries endpoints in backend/tests/api/entries.test.js
- [ ] T055 [P] [US2] Integration test for entry CRUD operations in backend/tests/integration/entry-crud.test.js

### Implementation for User Story 2

- [ ] T056 [P] [US2] Create entry service in backend/src/services/entryService.js
- [ ] T057 [US2] Create entry controller in backend/src/controllers/entryController.js
- [ ] T058 [US2] Create entries routes in backend/src/routes/entries.js
- [ ] T059 [US2] Create Entries list page in frontend/src/pages/Entries.jsx
- [ ] T060 [US2] Create EntryCard component in frontend/src/components/entries/EntryCard.jsx
- [ ] T061 [US2] Create EntryForm component in frontend/src/components/entries/EntryForm.jsx
- [ ] T062 [US2] Create ViewEntry page in frontend/src/pages/ViewEntry.jsx
- [ ] T063 [US2] Create EditEntry page in frontend/src/pages/EditEntry.jsx
- [ ] T064 [US2] Create CreateEntry page in frontend/src/pages/CreateEntry.jsx
- [ ] T065 [US2] Add entry API service methods in frontend/src/services/entryService.js
- [ ] T066 [US2] Create useEntries hook in frontend/src/hooks/useEntries.jsx
- [ ] T067 [US2] Add entry validation middleware in backend/src/middleware/validation.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Student Analytics and Visualization (Priority: P3)

**Goal**: Enable students to view mood trends through graphs and calendar visualization

**Independent Test**: Can be fully tested by creating multiple mood entries over time and verifying that the trend graph and calendar visualization accurately display the data. This delivers the value of insight generation from collected data.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T068 [P] [US3] Contract test for entries/trends endpoint in backend/tests/api/entries.test.js
- [ ] T069 [P] [US3] Contract test for entries/calendar endpoint in backend/tests/api/entries.test.js
- [ ] T070 [P] [US3] Unit test for statistic calculations in backend/tests/unit/statistics.test.js

### Implementation for User Story 3

- [ ] T071 [P] [US3] Create statistic service in backend/src/services/statisticService.js
- [ ] T072 [US3] Add trends endpoint to entry controller in backend/src/controllers/entryController.js
- [ ] T073 [US3] Add calendar endpoint to entry controller in backend/src/controllers/entryController.js
- [ ] T074 [US3] Create MoodTrendChart component in frontend/src/components/charts/MoodTrendChart.jsx
- [ ] T075 [US3] Create EmotionDistributionChart component in frontend/src/components/charts/EmotionDistributionChart.jsx
- [ ] T076 [US3] Create CalendarView component in frontend/src/components/entries/CalendarView.jsx
- [ ] T077 [US3] Add chart.js configuration in frontend/src/utils/chartConfig.js
- [ ] T078 [US3] Add date utility functions in frontend/src/utils/helpers.js
- [ ] T079 [US3] Update dashboard to include trends and calendar in frontend/src/pages/Dashboard.jsx

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Psychologist School Analytics Dashboard (Priority: P4)

**Goal**: Enable psychologists to access anonymized statistics for their school

**Independent Test**: Can be fully tested by logging in as a psychologist, accessing the school-specific dashboard with date filters, viewing all statistics (active students, emotion distribution, mood trends, popular tags, class comparisons), and verifying all data is anonymized with no student identifiers visible.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T080 [P] [US4] Contract test for psychologist statistics endpoint in backend/tests/api/psychologist.test.js
- [ ] T081 [P] [US4] Contract test for psychologist export endpoint in backend/tests/api/psychologist.test.js
- [ ] T082 [P] [US4] Unit test for anonymized statistic calculations in backend/tests/unit/anonymized-stats.test.js
- [ ] T083 [P] [US4] Integration test for psychologist access control in backend/tests/integration/psychologist-access.test.js

### Implementation for User Story 4

- [X] T084 [P] [US4] Add psychologist role to User model in backend/src/models/User.js
- [X] T085 [US4] Add school-specific statistics methods to statisticService in backend/src/services/statisticService.js
- [X] T086 [US4] Create psychologist controller in backend/src/controllers/psychologistController.js
- [X] T087 [US4] Create psychologist routes in backend/src/routes/psychologists.js
- [ ] T088 [US4] Create PsychologistDashboard page in frontend/src/pages/PsychologistDashboard.jsx
- [ ] T089 [US4] Create Statistics page for school analytics in frontend/src/pages/Statistics.jsx
- [ ] T090 [US4] Create StatisticCard component in frontend/src/components/statistics/StatisticCard.jsx
- [ ] T091 [US4] Add school comparison visualization in frontend/src/components/charts/SchoolComparisonChart.jsx
- [ ] T092 [US4] Add date filter component in frontend/src/components/common/DateFilter.jsx
- [ ] T093 [US4] Add school selector dropdown component in frontend/src/components/common/SchoolSelector.jsx
- [ ] T094 [US4] Add get all schools endpoint for psychologist in backend/src/routes/psychologists.js
- [ ] T095 [US4] Add multi-school statistics API endpoint in backend/src/controllers/psychologistController.js
- [ ] T096 [US4] Add Excel export functionality using exceljs in backend/src/services/statisticService.js
- [ ] T097 [US4] Add anonymization threshold checks in backend/src/services/statisticService.js
- [ ] T098 [US4] Update Header to show psychologist navigation in frontend/src/components/Header.jsx
- [ ] T099 [US4] Update App routing to include psychologist routes in frontend/src/App.jsx

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - REMOVED (Administrator not needed)

**Note**: Administrator Cross-School Analytics has been removed. Psychologists can now select and view multiple schools directly.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T116 [P] Documentation updates in README.md
- [ ] T117 Code cleanup and refactoring to maintain code quality standards
- [ ] T118 Performance optimization for database queries
- [ ] T119 [P] Additional unit tests in backend/tests/unit/
- [ ] T120 [P] Additional integration tests in backend/tests/integration/
- [ ] T121 Security hardening and privacy compliance verification
- [ ] T122 User experience validation for target demographic (ages 10-18)
- [ ] T123 Accessibility improvements for inclusive design
- [ ] T124 Run quickstart.md validation
- [ ] T125 Add responsive design improvements to CSS modules
- [ ] T126 Create comprehensive error handling across frontend components
- [ ] T127 Add loading states and user feedback mechanisms
- [ ] T128 Implement data retention policy enforcement
- [ ] T129 Add comprehensive logging for audit trails
- [ ] T130 Create backup and recovery procedures
- [ ] T131 Add performance monitoring and metrics collection
- [ ] T132 Conduct load testing to validate 500 concurrent user support
- [ ] T133 Optimize API endpoints to meet <500ms response time targets
- [ ] T134 Optimize frontend to meet <2 second page load targets
- [ ] T135 Add COPPA compliance features (parental consent for under 13)
- [ ] T136 Add audit logging for psychologist and administrator data access

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US2 (needs entries to visualize)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US2 (needs entries for statistics)
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Depends on US4 (builds on statistics infrastructure)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Unit test for User model in backend/tests/unit/User.test.js"
Task: "Unit test for School model in backend/tests/unit/School.test.js"
Task: "Contract test for auth registration endpoint in backend/tests/api/auth.test.js"
Task: "Contract test for auth login endpoint in backend/tests/api/auth.test.js"
Task: "Integration test for authentication flow in backend/tests/integration/auth-flow.test.js"

# Launch all models for User Story 1 together:
Task: "Add school selection to registration form in frontend/src/pages/Register.jsx"
Task: "Add school_id validation in backend/src/controllers/authController.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

## Task Summary

| Phase | Description | Task Count | Story |
|-------|-------------|------------|-------|
| Phase 1 | Setup | 7 | N/A |
| Phase 2 | Foundational | 29 | N/A |
| Phase 3 | Student Registration | 15 | US1 |
| Phase 4 | Student Mood Tracking | 16 | US2 |
| Phase 5 | Student Analytics | 9 | US3 |
| Phase 6 | Psychologist Dashboard | 16 | US4 |
| Phase 7 | REMOVED (Administrator) | 0 | US5 |
| Phase 8 | Polish | 21 | N/A |
| **Total** | **All Phases** | **113** | **All** |
