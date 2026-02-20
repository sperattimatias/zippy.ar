import { IsLatitude, IsLongitude, IsString, MinLength } from 'class-validator';

export class FavoritePlaceDto {
  @IsString()
  @MinLength(1)
  label!: string;

  @IsString()
  @MinLength(3)
  address!: string;

  @IsString()
  @MinLength(2)
  placeId!: string;

  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lng!: number;
}
