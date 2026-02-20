import { Module } from '@nestjs/common';
import { MapsModule } from '../maps/maps.module';
import { MatchmakingModule } from '../matchmaking/matchmaking.module';
import { PricingModule } from '../pricing/pricing.module';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';

@Module({
  imports: [MapsModule, PricingModule, MatchmakingModule],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService]
})
export class RidesModule {}
