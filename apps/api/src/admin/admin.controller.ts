import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/roles';
import { AdminService } from './admin.service';
import { GoogleMapsConfigDto, PricingConfigDto } from './admin.dto';

@ApiTags('admin')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('drivers')
  drivers() {
    return this.adminService.listDrivers();
  }

  @Patch('drivers/:id/approve')
  approve(@Param('id') id: string) {
    return this.adminService.approveDriver(id);
  }

  @Patch('drivers/:id/ban')
  ban(@Param('id') id: string) {
    return this.adminService.banDriver(id);
  }

  @Get('config')
  config() {
    return this.adminService.getConfig();
  }

  @Put('config/google-maps')
  setGoogleMaps(@Body() dto: GoogleMapsConfigDto) {
    return this.adminService.setGoogleMapsConfig(dto);
  }

  @Put('config/pricing')
  setPricing(@Body() dto: PricingConfigDto) {
    return this.adminService.setPricing(dto);
  }
}
