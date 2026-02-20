import { ApiProperty } from '@nestjs/swagger';
import { RideType, VehicleType } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RidePointDto } from './create-ride.dto';

export class EstimateRideDto {
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

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hasLuggage?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hasPets?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  needsAccessibility?: boolean;
}
