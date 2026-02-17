const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.role = userData.role;
    this.school_id = userData.school_id;
    this.date_of_birth = userData.date_of_birth;
    this.is_active = userData.is_active;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const { email, password, first_name, last_name, role, school_id, date_of_birth } = userData;
    
    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role, school_id, date_of_birth, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING id, email, first_name, last_name, role, school_id, date_of_birth, is_active, created_at, updated_at
    `;
    
    // For psychologists, school_id and date_of_birth are optional
    const values = [
      email, 
      password_hash, 
      first_name, 
      last_name, 
      role, 
      role === 'student' ? school_id : null, 
      role === 'student' ? date_of_birth : null
    ];
    
    const result = await db.query(query, values);
    return new User(result.rows[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await db.query(query, [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  }

  // Update user
  async update(updates) {
    const allowedUpdates = ['first_name', 'last_name'];
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

    // Add id to values array for WHERE clause
    values.push(this.id);

    const query = `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);
    
    // Update current instance
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Delete user (soft delete)
  async deactivate() {
    const query = 'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *';
    const result = await db.query(query, [this.id]);
    this.is_active = false;
    this.updated_at = result.rows[0].updated_at;
    return this;
  }
}

module.exports = User;