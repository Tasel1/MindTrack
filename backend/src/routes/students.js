const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateSchoolId, validatePagination } = require('../middleware/validation');

// Protected routes - only accessible by authenticated users
router.get('/profile', authenticateToken, authorizeRole(['student']), StudentController.getProfile);
router.put('/profile', authenticateToken, authorizeRole(['student']), StudentController.updateProfile);

// Routes for psychologists and admins to access student information
router.get('/school/:schoolId', 
  authenticateToken, 
  authorizeRole(['psychologist', 'admin']), 
  validateSchoolId, 
  validatePagination,
  StudentController.getStudentsBySchool
);

router.get('/search/:searchTerm', 
  authenticateToken, 
  authorizeRole(['psychologist', 'admin']), 
  validatePagination,
  StudentController.searchStudents
);

module.exports = router;