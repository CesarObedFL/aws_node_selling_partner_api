import { Router } from 'express';
import orderRoutes from './order.routes.js';
import inventoryRoutes from './inventory.routes.js';
import productRoutes from './product.routes.js';
import financeRoutes from './finance.routes.js';
import salesRoutes from './sales.routes.js';

const router = Router();

// Mount all route modules
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/products', productRoutes);
router.use('/finances', financeRoutes);
router.use('/sales', salesRoutes);

// Optional: 404 catch-all (only if not handled elsewhere)
router.use((req, res) => {
    res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`,
    });
});

export default router;