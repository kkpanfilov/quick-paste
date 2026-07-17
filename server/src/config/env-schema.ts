import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  FRONTEND_PORT: z.coerce.number().int().positive().optional(),
  BACKEND_PORT: z.coerce.number().int().positive().default(4200),
  JWT_SECRET: z.string().min(32),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive().optional(),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().positive(),
});

export type Env = z.infer<typeof envSchema>;
