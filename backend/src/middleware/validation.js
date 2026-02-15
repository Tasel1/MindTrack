const { body, param, query } = require('express-validator');

// Validation rules for authentication
const validateRegister = [
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('Must be a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must not exceed 100 characters')
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must not exceed 100 characters')
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  body('role')
    .isIn(['student', 'psychologist'])
    .withMessage('Role must be either "student" or "psychologist"'),
  body('school_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('School ID must be a positive integer'),
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid ISO 8601 date'),
  body('parent_email')
    .optional()
    .isEmail().normalizeEmail()
    .withMessage('Parent email must be a valid email address')
];

const validateLogin = [
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateRefreshToken = [
  body('refresh_token')
    .notEmpty()
    .withMessage('Refresh token is required')
];

const validateForgotPassword = [
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('Must be a valid email address')
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Validation rules for entries
const validateCreateEntry = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('emotion_id')
    .isInt({ min: 1 })
    .withMessage('Emotion ID must be a positive integer'),
  body('intensity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be an integer between 1 and 10'),
  body('note')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Note must not exceed 1000 characters'),
  body('tag_ids')
    .optional()
    .isArray()
    .withMessage('Tag IDs must be an array'),
  body('tag_ids.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each tag ID must be a positive integer')
];

const validateUpdateEntry = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('emotion_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Emotion ID must be a positive integer'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be an integer between 1 and 10'),
  body('note')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Note must not exceed 1000 characters'),
  body('tag_ids')
    .optional()
    .isArray()
    .withMessage('Tag IDs must be an array'),
  body('tag_ids.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each tag ID must be a positive integer')
];

// Validation rules for parameters
const validateEntryId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Entry ID must be a positive integer')
];

const validateSchoolId = [
  param('schoolId')
    .isInt({ min: 1 })
    .withMessage('School ID must be a positive integer')
];

// Validation rules for queries
const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
];

const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

const validateCalendarParams = [
  query('year')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be a valid year between 1900 and 2100'),
  query('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12')
];

const validateExportFormat = [
  query('format')
    .isIn(['pdf', 'xlsx', 'csv'])
    .withMessage('Format must be one of: pdf, xlsx, csv')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword,
  validateCreateEntry,
  validateUpdateEntry,
  validateEntryId,
  validateSchoolId,
  validatePagination,
  validateDateRange,
  validateCalendarParams,
  validateExportFormat
};