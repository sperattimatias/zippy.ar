import { ConfirmedClient } from './confirmed-client';

type ConfirmedPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const toText = (value: string | string[] | undefined, fallback = '-'): string => {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
};

const formatArs = (value: string): string => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
};

export default async function RideConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const params = await searchParams;

  return (
    <ConfirmedClient
      data={{
        driverName: toText(params.driverName, 'Conductor verificado'),
        rating: toText(params.driverRating, '4.8'),
        level: toText(params.level, 'Gold'),
        vehicleType: toText(params.vehicleType, 'Auto'),
        eta: toText(params.etaMinutes, '5'),
        price: formatArs(toText(params.price, '5600')),
        origin: toText(params.origin, 'Tu ubicación'),
        destination: toText(params.destination, 'Destino'),
        tripType: toText(params.tripType, 'Directo')
      }}
    />
  );
}
