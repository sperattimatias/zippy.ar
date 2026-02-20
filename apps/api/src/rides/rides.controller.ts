import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/roles';
import { ChangeRideStatusDto } from './dto/change-ride-status.dto';
import { CreateRideDto } from './dto/create-ride.dto';
import { EstimateRideDto } from './dto/estimate-ride.dto';
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

  @Post('estimate')
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Estimate ride price and ETA' })
  estimate(@Body() dto: EstimateRideDto) {
    return this.ridesService.estimateRide(dto);
  }

  @Post()
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Create a ride request' })
  createRide(@Req() request: AuthRequest, @Body() dto: CreateRideDto) {
    return this.ridesService.createRide(request.user.userId, dto);
  }

  @Get()
  @Roles(UserRole.PASSENGER, UserRole.ADMIN)
  listRides(@Req() request: AuthRequest) {
    return this.ridesService.listRides(request.user.userId, request.user.role === UserRole.ADMIN);
  }

  @Get(':id')
  @Roles(UserRole.PASSENGER, UserRole.DRIVER, UserRole.ADMIN)
  getRide(@Req() request: AuthRequest, @Param('id') rideId: string) {
    return this.ridesService.getRide(rideId, request.user.userId, request.user.role);
  }

  @Post(':id/cancel')
  @Roles(UserRole.PASSENGER)
  cancelRide(@Req() request: AuthRequest, @Param('id') rideId: string) {
    return this.ridesService.cancelRide(rideId, request.user.userId);
  }

  @Post(':id/status')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  changeStatus(@Req() request: AuthRequest, @Param('id') rideId: string, @Body() dto: ChangeRideStatusDto) {
    return this.ridesService.changeStatus(rideId, request.user.userId, request.user.role, dto);
  }
}
