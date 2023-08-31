// this file defines the auth.js config
// TODO: set up more providers (maybe: notion, google, apple, twitter, ...)
import { redirect } from "next/navigation";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  type DefaultSession,
  type DefaultUser,
  getServerSession,
  type ISODateString,
  type NextAuthOptions,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { siteMap } from "@/config/site";
import { env } from "@/lib/env";
import { type UserRole } from "@/types/database-types";

import prisma from "@/server/prisma";

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
    signIn: siteMap.login.url,
    signOut: siteMap.logout.url,
    error: siteMap.login.url,
  },
};

export async function S_getSession() {
  return getServerSession(nextAuthOptions);
}

export async function S_requireUser() {
  const session = await S_getSession();
  if (!session) {
    redirect(siteMap.login.url);
  }
  return session.user;
}

export async function S_requireUserId() {
  return S_requireUser().then((user) => user.id);
}
