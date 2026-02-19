import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RideStatus as DbRideStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AcceptOfferDto } from './dto/accept-offer.dto';
import { ChangeRideStatusDto } from './dto/change-ride-status.dto';
import { canTransitionRideStatus, RideStatus } from './domain/ride-status';

const CLOSED_STATUSES: DbRideStatus[] = [
  DbRideStatus.COMPLETED,
  DbRideStatus.CANCELLED,
  DbRideStatus.EXPIRED
];

@Injectable()
export class RidesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRide(passengerId: string, dto: CreateRideDto) {
    return this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.create({
        data: {
          passengerId,
          status: DbRideStatus.REQUESTED,
          estimatedFare: this.decimal(dto.estimatedFare),
          hasLuggage: dto.hasLuggage ?? false,
          hasPets: dto.hasPets ?? false,
          needsAccessibility: dto.needsAccessibility ?? false,
          note: dto.note
        }
      });

      await tx.rideEvent.create({
        data: {
          rideId: ride.id,
          eventType: 'ride.created',
          toStatus: DbRideStatus.REQUESTED,
          payload: {
            estimatedFare: dto.estimatedFare,
            passengerId
          }
        }
      });

      return this.getRideView(tx, ride.id);
    });
  }

  async listRides() {
    return this.prisma.ride.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        offers: { orderBy: { createdAt: 'asc' } },
        events: { orderBy: { createdAt: 'asc' } }
      }
    });
  }

  async createOffer(rideId: string, driverId: string, dto: CreateOfferDto) {
    return this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({ where: { id: rideId } });

      if (!ride) {
        throw new NotFoundException('Ride not found');
      }

      if (CLOSED_STATUSES.includes(ride.status)) {
        throw new BadRequestException('Cannot add offers to a closed ride');
      }

      const offer = await tx.offer.create({
        data: {
          rideId,
          driverId,
          amount: this.decimal(dto.amount),
          message: dto.message
        }
      });

      const nextStatus = ride.status === DbRideStatus.REQUESTED ? DbRideStatus.NEGOTIATING : ride.status;

      if (nextStatus !== ride.status) {
        await tx.ride.update({
          where: { id: rideId },
          data: { status: nextStatus }
        });
      }

      await tx.rideEvent.create({
        data: {
          rideId,
          eventType: 'offer.created',
          fromStatus: ride.status,
          toStatus: nextStatus,
          payload: {
            offerId: offer.id,
            driverId,
            amount: dto.amount
          }
        }
      });

      return offer;
    });
  }

  async acceptOffer(rideId: string, offerId: string, dto: AcceptOfferDto) {
    return this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({ where: { id: rideId } });
      if (!ride) {
        throw new NotFoundException('Ride not found');
      }

      const offer = await tx.offer.findUnique({ where: { id: offerId } });
      if (!offer || offer.rideId !== rideId) {
        throw new NotFoundException('Offer not found for ride');
      }

      if (![DbRideStatus.REQUESTED, DbRideStatus.NEGOTIATING, DbRideStatus.ASSIGNED].includes(ride.status)) {
        throw new BadRequestException('Ride is not in an assignable state');
      }

      await tx.offer.updateMany({
        where: { rideId },
        data: { isAccepted: false, acceptedAt: null }
      });

      await tx.offer.update({
        where: { id: offerId },
        data: { isAccepted: true, acceptedAt: new Date() }
      });

      const updatedRide = await tx.ride.update({
        where: { id: rideId },
        data: {
          status: DbRideStatus.ASSIGNED,
          driverId: offer.driverId,
          agreedFare: this.decimal(dto.agreedFare)
        }
      });

      await tx.rideEvent.create({
        data: {
          rideId,
          eventType: 'offer.accepted',
          fromStatus: ride.status,
          toStatus: DbRideStatus.ASSIGNED,
          payload: {
            offerId,
            driverId: offer.driverId,
            agreedFare: dto.agreedFare
          }
        }
      });

      return updatedRide;
    });
  }

  async changeStatus(rideId: string, dto: ChangeRideStatusDto) {
    return this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({ where: { id: rideId } });
      if (!ride) {
        throw new NotFoundException('Ride not found');
      }

      const from = ride.status as unknown as RideStatus;
      const to = dto.status;

      if (!canTransitionRideStatus(from, to)) {
        throw new BadRequestException(`Invalid ride status transition: ${ride.status} -> ${dto.status}`);
      }

      if (ride.status === (dto.status as unknown as DbRideStatus)) {
        return ride;
      }

      const updatedRide = await tx.ride.update({
        where: { id: rideId },
        data: { status: dto.status as unknown as DbRideStatus }
      });

      await tx.rideEvent.create({
        data: {
          rideId,
          eventType: 'ride.statusChanged',
          fromStatus: ride.status,
          toStatus: dto.status as unknown as DbRideStatus
        }
      });

      return updatedRide;
    });
  }

  private decimal(value: number) {
    return new Prisma.Decimal(value.toFixed(2));
  }

  private getRideView(tx: Prisma.TransactionClient, rideId: string) {
    return tx.ride.findUniqueOrThrow({
      where: { id: rideId },
      include: {
        offers: { orderBy: { createdAt: 'asc' } },
        events: { orderBy: { createdAt: 'asc' } }
      }
    });
  }
}
