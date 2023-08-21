/**
 * This file defines handlers for the Auth.js routes.
 */

import NextAuth from "next-auth";

import { nextAuthOptions } from "@/server/auth";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };