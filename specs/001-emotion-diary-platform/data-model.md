# Data Model: MindTrack Analytics

## Overview
This document defines the data model for MindTrack Analytics, detailing entities, their attributes, relationships, and validation rules based on the feature specification.

## Entities

### School
Represents an educational institution with associated students and psychologists.

**Fields**:
- `id` (SERIAL PRIMARY KEY): Unique identifier for the school
- `name` (VARCHAR(255) NOT NULL UNIQUE): Name of the school
- `address` (TEXT): Physical address of the school
- `contact_email` (VARCHAR(255)): Administrative contact email
- `contact_phone` (VARCHAR(50)): Administrative contact phone
- `district_id` (INTEGER): Optional district/region identifier for administrator grouping
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

**Validation Rules**:
- Name must be provided and unique
- Contact email must be valid email format if provided
- District ID is optional (for administrators who need to group schools)

### User
Represents all system users (students, psychologists, administrators).

**Fields**:
- `id` (SERIAL PRIMARY KEY): Unique identifier for the user
- `email` (VARCHAR(255) UNIQUE NOT NULL): User's email address
- `password_hash` (VARCHAR(255) NOT NULL): Hashed password using bcryptjs
- `first_name` (VARCHAR(100) NOT NULL): User's first name
- `last_name` (VARCHAR(100) NOT NULL): User's last name
- `role` (VARCHAR(20) NOT NULL): User's role ('student', 'psychologist', 'administrator')
- `school_id` (INTEGER REFERENCES schools(id)): Associated school (NULL for administrators)
- `date_of_birth` (DATE): User's date of birth (required for students)
- `class_grade` (VARCHAR(50)): Optional class or grade level (for student comparisons)
- `parent_email` (VARCHAR(255)): Parent's email for students under 13
- `is_active` (BOOLEAN DEFAULT TRUE): Account status flag
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

**Validation Rules**:
- Email must be valid email format and unique
- Password must meet strength requirements (8+ chars, mixed case, number, special char)
- Role must be one of 'student', 'psychologist', or 'administrator'
- Students must have school_id and date_of_birth
- Psychologists must have school_id
- Administrators have NULL school_id (system-wide access)
- Parent email required for students under 13 years old

### Emotion
Represents a predefined emotion type for mood entries.

**Fields**:
- `id` (SERIAL PRIMARY KEY): Unique identifier for the emotion
- `name` (VARCHAR(50) UNIQUE NOT NULL): Name of the emotion in Russian
- `description` (TEXT): Brief description of the emotion
- `color_code` (VARCHAR(7)): Hex color code for UI representation (e.g., #FFD700)
- `is_active` (BOOLEAN DEFAULT TRUE): Whether this emotion is available for selection
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

**Predefined Values**:
- радость (joy) - #FFD700
- грусть (sadness) - #4682B4
- гнев (anger) - #DC143C
- страх (fear) - #9370DB
- спокойствие (calmness) - #32CD32
- удивление (surprise) - #FFA500
- вина (guilt) - #808080
- стыд (shame) - #4B0082

**Validation Rules**:
- Name must be provided and unique
- Color code must be valid hex format if provided

### Tag
Represents a predefined category for mood entries.

**Fields**:
- `id` (SERIAL PRIMARY KEY): Unique identifier for the tag
- `name` (VARCHAR(50) UNIQUE NOT NULL): Name of the tag in Russian
- `description` (TEXT): Brief description of the tag
- `is_active` (BOOLEAN DEFAULT TRUE): Whether this tag is available for selection
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

**Predefined Values**:
- учёба (study)
- друзья (friends)
- семья (family)
- здоровье (health)
- хобби (hobby)
- будущее (future)
- одиночество (loneliness)

**Validation Rules**:
- Name must be provided and unique

### Entry
Represents a single mood recording with date, emotion, intensity, note, and tags.

**Fields**:
- `id` (SERIAL PRIMARY KEY): Unique identifier for the entry
- `user_id` (INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE): Reference to the student who created the entry
- `date` (DATE NOT NULL DEFAULT CURRENT_DATE): Date of the mood entry
- `emotion_id` (INTEGER NOT NULL REFERENCES emotions(id)): Reference to the selected emotion
- `intensity` (INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10)): Intensity level from 1-10
- `note` (TEXT): Optional text note about the mood (max 1000 characters)
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

**Validation Rules**:
- User_id must reference an existing student user
- Date must be in the past or present
- Emotion_id must reference an existing active emotion
- Intensity must be between 1 and 10 inclusive
- Note length must not exceed 1000 characters

### EntryTag
Junction table linking entries to tags (many-to-many relationship).

**Fields**:
- `entry_id` (INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE): Reference to the entry
- `tag_id` (INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE): Reference to the tag
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

**Validation Rules**:
- Both entry_id and tag_id must reference existing records
- Combination of entry_id and tag_id must be unique (PRIMARY KEY)

## Relationships

### School and User
- **One-to-Many**: One school has many users (students and psychologists)
- **Foreign Key**: `users.school_id` references `schools.id`
- **Cascade**: ON DELETE RESTRICT (cannot delete school with users)
- **Note**: Administrators have NULL school_id

### User and Entry
- **One-to-Many**: One user (student) can have many entries
- **Foreign Key**: `entries.user_id` references `users.id`
- **Cascade**: ON DELETE CASCADE (entries deleted when user deleted)

### Emotion and Entry
- **One-to-Many**: One emotion can be associated with many entries
- **Foreign Key**: `entries.emotion_id` references `emotions.id`
- **Cascade**: ON DELETE RESTRICT (cannot delete emotion with entries)

### Entry and Tag
- **Many-to-Many**: An entry can have multiple tags, and a tag can be associated with multiple entries
- **Junction Table**: `entry_tags` connects `entries` and `tags`
- **Foreign Keys**: 
  - `entry_tags.entry_id` references `entries.id`
  - `entry_tags.tag_id` references `tags.id`
- **Cascade**: ON DELETE CASCADE for both

## Indexes

### Schools Table
- Index on `name` (unique) for school lookup
- Index on `district_id` for administrator filtering

### Users Table
- Index on `email` (unique) for login
- Index on `role` for role-based queries
- Index on `school_id` for school-based filtering
- Index on `class_grade` for class comparisons

### Entries Table
- Index on `user_id` for user-specific queries
- Index on `date` for chronological ordering
- Index on `emotion_id` for emotion-based statistics
- Composite index on `(user_id, date)` for user date-range queries
- Composite index on `(school_id, date)` via JOIN for psychologist queries

### Tags Table
- Index on `name` (unique) for tag lookup

### EntryTags Table
- Index on `entry_id` for entry-tag associations
- Index on `tag_id` for tag-entry associations

## Constraints

### Referential Integrity
- Foreign key constraints ensure data consistency across related tables
- Cascade operations defined where appropriate (e.g., deleting user removes entries)
- Restrict operations prevent deletion of referenced data (schools, emotions, tags)

### Business Logic
- Students can only view/edit/delete their own entries
- Psychologists can only access anonymized aggregate data for their school
- Administrators can access aggregated data across all schools
- Data anonymization enforced at query level (no user identifiers in statistics)
- Minimum threshold of 5 students before statistics are displayed

### Data Privacy
- Passwords never stored in plain text (bcryptjs with 12 rounds)
- No personal identifiers in statistic queries
- Audit logging of all data access by psychologists and administrators
- Data retention until student graduates or turns 18

## Audit Trail
All entities include `created_at` and `updated_at` timestamps to track when records were created and modified. Additional audit logging table recommended for tracking data access by psychologists and administrators.