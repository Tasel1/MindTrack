const express = require('express');
const router = express.Router();
const PsychologistController = require('../controllers/psychologistController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateSchoolId, validateDateRange, validateExportFormat } = require('../middleware/validation');

// Protected routes - only accessible by authenticated psychologists
router.get('/stats/:schoolId', 
  authenticateToken, 
  authorizeRole(['psychologist']), 
  validateSchoolId,
  validateDateRange,
  PsychologistController.getSchoolStats
);

router.get('/trends/:schoolId', 
  authenticateToken, 
  authorizeRole(['psychologist']), 
  validateSchoolId,
  validateDateRange,
  PsychologistController.getTrendData
);

router.get('/export/:schoolId', 
  authenticateToken, 
  authorizeRole(['psychologist']), 
  validateSchoolId,
  validateDateRange,
  validateExportFormat,
  PsychologistController.exportStats
);

// Admin route for getting stats across all schools
router.get('/all-schools/stats', 
  authenticateToken, 
  authorizeRole(['admin']), 
  validateDateRange,
  PsychologistController.getAllSchoolsStats
);

module.exports = router;