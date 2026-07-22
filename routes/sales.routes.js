import { Router } from 'express';
import { getSalesMetrics } from '../controllers/sales.controller.js';

const router = Router();

// GET /sales/metrics?date_from=...&date_to=...&marketplace_ids=...&asin=...&granularity=...
router.get('/metrics', getSalesMetrics);

export default router;