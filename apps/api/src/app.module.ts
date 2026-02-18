import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { envConfig } from './config/env';
import { envValidationSchema } from './config/validation';
import { HealthModule } from './health/health.module';
import { AppLogger } from './logging/app-logger.service';
import { RidesModule } from './rides/rides.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false
      }
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        ttl: configService.get<number>('env.throttleTtl', 60) * 1000,
        limit: configService.get<number>('env.throttleLimit', 100)
      }]
    }),
    HealthModule,
    RidesModule
  ],
  providers: [AppLogger]
})
export class AppModule {}
