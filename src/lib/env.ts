import { z } from "zod";

const isServer = typeof window === "undefined";

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
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("ZYLO"),
});

export function validateStartupEnv(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Strict Server-Side Key Containment (Req 10)
  const clientOpenAIKey = Object.keys(process.env).find(
    (k) => k.startsWith("NEXT_PUBLIC_") && k.includes("OPENAI")
  );
  if (clientOpenAIKey) {
    errors.push(
      `CRITICAL SECURITY VIOLATION: ${clientOpenAIKey} detected! OpenAI keys must remain strictly server-side.`
    );
  }

  // 2. Production Strictness (Req 4)
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes("localhost:5432/zylo_db")
    ) {
      errors.push("Production requires a valid external DATABASE_URL (localhost default forbidden).");
    }

    if (
      !process.env.NEXTAUTH_SECRET ||
      process.env.NEXTAUTH_SECRET === "zylo_super_secret_jwt_key_min_32_chars_long_12345" ||
      process.env.NEXTAUTH_SECRET.length < 32
    ) {
      errors.push("Production requires a high-entropy NEXTAUTH_SECRET with at least 32 characters.");
    }

    if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
      errors.push("Production requires a valid public NEXTAUTH_URL (localhost forbidden).");
    }
  }

  // 3. Schema Parsing without printing secrets
  const parsedServer = serverEnvSchema.safeParse(process.env);
  if (!parsedServer.success) {
    const fieldKeys = Object.keys(parsedServer.error.flatten().fieldErrors);
    errors.push(`Invalid server environment variables: ${fieldKeys.join(", ")}`);
  }

  const parsedClient = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });
  if (!parsedClient.success) {
    const clientKeys = Object.keys(parsedClient.error.flatten().fieldErrors);
    errors.push(`Invalid client environment variables: ${clientKeys.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateEnv() {
  // Security guard against leaking OpenAI key to client bundle
  if (
    typeof window !== "undefined" &&
    Object.keys((window as any)?.process?.env || {}).some(
      (k) => k.startsWith("NEXT_PUBLIC_") && k.includes("OPENAI")
    )
  ) {
    throw new Error("Security alert: OpenAI API key detected on client bundle.");
  }

  const parsedServer = isServer
    ? serverEnvSchema.safeParse(process.env)
    : { success: true as const, data: {} as z.infer<typeof serverEnvSchema> };

  const parsedClient = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });

  if (!parsedClient.success) {
    const keys = Object.keys(parsedClient.error.flatten().fieldErrors);
    console.error("❌ Invalid client environment variables:", keys);
    throw new Error(`Invalid client environment variables: ${keys.join(", ")}`);
  }

  if (isServer && !parsedServer.success) {
    const keys = Object.keys(parsedServer.error.flatten().fieldErrors);
    console.error("❌ Invalid server environment variables:", keys);
    throw new Error(`Invalid server environment variables: ${keys.join(", ")}`);
  }

  return {
    ...(isServer && parsedServer.success ? parsedServer.data : {}),
    ...parsedClient.data,
  } as z.infer<typeof serverEnvSchema> & z.infer<typeof clientEnvSchema>;
}

export const env = validateEnv();
