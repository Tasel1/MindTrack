const User = require('../models/User');

class UserService {
  // Get user profile
  static async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Return user profile without sensitive information
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      school_id: user.school_id,
      date_of_birth: user.date_of_birth,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  // Update user profile
  static async updateProfile(userId, updates) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['first_name', 'last_name', 'parent_email'];
    const filteredUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields to update');
    }

    // Validate age for minors if parent email is being updated
    if (filteredUpdates.parent_email && user.date_of_birth) {
      const birthDate = new Date(user.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // If user is under 13, parent email is required
      if (age < 13 && !filteredUpdates.parent_email) {
        throw new Error('Parent email is required for users under 13 years old');
      }
    }

    await user.update(filteredUpdates);

    // Return updated user profile without sensitive information
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      school_id: user.school_id,
      date_of_birth: user.date_of_birth,
      parent_email: user.parent_email,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  // Deactivate user account
  static async deactivateAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Deactivate the user
    await user.deactivate();

    return {
      message: 'Account deactivated successfully',
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  // Get users by role
  static async getUsersByRole(role, limit = 10, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, role, school_id, date_of_birth, created_at, updated_at
      FROM users 
      WHERE role = $1 AND is_active = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const db = require('../config/database');
    const result = await db.query(query, [role, limit, offset]);
    
    return {
      users: result.rows,
      limit: limit,
      offset: offset
    };
  }

  // Get users by school
  static async getUsersBySchool(schoolId, limit = 10, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, role, date_of_birth, created_at, updated_at
      FROM users 
      WHERE school_id = $1 AND is_active = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const db = require('../config/database');
    const result = await db.query(query, [schoolId, limit, offset]);
    
    return {
      users: result.rows,
      limit: limit,
      offset: offset
    };
  }

  // Search users by email or name
  static async searchUsers(searchTerm, limit = 10, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, role, school_id, created_at, updated_at
      FROM users 
      WHERE (email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1) 
      AND is_active = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const searchTermPattern = `%${searchTerm}%`;
    const db = require('../config/database');
    const result = await db.query(query, [searchTermPattern, limit, offset]);
    
    return {
      users: result.rows,
      limit: limit,
      offset: offset
    };
  }
}

module.exports = UserService;