import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritePlaceDto } from './dto/favorite-place.dto';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.favoritePlace.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  create(userId: string, dto: FavoritePlaceDto) {
    return this.prisma.favoritePlace.create({ data: { ...dto, userId } });
  }

  async remove(userId: string, id: string) {
    const place = await this.prisma.favoritePlace.findUnique({ where: { id } });
    if (!place || place.userId !== userId) throw new NotFoundException('Favorite place not found');
    await this.prisma.favoritePlace.delete({ where: { id } });
    return { success: true };
  }
}
