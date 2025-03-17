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
    await prisma.$disconnect(); // Ensure the client disconnects
  }
}

main();
