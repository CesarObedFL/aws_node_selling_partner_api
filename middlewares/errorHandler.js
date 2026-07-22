import logger from './logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    // Si el error ya tiene un código de status, usarlo; si no, 500
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // No exponer detalles internos en producción (excepto si es 400 por validación)
    const response = {
        status: 'error',
        code: err.code || 'INTERNAL_ERROR',
        message,
    };

    if (env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};