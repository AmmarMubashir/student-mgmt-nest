import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { StudentsService } from "./students.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/role.enum";
import { CurrentUser } from "../common/decorators/user.decorator";

@ApiTags("profile")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("profile")
export class ProfileController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Get current student profile (STUDENT only)" })
  async getProfile(@CurrentUser() user: any) {
    return this.studentsService.findByUser(user.userId);
  }

  @Patch()
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Update current student profile (STUDENT only)" })
  async updateProfile(@CurrentUser() user: any, @Body() updatedData: any) {
    return this.studentsService.findByUserAndUpdate(user.userId, updatedData);
  }
}
