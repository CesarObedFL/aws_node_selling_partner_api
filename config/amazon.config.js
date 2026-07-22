import SellingPartnerAPI from 'amazon-sp-api';
import { env } from './env.config.js';

// Configuración limpia basada en env validado
const amazonConfig = {
  credentials: {
    clientId: env.AMAZON_CLIENT_ID,
    clientSecret: env.AMAZON_CLIENT_SECRET,
    refreshToken: env.AMAZON_REFRESH_TOKEN,
  },
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
  },
  marketplace_id: env.DEFAULT_MARKETPLACE_ID, // el SDK espera 'marketplace_id'
  environment: env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  auto_request_throttled: true,
};

// Cliente singleton (inicialización perezosa)
let amazonSpApiClient = null;

export const get_amazon_client = () => {
  if (!amazonSpApiClient) {
    try {
      amazonSpApiClient = new SellingPartnerAPI(amazonConfig);
      console.log('Amazon SP-API Client initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize Amazon SP-API Client:', error.message);
      throw error; // relanzamos para que el servidor se detenga si no puede conectar
    }
  }
  return amazonSpApiClient;
};

// También exportamos la configuración por si se necesita en otros lados
export { amazonConfig };