import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

type GeocodeResult = { address: string; lat: number; lng: number };

@Injectable()
export class MapsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  private async getServerKey() {
    const appConfig = await this.prisma.appConfig.findUnique({ where: { id: 1 } });
    return appConfig?.googleMapsServerKey || this.configService.get<string>('env.googleMapsServerKey');
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    const key = await this.getServerKey();
    if (!key) {
      throw new HttpException('Google Maps server key not configured', HttpStatus.PRECONDITION_REQUIRED);
    }

    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('latlng', `${lat},${lng}`);
    url.searchParams.set('key', key);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      status: string;
      results?: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }>;
    };

    if (data.status !== 'OK' || !data.results?.length) {
      throw new HttpException('Failed reverse geocoding', HttpStatus.BAD_GATEWAY);
    }

    const first = data.results[0];
    return {
      address: first.formatted_address,
      lat: first.geometry.location.lat,
      lng: first.geometry.location.lng
    };
  }

  async distanceMatrix(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    const key = await this.getServerKey();
    if (!key) {
      throw new HttpException('Google Maps server key not configured', HttpStatus.PRECONDITION_REQUIRED);
    }

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${origin.lat},${origin.lng}`);
    url.searchParams.set('destinations', `${destination.lat},${destination.lng}`);
    url.searchParams.set('key', key);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      status: string;
      rows?: Array<{ elements: Array<{ status: string; distance?: { value: number }; duration?: { value: number } }> }>;
    };

    const el = data.rows?.[0]?.elements?.[0];
    if (data.status !== 'OK' || !el || el.status !== 'OK' || !el.distance || !el.duration) {
      throw new HttpException('Failed distance calculation', HttpStatus.BAD_GATEWAY);
    }

    return {
      distanceMeters: el.distance.value,
      durationSeconds: el.duration.value
    };
  }
}
