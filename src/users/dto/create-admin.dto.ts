import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin User' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, default: Role.ADMIN })
  @IsEnum(Role)
  role: Role = Role.ADMIN;
}

