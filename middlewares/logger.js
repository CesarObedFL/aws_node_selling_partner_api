import pino from 'pino';
import { env } from '../config/env.config.js';

// Configurar logger con formato bonito en desarrollo
const logger = pino({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
});

// Middleware para loggear cada request
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });
    next();
};

export default logger;