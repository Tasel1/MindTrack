const db = require('../config/database');

class EntryTag {
  constructor(entryTagData) {
    this.entry_id = entryTagData.entry_id;
    this.tag_id = entryTagData.tag_id;
    this.created_at = entryTagData.created_at;
  }

  // Create a new entry-tag association
  static async create(entry_id, tag_id) {
    const query = `
      INSERT INTO entry_tags (entry_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT (entry_id, tag_id) DO NOTHING
      RETURNING *
    `;
    
    const values = [entry_id, tag_id];
    
    const result = await db.query(query, values);
    return result.rows.length > 0 ? new EntryTag(result.rows[0]) : null;
  }

  // Create multiple entry-tag associations
  static async createMultiple(entry_id, tag_ids) {
    if (!tag_ids || tag_ids.length === 0) {
      return [];
    }

    // Create placeholders for the tag IDs
    const placeholders = tag_ids.map((_, index) => `($1, $${index + 2})`).join(', ');
    const query = `
      INSERT INTO entry_tags (entry_id, tag_id)
      VALUES ${placeholders}
      ON CONFLICT (entry_id, tag_id) DO NOTHING
      RETURNING *
    `;
    
    const values = [entry_id, ...tag_ids];
    
    const result = await db.query(query, values);
    return result.rows.map(row => new EntryTag(row));
  }

  // Find all tags for an entry
  static async findByEntryId(entry_id) {
    const query = `
      SELECT et.*, t.name as tag_name, t.description as tag_description
      FROM entry_tags et
      JOIN tags t ON et.tag_id = t.id
      WHERE et.entry_id = $1
      AND t.is_active = true
    `;
    const result = await db.query(query, [entry_id]);
    return result.rows.map(row => new EntryTag(row));
  }

  // Find all entries for a tag
  static async findByTagId(tag_id) {
    const query = `
      SELECT et.*, e.user_id
      FROM entry_tags et
      JOIN entries e ON et.entry_id = e.id
      WHERE et.tag_id = $1
    `;
    const result = await db.query(query, [tag_id]);
    return result.rows.map(row => new EntryTag(row));
  }

  // Delete an entry-tag association
  static async delete(entry_id, tag_id) {
    const query = 'DELETE FROM entry_tags WHERE entry_id = $1 AND tag_id = $2';
    const result = await db.query(query, [entry_id, tag_id]);
    return result.rowCount > 0;
  }

  // Delete all tags for an entry
  static async deleteByEntryId(entry_id) {
    const query = 'DELETE FROM entry_tags WHERE entry_id = $1';
    const result = await db.query(query, [entry_id]);
    return result.rowCount;
  }
}

module.exports = EntryTag;