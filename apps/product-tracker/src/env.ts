import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5440),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('product_tracker'),
  DB_LOGGING: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:', z.treeifyError(result.error));
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

export const env = validateEnv();