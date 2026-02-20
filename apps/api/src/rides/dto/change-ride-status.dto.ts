import { ApiProperty } from '@nestjs/swagger';
import { RideStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ChangeRideStatusDto {
  @ApiProperty({ enum: RideStatus })
  @IsEnum(RideStatus)
  status!: RideStatus;
}
