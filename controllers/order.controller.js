import { GetOrdersSchema } from '../validators/order.validator.js';

/**
 * Endpoint to get orders by a time interval 
 * * @param {string|Date} req.query.date_from - Start date interval
 * @param {string|Date} req.query.date_to - End date interval
 * @returns {Response} JSON object with the obtained orders or the SP-API error message
 */
export const getOrdersByInterval = async (req, res) => {
    // 1. Intercept and validate query parameters (or req.body if it changes to POST)
    const validation = GetOrdersSchema.safeParse(req.query);

    // 2. If validation fails, return structured errors to the LLM agent immediately
    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "The parameters provided are malformed or logically incorrect.",
            // Zod formats the error object cleanly by field name
            errors: validation.error.format()
        });
    }

    // 3. Destructure clean, sanitized Date objects from the validation results
    const { date_from, date_to } = validation.data;

    try {
        // 4. Transform native JS Date objects into Amazon SP-API strict ISO 8601 strings
        const createdAfterISO = date_from.toISOString();
        const createdBeforeISO = date_to.toISOString();

        // 5. Invoke your core Amazon Selling Partner API client integration logic
        const amazonOrdersResult = await yourAmazonSpApiClient.getOrders({
            CreatedAfter: createdAfterISO,
            CreatedBefore: createdBeforeISO
        });

        return res.status(200).json({
            status: "success",
            data: amazonOrdersResult
        });

    } catch (error) {
        // 6. Gracefully catch and structure native Amazon SP-API errors (like 429 Throttling)
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "An unexpected error occurred while communicating with Amazon SP-API."
        });
    }
};