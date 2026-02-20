import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GoogleMapsConfigDto {
  @IsOptional()
  @IsString()
  googleMapsWebKey?: string;

  @IsOptional()
  @IsString()
  googleMapsServerKey?: string;

  @IsBoolean()
  enablePlaces!: boolean;

  @IsBoolean()
  enableDistanceMatrix!: boolean;

  @IsBoolean()
  enableDirections!: boolean;
}

export class PricingConfigDto {
  @IsNumber() @Min(0) baseFareAuto!: number;
  @IsNumber() @Min(0) baseFareMoto!: number;
  @IsNumber() @Min(0) perKmAuto!: number;
  @IsNumber() @Min(0) perKmMoto!: number;
  @IsNumber() @Min(0) perMinAuto!: number;
  @IsNumber() @Min(0) perMinMoto!: number;
  @IsNumber() @Min(0) multiplierDirect!: number;
  @IsNumber() @Min(0) multiplierShared!: number;
  @IsNumber() @Min(0) surchargeLuggage!: number;
  @IsNumber() @Min(0) surchargePet!: number;
  @IsNumber() @Min(0) surchargeAccessibility!: number;
  @IsNumber() @Min(0) minFare!: number;
  @IsNumber() @Min(0) maxSearchRadiusKm!: number;
}
