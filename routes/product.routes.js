import { Router } from 'express';
import { getProductRanking } from '../controllers/product.controller.js';

const router = Router();

// GET /products/ranking/:asin?marketplace_ids=...
router.get('/ranking/:asin', getProductRanking);

export default router;