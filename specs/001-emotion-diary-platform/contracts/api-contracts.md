# API Contracts: MindTrack Analytics

## Overview
This document defines the API contracts for MindTrack Analytics, specifying endpoints, request/response formats, and authentication requirements for all three user roles (Student, Psychologist, Administrator).

## Base URL
`https://api.mindtrack.analytics/api/v1`

## Authentication
All authenticated endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

Tokens include user role information for authorization checks.

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
Register a new user (student or psychologist).

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "school_id": 1,
  "date_of_birth": "2008-05-15",
  "class_grade": "10A",
  "parent_email": "parent@example.com"
}
```

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

**Headers**: `Authorization: Bearer {jwt_token}`

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

**Headers**: `Authorization: Bearer {jwt_token}`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "school_id": 1,
    "date_of_birth": "2008-05-15",
    "class_grade": "10A",
    "created_at": "2023-01-15T10:30:00Z"
  }
}
```

#### PUT /students/profile
Update student's profile information.

**Headers**: `Authorization: Bearer {jwt_token}`

**Request Body**:
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "class_grade": "10B"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": { /* updated profile */ },
  "message": "Profile updated successfully"
}
```

### Entries

#### GET /entries
Get current user's mood entries with pagination.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10, max: 50): Entries per page
- `startDate` (date, optional): Filter from this date
- `endDate` (date, optional): Filter until this date

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
          { "id": 1, "name": "учёба" },
          { "id": 2, "name": "друзья" }
        ],
        "created_at": "2023-01-15T10:30:00Z"
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

#### POST /entries
Create a new mood entry.

**Headers**: `Authorization: Bearer {jwt_token}`

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

**Response (201 Created)**:
```json
{
  "success": true,
  "data": { /* created entry */ },
  "message": "Entry created successfully"
}
```

#### GET /entries/:id
Get a specific mood entry by ID.

**Headers**: `Authorization: Bearer {jwt_token}`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": { /* entry details */ }
}
```

#### PUT /entries/:id
Update an existing mood entry.

**Headers**: `Authorization: Bearer {jwt_token}`

**Request Body**:
```json
{
  "date": "2023-01-16",
  "emotion_id": 2,
  "intensity": 5,
  "note": "Feeling more neutral today",
  "tag_ids": [1, 4]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": { /* updated entry */ },
  "message": "Entry updated successfully"
}
```

#### DELETE /entries/:id
Delete a mood entry.

**Headers**: `Authorization: Bearer {jwt_token}`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

#### GET /entries/trends
Get mood trend data for visualization.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `period` (string, default: "month"): "week" or "month"
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
      }
    ]
  }
}
```

#### GET /entries/calendar
Get calendar data with highlighted days containing entries.

**Headers**: `Authorization: Bearer {jwt_token}`

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
      }
    ]
  }
}
```

### Psychologists

#### GET /psychologists/stats
Get anonymized statistics for psychologist's school.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `startDate` (date, optional): Start date for statistics
- `endDate` (date, optional): End date for statistics
- `classGrade` (string, optional): Filter by specific class/grade

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
      { "emotion_name": "радость", "percentage": 25.5 },
      { "emotion_name": "грусть", "percentage": 18.2 }
    ],
    "average_intensity": 5.8,
    "popular_tags": [
      { "tag_name": "учёба", "count": 89, "percentage": 32.1 },
      { "tag_name": "друзья", "count": 67, "percentage": 24.5 }
    ],
    "class_comparisons": [
      { "class_grade": "10A", "average_intensity": 6.2, "entry_count": 45 },
      { "class_grade": "10B", "average_intensity": 5.5, "entry_count": 38 }
    ]
  }
}
```

#### GET /psychologists/export
Export anonymized statistics to Excel.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `format` (string, required): "xlsx"
- `startDate` (date, optional): Start date for statistics
- `endDate` (date, optional): End date for statistics

**Response**: Excel file download (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

### Administrators

#### GET /administrators/schools
Get list of all schools with summary statistics.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `districtId` (integer, optional): Filter by district
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Schools per page

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "schools": [
      {
        "id": 1,
        "name": "Central High School",
        "active_students": 125,
        "average_intensity": 5.8,
        "total_entries": 450
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalSchools": 50
    }
  }
}
```

#### GET /administrators/analytics
Get cross-school aggregated analytics.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `startDate` (date, optional): Start date for analytics
- `endDate` (date, optional): End date for analytics
- `districtId` (integer, optional): Filter by district
- `schoolIds` (array, optional): Specific schools to compare

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2023-01-01",
      "end_date": "2023-01-31"
    },
    "total_schools": 50,
    "total_active_students": 6250,
    "overall_average_intensity": 5.9,
    "emotion_distribution": [
      { "emotion_name": "радость", "percentage": 26.3 },
      { "emotion_name": "грусть", "percentage": 17.8 }
    ],
    "school_comparisons": [
      {
        "school_id": 1,
        "school_name": "Central High School",
        "active_students": 125,
        "average_intensity": 5.8,
        "total_entries": 450
      }
    ],
    "trends": [
      {
        "date": "2023-01-01",
        "average_intensity": 5.7,
        "total_entries": 150
      }
    ]
  }
}
```

#### GET /administrators/export
Export cross-school analytics to Excel.

**Headers**: `Authorization: Bearer {jwt_token}`

**Query Parameters**:
- `format` (string, required): "xlsx"
- `startDate` (date, optional): Start date
- `endDate` (date, optional): End date
- `districtId` (integer, optional): Filter by district

**Response**: Excel file download

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
- `ANONYMIZATION_THRESHOLD`: Insufficient data for anonymized statistics (minimum 5 students required)