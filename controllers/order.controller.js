import { GetOrdersSchema } from '../validators/order.validator.js';
import { amazonService } from '../services/amazon.service.js';

/**
 * Endpoint to get orders by a time interval
 * Query params: date_from, date_to, next_token (optional), marketplace_ids (optional)
 */
export const getOrdersByInterval = async (req, res) => {
    // 1. Intercept and validate query parameters
    const validation = GetOrdersSchema.safeParse(req.query);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "The parameters provided are malformed or logically incorrect.",
            errors: validation.error.format()
        });
    }

    // Destructure validated data
    const { date_from, date_to } = validation.data;
    // Additional optional params
    const { next_token, marketplace_ids } = req.query;

    try {
        // Convert dates to ISO strings
        const createdAfterISO = date_from.toISOString();
        const createdBeforeISO = date_to.toISOString();

        // Prepare marketplace IDs (comma-separated string to array)
        let marketplaceIdsArray = [];
        if (marketplace_ids) {
            marketplaceIdsArray = marketplace_ids.split(',').map(id => id.trim());
        }

        // Call service
        const result = await amazonService.getOrders({
            CreatedAfter: createdAfterISO,
            CreatedBefore: createdBeforeISO,
            NextToken: next_token,
            MarketplaceIds: marketplaceIdsArray.length ? marketplaceIdsArray : undefined,
        });

        // Extract orders and next token
        const orders = result.payload?.Orders || [];
        const nextToken = result.payload?.NextToken || null;

        return res.status(200).json({
            status: "success",
            data: orders,
            pagination: {
                next_token: nextToken
            }
        });

    } catch (error) {
        // Handle SP-API errors
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "An unexpected error occurred while communicating with Amazon SP-API."
        });
    }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await amazonService.getOrder(id);
        return res.status(200).json({
            status: "success",
            data: result.payload
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve order."
        });
    }
};

/**
 * Get order items by order ID
 */
export const getOrderItems = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await amazonService.getOrderItems(id);
        return res.status(200).json({
            status: "success",
            data: result.payload?.OrderItems || []
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve order items."
        });
    }
};

/**
 * Get buyer info by order ID
 */
export const getBuyerInfo = async (req, res) => {
    const { order_id } = req.params;
    try {
        const result = await amazonService.getBuyerInfo(order_id);
        return res.status(200).json({
            status: "success",
            data: result.payload?.BuyerInfo || {}
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve buyer info."
        });
    }
};

/**
 * Get shipping address by order ID
 */
export const getShippingAddress = async (req, res) => {
    const { order_id } = req.params;
    try {
        const result = await amazonService.getShippingAddress(order_id);
        return res.status(200).json({
            status: "success",
            data: result.payload?.ShippingAddress || {}
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve shipping address."
        });
    }
};