import { Router } from 'express';
import orderRoutes from './order.routes.js';
import inventoryRoutes from './inventory.routes.js';


const router = Router();

router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);


export default router;