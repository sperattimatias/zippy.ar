import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoritePlaceDto } from './dto/favorite-place.dto';
import { MeService } from './me.service';

@Controller('me/favorites')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  list(@Req() req: { user: { userId: string } }) {
    return this.meService.list(req.user.userId);
  }

  @Post()
  create(@Req() req: { user: { userId: string } }, @Body() dto: FavoritePlaceDto) {
    return this.meService.create(req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.meService.remove(req.user.userId, id);
  }
}
