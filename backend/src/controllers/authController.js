const AuthService = require('../services/authService');
const UserService = require('../services/userService');
const { validationResult } = require('express-validator');

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
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

      const userData = req.body;
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.first_name || !userData.last_name || !userData.role) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Missing required fields: email, password, first_name, last_name, role'
          }
        });
      }

      // Validate role is either 'student' or 'psychologist'
      if (!['student', 'psychologist'].includes(userData.role)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ROLE',
            message: 'Role must be either "student" or "psychologist"'
          }
        });
      }

      // For students, validate required fields
      if (userData.role === 'student') {
        if (!userData.school_id || !userData.date_of_birth) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'MISSING_STUDENT_FIELDS',
              message: 'Students must provide school_id and date_of_birth'
            }
          });
        }
      }

      const result = await AuthService.register(userData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Registration successful'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message
        }
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
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

      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          }
        });
      }

      const result = await AuthService.login(email, password);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: error.message
        }
      });
    }
  }

  // Refresh access token
  static async refreshToken(req, res) {
    try {
      const { refresh_token } = req.body;
      
      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token is required'
          }
        });
      }

      const result = await AuthService.refreshToken(refresh_token);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_ERROR',
          message: error.message
        }
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      const result = await AuthService.logout();
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message
        }
      });
    }
  }

  // Forgot password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_EMAIL',
            message: 'Email is required'
          }
        });
      }

      const result = await AuthService.forgotPassword(email);
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_ERROR',
          message: error.message
        }
      });
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_RESET_FIELDS',
            message: 'Token and new password are required'
          }
        });
      }

      const result = await AuthService.resetPassword(token, newPassword);
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'RESET_PASSWORD_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming user info is attached to req by auth middleware
      
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

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming user info is attached to req by auth middleware
      const updates = req.body;
      
      // Don't allow updating sensitive fields
      delete updates.id;
      delete updates.email;
      delete updates.role;
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
}

module.exports = AuthController;