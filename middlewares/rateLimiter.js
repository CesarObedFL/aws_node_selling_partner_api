import rateLimit from 'express-rate-limit';

// Límite de 100 peticiones por minuto por IP
export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100,
    message: {
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});