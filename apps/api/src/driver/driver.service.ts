import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DriverStatus, OfferStatus, RideStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password';
import { RegisterDriverDto } from './dto/register-driver.dto';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDriverDto) {
    if (!dto.acceptTerms) throw new BadRequestException('Terms required');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash: await hashPassword(dto.password),
        role: Role.DRIVER,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        driverProfile: {
          create: {
            vehicleType: dto.vehicleType,
            plateNumber: dto.plateNumber,
            status: DriverStatus.PENDING_VERIFICATION
          }
        }
      }
    });
    return { id: user.id, status: DriverStatus.PENDING_VERIFICATION };
  }

  async setOnline(userId: string, body: { isOnline: boolean; lat?: number; lng?: number }) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Driver profile not found');
    if (body.isOnline && profile.status !== DriverStatus.VERIFIED) throw new BadRequestException('Driver not verified');

    return this.prisma.driverProfile.update({ where: { userId }, data: { isOnline: body.isOnline, lastLocationLat: body.lat, lastLocationLng: body.lng } });
  }

  listOffers(userId: string) {
    return this.prisma.offer.findMany({ where: { driverId: userId, status: OfferStatus.SENT }, include: { ride: true }, orderBy: { createdAt: 'desc' } });
  }

  async acceptOffer(userId: string, id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer || offer.driverId !== userId) throw new NotFoundException('Offer not found');

    await this.prisma.offer.update({ where: { id }, data: { status: OfferStatus.ACCEPTED } });
    await this.prisma.offer.updateMany({ where: { rideId: offer.rideId, id: { not: id }, status: OfferStatus.SENT }, data: { status: OfferStatus.EXPIRED } });
    await this.prisma.ride.update({ where: { id: offer.rideId }, data: { driverId: userId, status: RideStatus.ASSIGNED } });
    await this.prisma.rideStatusHistory.create({ data: { rideId: offer.rideId, status: RideStatus.ASSIGNED } });
    return { success: true };
  }

  async rejectOffer(userId: string, id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer || offer.driverId !== userId) throw new NotFoundException('Offer not found');
    return this.prisma.offer.update({ where: { id }, data: { status: OfferStatus.REJECTED } });
  }

  async updateRideStatus(userId: string, rideId: string, status: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride || ride.driverId !== userId) throw new NotFoundException('Ride not found');
    const next = status as RideStatus;
    if (!Object.values(RideStatus).includes(next)) throw new BadRequestException('Invalid status');
    await this.prisma.ride.update({ where: { id: rideId }, data: { status: next } });
    await this.prisma.rideStatusHistory.create({ data: { rideId, status: next } });
    return { success: true };
  }
}
