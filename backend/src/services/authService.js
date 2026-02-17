const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');

class AuthService {
  // Register a new user
  static async register(userData) {
    console.log('[AuthService] Registering user:', userData.email);
    
    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      console.log('[AuthService] Email already exists:', userData.email);
      throw new Error('Email already in use');
    }

    console.log('[AuthService] Creating user in database...');
    
    // Create the user
    const newUser = await User.create(userData);
    
    console.log('[AuthService] User created successfully:', newUser.id);

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    
    console.log('[AuthService] Tokens generated');

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    };
  }

  // Login user
  static async login(email, password) {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Compare password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    };
  }

  // Refresh access token
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      // Verify the refresh token
      const decoded = await require('../config/jwt').verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Find user by ID
      const user = await User.findById(decoded.id);
      if (!user || !user.is_active) {
        throw new Error('User not found or deactivated');
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user);

      return {
        access_token: newAccessToken
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Logout user (client-side token invalidation)
  static async logout() {
    // In a stateless JWT system, we can't invalidate tokens server-side
    // The client should handle removing tokens from storage
    return { message: 'Logged out successfully' };
  }

  // Forgot password (initiate password reset)
  static async forgotPassword(email) {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists to prevent enumeration
      return { message: 'If email exists, a reset link has been sent' };
    }

    // In a real implementation, you would:
    // 1. Generate a password reset token
    // 2. Store it with expiry in the database
    // 3. Send email with reset link containing token
    // For now, we'll just simulate the process

    // This is where you would send an email with a reset link
    console.log(`Password reset initiated for ${email}`);

    return { message: 'If email exists, a reset link has been sent' };
  }

  // Reset password with token
  static async resetPassword(token, newPassword) {
    // In a real implementation, you would:
    // 1. Verify the reset token
    // 2. Check if it's not expired
    // 3. Hash the new password
    // 4. Update the user's password
    // For now, we'll just validate the new password

    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Additional password validation could go here
    // e.g., require uppercase, lowercase, number, special character

    // This is where you would update the user's password in the database
    console.log(`Password reset attempted with token: ${token}`);

    return { message: 'Password has been reset successfully' };
  }
}

module.exports = AuthService;