import { Module } from '@nestjs/common';
import { PricingModule } from '../pricing/pricing.module';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [PricingModule],
  providers: [MatchmakingService],
  exports: [MatchmakingService]
})
export class MatchmakingModule {}
