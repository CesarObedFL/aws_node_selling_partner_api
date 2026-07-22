import { get_amazon_client } from '../config/amazon.config.js';

/**
 * Service layer for Amazon SP-API order-related operations.
 * All methods use the singleton SP-API client.
 */
export const amazonService = {
    /**
     * Fetch orders by date range with optional pagination and marketplace filter.
     * @param {Object} params
     * @param {string} params.CreatedAfter - ISO 8601 date string
     * @param {string} params.CreatedBefore - ISO 8601 date string
     * @param {string} [params.NextToken] - Pagination token
     * @param {string[]} [params.MarketplaceIds] - Array of marketplace IDs
     * @returns {Promise<Object>} Raw response from SP-API
     */
    async getOrders({ CreatedAfter, CreatedBefore, NextToken, MarketplaceIds }) {
        const client = get_amazon_client();
        const query = {
            CreatedAfter,
            CreatedBefore,
        };
        if (NextToken) query.NextToken = NextToken;
        if (MarketplaceIds && MarketplaceIds.length) {
            query.MarketplaceIds = MarketplaceIds.join(',');
        }

        return client.callAPI({
            operation: 'getOrders',
            endpoint: 'orders',
            query,
        });
    },

    /**
     * Fetch a single order by ID.
     * @param {string} orderId
     * @returns {Promise<Object>}
     */
    async getOrder(orderId) {
        const client = get_amazon_client();
        return client.callAPI({
            operation: 'getOrder',
            endpoint: 'orders',
            path: { orderId },
        });
    },

    /**
     * Fetch items of a specific order.
     * @param {string} orderId
     * @returns {Promise<Object>}
     */
    async getOrderItems(orderId) {
        const client = get_amazon_client();
        return client.callAPI({
            operation: 'getOrderItems',
            endpoint: 'orders',
            path: { orderId },
        });
    },

    /**
     * Fetch buyer information for an order.
     * @param {string} orderId
     * @returns {Promise<Object>}
     */
    async getBuyerInfo(orderId) {
        const client = get_amazon_client();
        return client.callAPI({
            operation: 'getOrderBuyerInfo',
            endpoint: 'orders',
            path: { orderId },
        });
    },

    /**
     * Fetch shipping address for an order.
     * @param {string} orderId
     * @returns {Promise<Object>}
     */
    async getShippingAddress(orderId) {
        const client = get_amazon_client();
        return client.callAPI({
            operation: 'getOrderAddress',
            endpoint: 'orders',
            path: { orderId },
        });
    },
};