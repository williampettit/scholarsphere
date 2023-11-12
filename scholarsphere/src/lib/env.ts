// this file defines a schema for runtime validation and type-safe access to environment variables
// if the `.env` file does not match the schema, an error will be thrown
// -william
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const nodeEnvSchema = z.enum(["development", "test", "production"]);

export const env = createEnv({
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  client: {
    // 
    NEXT_PUBLIC_NODE_ENV: nodeEnvSchema,
  },
  server: {
    // 
    NODE_ENV: nodeEnvSchema,
    
    // postgres
    POSTGRES_URL: z.string().nonempty(),
    POSTGRES_PRISMA_URL: z.string().nonempty(),
    POSTGRES_URL_NON_POOLING: z.string().nonempty(),
    POSTGRES_USER: z.string().nonempty(),
    POSTGRES_HOST: z.string().nonempty(),
    POSTGRES_PASSWORD: z.string().nonempty(),
    POSTGRES_DATABASE: z.string().nonempty(),
    
    // nextauth
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().nonempty() : z.string().url(),
    ),
    NEXTAUTH_SECRET: z.string().nonempty(),

    // github
    GITHUB_CLIENT_ID: z.string().nonempty(),
    GITHUB_CLIENT_SECRET: z.string().nonempty(),
  },
  runtimeEnv: {
    // 
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NODE_ENV: process.env.NODE_ENV,

    // postgres
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,

    // nextauth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    
    // github
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
});
