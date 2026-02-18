import Link from 'next/link';
import { Badge, Card } from '../../../ui';

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

  const driverName = toText(params.driverName, 'Conductor');
  const rating = toText(params.driverRating, '-');
  const level = toText(params.level, '-');
  const vehicleType = toText(params.vehicleType, '-');
  const eta = toText(params.etaMinutes, '-');
  const price = formatArs(toText(params.price, '0'));
  const origin = toText(params.origin, 'Tu ubicación');
  const destination = toText(params.destination, 'Destino');
  const tripType = toText(params.tripType, 'Directo');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zippy-muted">Viaje confirmado</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text sm:text-3xl">Tu conductor está asignado</h1>
      </div>

      <Card className="space-y-3 rounded-3xl p-5 sm:p-6">
        <p className="text-lg font-semibold text-zippy-text">
          {origin} <span className="text-zippy-muted">→</span> {destination}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">{tripType}</Badge>
          <Badge variant="neutral">{vehicleType}</Badge>
          <Badge variant="warning">ETA {eta} min</Badge>
        </div>
      </Card>

      <Card className="space-y-2 rounded-3xl p-5 sm:p-6">
        <p className="text-sm text-zippy-muted">Conductor</p>
        <p className="text-xl font-semibold text-zippy-text">{driverName}</p>
        <p className="text-sm text-zippy-muted">Nivel {level} · Rating {rating}</p>
        <p className="pt-2 text-2xl font-semibold text-zippy-text">{price}</p>
      </Card>

      <Link href="/" className="text-sm font-medium text-zippy-primary hover:text-zippy-primaryHover">
        Volver al inicio
      </Link>
    </main>
  );
}
