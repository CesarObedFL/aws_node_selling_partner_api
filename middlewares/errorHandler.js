/**
 * Global error handling middleware.
 * Catches all errors thrown in controllers/services and formats them consistently.
 */
export const errorHandler = (err, req, res, next) => {
    // Log error for debugging (structured logging would be better)
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // Determine status code
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Don't expose internal error details in production
    const response = {
        status: 'error',
        code: err.code || 'INTERNAL_ERROR',
        message: message,
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
};