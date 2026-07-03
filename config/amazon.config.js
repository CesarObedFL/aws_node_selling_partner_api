import { env } from './env.config.js';

const SellingPartnerAPI = require('amazon-sp-api');

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
    // Setting default marketplace targeting (e.g., Mexico / North America region)
    defaultMarketplaceId: env.DEFAULT_MARKETPLACE_ID,
    sandbox: env.NODE_ENV !== 'production' // Toggles Amazon Sandbox API automatically
};

// Initialize the single shared instance of the Amazon SP-API Client
let amazonSpApiClient;

try {
    // Replace this initialization logic with your specific library instantiation
    amazonSpApiClient = new AmazonClientSDK(amazonConfig);
    console.log("🚀 Amazon SP-API Client initialized successfully.");
} catch (error) {
    console.error("❌ Failed to initialize Amazon SP-API Client:", error.message);
    throw error;
}

export { amazonSpApiClient, amazonConfig };