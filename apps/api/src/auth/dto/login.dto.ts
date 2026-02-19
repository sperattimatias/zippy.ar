import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@zippy.ar' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'Secreta123!' })
  @IsString()
  @MinLength(8)
  password!: string;
}
