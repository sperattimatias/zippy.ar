'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Clock3, Gauge, MessageSquareQuote, Star, Wallet } from 'lucide-react';
import { Badge, Button, Card, Chip, Input, Modal } from '../../ui';

type ProfessionalLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
type VehicleType = 'Auto' | 'Moto';

type Offer = {
  id: string;
  driverName: string;
  rating: number;
  level: ProfessionalLevel;
  vehicleType: VehicleType;
  etaMinutes: number;
  offeredPrice: number;
  avatar: string;
};

type Query = {
  origin: string;
  destination: string;
  mode: string;
  tripType: string;
  hasLuggage: boolean;
  hasPets: boolean;
  needsAccessibility: boolean;
  note: string;
  history: boolean;
};

const levelVariant: Record<ProfessionalLevel, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Bronze: 'neutral',
  Silver: 'success',
  Gold: 'warning',
  Platinum: 'danger'
};

const offersMock: Offer[] = [
  { id: 'off_1', driverName: 'Santiago Díaz', rating: 4.9, level: 'Platinum', vehicleType: 'Auto', etaMinutes: 4, offeredPrice: 6100, avatar: 'SD' },
  { id: 'off_2', driverName: 'Martina López', rating: 4.8, level: 'Gold', vehicleType: 'Moto', etaMinutes: 3, offeredPrice: 5400, avatar: 'ML' },
  { id: 'off_3', driverName: 'Juan Pérez', rating: 4.7, level: 'Silver', vehicleType: 'Auto', etaMinutes: 6, offeredPrice: 5750, avatar: 'JP' }
];

const formatArs = (value: number): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

export function OffersClient({ query }: { query: Query }) {
  const router = useRouter();
  const [counterOfferOpen, setCounterOfferOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterError, setCounterError] = useState('');

  const activeConditions = useMemo(
    () => [query.hasLuggage ? 'Equipaje' : null, query.hasPets ? 'Mascota' : null, query.needsAccessibility ? 'Accesibilidad' : null].filter((i): i is string => Boolean(i)),
    [query.hasLuggage, query.hasPets, query.needsAccessibility]
  );

  const handleAccept = (offer: Offer) => {
    const params = new URLSearchParams({
      offerId: offer.id,
      driverName: offer.driverName,
      driverRating: String(offer.rating),
      level: offer.level,
      vehicleType: offer.vehicleType,
      etaMinutes: String(offer.etaMinutes),
      price: String(offer.offeredPrice),
      origin: query.origin,
      destination: query.destination,
      tripType: query.tripType
    });
    router.push(`/ride/confirmed?${params.toString()}`);
  };

  const openCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setCounterAmount(String(offer.offeredPrice));
    setCounterError('');
    setCounterOfferOpen(true);
  };

  const submitCounterOffer = () => {
    const parsed = Number(counterAmount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setCounterError('Ingresá un monto válido.');
      return;
    }
    setCounterError('');
    setCounterOfferOpen(false);
  };

  if (query.history) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text">Historial de viajes</h1>
        <Card className="space-y-2">
          <p className="text-sm text-zippy-muted">Todavía no hay viajes en este entorno de demo.</p>
          <Button variant="secondary" className="w-fit" onClick={() => router.push('/')}>
            Volver al inicio
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zippy-muted">Negociación de ofertas</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text sm:text-3xl">Elegí tu mejor opción</h1>
      </div>

      <Card className="space-y-4 rounded-2xl p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zippy-muted">Resumen del viaje</p>
          <p className="text-lg font-semibold text-zippy-text">{query.origin} <span className="text-zippy-muted">→</span> {query.destination}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip selected>{query.mode}</Chip>
          <Chip selected>{query.tripType}</Chip>
          {activeConditions.map((condition) => <Badge key={condition} variant="neutral">{condition}</Badge>)}
        </div>

        {query.note ? (
          <div className="rounded-xl border border-zippy-border bg-zippy-surfaceElevated/60 p-3 text-sm text-zippy-muted">
            <p className="inline-flex items-center gap-2 font-medium text-zippy-text"><MessageSquareQuote className="size-4" /> Nota</p>
            <p className="mt-1">{query.note}</p>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {offersMock.map((offer) => (
          <Card key={offer.id} className="space-y-4 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-zippy-surfaceElevated text-sm font-semibold text-zippy-text">{offer.avatar}</div>
                <div>
                  <p className="font-semibold text-zippy-text">{offer.driverName}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-zippy-muted"><Star className="size-3.5" /> {offer.rating.toFixed(1)}</p>
                </div>
              </div>
              <Badge variant={levelVariant[offer.level]}>{offer.level}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-zippy-border bg-zippy-surfaceElevated/60 p-2.5 text-zippy-muted">
                <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide"><Car className="size-3.5" /> Vehículo</p>
                <p className="mt-1 font-medium text-zippy-text">{offer.vehicleType}</p>
              </div>
              <div className="rounded-xl border border-zippy-border bg-zippy-surfaceElevated/60 p-2.5 text-zippy-muted">
                <p className="inline-flex items-center gap-1 text-xs uppercase tracking-wide"><Clock3 className="size-3.5" /> ETA</p>
                <p className="mt-1 font-medium text-zippy-text">{offer.etaMinutes} min</p>
              </div>
            </div>

            <div className="rounded-xl border border-zippy-border bg-zippy-surfaceElevated p-3">
              <p className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-zippy-muted"><Wallet className="size-3.5" /> Oferta</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zippy-text">{formatArs(offer.offeredPrice)}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleAccept(offer)}>Aceptar</Button>
              <Button variant="secondary" onClick={() => openCounterOffer(offer)}>Contraofertar</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={counterOfferOpen}
        onClose={() => setCounterOfferOpen(false)}
        title="Enviar contraoferta"
        description={selectedOffer ? `A ${selectedOffer.driverName}` : 'Definí un nuevo monto para el viaje.'}
      >
        <div className="space-y-3">
          <Input
            label="Monto propuesto"
            type="number"
            leftIcon={<Gauge className="size-4" />}
            value={counterAmount}
            onChange={(event) => {
              setCounterAmount(event.target.value);
              if (counterError) setCounterError('');
            }}
            min={1}
          />
          {counterError ? <p className="text-sm text-rose-600">{counterError}</p> : null}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" className="w-auto" onClick={() => setCounterOfferOpen(false)}>Cancelar</Button>
            <Button className="w-auto" onClick={submitCounterOffer}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
