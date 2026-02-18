import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcceptOfferDto } from './dto/accept-offer.dto';
import { ChangeRideStatusDto } from './dto/change-ride-status.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateRideDto } from './dto/create-ride.dto';
import { RidesService } from './rides.service';

@ApiTags('rides')
@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a ride request' })
  createRide(@Body() dto: CreateRideDto) {
    return this.ridesService.createRide(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List rides with current status' })
  listRides() {
    return this.ridesService.listRides();
  }

  @Post(':id/offers')
  @ApiOperation({ summary: 'Create an offer for a ride' })
  createOffer(@Param('id') rideId: string, @Body() dto: CreateOfferDto) {
    return this.ridesService.createOffer(rideId, dto);
  }

  @Post(':id/offers/:offerId/accept')
  @ApiOperation({ summary: 'Accept a ride offer and assign driver' })
  acceptOffer(
    @Param('id') rideId: string,
    @Param('offerId') offerId: string,
    @Body() dto: AcceptOfferDto
  ) {
    return this.ridesService.acceptOffer(rideId, offerId, dto);
  }

  @Post(':id/status')
  @ApiOperation({ summary: 'Change ride status with transition validation' })
  changeStatus(@Param('id') rideId: string, @Body() dto: ChangeRideStatusDto) {
    return this.ridesService.changeStatus(rideId, dto);
  }
}
