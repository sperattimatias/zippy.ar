import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RideType, VehicleType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class RidePointDto {
  @ApiProperty()
  @IsString()
  address!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty()
  @IsNumber()
  lat!: number;

  @ApiProperty()
  @IsNumber()
  lng!: number;
}

export class CreateRideDto {
  @ApiProperty({ type: RidePointDto })
  origin!: RidePointDto;

  @ApiProperty({ type: RidePointDto })
  destination!: RidePointDto;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @ApiProperty({ enum: RideType })
  @IsEnum(RideType)
  rideType!: RideType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasLuggage?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasPets?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  needsAccessibility?: boolean;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}
