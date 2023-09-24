import { nanoid } from "ai";

import { prismaClient } from "./db";

async function main() {
  //
  // const type = "assignment";
  // const type = "course";
  // const type = "user";
  // const type = "account";
  // const type = "session";
  const type = "semester";

  // Get all objects
  const objects = await prismaClient[type].findMany();

  // Update ID on all objects
  for (const { id } of objects) {
    // Generate new ID
    const newId = nanoid(21);

    // Update ID
    const newObject = await prismaClient[type].update({
      where: { id },
      data: { id: newId },
    });

    // Log progress
    console.log(`Updated ${type} ${id} to ${newObject.id}`);
  }
}

main()
  .then(() => console.log("main() complete"))
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
