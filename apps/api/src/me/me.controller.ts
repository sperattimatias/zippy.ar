import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoritePlaceDto, UpdateMeDto } from './me.dto';
import { MeService } from './me.service';

@ApiTags('me')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  me(@Req() req: { user: { userId: string } }) {
    return this.meService.getMe(req.user.userId);
  }

  @Patch()
  patchMe(@Req() req: { user: { userId: string } }, @Body() dto: UpdateMeDto) {
    return this.meService.updateMe(req.user.userId, dto);
  }

  @Get('favorites')
  listFavorites(@Req() req: { user: { userId: string } }) {
    return this.meService.listFavorites(req.user.userId);
  }

  @Post('favorites')
  createFavorite(@Req() req: { user: { userId: string } }, @Body() dto: FavoritePlaceDto) {
    return this.meService.addFavorite(req.user.userId, dto);
  }

  @Delete('favorites/:id')
  deleteFavorite(@Req() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.meService.removeFavorite(req.user.userId, id);
  }
}
