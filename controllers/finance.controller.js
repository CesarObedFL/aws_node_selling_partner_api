import { GetFinanceEventsSchema } from '../validators/finance.validator.js';
import { amazonService } from '../services/amazon.service.js';

/**
 * Get all financial events for a specific order.
 * GET /finances/order/:order_id
 */
export const getFinanceEventsByOrder = async (req, res) => {
    const validation = GetFinanceEventsSchema.safeParse({
        order_id: req.params.order_id,
    });

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "Invalid parameters.",
            errors: validation.error.format()
        });
    }

    const { order_id } = validation.data;

    try {
        const result = await amazonService.getFinancialEvents(order_id);
        // La respuesta tiene una estructura: payload.FinancialEvents
        const events = result.payload?.FinancialEvents || {};
        return res.status(200).json({
            status: "success",
            data: events,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve financial events."
        });
    }
};

/**
 * Get refunds (FinancialEvents where RefundEventList is not empty) for an order.
 * GET /finances/refunds/:order_id
 */
export const getRefundsByOrder = async (req, res) => {
    const validation = GetFinanceEventsSchema.safeParse({
        order_id: req.params.order_id,
    });

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "Invalid parameters.",
            errors: validation.error.format()
        });
    }

    const { order_id } = validation.data;

    try {
        const result = await amazonService.getFinancialEvents(order_id);
        const financialEvents = result.payload?.FinancialEvents || {};
        // Extraer todos los eventos de reembolso (RefundEventList) de los grupos de eventos
        const refundEvents = [];
        if (financialEvents.FinancialEventGroupList) {
            for (const group of financialEvents.FinancialEventGroupList) {
                if (group.RefundEventList && group.RefundEventList.length) {
                    refundEvents.push(...group.RefundEventList);
                }
            }
        }
        return res.status(200).json({
            status: "success",
            data: refundEvents,
            count: refundEvents.length,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve refunds."
        });
    }
};