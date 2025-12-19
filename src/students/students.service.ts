import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "../common/enums/role.enum";
import { CreateStudentDto } from "./dto/create-student.dto";
import { Role as PrismaRole } from "@prisma/client";

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ADMIN creates a student they own
  async create(dto: CreateStudentDto, adminId: number) {
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
        role: Role.STUDENT,
        student: {
          create: {
            class: dto.class,
            section: dto.section,
            createdByAdminId: adminId,
          },
        },
      },
      include: { student: true },
    });

    return this.toStudentResponse(user);
  }

  // ADMIN can see only students they created
  async findAll(adminId: number) {
    const students = await this.prisma.student.findMany({
      where: { createdByAdminId: adminId },
      include: {
        user: true,
      },
    });
    return students.map((student) =>
      this.toStudentResponse(student.user, student)
    );
  }

  // ADMIN can fetch a single student they created
  async findOne(id: number, adminId: number) {
    const student = await this.prisma.student.findFirst({
      where: { id, createdByAdminId: adminId },
      include: { user: true },
    });
    if (!student) {
      throw new NotFoundException("Student not found");
    }
    return this.toStudentResponse(student.user, student);
  }

  async findByUser(userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!student) {
      throw new NotFoundException("Profile not found");
    }
    return this.toStudentResponse(student.user, student);
  }

  async findByUserAndUpdate(userId: number, updatedData: any) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!student) {
      throw new NotFoundException("Profile not found");
    }

    // Prepare data for update
    const userUpdateData: any = {};

    // if (updatedData.name) userUpdateData.name = updatedData.name;
    // if (updatedData.email) userUpdateData.email = updatedData.email;

    // If password is provided, hash it
    if (updatedData.password) {
      userUpdateData.password = await bcrypt.hash(updatedData.password, 10);
    }

    // Update the user record
    const updatedUser = await this.prisma.user.update({
      where: { id: student.user.id },
      data: userUpdateData,
    });

    return this.toStudentResponse(updatedUser, student);
  }

  private toStudentResponse(
    user: {
      id: number;
      name: string;
      email: string;
      role: Role | PrismaRole;
      createdAt?: Date;
      createdById?: number;
    },
    student?: { id: number; class: string; section: string }
  ) {
    return {
      id: student?.id ?? undefined,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      class: student?.class,
      section: student?.section,
      createdAt: user.createdAt,
      createdById: user.createdById,
    };
  }
}
