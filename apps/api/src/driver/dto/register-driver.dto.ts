import { VehicleType } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDriverDto {
  @IsString() @MinLength(1) firstName!: string;
  @IsString() @MinLength(1) lastName!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() phone!: string;
  @IsEnum(VehicleType) vehicleType!: VehicleType;
  @IsString() plateNumber!: string;
  @IsString() avatarUrl!: string;
  @IsBoolean() acceptTerms!: boolean;
}
