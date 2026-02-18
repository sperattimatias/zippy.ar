import { RideStatus } from '../domain/ride-status';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ChangeRideStatusDto {
  @ApiProperty({ enum: RideStatus })
  @IsEnum(RideStatus)
  status!: RideStatus;
}
