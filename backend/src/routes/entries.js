const express = require('express');
const router = express.Router();
const EntryController = require('../controllers/entryController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateCreateEntry, 
  validateUpdateEntry, 
  validateEntryId, 
  validatePagination, 
  validateDateRange, 
  validateCalendarParams 
} = require('../middleware/validation');

// Protected routes - only accessible by authenticated users
router.post('/', authenticateToken, validateCreateEntry, EntryController.createEntry);
router.get('/', authenticateToken, validatePagination, validateDateRange, EntryController.getUserEntries);
router.get('/:id', authenticateToken, validateEntryId, EntryController.getEntryById);
router.put('/:id', authenticateToken, validateEntryId, validateUpdateEntry, EntryController.updateEntry);
router.delete('/:id', authenticateToken, validateEntryId, EntryController.deleteEntry);

// Special routes for mood trends and calendar
router.get('/trends', authenticateToken, validateDateRange, EntryController.getMoodTrends);
router.get('/calendar', authenticateToken, validateCalendarParams, EntryController.getCalendarData);

module.exports = router;