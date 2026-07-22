import { Router } from 'express';
import orderRoutes from './order.routes.js';
import inventoryRoutes from './inventory.routes.js';
import productRoutes from './product.routes.js';
import financeRoutes from './finance.routes.js';
import salesRoutes from './sales.routes.js';


const router = Router();


router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/products', productRoutes);
router.use('/finances', financeRoutes);
router.use('/sales', salesRoutes);

export default router;