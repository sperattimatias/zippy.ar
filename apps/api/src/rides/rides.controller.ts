import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/roles';
import { AcceptOfferDto } from './dto/accept-offer.dto';
import { ChangeRideStatusDto } from './dto/change-ride-status.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateRideDto } from './dto/create-ride.dto';
import { RidesService } from './rides.service';

type AuthRequest = {
  user: {
    userId: string;
    role: UserRole;
  };
};

@ApiTags('rides')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Create a ride request (PASSENGER only). passengerId is taken from JWT.' })
  createRide(@Req() request: AuthRequest, @Body() dto: CreateRideDto) {
    return this.ridesService.createRide(request.user.userId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'List rides with current status (ADMIN can list all rides/offers).' })
  listRides() {
    return this.ridesService.listRides();
  }

  @Post(':id/offers')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Create an offer for a ride (DRIVER only). driverId is taken from JWT.' })
  createOffer(@Req() request: AuthRequest, @Param('id') rideId: string, @Body() dto: CreateOfferDto) {
    return this.ridesService.createOffer(rideId, request.user.userId, dto);
  }

  @Post(':id/offers/:offerId/accept')
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Accept a ride offer and assign driver (PASSENGER only).' })
  acceptOffer(
    @Param('id') rideId: string,
    @Param('offerId') offerId: string,
    @Body() dto: AcceptOfferDto
  ) {
    return this.ridesService.acceptOffer(rideId, offerId, dto);
  }

  @Post(':id/status')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Change ride status with transition validation (DRIVER/ADMIN).' })
  changeStatus(@Param('id') rideId: string, @Body() dto: ChangeRideStatusDto) {
    return this.ridesService.changeStatus(rideId, dto);
  }
}
