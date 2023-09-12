// this file defines the auth.js config
// TODO: set up more providers (maybe: notion, google, apple, twitter, ...)
import { redirect } from "next/navigation";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  type DefaultSession,
  type DefaultUser,
  type ISODateString,
  type NextAuthOptions,
} from "next-auth";
import { getServerSession as getNextAuthServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

import { env } from "@/lib/env";
import { siteConfig, siteMap } from "@/lib/site-config";
import { type UserRole } from "@/types/shared";

import prisma from "@/server/prisma";

// module augmentation to safely expand types
declare module "next-auth" {
  export interface User extends DefaultUser {
    role: UserRole;
    name: string;
    email: string;
    image: string;
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
  pages: {
    signIn: siteMap.login.url,
    signOut: siteMap.logout.url,
    error: siteMap.login.url,
  },
  callbacks: {
    async session({ session, user }) {
      return {
        expires: session.expires,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      };
    },
  },
};

export async function getSession() {
  return getNextAuthServerSession(nextAuthOptions);
}

export async function requireUser(
  redirectUrl: string = siteMap.login.url,
): Promise<{ userId: string; userDisplayName: string }> {
  const session = await getSession();
  if (!session) {
    redirect(redirectUrl);
  }
  const { id, name } = session.user;
  return { userId: id, userDisplayName: name };
}

export async function requireUserOpenAiApiKey(): Promise<{
  userId: string;
  userOpenAiApiKey: string;
}> {
  const { userId } = await requireUser();
  const { openaiApiKey: userOpenAiApiKey } =
    await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        openaiApiKey: true,
      },
    });
  if (!userOpenAiApiKey) {
    throw new Error(
      `An OpenAI API key has not been set for your ${siteConfig.name} account yet. You can set one in your account settings.`,
    );
  }
  return {
    userId: userId,
    userOpenAiApiKey: userOpenAiApiKey,
  };
}
