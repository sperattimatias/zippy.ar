import { Injectable } from '@nestjs/common';
import { RideType, VehicleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type PricingRules = {
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

const defaults: PricingRules = {
  baseFareAuto: 1500,
  baseFareMoto: 1000,
  perKmAuto: 500,
  perKmMoto: 350,
  perMinAuto: 120,
  perMinMoto: 90,
  multiplierDirect: 1.15,
  multiplierShared: 0.9,
  surchargeLuggage: 400,
  surchargePet: 350,
  surchargeAccessibility: 500,
  minFare: 1200,
  maxSearchRadiusKm: 5
};

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRules(): Promise<PricingRules> {
    const config = await this.prisma.appConfig.findUnique({ where: { id: 'singleton' } });
    return (config?.pricing as PricingRules) ?? defaults;
  }

  async estimate(input: { distanceMeters: number; durationSeconds: number; vehicleType: VehicleType; rideType: RideType; luggage?: boolean; pet?: boolean; accessibility?: boolean }) {
    const rules = await this.getRules();
    const km = input.distanceMeters / 1000;
    const mins = input.durationSeconds / 60;
    const vehicleBase = input.vehicleType === VehicleType.AUTO ? rules.baseFareAuto : rules.baseFareMoto;
    const perKm = input.vehicleType === VehicleType.AUTO ? rules.perKmAuto : rules.perKmMoto;
    const perMin = input.vehicleType === VehicleType.AUTO ? rules.perMinAuto : rules.perMinMoto;
    const rideMultiplier = input.rideType === RideType.DIRECT ? rules.multiplierDirect : rules.multiplierShared;

    let price = (vehicleBase + km * perKm + mins * perMin) * rideMultiplier;
    if (input.luggage) price += rules.surchargeLuggage;
    if (input.pet) price += rules.surchargePet;
    if (input.accessibility) price += rules.surchargeAccessibility;

    price = Math.max(price, rules.minFare);
    return { estimatedMin: Number((price * 0.92).toFixed(2)), estimatedMax: Number((price * 1.08).toFixed(2)) };
  }
}
