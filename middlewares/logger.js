/**
 * Simple request logging middleware.
 * For production, consider using pino or winston for structured logging.
 */
export const logger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const logLevel = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';
        console.log(`[${logLevel}] ${method} ${originalUrl} ${status} - ${duration}ms - ${ip}`);
    });

    next();
};