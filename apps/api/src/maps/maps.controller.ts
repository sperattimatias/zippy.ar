import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MapsService } from './maps.service';

@ApiTags('maps')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('reverse-geocode')
  reverse(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.mapsService.reverseGeocode(Number(lat), Number(lng));
  }
}
