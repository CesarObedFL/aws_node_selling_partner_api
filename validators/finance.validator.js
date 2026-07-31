import { z } from 'zod';

export const GetFinanceEventsSchema = z.object({
    order_id: z.string().min(1, "order_id is required"),
});
