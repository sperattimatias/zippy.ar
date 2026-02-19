import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../roles';

export class RegisterDto {
  @ApiProperty({ example: 'user@zippy.ar' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'Secreta123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.PASSENGER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
