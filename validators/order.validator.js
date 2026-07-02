import { z } from 'zod';

export const GetOrdersSchema = z.object({
    // .pipe() allows us to validate the transformed string/object
    date_from: z.coerce.date({
        invalid_type_error: "date_from must be a valid date (ISO 8601 or recognizable format)",
        required_error: "date_from is a required parameter"
    }),

    date_to: z.coerce.date({
        invalid_type_error: "date_to must be a valid date (ISO 8601 or recognizable format)",
        required_error: "date_to is a required parameter"
    })
}).refine((data) => data.date_to >= data.date_from, {
    message: "date_to cannot be a date earlier than date_from",
    path: ["date_to"] // Esto marca exactamente cuál campo causó el error
});