import { Router } from 'express';
import {
    getFinanceEventsByOrder,
    getRefundsByOrder
} from '../controllers/finance.controller.js';

const router = Router();

// GET /finances/order/:order_id
router.get('/order/:order_id', getFinanceEventsByOrder);

// GET /finances/refunds/:order_id
router.get('/refunds/:order_id', getRefundsByOrder);

export default router;