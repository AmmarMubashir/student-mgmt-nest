import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";
import { CurrentUser } from "src/common/decorators/user.decorator";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Create a new Admin user (SUPERADMIN only)" })
  @ApiResponse({ status: 201, description: "Admin created" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async create(@Body() dto: CreateAdminDto, @CurrentUser() user) {
    return this.usersService.createAdmin(dto, user.userId);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get all users (SUPERADMIN only)" })
  async findAll() {
    return this.usersService.findAll();
  }
}
