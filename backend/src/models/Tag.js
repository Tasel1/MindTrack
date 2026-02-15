const db = require('../config/database');

class Tag {
  constructor(tagData) {
    this.id = tagData.id;
    this.name = tagData.name;
    this.description = tagData.description;
    this.is_active = tagData.is_active;
    this.created_at = tagData.created_at;
    this.updated_at = tagData.updated_at;
  }

  // Create a new tag
  static async create(tagData) {
    const { name, description } = tagData;
    
    const query = `
      INSERT INTO tags (name, description, is_active)
      VALUES ($1, $2, true)
      RETURNING *
    `;
    
    const values = [name, description];
    
    const result = await db.query(query, values);
    return new Tag(result.rows[0]);
  }

  // Find tag by ID
  static async findById(id) {
    const query = 'SELECT * FROM tags WHERE id = $1 AND is_active = true';
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? new Tag(result.rows[0]) : null;
  }

  // Find tag by name
  static async findByName(name) {
    const query = 'SELECT * FROM tags WHERE name = $1 AND is_active = true';
    const result = await db.query(query, [name]);
    return result.rows.length > 0 ? new Tag(result.rows[0]) : null;
  }

  // Get all active tags
  static async findAll() {
    const query = 'SELECT * FROM tags WHERE is_active = true ORDER BY name';
    const result = await db.query(query);
    return result.rows.map(row => new Tag(row));
  }

  // Update tag
  async update(updates) {
    const allowedUpdates = ['name', 'description'];
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

    const query = `UPDATE tags SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);
    
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Delete tag (soft delete)
  async deactivate() {
    const query = 'UPDATE tags SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *';
    const result = await db.query(query, [this.id]);
    this.is_active = false;
    this.updated_at = result.rows[0].updated_at;
    return this;
  }
}

module.exports = Tag;