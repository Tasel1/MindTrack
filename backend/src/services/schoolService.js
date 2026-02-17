const School = require('../models/School');

class SchoolService {
  // Get all schools
  static async getAllSchools(limit = 20, offset = 0) {
    const query = `
      SELECT 
        s.id,
        s.name,
        s.address,
        s.contact_email,
        s.contact_phone,
        COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'student' AND u.is_active = true) as active_students,
        COUNT(DISTINCT e.id) as total_entries,
        AVG(e.intensity) as average_intensity
      FROM schools s
      LEFT JOIN users u ON s.id = u.school_id AND u.is_active = true
      LEFT JOIN entries e ON u.id = e.user_id
      GROUP BY s.id
      ORDER BY s.name
      LIMIT $1 OFFSET $2
    `;
    
    const values = [limit, offset];
    const result = await db.query(query, values);
    
    return {
      schools: result.rows,
      limit: limit,
      offset: offset
    };
  }

  // Get school by ID
  static async getSchoolById(schoolId) {
    const query = 'SELECT * FROM schools WHERE id = $1';
    const result = await db.query(query, [schoolId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Get schools for student registration dropdown
  static async getAvailableSchools() {
    const query = `
      SELECT id, name, address
      FROM schools
      WHERE is_active = true
      ORDER BY name
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Create a new school (admin only)
  static async createSchool(schoolData) {
    const { name, address, contact_email, contact_phone } = schoolData;
    
    const query = `
      INSERT INTO schools (name, address, contact_email, contact_phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [name, address, contact_email, contact_phone];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Update school information (admin only)
  static async updateSchool(schoolId, updates) {
    const allowedUpdates = ['name', 'address', 'contact_email', 'contact_phone'];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach((key, index) => {
      if (allowedUpdates.includes(key)) {
        updateFields.push(`${key} = $${index + 1}`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(schoolId);

    const query = `
      UPDATE schools 
      SET ${updateFields.join(', ')}, updated_at = NOW() 
      WHERE id = $${values.length} 
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Get school statistics summary (for admin dashboard)
  static async getSchoolStatsSummary(schoolId, startDate, endDate) {
    const query = `
      SELECT 
        s.id,
        s.name,
        COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'student' AND u.is_active = true) as active_students,
        COUNT(e.id) as total_entries,
        AVG(e.intensity) as average_intensity,
        COUNT(DISTINCT e.user_id) as active_students_with_entries
      FROM schools s
      LEFT JOIN users u ON s.id = u.school_id AND u.is_active = true
      LEFT JOIN entries e ON u.id = e.user_id 
        AND ($2::date IS NULL OR e.date >= $2::date)
        AND ($3::date IS NULL OR e.date <= $3::date)
      WHERE s.id = $1
      GROUP BY s.id
    `;
    
    const result = await db.query(query, [schoolId, startDate, endDate]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

module.exports = SchoolService;
