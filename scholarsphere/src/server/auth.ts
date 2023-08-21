/**
 * This file defines the Auth.js config.
 *
 * TODO: set up more providers (maybe: notion, google, apple, twitter, ...)
 */

import {
  DefaultSession,
  DefaultUser,
  getServerSession,
  ISODateString,
  type NextAuthOptions,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import { UserRole } from "@prisma/client";
import prisma from "@/server/prisma";
import { env } from "@/lib/env";
import { siteConfig } from "@/config/site";

//
// module augmentation to safely expand types
//

declare module "next-auth" {
  export interface User extends DefaultUser {
    role: UserRole;
    name: string;
    email: string;
    image: string;
    language?: string;
  }

  export interface Session extends DefaultSession {
    user: User;
    expires: ISODateString;
  }
}

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...user,
          // TODO: add language to database instead of hardcoding
          language: "en",
        },
      };
    },
  },
  pages: {
    signIn: siteConfig.auth.login,
    signOut: siteConfig.auth.logout,
    error: siteConfig.auth.login,
  },
};

export async function getServerSessionWrapper() {
  return getServerSession(nextAuthOptions);
}
