import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OfferStatus, Prisma, RideStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MapsService } from '../maps/maps.service';
import { PricingService } from '../pricing/pricing.service';
import { MatchmakingService } from '../matchmaking/matchmaking.service';
import { EstimateRideDto } from './dto/estimate-ride.dto';

@Injectable()
export class RidesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly maps: MapsService,
    private readonly pricing: PricingService,
    private readonly matchmaking: MatchmakingService
  ) {}

  async estimate(dto: EstimateRideDto) {
    const route = await this.maps.estimateDistance(
      { lat: dto.originLat, lng: dto.originLng },
      { lat: dto.destinationLat, lng: dto.destinationLng }
    );
    const quote = await this.pricing.estimate({ ...route, ...dto });
    return { ...route, ...quote };
  }

  async createRide(passengerId: string, dto: EstimateRideDto) {
    const estimation = await this.estimate(dto);
    const ride = await this.prisma.ride.create({
      data: {
        passengerId,
        ...dto,
        distanceMeters: estimation.distanceMeters,
        durationSeconds: estimation.durationSeconds,
        estimatedMin: new Prisma.Decimal(estimation.estimatedMin.toFixed(2)),
        estimatedMax: new Prisma.Decimal(estimation.estimatedMax.toFixed(2)),
        status: RideStatus.SEARCHING
      }
    });
    await this.prisma.rideStatusHistory.create({ data: { rideId: ride.id, status: RideStatus.SEARCHING } });
    await this.matchmaking.startSearch(ride.id);
    return this.getRide(passengerId, ride.id);
  }

  listPassengerRides(passengerId: string) {
    return this.prisma.ride.findMany({ where: { passengerId }, orderBy: { createdAt: 'desc' } });
  }

  async getRide(passengerId: string, rideId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      include: { history: { orderBy: { at: 'asc' } }, offers: true }
    });
    if (!ride || ride.passengerId !== passengerId) throw new NotFoundException('Ride not found');
    return ride;
  }

  async cancelRide(passengerId: string, rideId: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride || ride.passengerId !== passengerId) throw new NotFoundException('Ride not found');
    if (ride.status === RideStatus.COMPLETED || ride.status === RideStatus.CANCELLED) throw new BadRequestException('Ride cannot be cancelled');

    await this.prisma.ride.update({ where: { id: rideId }, data: { status: RideStatus.CANCELLED } });
    await this.prisma.rideStatusHistory.create({ data: { rideId, status: RideStatus.CANCELLED } });
    await this.prisma.offer.updateMany({ where: { rideId, status: OfferStatus.SENT }, data: { status: OfferStatus.EXPIRED } });
    return { success: true };
  }
}
