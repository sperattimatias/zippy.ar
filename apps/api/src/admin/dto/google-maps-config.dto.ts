import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GoogleMapsConfigDto {
  @IsOptional() @IsString() googleMapsWebKey?: string;
  @IsOptional() @IsString() googleMapsServerKey?: string;
  @IsBoolean() enablePlaces!: boolean;
  @IsBoolean() enableDistanceMatrix!: boolean;
  @IsBoolean() enableDirections!: boolean;
}
