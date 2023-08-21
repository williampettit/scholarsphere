import { PrismaClient } from "@prisma/client";

import { env } from "@/lib/env";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
