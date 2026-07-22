import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.config.js';
import routes from './routes/index.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

const app = express();

// Middlewares de seguridad y rendimiento
app.use(helmet());
app.use(compression());
app.use(cors());

// Parseo de JSON y URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requests (opcional, pero muy útil)
app.use(requestLogger);

// Rate limiting (opcional)
// app.use(rateLimiter);

// Montar todas las rutas bajo /spapi
app.use('/spapi', routes);

// Ruta raíz para verificar que el servidor está vivo
app.get('/', (req, res) => {
    res.send('Amazon SP-API Microservice is running');
});

// Manejador de errores (siempre al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`SP-API base path: /spapi`);
});