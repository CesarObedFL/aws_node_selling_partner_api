import { Router } from 'express';
import { getInventorySummary } from '../controllers/inventory.controller.js';

const router = Router();

// GET /inventory?next_token=...
router.get('/', getInventorySummary);

export default router;