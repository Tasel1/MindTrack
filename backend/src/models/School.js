const db = require('../config/database');

class School {
  constructor(schoolData) {
    this.id = schoolData.id;
    this.name = schoolData.name;
    this.address = schoolData.address;
    this.contact_email = schoolData.contact_email;
    this.contact_phone = schoolData.contact_phone;
    this.created_at = schoolData.created_at;
    this.updated_at = schoolData.updated_at;
  }

  // Create a new school
  static async create(schoolData) {
    const { name, address, contact_email, contact_phone } = schoolData;
    
    const query = `
      INSERT INTO schools (name, address, contact_email, contact_phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [name, address, contact_email, contact_phone];
    
    const result = await db.query(query, values);
    return new School(result.rows[0]);
  }

  // Find school by ID
  static async findById(id) {
    const query = 'SELECT * FROM schools WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? new School(result.rows[0]) : null;
  }

  // Find school by name
  static async findByName(name) {
    const query = 'SELECT * FROM schools WHERE name = $1';
    const result = await db.query(query, [name]);
    return result.rows.length > 0 ? new School(result.rows[0]) : null;
  }

  // Get all schools
  static async findAll() {
    const query = 'SELECT * FROM schools ORDER BY name';
    const result = await db.query(query);
    return result.rows.map(row => new School(row));
  }

  // Update school
  async update(updates) {
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

    values.push(this.id);

    const query = `UPDATE schools SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);
    
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Delete school (only if no associated users)
  async delete() {
    // Check if there are any users associated with this school
    const userCheckQuery = 'SELECT COUNT(*) as count FROM users WHERE school_id = $1';
    const userResult = await db.query(userCheckQuery, [this.id]);
    
    if (parseInt(userResult.rows[0].count) > 0) {
      throw new Error('Cannot delete school with associated users');
    }

    const query = 'DELETE FROM schools WHERE id = $1 RETURNING *';
    const result = await db.query(query, [this.id]);
    return result.rowCount > 0;
  }
}

module.exports = School;