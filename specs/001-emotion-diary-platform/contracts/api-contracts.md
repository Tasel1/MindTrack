# API Contracts: MindTrack Emotion Diary Platform

## Overview
This document defines the API contracts for the MindTrack emotion diary platform, specifying endpoints, request/response formats, and authentication requirements based on the feature specification.

## Base URL
`https://api.mindtrack.com/api/v1`

## Authentication
All authenticated endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

Tokens are issued upon successful login and include user role information for authorization checks.

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* optional error details */ }
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new student account.

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "2008-05-15",
  "school_id": 1,
  "parent_email": "parent@example.com"
}
```

**Validation**:
- Email must be valid format
- Password must meet strength requirements (8+ chars, mixed case, number, special char)
- Date of birth must be in the past and indicate age under 18
- Parent email required if under 13 years old
- School ID must reference an existing school

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "student@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "student"
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token"
    }
  },
  "message": "Registration successful"
}
```

#### POST /auth/login
Login to the system.

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "student@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "student"
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token"
    }
  },
  "message": "Login successful"
}
```

#### POST /auth/logout
Logout and invalidate tokens.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body**:
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "access_token": "new_jwt_access_token"
  }
}
```

### Students

#### GET /students/profile
Get current student's profile information.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "2008-05-15",
    "school_id": 1,
    "role": "student",
    "created_at": "2023-01-15T10:30:00Z"
  }
}
```

#### PUT /students/profile
Update student's profile information.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**:
```json
{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "student@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "date_of_birth": "2008-05-15",
    "school_id": 1,
    "role": "student",
    "updated_at": "2023-01-16T14:20:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Entries

#### GET /entries
Get current user's mood entries with pagination.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10, max: 50): Number of entries per page
- `startDate` (date, optional): Filter entries from this date
- `endDate` (date, optional): Filter entries until this date

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": 456,
        "date": "2023-01-15",
        "emotion": {
          "id": 1,
          "name": "радость",
          "color_code": "#FFD700"
        },
        "intensity": 8,
        "note": "Had a great day at school",
        "tags": [
          {
            "id": 1,
            "name": "учёба"
          },
          {
            "id": 2,
            "name": "друзья"
          }
        ],
        "created_at": "2023-01-15T10:30:00Z",
        "updated_at": "2023-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalEntries": 45,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### GET /entries/:id
Get a specific mood entry by ID.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Parameters**:
- `id` (path): Entry ID

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 456,
    "date": "2023-01-15",
    "emotion": {
      "id": 1,
      "name": "радость",
      "color_code": "#FFD700"
    },
    "intensity": 8,
    "note": "Had a great day at school",
    "tags": [
      {
        "id": 1,
        "name": "учёба"
      },
      {
        "id": 2,
        "name": "друзья"
      }
    ],
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2023-01-15T10:30:00Z"
  }
}
```

#### POST /entries
Create a new mood entry.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**:
```json
{
  "date": "2023-01-16",
  "emotion_id": 1,
  "intensity": 7,
  "note": "Feeling good today",
  "tag_ids": [1, 3]
}
```

**Validation**:
- Date must be in the past or present
- Emotion_id must reference an existing active emotion
- Intensity must be between 1 and 10
- Tag_ids must reference existing active tags

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 789,
    "date": "2023-01-16",
    "emotion_id": 1,
    "intensity": 7,
    "note": "Feeling good today",
    "tag_ids": [1, 3],
    "user_id": 123,
    "created_at": "2023-01-16T09:15:00Z",
    "updated_at": "2023-01-16T09:15:00Z"
  },
  "message": "Entry created successfully"
}
```

#### PUT /entries/:id
Update an existing mood entry.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Parameters**:
- `id` (path): Entry ID

**Request Body**:
```json
{
  "date": "2023-01-16",
  "emotion_id": 2,
  "intensity": 5,
  "note": "Actually feeling more neutral today",
  "tag_ids": [1, 4]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 789,
    "date": "2023-01-16",
    "emotion_id": 2,
    "intensity": 5,
    "note": "Actually feeling more neutral today",
    "tag_ids": [1, 4],
    "user_id": 123,
    "created_at": "2023-01-16T09:15:00Z",
    "updated_at": "2023-01-16T10:20:00Z"
  },
  "message": "Entry updated successfully"
}
```

