import { GetInventorySchema } from '../validators/inventory.validator.js';
import { amazonService } from '../services/amazon.service.js';

/**
 * Get inventory summary (FBA) with optional pagination.
 * Query param: next_token (optional)
 */
export const getInventorySummary = async (req, res) => {
    // Validate query params
    const validation = GetInventorySchema.safeParse(req.query);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "Invalid query parameters.",
            errors: validation.error.format()
        });
    }

    const { next_token } = validation.data;

    try {
        const result = await amazonService.getInventory({ NextToken: next_token });

        // Extract inventory data and next token
        const inventory = result.payload?.InventorySummaries || [];
        const nextToken = result.payload?.NextToken || null;

        return res.status(200).json({
            status: "success",
            data: inventory,
            pagination: {
                next_token: nextToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve inventory summary."
        });
    }
};