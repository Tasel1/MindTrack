const db = require('../config/database');

class Emotion {
  constructor(emotionData) {
    this.id = emotionData.id;
    this.name = emotionData.name;
    this.description = emotionData.description;
    this.color_code = emotionData.color_code;
    this.is_active = emotionData.is_active;
    this.created_at = emotionData.created_at;
    this.updated_at = emotionData.updated_at;
  }

  // Create a new emotion
  static async create(emotionData) {
    const { name, description, color_code } = emotionData;
    
    const query = `
      INSERT INTO emotions (name, description, color_code, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `;
    
    const values = [name, description, color_code];
    
    const result = await db.query(query, values);
    return new Emotion(result.rows[0]);
  }

  // Find emotion by ID
  static async findById(id) {
    const query = 'SELECT * FROM emotions WHERE id = $1 AND is_active = true';
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? new Emotion(result.rows[0]) : null;
  }

  // Find emotion by name
  static async findByName(name) {
    const query = 'SELECT * FROM emotions WHERE name = $1 AND is_active = true';
    const result = await db.query(query, [name]);
    return result.rows.length > 0 ? new Emotion(result.rows[0]) : null;
  }

  // Get all active emotions
  static async findAll() {
    const query = 'SELECT * FROM emotions WHERE is_active = true ORDER BY name';
    const result = await db.query(query);
    return result.rows.map(row => new Emotion(row));
  }

  // Update emotion
  async update(updates) {
    const allowedUpdates = ['name', 'description', 'color_code'];
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

    const query = `UPDATE emotions SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);
    
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Delete emotion (soft delete)
  async deactivate() {
    const query = 'UPDATE emotions SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *';
    const result = await db.query(query, [this.id]);
    this.is_active = false;
    this.updated_at = result.rows[0].updated_at;
    return this;
  }
}

module.exports = Emotion;