const StatisticService = require('../services/statisticService');
const { validationResult } = require('express-validator');

class PsychologistController {
  // Get anonymized statistics for a school
  static async getSchoolStats(req, res) {
    try {
      // Verify user is a psychologist
      if (req.user.role !== 'psychologist') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only psychologists can access this endpoint'
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

      const { schoolId } = req.params;
      const { startDate, endDate } = req.query;

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

      const stats = await StatisticService.getPsychologistStats(req.user.id, schoolId, startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get anonymized statistics for all schools (for admin use)
  static async getAllSchoolsStats(req, res) {
    try {
      // Verify user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only admins can access this endpoint'
          }
        });
      }

      const { startDate, endDate } = req.query;

      const stats = await StatisticService.getAllSchoolsStats(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'ALL_SCHOOLS_STATS_ERROR',
          message: error.message
        }
      });
    }
  }

  // Generate export data (PDF/Excel)
  static async exportStats(req, res) {
    try {
      // Verify user is a psychologist
      if (req.user.role !== 'psychologist') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only psychologists can access this endpoint'
          }
        });
      }

      const { schoolId } = req.params;
      const { format, startDate, endDate } = req.query;

      // Validate required parameters
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_SCHOOL_ID',
            message: 'School ID is required'
          }
        });
      }

      if (!format || format.toLowerCase() !== 'xlsx') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: 'Invalid export format. Supported format: xlsx'
          }
        });
      }

      // Get the export data
      const exportData = await StatisticService.generateExportData(schoolId, startDate, endDate);

      // Set response headers and generate Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=school_stats_${schoolId}_${Date.now()}.xlsx`);
      
      // Generate XLSX using exceljs
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('School Statistics');
      
      // Add title
      worksheet.addRow(['School Statistics Report']);
      worksheet.addRow([`School: ${exportData.school_info.name}`]);
      worksheet.addRow([`Period: ${exportData.period.start_date} to ${exportData.period.end_date}`]);
      worksheet.addRow([]);
      
      // Add summary data
      worksheet.addRow(['Summary']);
      worksheet.addRow(['Active Students', exportData.summary.active_students]);
      worksheet.addRow(['Average Intensity', exportData.summary.average_intensity]);
      worksheet.addRow(['Total Entries', exportData.summary.total_entries]);
      worksheet.addRow([]);
      
      // Add emotion distribution
      worksheet.addRow(['Emotion Distribution']);
      worksheet.addRow(['Emotion', 'Percentage']);
      for (const emotion of exportData.emotion_breakdown) {
        worksheet.addRow([emotion.emotion_name, emotion.percentage]);
      }
      worksheet.addRow([]);
      
      // Add popular tags
      worksheet.addRow(['Popular Tags']);
      worksheet.addRow(['Tag', 'Count', 'Percentage']);
      for (const tag of exportData.tag_popularity) {
        worksheet.addRow([tag.tag_name, tag.count, tag.percentage]);
      }
      
      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();
      res.status(200).send(buffer);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'EXPORT_ERROR',
          message: error.message
        }
      });
    }
  }

  // Get trend data for a school
  static async getTrendData(req, res) {
    try {
      // Verify user is a psychologist
      if (req.user.role !== 'psychologist') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_ACCESS',
            message: 'Access denied: Only psychologists can access this endpoint'
          }
        });
      }

      const { schoolId } = req.params;
      const { startDate, endDate } = req.query;

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

      const trendData = await StatisticService.getTrendData(schoolId, startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: {
          school_id: schoolId,
          period: {
            start_date: startDate,
            end_date: endDate
          },
          trend_data: trendData
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'TREND_DATA_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = PsychologistController;