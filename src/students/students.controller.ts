import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";
import { CurrentUser } from "../common/decorators/user.decorator";

@ApiTags("students")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new student (ADMIN only)" })
  @ApiResponse({ status: 201, description: "Student created" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async create(@Body() dto: CreateStudentDto, @CurrentUser() user: any) {
    return this.studentsService.create(dto, user.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all students (ADMIN only)" })
  async findAll(@CurrentUser() user: any) {
    return this.studentsService.findAll(user.userId);
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get student by id (ADMIN only)" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    return this.studentsService.findOne(id, user.userId);
  }
}
