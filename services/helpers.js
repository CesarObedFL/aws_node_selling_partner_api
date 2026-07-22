/**
 * Convierte una fecha a string ISO 8601.
 * Si la fecha es inválida, devuelve undefined.
 */
export const formatDateToISO = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
};

/**
 * Extrae el NextToken de la respuesta de la SP-API para paginación.
 */
export const extractNextToken = (response) => {
    return response.payload?.NextToken || null;
};

/**
 * Limpia y convierte una lista de marketplace IDs (string separado por comas) en un array.
 */
export const parseMarketplaceIds = (idsString) => {
    if (!idsString) return [];
    return idsString.split(',').map(id => id.trim()).filter(Boolean);
};

/**
 * Espera un tiempo determinado (útil para reintentos).
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));