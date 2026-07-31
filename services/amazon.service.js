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

    /**
     * Fetch inventory summary (FBA) with optional pagination.
     * @param {Object} params
     * @param {string} [params.NextToken] - Pagination token
     * @returns {Promise<Object>}
     */
    async getInventory({ NextToken }) {
        const client = get_amazon_client();
        const query = {};
        if (NextToken) query.NextToken = NextToken;

        return client.callAPI({
            operation: 'getInventorySummary',
            endpoint: 'inventory',
            query,
        });
    },

    /**
     * Get catalog item (product details and rankings) by ASIN.
     * @param {string} asin - Amazon Standard Identification Number
     * @param {string[]} [marketplaceIds] - Optional array of marketplace IDs
     * @returns {Promise<Object>}
     */
    async getCatalogItem({ asin, marketplaceIds }) {
        const client = get_amazon_client();
        const query = {
            marketplaceIds: marketplaceIds || [env.DEFAULT_MARKETPLACE_ID],
        };
        return client.callAPI({
            operation: 'getCatalogItem',
            endpoint: 'catalog',
            path: { asin },
            query,
        });
    },

    /**
     * Get financial events for an order.
     * @param {string} orderId
     * @returns {Promise<Object>}
     */
    async getFinancialEvents(orderId) {
        const client = get_amazon_client();
        return client.callAPI({
            operation: 'listFinancialEvents',
            endpoint: 'finances',
            query: {
                orderId,
            },
        });
    },

    /**
     * Get sales metrics for a period.
     * @param {Object} params
     * @param {string} params.startDate - ISO 8601
     * @param {string} params.endDate - ISO 8601
     * @param {string[]} params.marketplaceIds - array of marketplace IDs
     * @param {string} [params.asin] - optional ASIN filter
     * @param {string} [params.granularity] - "Day", "Week", "Month"
     * @returns {Promise<Object>}
     */
    async getSalesMetrics({ startDate, endDate, marketplaceIds, asin, granularity = "Day" }) {
        const client = get_amazon_client();
        const query = {
            marketplaceIds: marketplaceIds.join(','),
            granularity,
            startDate,
            endDate,
        };
        if (asin) query.asin = asin;
        return client.callAPI({
            operation: 'getSalesMetrics', // name may vary; check your SDK
            endpoint: 'sales',
            query,
        });
    },
};

