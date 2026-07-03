import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define a schema to validate your environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  
  // Amazon Selling Partner API Credentials
  AMAZON_CLIENT_ID: z.string().min(1, "AMAZON_CLIENT_ID is required"),
  AMAZON_CLIENT_SECRET: z.string().min(1, "AMAZON_CLIENT_SECRET is required"),
  AMAZON_REFRESH_TOKEN: z.string().min(1, "AMAZON_REFRESH_TOKEN is required"),
  
  // AWS IAM Role / User Credentials (if your library/SDK requires AWS signing)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  
  // Marketplaces default configs
  DEFAULT_MARKETPLACE_ID: z.string().default('A1AM78C64UMU9V') // Default: Mexico
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1); // Stop the server immediately if config is broken
}

export const env = parsedEnv.data;