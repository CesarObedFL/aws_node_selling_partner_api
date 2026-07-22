import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import { env } from './config/env.config.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error_handler.js';
import { logger } from './middlewares/logger.js';
import { rateLimiter } from './middlewares/rate_limiter.js';

const app = express();

// ============================================================
// 1. Security & Performance Middlewares
// ============================================================

// Helmet: sets various HTTP headers for security
app.use(helmet());

// CORS: allow cross-origin requests (configure as needed)
app.use(cors({
    origin: '*', // En producción, especifica los dominios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Compression: compress responses (gzip/deflate)
app.use(compression());

// ============================================================
// 2. Parsing & Logging
// ============================================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (optional)
app.use(logger);

// ============================================================
// 3. Rate Limiting (optional, uncomment if needed)
// ============================================================

// app.use(rateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }));

// ============================================================
// 4. Health Check & Status
// ============================================================

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        uptime: process.uptime(),
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'Amazon SP-API Microservice',
        version: '1.0.0',
        status: 'running',
        endpoints: '/spapi/orders, /spapi/inventory, /spapi/products, /spapi/finances, /spapi/sales',
    });
});

// ============================================================
// 5. Main API Routes
// ============================================================

// Mount all routes under /spapi
app.use('/spapi', routes);

// ============================================================
// 6. Global Error Handler (must be LAST)
// ============================================================

app.use(errorHandler);

// ============================================================
// 7. Start Server
// ============================================================

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/spapi`);
});