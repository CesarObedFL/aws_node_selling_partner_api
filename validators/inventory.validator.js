import { z } from 'zod';

export const GetInventorySchema = z.object({
    next_token: z.string().optional(),
});