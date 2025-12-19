import { Injectable, OnModuleInit } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "../common/enums/role.enum";

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Optional: limit auto-seeding to specific environments
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const name = process.env.SUPERADMIN_NAME || "Super Admin";

    if (!email || !password) {
      console.warn("SuperAdmin env vars not set. Skipping auto-seed.");
      return;
    }

    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      console.log("SuperAdmin already exists. Skipping auto-seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.SUPERADMIN,
      },
    });

    console.log("SuperAdmin auto-seeded successfully.");
  }
}
