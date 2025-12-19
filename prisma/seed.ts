import * as bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { prismaConfig } from "../prisma.config";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: { url: prismaConfig.databaseUrl },
  },
});

async function main() {
  const email = process.env.SUPERADMIN_EMAIL || "superadmin@example.com";
  const password = process.env.SUPERADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.SUPERADMIN_NAME || "Super Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("SuperAdmin already exists, skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seed completed: SuperAdmin user created.");
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