#### DELETE /entries/:id
Delete a mood entry.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Parameters**:
- `id` (path): Entry ID

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

#### GET /entries/trends
Get mood trend data for visualization.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters**:
- `period` (string, default: "month"): "week" or "month" for different aggregation periods
- `startDate` (date, optional): Start date for trend calculation
- `endDate` (date, optional): End date for trend calculation

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "average_intensity": 6.2,
    "daily_data": [
      {
        "date": "2023-01-01",
        "average_intensity": 5.8,
        "entry_count": 3
      },
      {
        "date": "2023-01-02",
        "average_intensity": 6.5,
        "entry_count": 2
      }
    ]
  }
}
```

#### GET /entries/calendar
Get calendar data with highlighted days containing entries.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters**:
- `year` (integer): Year for calendar data
- `month` (integer): Month for calendar data (1-12)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "year": 2023,
    "month": 1,
    "days_with_entries": [
      {
        "day": 1,
        "entry_count": 2,
        "average_intensity": 6.5
      },
      {
        "day": 5,
        "entry_count": 1,
        "average_intensity": 4.0
      }
    ]
  }
}
```

### Psychologists

#### GET /psychologists/statistics
Get anonymized statistics for psychologists.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters**:
- `school_id` (integer, required for psychologists): School ID to get statistics for
- `startDate` (date, optional): Start date for statistics
- `endDate` (date, optional): End date for statistics

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "school_id": 1,
    "period": {
      "start_date": "2023-01-01",
      "end_date": "2023-01-31"
    },
    "active_students_count": 125,
    "emotion_distribution": [
      {
        "emotion_name": "радость",
        "percentage": 25.5
      },
      {
        "emotion_name": "грусть",
        "percentage": 18.2
      }
    ],
    "average_intensity": 5.8,
    "popular_tags": [
      {
        "tag_name": "учёба",
        "count": 89,
        "percentage": 32.1
      },
      {
        "tag_name": "друзья",
        "count": 67,
        "percentage": 24.5
      }
    ]
  }
}
```

#### GET /psychologists/export
Export anonymized statistics to PDF or Excel.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters**:
- `school_id` (integer, required): School ID to export statistics for
- `format` (string, required): "pdf" or "excel"
- `startDate` (date, optional): Start date for statistics
- `endDate` (date, optional): End date for statistics

**Response (200 OK)**:
Returns binary file (PDF or Excel) with anonymized statistics.
Content-Type: application/pdf or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

### Reference Data

#### GET /emotions
Get list of available emotions.

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "радость",
      "description": "Feeling of happiness and joy",
      "color_code": "#FFD700"
    },
    {
      "id": 2,
      "name": "грусть",
      "description": "Feeling of sadness",
      "color_code": "#4682B4"
    }
  ]
}
```

#### GET /tags
Get list of available tags.

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "учёба",
      "description": "Related to studying"
    },
    {
      "id": 2,
      "name": "друзья",
      "description": "Related to friends"
    }
  ]
}
```

#### GET /schools
Get list of available schools (for student registration).

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Central High School",
      "address": "123 Education St, City, State"
    },
    {
      "id": 2,
      "name": "Eastside Academy",
      "address": "456 Learning Ave, City, State"
    }
  ]
}
```

## Error Codes

### Authentication Errors
- `AUTH_TOKEN_EXPIRED`: Access token has expired
- `AUTH_INVALID_CREDENTIALS`: Invalid email or password
- `AUTH_UNAUTHORIZED_ACCESS`: User doesn't have permission for this action
- `AUTH_ACCOUNT_INACTIVE`: User account is inactive

### Validation Errors
- `VALIDATION_ERROR`: Request data failed validation
- `VALIDATION_DUPLICATE_EMAIL`: Email already exists
- `VALIDATION_INVALID_DATA`: Provided data doesn't meet requirements

### Resource Errors
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RESOURCE_FORBIDDEN`: User doesn't have access to this resource
- `RESOURCE_CONFLICT`: Operation conflicts with existing data

### Server Errors
- `SERVER_ERROR`: Internal server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable