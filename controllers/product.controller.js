import { GetProductRankingSchema } from '../validators/product.validator.js';
import { amazonService } from '../services/amazon.service.js';

/**
 * Get product ranking and details by ASIN.
 * Path param: asin
 * Query param: marketplace_ids (optional, comma-separated)
 */
export const getProductRanking = async (req, res) => {
    // Validar parámetros
    const validation = GetProductRankingSchema.safeParse({
        asin: req.params.asin,
        marketplace_ids: req.query.marketplace_ids,
    });

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            code: "INVALID_PARAMETERS",
            message: "Invalid parameters.",
            errors: validation.error.format()
        });
    }

    const { asin, marketplace_ids } = validation.data;

    try {
        // Convertir marketplace_ids de string a array si existe
        let marketplaceIdsArray = [];
        if (marketplace_ids) {
            marketplaceIdsArray = marketplace_ids.split(',').map(id => id.trim());
        }

        const result = await amazonService.getCatalogItem({
            asin,
            marketplaceIds: marketplaceIdsArray.length ? marketplaceIdsArray : undefined,
        });

        // Extraer datos relevantes (puedes ajustar según lo que necesites)
        const item = result.payload || {};

        // Si hay ranking, extraerlo (ejemplo: SalesRankings)
        const rankings = item.SalesRankings || [];

        return res.status(200).json({
            status: "success",
            data: {
                asin: item.ASIN,
                title: item.ItemName,
                product_type: item.ProductType,
                sales_rankings: rankings,
                // También puedes devolver otras propiedades: dimensions, weight, etc.
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: "SP_API_INTEGRATION_ERROR",
            message: error.message || "Failed to retrieve product catalog information."
        });
    }
};