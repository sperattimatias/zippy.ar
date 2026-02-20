import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OfferStatus, Role } from '@prisma/client';
import { hashPassword } from '../auth/password';
import { MatchmakingService } from '../matchmaking/matchmaking.service';
import { PrismaService } from '../prisma/prisma.service';
import { DriverOnlineDto, DriverRegisterDto, DriverRideStatusDto } from './driver.dto';

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchmakingService: MatchmakingService
  ) {}

  async register(dto: DriverRegisterDto) {
    if (!dto.acceptTerms) throw new BadRequestException('Debe aceptar términos');

    const email = dto.email.toLowerCase().trim();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email ya registrado');

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(dto.password),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        role: Role.DRIVER,
        driverProfile: {
          create: {
            vehicleType: dto.vehicleType,
            plateNumber: dto.plateNumber,
            status: 'PENDING_VERIFICATION'
          }
        }
      },
      include: { driverProfile: true }
    });

    return user;
  }

  async setOnline(driverUserId: string, dto: DriverOnlineDto) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
    if (!profile) throw new NotFoundException('Driver profile not found');
    if (dto.isOnline && profile.status !== 'VERIFIED') {
      throw new ForbiddenException('Solo conductores verificados pueden estar online');
    }

    return this.prisma.driverProfile.update({
      where: { userId: driverUserId },
      data: {
        isOnline: dto.isOnline,
        lastLocationLat: dto.lat,
        lastLocationLng: dto.lng
      }
    });
  }

  listOffers(driverUserId: string) {
    return this.prisma.offer.findMany({
      where: { driverId: driverUserId, status: OfferStatus.SENT },
      include: { ride: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  acceptOffer(driverUserId: string, offerId: string) {
    return this.matchmakingService.acceptOffer(offerId, driverUserId);
  }

  rejectOffer(driverUserId: string, offerId: string) {
    return this.prisma.offer.updateMany({
      where: { id: offerId, driverId: driverUserId, status: OfferStatus.SENT },
      data: { status: OfferStatus.REJECTED }
    });
  }

  async setRideStatus(driverUserId: string, rideId: string, dto: DriverRideStatusDto) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride || ride.driverId !== driverUserId) {
      throw new NotFoundException('Ride not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.ride.update({ where: { id: rideId }, data: { status: dto.status } });
      await tx.rideStatusHistory.create({ data: { rideId, status: dto.status } });
      return updated;
    });
  }
}
