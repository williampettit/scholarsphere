// this file defines a schema for runtime validation and type-safe access to environment variables
// if the `.env` file does not match the schema, an error will be thrown
// -william
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const nodeEnvSchema = z.enum(["development", "test", "production"]);

export const env = createEnv({
  client: {
    NEXT_PUBLIC_NODE_ENV: nodeEnvSchema,
  },
  server: {
    NODE_ENV: nodeEnvSchema,
    DATABASE_URL: z.string().url(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().nonempty() : z.string().url(),
    ),
    NEXTAUTH_SECRET: z.string().nonempty(),
    GITHUB_CLIENT_ID: z.string().nonempty(),
    GITHUB_CLIENT_SECRET: z.string().nonempty(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
