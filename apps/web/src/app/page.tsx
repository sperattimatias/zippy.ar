'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, MapPin, Navigation, UserCircle } from 'lucide-react';
import { Button, Card, Chip, Input, Toggle } from '../ui';

type RideMode = 'Auto' | 'Moto';
type RideType = 'Compartido' | 'Directo';

export default function HomePage() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [rideMode, setRideMode] = useState<RideMode>('Auto');
  const [rideType, setRideType] = useState<RideType>('Directo');
  const [hasLuggage, setHasLuggage] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [note, setNote] = useState('');
  const [destinationError, setDestinationError] = useState('');

  const estimatedRange = useMemo(() => {
    const base = rideMode === 'Moto' ? 3200 : 4500;
    const typeDelta = rideType === 'Directo' ? 900 : 0;
    const extras = Number(hasLuggage) * 250 + Number(hasPets) * 300 + Number(needsAccessibility) * 350;
    const min = base + typeDelta + extras;
    const max = min + 1500;
    return { min, max };
  }, [hasLuggage, hasPets, needsAccessibility, rideMode, rideType]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!destination.trim()) {
      setDestinationError('Ingresá un destino para continuar.');
      return;
    }

    setDestinationError('');

    const query = new URLSearchParams({
      origin: origin.trim() || 'Tu ubicación',
      destination: destination.trim(),
      mode: rideMode,
      type: rideType,
      hasLuggage: String(hasLuggage),
      hasPets: String(hasPets),
      needsAccessibility: String(needsAccessibility),
      note: note.trim()
    });

    router.push(`/offers?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(126,161,255,0.18)_0%,rgba(6,11,22,0.95)_45%,rgba(6,11,22,1)_100%)]">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pb-5 pt-6 sm:px-6">
        <span className="text-xl font-semibold tracking-tight text-zippy-text">Zippy</span>

        <div className="flex items-center gap-2">
          <Link
            href="/offers?history=true"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm font-medium text-zippy-text transition hover:bg-zippy-surfaceElevated"
          >
            <CalendarClock className="size-4" />
            Historial
          </Link>
          <button
            type="button"
            aria-label="Perfil"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-zippy-border bg-zippy-surface text-zippy-muted transition hover:text-zippy-text"
          >
            <UserCircle className="size-5" />
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 sm:pb-14">
        <Card className="space-y-6 rounded-3xl p-5 sm:p-7">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zippy-muted">Passenger Home</p>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zippy-text sm:text-3xl">
              ¿A dónde te llevamos hoy?
            </h1>
            <p className="text-sm text-zippy-muted">Configurá tu viaje y recibí ofertas en segundos.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <Input
                label="Origen"
                placeholder="Tu ubicación"
                leftIcon={<MapPin className="size-4" />}
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              />
              <div className="space-y-2">
                <Input
                  label="Destino"
                  placeholder="¿A dónde vas?"
                  leftIcon={<Navigation className="size-4" />}
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    if (destinationError) {
                      setDestinationError('');
                    }
                  }}
                  aria-invalid={Boolean(destinationError)}
                />
                {destinationError ? <p className="text-sm text-rose-300">{destinationError}</p> : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-zippy-text">Vehículo</p>
                <div className="flex flex-wrap gap-2">
                  {(['Auto', 'Moto'] as const).map((mode) => (
                    <Chip key={mode} selected={rideMode === mode} onClick={() => setRideMode(mode)}>
                      {mode}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-zippy-text">Tipo de viaje</p>
                <div className="flex flex-wrap gap-2">
                  {(['Compartido', 'Directo'] as const).map((type) => (
                    <Chip key={type} selected={rideType === type} onClick={() => setRideType(type)}>
                      {type}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-zippy-border bg-zippy-surfaceElevated/50 p-4">
              <p className="text-sm font-medium text-zippy-text">Condiciones especiales</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center justify-between rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2">
                  <span className="text-sm text-zippy-text">Equipaje</span>
                  <Toggle checked={hasLuggage} onClick={() => setHasLuggage((value) => !value)} />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2">
                  <span className="text-sm text-zippy-text">Mascota</span>
                  <Toggle checked={hasPets} onClick={() => setHasPets((value) => !value)} />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2">
                  <span className="text-sm text-zippy-text">Accesibilidad</span>
                  <Toggle checked={needsAccessibility} onClick={() => setNeedsAccessibility((value) => !value)} />
                </label>
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zippy-text">Nota para el conductor (opcional)</span>
              <textarea
                rows={3}
                placeholder="Ej: Estoy en la puerta del edificio, timbre 4B."
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full resize-none rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2.5 text-sm text-zippy-text placeholder:text-zippy-muted outline-none transition focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              />
            </label>

            <Card className="space-y-1 rounded-2xl border-zippy-primary/40 bg-zippy-primary/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zippy-muted">Estimado del viaje</p>
              <p className="text-2xl font-semibold tracking-tight text-zippy-text">
                ARS ${estimatedRange.min.toLocaleString('es-AR')} - ${estimatedRange.max.toLocaleString('es-AR')}
              </p>
              <p className="text-sm text-zippy-muted">El valor final puede variar según tráfico y oferta del conductor.</p>
            </Card>

            <div className="space-y-3">
              <Button type="submit" leadingIcon={<ArrowRight className="size-4" />} className="w-full">
                Solicitar viaje
              </Button>
              <Link href="/offers?history=true" className="block text-center text-sm font-medium text-zippy-muted hover:text-zippy-text">
                Ver historial
              </Link>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
