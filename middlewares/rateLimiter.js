/**
 * Optional rate limiter middleware to prevent abuse.
 * Uses a simple in-memory store (replace with Redis for production).
 */
const requestCounts = new Map();

export const rateLimiter = (options = {}) => {
    const {
        windowMs = 60 * 1000, // 1 minute
        maxRequests = 100, // max requests per windowMs
        message = 'Too many requests, please try again later.',
    } = options;

    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        // Clean up old entries
        if (!requestCounts.has(key)) {
            requestCounts.set(key, { count: 1, resetTime: now + windowMs });
        } else {
            const entry = requestCounts.get(key);
            if (now > entry.resetTime) {
                // Reset if window expired
                entry.count = 1;
                entry.resetTime = now + windowMs;
            } else {
                entry.count += 1;
                if (entry.count > maxRequests) {
                    return res.status(429).json({
                        status: 'error',
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: message,
                        retry_after: Math.ceil((entry.resetTime - now) / 1000),
                    });
                }
            }
        }

        next();
    };
};