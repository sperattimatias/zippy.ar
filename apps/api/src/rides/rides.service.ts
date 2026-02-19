import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AcceptOfferDto } from './dto/accept-offer.dto';
import { ChangeRideStatusDto } from './dto/change-ride-status.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateRideDto } from './dto/create-ride.dto';
import { canTransitionRideStatus, RideStatus } from './domain/ride-status';

type Ride = {
  id: string;
  passengerId?: string;
  driverId?: string;
  status: RideStatus;
  estimatedFare: number;
  agreedFare?: number;
  hasLuggage: boolean;
  hasPets: boolean;
  needsAccessibility: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

type Offer = {
  id: string;
  rideId: string;
  driverId: string;
  amount: number;
  message?: string;
  createdAt: string;
};

type RideEvent = {
  id: string;
  rideId: string;
  eventType: string;
  fromStatus?: RideStatus;
  toStatus?: RideStatus;
  payload?: Record<string, unknown>;
  createdAt: string;
};

@Injectable()
export class RidesService {
  private readonly rides = new Map<string, Ride>();
  private readonly offers = new Map<string, Offer>();
  private readonly events = new Map<string, RideEvent[]>();

  createRide(passengerId: string, dto: CreateRideDto) {
    const now = new Date().toISOString();
    const ride: Ride = {
      id: randomUUID(),
      passengerId,
      status: RideStatus.REQUESTED,
      estimatedFare: dto.estimatedFare,
      hasLuggage: dto.hasLuggage ?? false,
      hasPets: dto.hasPets ?? false,
      needsAccessibility: dto.needsAccessibility ?? false,
      note: dto.note,
      createdAt: now,
      updatedAt: now
    };

    this.rides.set(ride.id, ride);

    this.createEvent(ride.id, 'ride.created', {
      toStatus: RideStatus.REQUESTED,
      payload: { estimatedFare: dto.estimatedFare, passengerId }
    });

    return this.getRideView(ride.id);
  }

  listRides() {
    return Array.from(this.rides.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((ride) => this.getRideView(ride.id));
  }

  createOffer(rideId: string, driverId: string, dto: CreateOfferDto) {
    const ride = this.findRideOrThrow(rideId);

    if ([RideStatus.COMPLETED, RideStatus.CANCELLED, RideStatus.EXPIRED].includes(ride.status)) {
      throw new BadRequestException('Cannot add offers to a closed ride');
    }

    const offer: Offer = {
      id: randomUUID(),
      rideId,
      driverId,
      amount: dto.amount,
      message: dto.message,
      createdAt: new Date().toISOString()
    };

    this.offers.set(offer.id, offer);

    const previousStatus = ride.status;
    if (ride.status === RideStatus.REQUESTED) {
      ride.status = RideStatus.NEGOTIATING;
      ride.updatedAt = new Date().toISOString();
    }

    this.createEvent(rideId, 'offer.created', {
      fromStatus: previousStatus,
      toStatus: ride.status,
      payload: { offerId: offer.id, driverId: offer.driverId, amount: offer.amount }
    });

    return offer;
  }

  acceptOffer(rideId: string, offerId: string, dto: AcceptOfferDto) {
    const ride = this.findRideOrThrow(rideId);
    const offer = this.offers.get(offerId);

    if (!offer || offer.rideId !== rideId) {
      throw new NotFoundException('Offer not found for ride');
    }

    if (![RideStatus.REQUESTED, RideStatus.NEGOTIATING, RideStatus.ASSIGNED].includes(ride.status)) {
      throw new BadRequestException('Ride is not in an assignable state');
    }

    const previousStatus = ride.status;
    ride.status = RideStatus.ASSIGNED;
    ride.driverId = offer.driverId;
    ride.agreedFare = dto.agreedFare;
    ride.updatedAt = new Date().toISOString();

    this.createEvent(rideId, 'offer.accepted', {
      fromStatus: previousStatus,
      toStatus: RideStatus.ASSIGNED,
      payload: {
        offerId,
        driverId: offer.driverId,
        agreedFare: dto.agreedFare
      }
    });

    return ride;
  }

  changeStatus(rideId: string, dto: ChangeRideStatusDto) {
    const ride = this.findRideOrThrow(rideId);

    if (!canTransitionRideStatus(ride.status, dto.status)) {
      throw new BadRequestException(`Invalid ride status transition: ${ride.status} -> ${dto.status}`);
    }

    if (ride.status === dto.status) {
      return ride;
    }

    const previousStatus = ride.status;
    ride.status = dto.status;
    ride.updatedAt = new Date().toISOString();

    this.createEvent(rideId, 'ride.statusChanged', {
      fromStatus: previousStatus,
      toStatus: dto.status
    });

    return ride;
  }

  private findRideOrThrow(rideId: string): Ride {
    const ride = this.rides.get(rideId);
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }
    return ride;
  }

  private createEvent(
    rideId: string,
    eventType: string,
    args: { fromStatus?: RideStatus; toStatus?: RideStatus; payload?: Record<string, unknown> }
  ) {
    const current = this.events.get(rideId) ?? [];

    current.push({
      id: randomUUID(),
      rideId,
      eventType,
      fromStatus: args.fromStatus,
      toStatus: args.toStatus,
      payload: args.payload,
      createdAt: new Date().toISOString()
    });

    this.events.set(rideId, current);
  }

  private getRideView(rideId: string) {
    const ride = this.findRideOrThrow(rideId);
    const offers = Array.from(this.offers.values()).filter((offer) => offer.rideId === rideId);
    const events = this.events.get(rideId) ?? [];
    return { ...ride, offers, events };
  }
}
