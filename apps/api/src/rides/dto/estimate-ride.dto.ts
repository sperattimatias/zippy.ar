import { RideType, VehicleType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class EstimateRideDto {
  @IsString() @MinLength(3) originAddress!: string;
  @IsString() originPlaceId!: string;
  @IsNumber() originLat!: number;
  @IsNumber() originLng!: number;
  @IsString() @MinLength(3) destinationAddress!: string;
  @IsString() destinationPlaceId!: string;
  @IsNumber() destinationLat!: number;
  @IsNumber() destinationLng!: number;
  @IsEnum(VehicleType) vehicleType!: VehicleType;
  @IsEnum(RideType) rideType!: RideType;
  @IsOptional() @IsBoolean() luggage?: boolean;
  @IsOptional() @IsBoolean() pet?: boolean;
  @IsOptional() @IsBoolean() accessibility?: boolean;
  @IsOptional() @IsString() @MaxLength(200) note?: string;
}
