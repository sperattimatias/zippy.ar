import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GoogleMapsConfigDto } from './dto/google-maps-config.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('drivers')
  drivers() { return this.adminService.listDrivers(); }

  @Patch('drivers/:id/approve')
  approve(@Param('id') id: string) { return this.adminService.setDriverStatus(id, 'VERIFIED'); }

  @Patch('drivers/:id/ban')
  ban(@Param('id') id: string) { return this.adminService.setDriverStatus(id, 'BANNED'); }

  @Get('config')
  config() { return this.adminService.getConfig(); }

  @Put('config/google-maps')
  saveMaps(@Body() dto: GoogleMapsConfigDto) { return this.adminService.updateGoogleMaps(dto); }

  @Put('config/pricing')
  savePricing(@Body() pricing: Record<string, number>) { return this.adminService.updatePricing(pricing); }
}
