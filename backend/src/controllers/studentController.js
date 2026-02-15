const UserService = require('../services/userService');
const { validationResult } = require('express-validator');

class StudentController {
  // Get student profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      
      // Verify user is a student
      if (req.user.role !== 'student') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only students can access this endpoint'
          }
        });
      }

      const profile = await UserService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_ERROR',
          message: error.message
        }
      });
    }
  }

  // Update student profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      
      // Verify user is a student
      if (req.user.role !== 'student') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only students can access this endpoint'
          }
        });
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors.array()
          }
        });
      }

      const updates = req.body;
      
      // Don't allow updating sensitive fields
      delete updates.id;
      delete updates.email;
      delete updates.role;
      delete updates.school_id; // Students shouldn't change their school
      delete updates.created_at;
      delete updates.updated_at;
      
      const result = await UserService.updateProfile(userId, updates);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_PROFILE_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get students by school (for psychologists or admins)
  static async getStudentsBySchool(req, res) {
    try {
      // Verify user is a psychologist or admin
      if (req.user.role !== 'psychologist' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only psychologists or admins can access this endpoint'
          }
        });
      }

      const { schoolId } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      // Validate schoolId
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_SCHOOL_ID',
            message: 'School ID is required'
          }
        });
      }

      const result = await UserService.getUsersBySchool(schoolId, parseInt(limit), parseInt(offset));
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'GET_STUDENTS_ERROR',
          message: error.message
        }
      });
    }
  }

  // Search students (for psychologists or admins)
  static async searchStudents(req, res) {
    try {
      // Verify user is a psychologist or admin
      if (req.user.role !== 'psychologist' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only psychologists or admins can access this endpoint'
          }
        });
      }

      const { searchTerm } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      // Validate search term
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_SEARCH_TERM',
            message: 'Search term is required'
          }
        });
      }

      const result = await UserService.searchUsers(searchTerm, parseInt(limit), parseInt(offset));
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'SEARCH_STUDENTS_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = StudentController;