const EntryService = require('../services/entryService');
const { validationResult } = require('express-validator');

class EntryController {
  // Create a new mood entry
  static async createEntry(req, res) {
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

      const userId = req.user.id; // From auth middleware
      const entryData = req.body;

      // Validate required fields
      if (!entryData.emotion_id || entryData.intensity === undefined) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Emotion ID and intensity are required'
          }
        });
      }

      // Validate intensity is between 1 and 10
      if (entryData.intensity < 1 || entryData.intensity > 10) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INTENSITY',
            message: 'Intensity must be between 1 and 10'
          }
        });
      }

      const entry = await EntryService.createEntry(userId, entryData);

      res.status(201).json({
        success: true,
        data: entry,
        message: 'Entry created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_ENTRY_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get user's mood entries
  static async getUserEntries(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const { limit, offset, startDate, endDate } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);
      if (startDate) options.startDate = startDate;
      if (endDate) options.endDate = endDate;

      const result = await EntryService.getUserEntries(userId, options);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'GET_ENTRIES_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get a specific mood entry
  static async getEntryById(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ENTRY_ID',
            message: 'Entry ID is required'
          }
        });
      }

      const entry = await EntryService.getEntryById(id, userId);

      res.status(200).json({
        success: true,
        data: entry
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'GET_ENTRY_ERROR',
          message: error.message
        }
      });
    }
  }

  // Update a mood entry
  static async updateEntry(req, res) {
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

      const userId = req.user.id; // From auth middleware
      const { id } = req.params;
      const entryData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ENTRY_ID',
            message: 'Entry ID is required'
          }
        });
      }

      // Validate intensity if provided
      if (entryData.intensity !== undefined) {
        if (entryData.intensity < 1 || entryData.intensity > 10) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_INTENSITY',
              message: 'Intensity must be between 1 and 10'
            }
          });
        }
      }

      const entry = await EntryService.updateEntry(id, userId, entryData);

      res.status(200).json({
        success: true,
        data: entry,
        message: 'Entry updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_ENTRY_ERROR',
          message: error.message
        }
      });
    }
  }

  // Delete a mood entry
  static async deleteEntry(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ENTRY_ID',
            message: 'Entry ID is required'
          }
        });
      }

      const result = await EntryService.deleteEntry(id, userId);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'DELETE_ENTRY_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get mood trends for the user
  static async getMoodTrends(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const { period, startDate, endDate } = req.query;

      const trends = await EntryService.getMoodTrends(userId, period, startDate, endDate);

      res.status(200).json({
        success: true,
        data: trends
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'GET_TRENDS_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get calendar data for the user
  static async getCalendarData(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const { year, month } = req.query;

      if (!year || !month) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_YEAR_MONTH',
            message: 'Year and month are required'
          }
        });
      }

      const calendarData = await EntryService.getCalendarData(userId, year, month);

      res.status(200).json({
        success: true,
        data: calendarData
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'GET_CALENDAR_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = EntryController;