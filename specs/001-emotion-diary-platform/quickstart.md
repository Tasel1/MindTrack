# Quickstart Guide: MindTrack Analytics

## Overview
This guide provides instructions for setting up and running the MindTrack Analytics platform locally for development and testing purposes.

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

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/mindtrack_dev
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

#### Database Setup
```bash
# Create the database
createdb mindtrack_dev

# Run migrations
npm run migrate

# (Optional) Seed sample data
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

Backend will be available at: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_TITLE=MindTrack Analytics
```

#### Start Frontend Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Default Test Accounts

After seeding, you can login with these test accounts:

### Student Account
- Email: `student@example.com`
- Password: `Password123!`
- Role: Student
- School: Central High School

### Psychologist Account
- Email: `psychologist@example.com`
- Password: `Password123!`
- Role: Psychologist
- School: Central High School

### Administrator Account
- Email: `admin@example.com`
- Password: `Password123!`
- Role: Administrator
- Access: System-wide

## API Documentation

The API is documented in the contracts directory:
- API contracts: `specs/001-emotion-diary-platform/contracts/api-contracts.md`

## Database Schema

The database schema is defined through migrations:
- Migrations: `backend/migrations/`
- Data model: `specs/001-emotion-diary-platform/data-model.md`

## Key Features Walkthrough

### For Students
1. Register with your school email and select your school
2. Login to access your dashboard
3. Create mood entries with emotions, intensity, notes, and tags
4. View your mood history in a timeline
5. Visualize your mood trends with charts
6. Use the calendar view to see days with entries

### For Psychologists
1. Login with your psychologist credentials
2. Access anonymized statistics for your school
3. View emotion distribution among students
4. Compare different classes/grades
5. Export statistics to Excel for reporting

### For Administrators
1. Login with administrator credentials
2. View aggregated statistics across all schools
3. Compare schools side-by-side
4. Filter by district or specific schools
5. Export cross-school reports to Excel

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify PostgreSQL is running
- Check database connection string in `.env`
- Ensure database user has proper permissions

#### Authentication Issues
- Verify JWT secrets are properly set
- Check that tokens are being stored correctly
- Ensure CORS is properly configured

#### Frontend Build Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Useful Commands

```bash
# Backend
cd backend
npm run migrate      # Run database migrations
npm run seed         # Seed sample data
npm run lint         # Run ESLint
npm test             # Run tests

# Frontend
cd frontend
npm run build        # Build for production
npm run lint         # Run ESLint
npm test             # Run tests
```

## Development Workflow

1. Make changes to backend or frontend code
2. Hot reload will automatically update the running application
3. Test changes in browser
4. Run tests to ensure no regressions
5. Commit changes with descriptive messages

## Next Steps
1. Explore the API endpoints in Postman or similar tool
2. Review the data model in `specs/001-emotion-diary-platform/data-model.md`
3. Look at the task breakdown in `specs/001-emotion-diary-platform/tasks.md`
4. Check the research findings in `specs/001-emotion-diary-platform/research.md`