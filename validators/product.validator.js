import { z } from 'zod';

export const GetProductRankingSchema = z.object({
    asin: z.string().min(1, "ASIN is required"),
    marketplace_ids: z.string().optional(), // opcional, si se pasa se usa
});