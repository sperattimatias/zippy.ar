import { Injectable } from '@nestjs/common';
import { OfferStatus, RideStatus } from '@prisma/client';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchmakingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService
  ) {}

  async runForRide(rideId: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride || ride.status !== RideStatus.SEARCHING) {
      return;
    }

    const pricing = await this.pricingService.getConfig();
    const maxKm = pricing.maxSearchRadiusKm;

    const drivers = await this.prisma.driverProfile.findMany({
      where: {
        status: 'VERIFIED',
        isOnline: true,
        lastLocationLat: { not: null },
        lastLocationLng: { not: null }
      },
      take: 20
    });

    const withDistance = drivers
      .map((d) => {
        const lat = d.lastLocationLat ?? 0;
        const lng = d.lastLocationLng ?? 0;
        const distKm = Math.sqrt((lat - ride.originLat) ** 2 + (lng - ride.originLng) ** 2) * 111;
        return { driverId: d.userId, distKm };
      })
      .filter((d) => d.distKm <= maxKm)
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, 3);

    if (!withDistance.length) {
      return;
    }

    await this.prisma.offer.createMany({
      data: withDistance.map((d) => ({
        rideId,
        driverId: d.driverId,
        status: OfferStatus.SENT
      }))
    });
  }

  async acceptOffer(offerId: string, driverId: string) {
    return this.prisma.$transaction(async (tx) => {
      const offer = await tx.offer.findUnique({ where: { id: offerId } });
      if (!offer || offer.driverId !== driverId || offer.status !== OfferStatus.SENT) {
        return null;
      }

      await tx.offer.update({ where: { id: offerId }, data: { status: OfferStatus.ACCEPTED } });
      await tx.offer.updateMany({
        where: { rideId: offer.rideId, id: { not: offerId }, status: OfferStatus.SENT },
        data: { status: OfferStatus.EXPIRED }
      });
      await tx.ride.update({
        where: { id: offer.rideId },
        data: { driverId, status: RideStatus.ASSIGNED }
      });
      await tx.rideStatusHistory.create({ data: { rideId: offer.rideId, status: RideStatus.ASSIGNED } });

      return offer;
    });
  }
}
