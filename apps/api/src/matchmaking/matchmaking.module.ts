import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { PricingModule } from '../pricing/pricing.module';

@Module({ imports: [PricingModule], providers: [MatchmakingService], exports: [MatchmakingService] })
export class MatchmakingModule {}
