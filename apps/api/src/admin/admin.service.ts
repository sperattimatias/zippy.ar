import { Injectable } from '@nestjs/common';
import { DriverStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsConfigDto } from './dto/google-maps-config.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  listDrivers() {
    return this.prisma.driverProfile.findMany({ include: { user: true }, orderBy: { updatedAt: 'desc' } });
  }

  setDriverStatus(userId: string, status: 'VERIFIED' | 'BANNED') {
    return this.prisma.driverProfile.update({ where: { userId }, data: { status: status as DriverStatus, isOnline: false } });
  }

  async getConfig() {
    const cfg = await this.prisma.appConfig.findUnique({ where: { id: 'singleton' } });
    return {
      ...cfg,
      googleMapsWebConfigured: Boolean(cfg?.googleMapsWebKey || this.config.get('env.googleMapsWebKey')),
      googleMapsServerConfigured: Boolean(cfg?.googleMapsServerKey || this.config.get('env.googleMapsServerKey'))
    };
  }

  updateGoogleMaps(dto: GoogleMapsConfigDto) {
    return this.prisma.appConfig.upsert({
      where: { id: 'singleton' },
      update: dto,
      create: { id: 'singleton', pricing: {}, ...dto }
    });
  }

  async updatePricing(pricing: Record<string, number>) {
    return this.prisma.appConfig.upsert({
      where: { id: 'singleton' },
      update: { pricing },
      create: { id: 'singleton', pricing }
    });
  }
}
