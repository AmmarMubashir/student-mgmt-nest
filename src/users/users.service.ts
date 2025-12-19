import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "../common/enums/role.enum";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { Role as PrismaRole } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(dto: CreateAdminDto, superAdminId: number) {
    if (dto.role !== Role.ADMIN) {
      throw new BadRequestException("Only ADMIN role can be created here");
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: Role.ADMIN,
        createdById: superAdminId,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      createdById: user.createdById,
    };
  }

  async findAll() {
    const admins = await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return admins.map((admin) => this.toAdminResponse(admin));
  }

  private toAdminResponse(user: {
    id: number;
    name: string;
    email: string;
    role: Role | PrismaRole;
    createdAt: Date;
    createdById?: number;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      createdAt: user.createdAt,
      createdById: user.createdById,
    };
  }
}
