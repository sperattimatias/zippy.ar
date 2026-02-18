import { OffersClient } from './offers-client';

type OffersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const toString = (value: string | string[] | undefined, fallback = ''): string => {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
};

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const params = await searchParams;

  return (
    <OffersClient
      query={{
        origin: toString(params.origin, 'Tu ubicación'),
        destination: toString(params.destination, 'Destino pendiente'),
        mode: toString(params.mode, 'Auto'),
        tripType: toString(params.type, 'Directo'),
        hasLuggage: toString(params.hasLuggage) === 'true',
        hasPets: toString(params.hasPets) === 'true',
        needsAccessibility: toString(params.needsAccessibility) === 'true',
        note: toString(params.note),
        history: toString(params.history) === 'true'
      }}
    />
  );
}
