// import { PrismaClient } from "@prisma/client";
// import sampleData from "../sampleData"; // Remove duplicate import
// import { hashSync } from "bcrypt-ts-edge";

// async function main() {
//   const prisma = new PrismaClient();

//   try {
//     // Seed new product data

//     await prisma.user.update({
//       where: { id: "4e7bc20c-171d-4eb6-80bc-d8f33eaa6ff0" },
//       data: { password: hashSync("abc123") },
//     });

//     console.log("seed hash");
//   } catch (error) {
//     console.error("❌ Error seeding data:", error);
//   } finally {
//     console.log("Seeded successfully");
//     await prisma.$disconnect(); // Ensure the client disconnects
//   }
// }

// main();

import { PrismaClient } from "@prisma/client";
import sampleData from "../sampleData"; // Remove duplicate import

async function main() {
  const prisma = new PrismaClient();

  try {
    // Seed new product data
    await prisma.user.deleteMany();

    await prisma.user.createMany({
      data: sampleData.users,
    });
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    console.log("Seeded successfully");
    await prisma.$disconnect(); // Ensure the client disconnects
  }
}

main();
