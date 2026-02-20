import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/roles';
import { DriverOnlineDto, DriverRegisterDto, DriverRideStatusDto } from './driver.dto';
import { DriverService } from './driver.service';

@ApiTags('driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('register')
  register(@Body() dto: DriverRegisterDto) {
    return this.driverService.register(dto);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  @Post('online')
  online(@Req() req: { user: { userId: string } }, @Body() dto: DriverOnlineDto) {
    return this.driverService.setOnline(req.user.userId, dto);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  @Get('offers')
  offers(@Req() req: { user: { userId: string } }) {
    return this.driverService.listOffers(req.user.userId);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  @Post('offers/:id/accept')
  accept(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.driverService.acceptOffer(req.user.userId, id);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  @Post('offers/:id/reject')
  reject(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.driverService.rejectOffer(req.user.userId, id);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  @Post('rides/:id/status')
  rideStatus(
    @Req() req: { user: { userId: string } },
    @Param('id') id: string,
    @Body() dto: DriverRideStatusDto
  ) {
    return this.driverService.setRideStatus(req.user.userId, id, dto);
  }
}
