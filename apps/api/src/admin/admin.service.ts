import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsConfigDto, PricingConfigDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService
  ) {}

  listDrivers() {
    return this.prisma.driverProfile.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  approveDriver(userId: string) {
    return this.prisma.driverProfile.update({ where: { userId }, data: { status: 'VERIFIED' } });
  }

  banDriver(userId: string) {
    return this.prisma.driverProfile.update({ where: { userId }, data: { status: 'BANNED', isOnline: false } });
  }

  async getConfig() {
    const appConfig = await this.prisma.appConfig.findUnique({ where: { id: 1 } });
    return {
      googleMaps: {
        hasWebKey: Boolean(appConfig?.googleMapsWebKey),
        hasServerKey: Boolean(appConfig?.googleMapsServerKey),
        enablePlaces: appConfig?.enablePlaces ?? true,
        enableDistanceMatrix: appConfig?.enableDistanceMatrix ?? true,
        enableDirections: appConfig?.enableDirections ?? true
      },
      pricing: await this.pricingService.getConfig()
    };
  }

  async setGoogleMapsConfig(dto: GoogleMapsConfigDto) {
    await this.prisma.appConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        googleMapsWebKey: dto.googleMapsWebKey,
        googleMapsServerKey: dto.googleMapsServerKey,
        enablePlaces: dto.enablePlaces,
        enableDistanceMatrix: dto.enableDistanceMatrix,
        enableDirections: dto.enableDirections
      },
      update: {
        googleMapsWebKey: dto.googleMapsWebKey,
        googleMapsServerKey: dto.googleMapsServerKey,
        enablePlaces: dto.enablePlaces,
        enableDistanceMatrix: dto.enableDistanceMatrix,
        enableDirections: dto.enableDirections
      }
    });

    return this.getConfig();
  }

  setPricing(dto: PricingConfigDto) {
    return this.pricingService.setConfig(dto);
  }
}
