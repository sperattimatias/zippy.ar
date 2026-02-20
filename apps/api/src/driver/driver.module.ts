import { Module } from '@nestjs/common';
import { MatchmakingModule } from '../matchmaking/matchmaking.module';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [MatchmakingModule],
  controllers: [DriverController],
  providers: [DriverService]
})
export class DriverModule {}
