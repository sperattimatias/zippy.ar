import { RideStatus, VehicleType } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class DriverRegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  phone!: string;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @IsString()
  plateNumber!: string;

  @IsString()
  avatarUrl!: string;

  @IsBoolean()
  acceptTerms!: boolean;
}

export class DriverOnlineDto {
  @IsBoolean()
  isOnline!: boolean;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}

export class DriverRideStatusDto {
  @IsEnum(RideStatus)
  status!: RideStatus;
}
