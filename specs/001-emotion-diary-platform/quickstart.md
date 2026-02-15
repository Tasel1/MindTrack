# Quickstart Guide: MindTrack Emotion Diary Platform

## Overview
This guide provides instructions for setting up and running the MindTrack emotion diary platform locally for development and testing purposes.

## Prerequisites
- Node.js v20.x or higher
- PostgreSQL 15.x or higher
- npm or yarn package manager
- Git

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/mindtrack.git
cd mindtrack
```

### 2. Set Up Environment Variables
Copy the example environment files and configure them for your local setup:

```bash
# Backend
cd backend
cp .env.example .env
```

Edit the `.env` file with your local configuration:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/mindtrack_dev
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

```bash
# Frontend
cd ../frontend
cp .env.example .env
```

Edit the frontend `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_TITLE=MindTrack
```

### 3. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### 4. Set Up Database

#### Create Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create databases
CREATE DATABASE mindtrack_dev;
CREATE DATABASE mindtrack_test;

# Create user and grant privileges (optional but recommended)
CREATE USER mindtrack_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mindtrack_dev TO mindtrack_user;
GRANT ALL PRIVILEGES ON DATABASE mindtrack_test TO mindtrack_user;

# Exit psql
\q
```

#### Run Migrations
```bash
cd backend
npm run migrate  # or node migrations/run-migrations.js
```

#### Seed Reference Data (Optional)
```bash
npm run seed  # or node seeds/seed-data.js
```

### 5. Run the Applications

#### Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`.

#### Frontend Server
```bash
cd frontend
npm run dev
```
The frontend server will start on `http://localhost:3000`.

## Development Workflow

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Running Linters
```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## API Documentation
The API is documented in the contracts directory:
- API contracts: `specs/001-emotion-diary-platform/contracts/api-contracts.md`

## Database Schema
The database schema is defined through migrations in:
- Migrations: `backend/migrations/`

## Key Features Walkthrough

### For Students
1. Register with your school email
2. Login to access your dashboard
3. Create mood entries with emotions, intensity, notes, and tags
4. View your mood history in a timeline
5. Visualize your mood trends with charts
6. Use the calendar view to see days with entries

### For Psychologists
1. Login with your psychologist credentials
2. Access anonymized statistics for your assigned school
3. View emotion distribution among students
4. Export statistics to PDF or Excel for reporting

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify PostgreSQL is running
- Check database connection string in `.env`
- Ensure database user has proper permissions

#### Authentication Issues
- Verify JWT secrets are properly set
- Check that httpOnly cookies are enabled in browser
- Ensure CORS is properly configured

#### Frontend Build Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Useful Commands
```bash
# Reset database (dev only)
npm run reset-db

# Generate test data
npm run generate-test-data

# Check system status
npm run health-check
```

## Next Steps
1. Explore the API endpoints in Postman or similar tool
2. Review the data models in `specs/001-emotion-diary-platform/data-model.md`
3. Look at the task breakdown in `specs/001-emotion-diary-platform/tasks.md` for implementation details
4. Check the research findings in `specs/001-emotion-diary-platform/research.md` for architectural decisions