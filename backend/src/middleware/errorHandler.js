// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', err);

  // Default error response
  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    }
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error.code = 'VALIDATION_ERROR';
    errorResponse.error.message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse.error.code = 'UNAUTHORIZED';
    errorResponse.error.message = 'Authentication required';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    errorResponse.error.code = 'INVALID_JSON';
    errorResponse.error.message = 'Invalid JSON in request body';
  } else if (err.message && err.message.includes('duplicate')) {
    statusCode = 409;
    errorResponse.error.code = 'DUPLICATE_ENTRY';
    errorResponse.error.message = 'Duplicate entry not allowed';
  } else if (err.message && err.message.includes('foreign key')) {
    statusCode = 400;
    errorResponse.error.code = 'INVALID_REFERENCE';
    errorResponse.error.message = 'Referenced resource does not exist';
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  const errorResponse = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.originalUrl} not found`
    }
  };
  
  res.status(404).json(errorResponse);
};

module.exports = {
  errorHandler,
  notFoundHandler
};