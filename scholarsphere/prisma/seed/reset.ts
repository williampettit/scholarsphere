import { prismaClient } from "./db";
import { getUserByEmail, resetUserById } from "./utils";

async function main() {
  // Find user ID of my account
  const user = await getUserByEmail("wm@uga.edu");

  //
  await resetUserById(user.id);
}

main()
  .then(() => console.log("Reset complete"))
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
