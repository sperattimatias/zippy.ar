import { Injectable } from '@nestjs/common';
import { Prisma, RideType, VehicleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type PricingConfig = {
  baseFareAuto: number;
  baseFareMoto: number;
  perKmAuto: number;
  perKmMoto: number;
  perMinAuto: number;
  perMinMoto: number;
  multiplierDirect: number;
  multiplierShared: number;
  surchargeLuggage: number;
  surchargePet: number;
  surchargeAccessibility: number;
  minFare: number;
  maxSearchRadiusKm: number;
};

const DEFAULT_PRICING: PricingConfig = {
  baseFareAuto: 1800,
  baseFareMoto: 1200,
  perKmAuto: 320,
  perKmMoto: 220,
  perMinAuto: 45,
  perMinMoto: 35,
  multiplierDirect: 1.2,
  multiplierShared: 1,
  surchargeLuggage: 200,
  surchargePet: 180,
  surchargeAccessibility: 220,
  minFare: 1500,
  maxSearchRadiusKm: 8
};

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getConfig(): Promise<PricingConfig> {
    const config = await this.prisma.appConfig.findUnique({ where: { id: 1 } });
    return { ...DEFAULT_PRICING, ...(config?.pricing as Partial<PricingConfig> | undefined) };
  }

  async setConfig(pricing: PricingConfig) {
    await this.prisma.appConfig.upsert({
      where: { id: 1 },
      create: { id: 1, pricing: pricing as unknown as Prisma.JsonObject },
      update: { pricing: pricing as unknown as Prisma.JsonObject }
    });
    return this.getConfig();
  }

  async estimate(input: {
    distanceMeters: number;
    durationSeconds: number;
    vehicleType: VehicleType;
    rideType: RideType;
    hasLuggage?: boolean;
    hasPets?: boolean;
    needsAccessibility?: boolean;
  }) {
    const cfg = await this.getConfig();
    const km = input.distanceMeters / 1000;
    const minutes = input.durationSeconds / 60;

    const base = input.vehicleType === VehicleType.MOTO ? cfg.baseFareMoto : cfg.baseFareAuto;
    const perKm = input.vehicleType === VehicleType.MOTO ? cfg.perKmMoto : cfg.perKmAuto;
    const perMin = input.vehicleType === VehicleType.MOTO ? cfg.perMinMoto : cfg.perMinAuto;
    const multiplier = input.rideType === RideType.DIRECT ? cfg.multiplierDirect : cfg.multiplierShared;

    const extras =
      (input.hasLuggage ? cfg.surchargeLuggage : 0) +
      (input.hasPets ? cfg.surchargePet : 0) +
      (input.needsAccessibility ? cfg.surchargeAccessibility : 0);

    const raw = (base + km * perKm + minutes * perMin + extras) * multiplier;
    const min = Math.max(cfg.minFare, raw * 0.92);
    const max = Math.max(min, raw * 1.12);

    return {
      estimatedMin: Number(min.toFixed(2)),
      estimatedMax: Number(max.toFixed(2))
    };
  }
}
