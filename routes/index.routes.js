import { Router } from 'express';
import orderRoutes from './order.routes.js';
import inventoryRoutes from './inventory.routes.js';
import productRoutes from './product.routes.js';


const router = Router();

router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/products', productRoutes);

export default router;