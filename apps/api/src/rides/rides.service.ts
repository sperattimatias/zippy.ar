import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RideStatus, Role } from '@prisma/client';
import { MatchmakingService } from '../matchmaking/matchmaking.service';
import { MapsService } from '../maps/maps.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeRideStatusDto } from './dto/change-ride-status.dto';
import { CreateRideDto } from './dto/create-ride.dto';
import { EstimateRideDto } from './dto/estimate-ride.dto';

const DRIVER_STATUS_SET = new Set<RideStatus>([
  RideStatus.DRIVER_EN_ROUTE,
  RideStatus.ARRIVED,
  RideStatus.IN_PROGRESS,
  RideStatus.COMPLETED,
  RideStatus.CANCELLED
]);

@Injectable()
export class RidesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapsService: MapsService,
    private readonly pricingService: PricingService,
    private readonly matchmakingService: MatchmakingService
  ) {}

  async estimateRide(dto: EstimateRideDto) {
    const matrix = await this.mapsService.distanceMatrix(dto.origin, dto.destination);
    const price = await this.pricingService.estimate({
      ...matrix,
      vehicleType: dto.vehicleType,
      rideType: dto.rideType,
      hasLuggage: dto.hasLuggage,
      hasPets: dto.hasPets,
      needsAccessibility: dto.needsAccessibility
    });

    return {
      ...matrix,
      ...price
    };
  }

  async createRide(passengerId: string, dto: CreateRideDto) {
    const estimate = await this.estimateRide(dto);

    const ride = await this.prisma.$transaction(async (tx) => {
      const created = await tx.ride.create({
        data: {
          passengerId,
          status: RideStatus.SEARCHING,
          originAddress: dto.origin.address,
          originPlaceId: dto.origin.placeId,
          originLat: dto.origin.lat,
          originLng: dto.origin.lng,
          destinationAddress: dto.destination.address,
          destinationPlaceId: dto.destination.placeId,
          destinationLat: dto.destination.lat,
          destinationLng: dto.destination.lng,
          vehicleType: dto.vehicleType,
          rideType: dto.rideType,
          hasLuggage: dto.hasLuggage ?? false,
          hasPets: dto.hasPets ?? false,
          needsAccessibility: dto.needsAccessibility ?? false,
          note: dto.note,
          distanceMeters: estimate.distanceMeters,
          durationSeconds: estimate.durationSeconds,
          estimatedMin: new Prisma.Decimal(estimate.estimatedMin.toFixed(2)),
          estimatedMax: new Prisma.Decimal(estimate.estimatedMax.toFixed(2))
        }
      });

      await tx.rideStatusHistory.create({ data: { rideId: created.id, status: RideStatus.SEARCHING } });
      await tx.rideEvent.create({
        data: {
          rideId: created.id,
          eventType: 'ride.created',
          toStatus: RideStatus.SEARCHING,
          payload: {
            estimate
          }
        }
      });
      return created;
    });

    await this.matchmakingService.runForRide(ride.id);
    return this.getRide(ride.id, passengerId, Role.PASSENGER);
  }

  listRides(userId: string, isAdmin = false) {
    return this.prisma.ride.findMany({
      where: isAdmin ? undefined : { passengerId: userId },
      include: {
        history: { orderBy: { at: 'asc' } },
        offers: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRide(rideId: string, userId: string, role: Role) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        history: { orderBy: { at: 'asc' } },
        offers: true,
        passenger: { select: { id: true, firstName: true, lastName: true } },
        driver: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    if (!ride) throw new NotFoundException('Ride not found');
    if (role !== Role.ADMIN && ride.passengerId !== userId && ride.driverId !== userId) {
      throw new ForbiddenException('Ride not accessible');
    }

    return ride;
  }

  async cancelRide(rideId: string, passengerId: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride || ride.passengerId !== passengerId) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.status === RideStatus.COMPLETED || ride.status === RideStatus.CANCELLED) {
      throw new BadRequestException('Ride cannot be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.ride.update({ where: { id: rideId }, data: { status: RideStatus.CANCELLED } });
      await tx.offer.updateMany({ where: { rideId, status: 'SENT' }, data: { status: 'EXPIRED' } });
      await tx.rideStatusHistory.create({ data: { rideId, status: RideStatus.CANCELLED } });
      return updated;
    });
  }

  async changeStatus(rideId: string, actorUserId: string, role: Role, dto: ChangeRideStatusDto) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');

    if (role !== Role.ADMIN) {
      if (!ride.driverId || ride.driverId !== actorUserId) {
        throw new ForbiddenException('Only assigned driver can change ride status');
      }
      if (!DRIVER_STATUS_SET.has(dto.status)) {
        throw new BadRequestException('Invalid status for driver');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.ride.update({ where: { id: rideId }, data: { status: dto.status } });
      await tx.rideStatusHistory.create({ data: { rideId, status: dto.status } });
      return updated;
    });
  }
}
