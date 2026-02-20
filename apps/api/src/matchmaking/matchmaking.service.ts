import { Injectable } from '@nestjs/common';
import { DriverStatus, OfferStatus, RideStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class MatchmakingService {
  constructor(private readonly prisma: PrismaService, private readonly pricing: PricingService) {}

  async startSearch(rideId: string) {
    const ride = await this.prisma.ride.findUniqueOrThrow({ where: { id: rideId } });
    const rules = await this.pricing.getRules();
    const candidates = await this.prisma.driverProfile.findMany({
      where: { status: DriverStatus.VERIFIED, isOnline: true, lastLocationLat: { not: null }, lastLocationLng: { not: null } },
      include: { user: true }
    });

    const nearby = candidates
      .map((c) => ({
        profile: c,
        distKm: this.haversine(ride.originLat, ride.originLng, c.lastLocationLat ?? 0, c.lastLocationLng ?? 0)
      }))
      .filter((x) => x.distKm <= rules.maxSearchRadiusKm)
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, 3);

    await this.prisma.offer.createMany({
      data: nearby.map((x) => ({ rideId, driverId: x.profile.userId, status: OfferStatus.SENT }))
    });

    return nearby.length;
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }
}
