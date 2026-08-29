import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL connection URL")
    .default("postgresql://postgres:postgres@localhost:5432/zylo_db?schema=public"),
  NEXTAUTH_SECRET: z
    .string()
    .min(16, "NEXTAUTH_SECRET must be at least 16 characters long")
    .default("zylo_super_secret_jwt_key_min_32_chars_long_12345"),
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL")
    .default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("ZYLO"),
});

const isServer = typeof window === "undefined";

function validateEnv() {
  const parsedServer = isServer
    ? serverEnvSchema.safeParse(process.env)
    : { success: true as const, data: {} as z.infer<typeof serverEnvSchema> };

  const parsedClient = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });

  if (!parsedClient.success) {
    console.error("❌ Invalid client environment variables:", parsedClient.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
  }

  if (isServer && !parsedServer.success) {
    console.error("❌ Invalid server environment variables:", parsedServer.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }

  return {
    ...(isServer && parsedServer.success ? parsedServer.data : {}),
    ...parsedClient.data,
  } as z.infer<typeof serverEnvSchema> & z.infer<typeof clientEnvSchema>;
}

export const env = validateEnv();
