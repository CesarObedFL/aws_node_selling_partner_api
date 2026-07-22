import { Router } from 'express';
import {
    getOrdersByInterval,
    getOrderById,
    getOrderItems,
    getBuyerInfo,
    getShippingAddress
} from '../controllers/order.controller.js';

const router = Router();

// GET /orders?date_from=...&date_to=...&next_token=...&marketplace_ids=...
router.get('/', getOrdersByInterval);

// GET /orders/:id
router.get('/:id', getOrderById);

// GET /orders/:id/items
router.get('/:id/items', getOrderItems);

// GET /orders/:order_id/buyerinfo
router.get('/:order_id/buyerinfo', getBuyerInfo);

// GET /orders/:order_id/shippingaddress
router.get('/:order_id/shippingaddress', getShippingAddress);

export default router;