// this file defines the auth.js config
// TODO: set up more providers (maybe: notion, google, apple, twitter, ...)

import {
  getServerSession,
  type DefaultSession,
  type DefaultUser,
  type ISODateString,
  type NextAuthOptions,
} from "next-auth";
import { UserRole } from "@/types/database-types";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/lib/env";
import { siteConfig } from "@/config/site";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/server/prisma";
import { redirect } from "next/navigation";

// module augmentation to safely expand types
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
    signIn: siteConfig.links.login,
    signOut: siteConfig.links.logout,
    error: siteConfig.links.login,
  },
};

export async function S_getSession() {
  return getServerSession(nextAuthOptions);
}

export async function S_getUser() {
  const session = await S_getSession();
  if (!session) {
    redirect(siteConfig.links.login);
  }
  return session.user;
}
