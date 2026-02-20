import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapsService {
  constructor(private readonly config: ConfigService, private readonly prisma: PrismaService) {}

  private async key() {
    const db = await this.prisma.appConfig.findUnique({ where: { id: 'singleton' } });
    return db?.googleMapsServerKey || this.config.get<string>('env.googleMapsServerKey', '');
  }

  async reverseGeocode(lat: number, lng: number) {
    const key = await this.key();
    if (!key) return { formattedAddress: `${lat},${lng}` };
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    const response = await fetch(url);
    const data = (await response.json()) as { results?: Array<{ formatted_address: string; place_id: string }> };
    return {
      formattedAddress: data.results?.[0]?.formatted_address ?? `${lat},${lng}`,
      placeId: data.results?.[0]?.place_id ?? ''
    };
  }

  async estimateDistance(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    const key = await this.key();
    if (!key) {
      const distanceMeters = Math.round(this.haversine(origin.lat, origin.lng, destination.lat, destination.lng) * 1000);
      const durationSeconds = Math.round((distanceMeters / 1000 / 28) * 3600);
      return { distanceMeters, durationSeconds };
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${key}`;
    const response = await fetch(url);
    const data = (await response.json()) as { rows?: Array<{ elements?: Array<{ distance?: { value: number }; duration?: { value: number } }> }> };
    const element = data.rows?.[0]?.elements?.[0];
    return {
      distanceMeters: element?.distance?.value ?? 0,
      durationSeconds: element?.duration?.value ?? 0
    };
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }
}
