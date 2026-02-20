import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { envConfig } from './config/env';
import { envValidationSchema } from './config/validation';
import { DriverModule } from './driver/driver.module';
import { HealthModule } from './health/health.module';
import { AppLogger } from './logging/app-logger.service';
import { MapsModule } from './maps/maps.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { MeModule } from './me/me.module';
import { PricingModule } from './pricing/pricing.module';
import { PrismaModule } from './prisma/prisma.module';
import { RidesModule } from './rides/rides.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig], validationSchema: envValidationSchema, validationOptions: { abortEarly: false } }),
    ThrottlerModule.forRootAsync({ inject: [ConfigService], useFactory: (configService: ConfigService) => [{ ttl: configService.get<number>('env.throttleTtl', 60) * 1000, limit: configService.get<number>('env.throttleLimit', 100) }] }),
    PrismaModule,
    HealthModule,
    AuthModule,
    MeModule,
    MapsModule,
    PricingModule,
    MatchmakingModule,
    RidesModule,
    DriverModule,
    AdminModule
  ],
  providers: [AppLogger]
})
export class AppModule {}
