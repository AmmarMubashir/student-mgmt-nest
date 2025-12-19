import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Student Name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'student@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  class: string;

  @ApiProperty({ example: 'A' })
  @IsNotEmpty()
  section: string;
}

