import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_placeholder'),
  STRIPE_PUBLISHABLE_KEY: z.string().default('pk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_placeholder'),
  STRIPE_PLATFORM_FEE_BPS: z.coerce.number().default(1000),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default('placeholder'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('DwellScan'),
});

type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
}

export const env = getEnv();
