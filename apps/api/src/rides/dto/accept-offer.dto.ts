import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AcceptOfferDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
