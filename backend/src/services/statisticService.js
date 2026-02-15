const db = require('../config/database');
const User = require('../models/User');
const Emotion = require('../models/Emotion');
const Tag = require('../models/Tag');
const Entry = require('../models/Entry');
const EntryTag = require('../models/EntryTag');

class StatisticService {
  // Get anonymized statistics for a school
  static async getSchoolStats(schoolId, startDate, endDate) {
    // Validate school exists
    const schoolQuery = 'SELECT id, name FROM schools WHERE id = $1';
    const schoolResult = await db.query(schoolQuery, [schoolId]);
    if (schoolResult.rows.length === 0) {
      throw new Error('School not found');
    }

    // Set default date range if not provided
    if (!startDate || !endDate) {
      const now = new Date();
      // Default to last 30 days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
    }

    // Query for active students count
    const activeStudentsQuery = `
      SELECT COUNT(DISTINCT u.id) as active_student_count
      FROM users u
      INNER JOIN entries e ON u.id = e.user_id
      WHERE u.school_id = $1
        AND u.role = 'student'
        AND u.is_active = true
        AND e.date BETWEEN $2 AND $3
    `;
    const activeStudentsResult = await db.query(activeStudentsQuery, [schoolId, startDate, endDate]);

    // Query for emotion distribution
    const emotionDistributionQuery = `
      SELECT 
        em.name as emotion_name,
        COUNT(e.id) as count,
        ROUND(COUNT(e.id) * 100.0 / (
          SELECT COUNT(*) 
          FROM entries e2 
          INNER JOIN users u2 ON e2.user_id = u2.id
          WHERE u2.school_id = $1 
            AND e2.date BETWEEN $2 AND $3
        ), 2) as percentage
      FROM entries e
      INNER JOIN users u ON e.user_id = u.id
      INNER JOIN emotions em ON e.emotion_id = em.id
      WHERE u.school_id = $1
        AND u.role = 'student'
        AND e.date BETWEEN $2 AND $3
      GROUP BY em.id, em.name
      ORDER BY count DESC
    `;
    const emotionDistributionResult = await db.query(emotionDistributionQuery, [schoolId, startDate, endDate]);

    // Query for average intensity
    const avgIntensityQuery = `
      SELECT 
        AVG(e.intensity) as average_intensity
      FROM entries e
      INNER JOIN users u ON e.user_id = u.id
      WHERE u.school_id = $1
        AND u.role = 'student'
        AND e.date BETWEEN $2 AND $3
    `;
    const avgIntensityResult = await db.query(avgIntensityQuery, [schoolId, startDate, endDate]);

    // Query for popular tags
    const popularTagsQuery = `
      SELECT 
        t.name as tag_name,
        COUNT(et.tag_id) as count,
        ROUND(COUNT(et.tag_id) * 100.0 / (
          SELECT COUNT(*) 
          FROM entry_tags et2
          INNER JOIN entries e2 ON et2.entry_id = e2.id
          INNER JOIN users u2 ON e2.user_id = u2.id
          WHERE u2.school_id = $1 
            AND e2.date BETWEEN $2 AND $3
        ), 2) as percentage
      FROM entry_tags et
      INNER JOIN entries e ON et.entry_id = e.id
      INNER JOIN users u ON e.user_id = u.id
      INNER JOIN tags t ON et.tag_id = t.id
      WHERE u.school_id = $1
        AND u.role = 'student'
        AND e.date BETWEEN $2 AND $3
      GROUP BY t.id, t.name
      ORDER BY count DESC
      LIMIT 10
    `;
    const popularTagsResult = await db.query(popularTagsQuery, [schoolId, startDate, endDate]);

    return {
      school_id: schoolId,
      period: {
        start_date: startDate,
        end_date: endDate
      },
      active_students_count: parseInt(activeStudentsResult.rows[0].active_student_count) || 0,
      emotion_distribution: emotionDistributionResult.rows.map(row => ({
        emotion_name: row.emotion_name,
        percentage: parseFloat(row.percentage) || 0
      })),
      average_intensity: parseFloat(avgIntensityResult.rows[0].average_intensity) || 0,
      popular_tags: popularTagsResult.rows.map(row => ({
        tag_name: row.tag_name,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage) || 0
      }))
    };
  }

  // Get anonymized statistics for a psychologist
  static async getPsychologistStats(psychologistId, schoolId, startDate, endDate) {
    // First, verify the psychologist exists and get their school
    const psychologist = await User.findById(psychologistId);
    if (!psychologist || psychologist.role !== 'psychologist') {
      throw new Error('Psychologist not found or invalid role');
    }

    // Get school stats
    return await this.getSchoolStats(schoolId, startDate, endDate);
  }

  // Generate data for export (PDF/Excel)
  static async generateExportData(schoolId, startDate, endDate) {
    const stats = await this.getSchoolStats(schoolId, startDate, endDate);

    // Format data for export
    const exportData = {
      school_info: {
        id: stats.school_id,
        name: (await db.query('SELECT name FROM schools WHERE id = $1', [schoolId])).rows[0]?.name || 'Unknown School'
      },
      period: stats.period,
      summary: {
        active_students: stats.active_students_count,
        average_intensity: stats.average_intensity,
        total_entries: (await db.query(`
          SELECT COUNT(*) as count
          FROM entries e
          INNER JOIN users u ON e.user_id = u.id
          WHERE u.school_id = $1
            AND u.role = 'student'
            AND e.date BETWEEN $2 AND $3
        `, [schoolId, startDate, endDate])).rows[0].count
      },
      emotion_breakdown: stats.emotion_distribution,
      tag_popularity: stats.popular_tags,
      trends: await this.getTrendData(schoolId, startDate, endDate)
    };

    return exportData;
  }

  // Get trend data for export
  static async getTrendData(schoolId, startDate, endDate) {
    // Query for daily mood trends
    const trendQuery = `
      SELECT 
        e.date,
        AVG(e.intensity) as average_intensity,
        COUNT(e.id) as entry_count
      FROM entries e
      INNER JOIN users u ON e.user_id = u.id
      WHERE u.school_id = $1
        AND u.role = 'student'
        AND e.date BETWEEN $2 AND $3
      GROUP BY e.date
      ORDER BY e.date
    `;
    const trendResult = await db.query(trendQuery, [schoolId, startDate, endDate]);

    return trendResult.rows.map(row => ({
      date: row.date,
      average_intensity: parseFloat(row.average_intensity) || 0,
      entry_count: parseInt(row.entry_count) || 0
    }));
  }

  // Get anonymized statistics for all schools (for admin use)
  static async getAllSchoolsStats(startDate, endDate) {
    // Set default date range if not provided
    if (!startDate || !endDate) {
      const now = new Date();
      // Default to last 30 days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
    }

    // Query for all schools' stats
    const schoolsStatsQuery = `
      SELECT 
        s.id as school_id,
        s.name as school_name,
        COUNT(DISTINCT u.id) as active_students_count,
        AVG(e.intensity) as average_intensity,
        COUNT(e.id) as total_entries
      FROM schools s
      LEFT JOIN users u ON s.id = u.school_id AND u.role = 'student' AND u.is_active = true
      LEFT JOIN entries e ON u.id = e.user_id AND e.date BETWEEN $1 AND $2
      GROUP BY s.id, s.name
      ORDER BY s.name
    `;
    const schoolsStatsResult = await db.query(schoolsStatsQuery, [startDate, endDate]);

    return {
      period: {
        start_date: startDate,
        end_date: endDate
      },
      schools: schoolsStatsResult.rows.map(row => ({
        school_id: row.school_id,
        school_name: row.school_name,
        active_students_count: parseInt(row.active_students_count) || 0,
        average_intensity: parseFloat(row.average_intensity) || 0,
        total_entries: parseInt(row.total_entries) || 0
      }))
    };
  }

  // Get anonymized statistics for a specific date range
  static async getDateRangeStats(schoolId, startDate, endDate) {
    // Validate inputs
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error('Dates must be in YYYY-MM-DD format');
    }

    // Validate that end date is not before start date
    if (new Date(endDate) < new Date(startDate)) {
      throw new Error('End date cannot be before start date');
    }

    // Get stats for the specified date range
    return await this.getSchoolStats(schoolId, startDate, endDate);
  }
}

module.exports = StatisticService;