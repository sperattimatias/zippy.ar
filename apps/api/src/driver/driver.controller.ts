import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('register')
  register(@Body() dto: RegisterDriverDto) {
    return this.driverService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('online')
  online(@Req() req: { user: { userId: string } }, @Body() body: { isOnline: boolean; lat?: number; lng?: number }) {
    return this.driverService.setOnline(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('offers')
  offers(@Req() req: { user: { userId: string } }) {
    return this.driverService.listOffers(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('offers/:id/accept')
  accept(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.driverService.acceptOffer(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('offers/:id/reject')
  reject(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.driverService.rejectOffer(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rides/:id/status')
  setStatus(@Req() req: { user: { userId: string } }, @Param('id') rideId: string, @Body() body: { status: string }) {
    return this.driverService.updateRideStatus(req.user.userId, rideId, body.status);
  }
}
