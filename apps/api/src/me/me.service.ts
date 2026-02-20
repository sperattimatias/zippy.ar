import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritePlaceDto, UpdateMeDto } from './me.dto';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true, driverProfile: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updateMe(userId: string, dto: UpdateMeDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatarUrl: dto.avatarUrl,
        phone: dto.phone
      }
    });
  }

  listFavorites(userId: string) {
    return this.prisma.favoritePlace.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  addFavorite(userId: string, dto: FavoritePlaceDto) {
    return this.prisma.favoritePlace.create({ data: { userId, ...dto } });
  }

  removeFavorite(userId: string, favoriteId: string) {
    return this.prisma.favoritePlace.deleteMany({ where: { id: favoriteId, userId } });
  }

  assertAvatarComplete(user: { role: string; avatarUrl: string | null }) {
    if ((user.role === 'PASSENGER' || user.role === 'DRIVER') && !user.avatarUrl) {
      throw new BadRequestException('Avatar is required for this profile');
    }
  }
}
