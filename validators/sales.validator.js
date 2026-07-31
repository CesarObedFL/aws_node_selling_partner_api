import { z } from 'zod';

export const GetSalesMetricsSchema = z.object({
    date_from: z.coerce.date({
        invalid_type_error: "date_from must be a valid date (ISO 8601 or recognizable format)",
        required_error: "date_from is a required parameter",
    }),
    date_to: z.coerce.date({
        invalid_type_error: "date_to must be a valid date (ISO 8601 or recognizable format)",
        required_error: "date_to is a required parameter",
    }),
    marketplace_ids: z.string().optional(), // comma-separated, e.g., "ATVPDKIKX0DER,A1AM78C64UMU9V"
    asin: z.string().optional(),
    granularity: z.enum(["Day", "Week", "Month"]).default("Day"),
}).refine((data) => data.date_to >= data.date_from, {
    message: "date_to cannot be earlier than date_from",
    path: ["date_to"],
});