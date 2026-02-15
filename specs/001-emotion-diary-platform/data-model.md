# Data Model: MindTrack Emotion Diary Platform

## Overview
This document defines the data model for the MindTrack emotion diary platform, detailing entities, their attributes, relationships, and validation rules based on the feature specification.

## Entities

### User
Represents both students and psychologists in the system.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the user
- `email` (String): User's email address (unique, required)
- `password_hash` (String): Hashed password using bcrypt (required)
- `first_name` (String): User's first name (required)
- `last_name` (String): User's last name (required)
- `role` (Enum): User's role ('student' or 'psychologist') (required)
- `school_id` (UUID/Integer): Reference to the school entity (required for students)
- `date_of_birth` (Date): User's date of birth (required for students, for age verification)
- `parent_email` (String): Parent's email for account verification (required for students under 13)
- `is_active` (Boolean): Account status flag (default: true)
- `created_at` (DateTime): Timestamp of account creation
- `updated_at` (DateTime): Timestamp of last update

**Validation Rules**:
- Email must be valid email format
- Password must meet minimum strength requirements (8+ chars, mixed case, number, special char)
- Role must be one of 'student' or 'psychologist'
- Date of birth must be in the past
- For students: parent_email required if under 13 years old

### School
Represents an educational institution with associated students and aggregate statistics.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the school
- `name` (String): Name of the school (required)
- `address` (String): Physical address of the school
- `contact_email` (String): Administrative contact email
- `contact_phone` (String): Administrative contact phone
- `created_at` (DateTime): Timestamp of school creation
- `updated_at` (DateTime): Timestamp of last update

**Validation Rules**:
- Name must be provided and not empty
- Contact email must be valid email format if provided

### Emotion
Represents a predefined emotion type for mood entries.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the emotion
- `name` (String): Name of the emotion in Russian (required)
- `description` (Text): Brief description of the emotion (optional)
- `color_code` (String): Hex color code for UI representation (optional)
- `is_active` (Boolean): Whether this emotion is available for selection (default: true)
- `created_at` (DateTime): Timestamp of emotion creation
- `updated_at` (DateTime): Timestamp of last update

**Predefined Values**:
- радость (joy)
- грусть (sadness)
- гнев (anger)
- страх (fear)
- спокойствие (calmness)
- удивление (surprise)
- вина (guilt)
- стыд (shame)

**Validation Rules**:
- Name must be provided and unique
- Color code must be valid hex format if provided

### Tag
Represents a predefined category for mood entries.

**Fields**:
- `id` (UUID/Integer): Unique identifier for the tag
- `name` (String): Name of the tag in Russian (required)
- `description` (Text): Brief description of the tag (optional)
- `is_active` (Boolean): Whether this tag is available for selection (default: true)
- `created_at` (DateTime): Timestamp of tag creation
- `updated_at` (DateTime): Timestamp of last update

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
- `id` (UUID/Integer): Unique identifier for the entry
- `user_id` (UUID/Integer): Reference to the user who created the entry (required)
- `date` (Date): Date of the mood entry (default: current date)
- `emotion_id` (UUID/Integer): Reference to the selected emotion (required)
- `intensity` (Integer): Intensity level from 1-10 (required)
- `note` (Text): Optional text note about the mood (optional)
- `created_at` (DateTime): Timestamp of entry creation
- `updated_at` (DateTime): Timestamp of last update

**Validation Rules**:
- User_id must reference an existing user
- Date must be in the past or present
- Emotion_id must reference an existing active emotion
- Intensity must be between 1 and 10 inclusive
- Note length must not exceed 1000 characters

### EntryTag
Junction table linking entries to tags (many-to-many relationship).

**Fields**:
- `entry_id` (UUID/Integer): Reference to the entry (required)
- `tag_id` (UUID/Integer): Reference to the tag (required)
- `created_at` (DateTime): Timestamp of association creation

**Validation Rules**:
- Both entry_id and tag_id must reference existing records
- Combination of entry_id and tag_id must be unique

## Relationships

### User and Entry
- One-to-Many: One user can have many entries
- Foreign key: `entries.user_id` references `users.id`
- Cascade delete: When a user is deleted, their entries are also deleted

### Emotion and Entry
- One-to-Many: One emotion can be associated with many entries
- Foreign key: `entries.emotion_id` references `emotions.id`
- Restrict delete: Cannot delete an emotion if it's associated with entries

### Entry and Tag
- Many-to-Many: An entry can have multiple tags, and a tag can be associated with multiple entries
- Junction table: `entry_tags` connects `entries` and `tags`
- Foreign keys: `entry_tags.entry_id` references `entries.id`, `entry_tags.tag_id` references `tags.id`

### User and School
- Many-to-One: Many users (students) belong to one school
- Foreign key: `users.school_id` references `schools.id`
- Restrict delete: Cannot delete a school if it has associated students

## Indexes

### Users Table
- Index on `email` (unique) for efficient login
- Index on `role` for role-based queries
- Index on `school_id` for school-based filtering

### Entries Table
- Index on `user_id` for user-specific queries
- Index on `date` for chronological ordering
- Index on `emotion_id` for emotion-based statistics
- Composite index on `(user_id, date)` for user date-range queries

### Tags Table
- Index on `name` (unique) for tag lookup

### EntryTags Table
- Index on `entry_id` for entry-tag associations
- Index on `tag_id` for tag-entry associations
- Composite index on `(entry_id, tag_id)` for unique constraint

## Constraints

### Referential Integrity
- Foreign key constraints ensure data consistency across related tables
- Cascade operations defined where appropriate (e.g., deleting user removes entries)

### Business Logic
- Students cannot view other students' entries
- Psychologists can only access anonymized aggregate data
- Data retention policy: entries deleted when user account is deleted or upon parent request

## Audit Trail
All entities include `created_at` and `updated_at` timestamps to track when records were created and modified.