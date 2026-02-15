# MindTrack - Emotion Diary Platform

MindTrack is a web-based emotion diary platform designed for students to track their moods and for psychologists to access anonymized statistics. The application emphasizes privacy and security, especially for minor users.

## Features

- **Student Registration & Login**: Secure authentication with role-based access
- **Mood Tracking**: Create, view, edit, and delete mood entries with emotions, intensity, notes, and tags
- **Analytics & Visualization**: View mood trends through graphs and calendar visualization
- **Psychologist Access**: View anonymized statistics about student moods without personally identifiable information
- **Export Functionality**: Export anonymized statistics to PDF or Excel formats
- **Privacy Focused**: Strict data protection with anonymized statistics for psychologists

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication with access/refresh tokens
- Bcrypt for password hashing
- Express-validator for input validation

### Frontend
- React 18 with functional components and hooks
- React Router for navigation
- Chart.js for data visualization
- CSS Modules for styling
- Axios for API requests

## Prerequisites

- Node.js v20.x or higher
- PostgreSQL 15.x or higher
- npm or yarn package manager

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mindtrack.git
cd mindtrack
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory with the following variables:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/mindtrack_dev
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
SESSION_TIMEOUT_MINUTES=30
BACKUP_RETENTION_DAYS=30
```

#### Database Setup
```bash
# Create the database
createdb mindtrack_dev

# Run migrations
npm run migrate
```

#### Seed Sample Data (Optional)
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory with the following variables:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_TITLE=MindTrack
```

#### Start Frontend Server
```bash
npm run dev
```

## API Documentation

The API follows RESTful principles and returns JSON responses. All endpoints require authentication except for registration and login.

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login to the system
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout from the system
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Entry Endpoints
- `GET /api/v1/entries` - Get user's mood entries
- `POST /api/v1/entries` - Create a new mood entry
- `GET /api/v1/entries/:id` - Get a specific mood entry
- `PUT /api/v1/entries/:id` - Update a mood entry
- `DELETE /api/v1/entries/:id` - Delete a mood entry
- `GET /api/v1/entries/trends` - Get mood trends
- `GET /api/v1/entries/calendar` - Get calendar data

### Psychologist Endpoints
- `GET /api/v1/psychologists/stats/:schoolId` - Get anonymized statistics for a school
- `GET /api/v1/psychologists/export/:schoolId` - Export anonymized statistics

## Data Model

The application uses the following main entities:

- **User**: Student or psychologist accounts
- **Emotion**: Predefined emotion types (радость, грусть, гнев, etc.)
- **Tag**: Predefined categories for mood entries (учёба, друзья, семья, etc.)
- **Entry**: Individual mood recordings
- **School**: Educational institutions

## Security Features

- JWT-based authentication with refresh token rotation
- Passwords hashed with bcrypt
- Session timeout after 30 minutes of inactivity
- Role-based access control
- Input validation and sanitization
- Anonymized data for psychologists
- COPPA compliance for users under 13

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please file an issue in the GitHub repository.