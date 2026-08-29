import { describe, it, expect } from "vitest";
import { z } from "zod";

const testServerEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

describe("Environment Variables Schema", () => {
  it("validates well-formed server environment variables", () => {
    const validEnv = {
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/zylo_db?schema=public",
      NEXTAUTH_SECRET: "zylo_super_secret_jwt_key_min_32_chars_long_12345",
      NEXTAUTH_URL: "http://localhost:3000",
      NODE_ENV: "test",
    };

    const result = testServerEnvSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("fails if DATABASE_URL is not a valid URL", () => {
    const invalidEnv = {
      DATABASE_URL: "not_a_valid_postgres_url",
      NEXTAUTH_SECRET: "zylo_super_secret_jwt_key_min_32_chars_long_12345",
      NEXTAUTH_URL: "http://localhost:3000",
    };

    const result = testServerEnvSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it("fails if NEXTAUTH_SECRET is too short (< 16 chars)", () => {
    const invalidEnv = {
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/zylo_db?schema=public",
      NEXTAUTH_SECRET: "short_secret",
      NEXTAUTH_URL: "http://localhost:3000",
    };

    const result = testServerEnvSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });
});
