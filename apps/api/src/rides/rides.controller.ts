import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstimateRideDto } from './dto/estimate-ride.dto';
import { RidesService } from './rides.service';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post('estimate')
  estimate(@Body() dto: EstimateRideDto) {
    return this.ridesService.estimate(dto);
  }

  @Post()
  create(@Req() req: { user: { userId: string } }, @Body() dto: EstimateRideDto) {
    return this.ridesService.createRide(req.user.userId, dto);
  }

  @Get()
  list(@Req() req: { user: { userId: string } }) {
    return this.ridesService.listPassengerRides(req.user.userId);
  }

  @Get(':id')
  detail(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ridesService.getRide(req.user.userId, id);
  }

  @Post(':id/cancel')
  cancel(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ridesService.cancelRide(req.user.userId, id);
  }
}
