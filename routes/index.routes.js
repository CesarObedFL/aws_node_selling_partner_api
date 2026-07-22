import { Router } from 'express';
import orderRoutes from './order.routes.js';
import inventoryRoutes from './inventory.routes.js';
import productRoutes from './product.routes.js';
import financeRoutes from './finance.routes.js';
import salesRoutes from './sales.routes.js';

const router = Router();

// routes
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/products', productRoutes);
router.use('/finances', financeRoutes);
router.use('/sales', salesRoutes);

// Health check para monitoreo
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

export default router;