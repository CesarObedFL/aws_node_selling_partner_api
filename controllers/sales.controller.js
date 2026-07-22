import { GetSalesMetricsSchema } from '../validators/sales.validator.js';
import { amazonService } from '../services/amazon.service.js';
import { env } from '../config/env.config.js';

/**
 * Get sales metrics for a given date range and optional filters.
 * GET /sales/metrics?date_from=...&date_to=...&marketplace_ids=...&asin=...&granularity=...
 */
export const getSalesMetrics = async (req, res) => {
    // Validar query params
    const validation = GetSalesMetricsSchema.safeParse(req.query);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "Invalid parameters.",
            errors: validation.error.format()
        });
    }

    const { date_from, date_to, marketplace_ids, asin, granularity } = validation.data;

    try {
        // Convertir fechas a ISO
        const startDate = date_from.toISOString();
        const endDate = date_to.toISOString();

        // Procesar marketplace_ids
        let marketplaceIdsArray = [];
        if (marketplace_ids) {
            marketplaceIdsArray = marketplace_ids.split(',').map(id => id.trim());
        } else {
            // Usar el marketplace por defecto de la configuración
            marketplaceIdsArray = [env.DEFAULT_MARKETPLACE_ID];
        }

        // Llamar al servicio
        const result = await amazonService.getSalesMetrics({
            startDate,
            endDate,
            marketplaceIds: marketplaceIdsArray,
            asin: asin || undefined,
            granularity,
        });

        // Extraer datos (la estructura puede variar)
        const metrics = result.payload?.SalesMetrics || [];

        return res.status(200).json({
            status: "success",
            data: metrics,
            filters: {
                date_from,
                date_to,
                marketplace_ids: marketplaceIdsArray,
                asin: asin || null,
                granularity,
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve sales metrics."
        });
    }
};