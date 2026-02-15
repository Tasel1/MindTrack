const db = require('../config/database');

class Entry {
  constructor(entryData) {
    this.id = entryData.id;
    this.user_id = entryData.user_id;
    this.date = entryData.date;
    this.emotion_id = entryData.emotion_id;
    this.intensity = entryData.intensity;
    this.note = entryData.note;
    this.created_at = entryData.created_at;
    this.updated_at = entryData.updated_at;
  }

  // Create a new entry
  static async create(entryData) {
    const { user_id, date, emotion_id, intensity, note } = entryData;
    
    const query = `
      INSERT INTO entries (user_id, date, emotion_id, intensity, note)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [user_id, date, emotion_id, intensity, note];
    
    const result = await db.query(query, values);
    return new Entry(result.rows[0]);
  }

  // Find entry by ID
  static async findById(id) {
    const query = 'SELECT * FROM entries WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? new Entry(result.rows[0]) : null;
  }

  // Find entries by user ID
  static async findByUserId(user_id, limit = 10, offset = 0) {
    const query = `
      SELECT * FROM entries 
      WHERE user_id = $1 
      ORDER BY date DESC, created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const values = [user_id, limit, offset];
    const result = await db.query(query, values);
    return result.rows.map(row => new Entry(row));
  }

  // Get entries count for a user
  static async getCountByUserId(user_id) {
    const query = 'SELECT COUNT(*) as count FROM entries WHERE user_id = $1';
    const result = await db.query(query, [user_id]);
    return parseInt(result.rows[0].count);
  }

  // Find entries by date range for a user
  static async findByDateRange(user_id, startDate, endDate) {
    const query = `
      SELECT * FROM entries 
      WHERE user_id = $1 
      AND date BETWEEN $2 AND $3
      ORDER BY date DESC, created_at DESC
    `;
    const values = [user_id, startDate, endDate];
    const result = await db.query(query, values);
    return result.rows.map(row => new Entry(row));
  }

  // Update entry
  async update(updates) {
    const allowedUpdates = ['date', 'emotion_id', 'intensity', 'note'];
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

    const query = `UPDATE entries SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const result = await db.query(query, values);
    
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Delete entry
  async delete() {
    const query = 'DELETE FROM entries WHERE id = $1 RETURNING *';
    const result = await db.query(query, [this.id]);
    return result.rows.length > 0;
  }

  // Get entry with emotion and tags
  static async findByIdWithDetails(id) {
    const query = `
      SELECT 
        e.*, 
        em.name as emotion_name, 
        em.color_code as emotion_color,
        ARRAY_AGG(t.name) AS tag_names
      FROM entries e
      LEFT JOIN emotions em ON e.emotion_id = em.id
      LEFT JOIN entry_tags et ON e.id = et.entry_id
      LEFT JOIN tags t ON et.tag_id = t.id
      WHERE e.id = $1
      GROUP BY e.id, em.name, em.color_code
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

module.exports = Entry;