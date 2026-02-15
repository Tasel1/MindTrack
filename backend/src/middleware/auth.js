const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

// Authentication middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_AUTH_TOKEN',
        message: 'Access token required'
      }
    });
  }

  try {
    // Verify token
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_AUTH_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_AUTH_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }
};

// Authorization middleware to check user role
const authorizeRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'User not authenticated'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Required role(s): ${roles.join(', ')}`
        }
      });
    }

    next();
  };
};

// Session timeout middleware
const sessionTimeout = (req, res, next) => {
  // Check if user has been active recently
  // In a real implementation, you would track user activity
  // and check if the last activity was within the timeout window
  
  // For now, we'll just continue (the actual timeout would be handled by token expiration)
  next();
};

module.exports = {
  authenticateToken,
  authorizeRole,
  sessionTimeout
};