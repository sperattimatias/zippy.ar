'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CalendarClock, MapPin, Navigation, UserCircle } from 'lucide-react';
import { apiClient, getStoredAuth } from '../lib/api-client';
import { Button, Card, Chip, Input, Toggle } from '../ui';

type Vehicle = 'AUTO' | 'MOTO';
type RideKind = 'DIRECT' | 'SHARED';

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    originAddress: 'Tu ubicación',
    originPlaceId: 'gps',
    originLat: -34.6037,
    originLng: -58.3816,
    destinationAddress: '',
    destinationPlaceId: '',
    destinationLat: 0,
    destinationLng: 0,
    vehicleType: 'AUTO' as Vehicle,
    rideType: 'DIRECT' as RideKind,
    luggage: false,
    pet: false,
    accessibility: false,
    note: ''
  });
  const [estimate, setEstimate] = useState<{ estimatedMin: number; estimatedMax: number } | null>(null);
  const [error, setError] = useState('');
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setForm((prev) => ({ ...prev, originLat: pos.coords.latitude, originLng: pos.coords.longitude }));
    });
  }, []);

  const estimateRide = async () => {
    if (!form.destinationAddress.trim()) {
      setError('Ingresá un destino para estimar.');
      return;
    }

    setLoadingEstimate(true);
    setError('');
    try {
      const data = await apiClient.post<{ estimatedMin: number; estimatedMax: number }>('/rides/estimate', form);
      setEstimate(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!getStoredAuth()) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent('/')}`);
      return;
    }

    setLoadingRequest(true);
    setError('');
    try {
      const ride = await apiClient.post<{ id: string }>('/rides', form);
      router.push(`/rides/${ride.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <main className="min-h-screen bg-zippy-bg">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pb-5 pt-6 sm:px-6">
        <span className="text-xl font-semibold tracking-tight text-zippy-text">Zippy</span>
        <div className="flex items-center gap-2">
          <Link href="/rides" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm font-medium text-zippy-text">
            <CalendarClock className="size-4" /> Historial
          </Link>
          <Link href="/account" className="inline-flex size-10 items-center justify-center rounded-xl border border-zippy-border bg-zippy-surface text-zippy-muted">
            <UserCircle className="size-5" />
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 sm:pb-14">
        <Card className="space-y-6 rounded-3xl p-5 sm:p-7">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zippy-muted">Passenger Home</p>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zippy-text sm:text-3xl">¿A dónde te llevamos hoy?</h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input label="Origen" placeholder="Tu ubicación" leftIcon={<MapPin className="size-4" />} value={form.originAddress} onChange={(e) => setForm((p) => ({ ...p, originAddress: e.target.value, originPlaceId: e.target.value }))} />
            <Input label="Destino" placeholder="¿A dónde vas?" leftIcon={<Navigation className="size-4" />} value={form.destinationAddress} onChange={(e) => setForm((p) => ({ ...p, destinationAddress: e.target.value, destinationPlaceId: e.target.value, destinationLat: -34.6, destinationLng: -58.4 }))} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-zippy-text">Vehículo</p>
                <div className="flex gap-2">{(['AUTO', 'MOTO'] as const).map((mode) => <Chip key={mode} selected={form.vehicleType === mode} onClick={() => setForm((p) => ({ ...p, vehicleType: mode }))}>{mode === 'AUTO' ? 'Auto' : 'Moto'}</Chip>)}</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-zippy-text">Tipo de viaje</p>
                <div className="flex gap-2">{(['DIRECT', 'SHARED'] as const).map((type) => <Chip key={type} selected={form.rideType === type} onClick={() => setForm((p) => ({ ...p, rideType: type }))}>{type === 'DIRECT' ? 'Directo' : 'Compartido'}</Chip>)}</div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-zippy-border bg-zippy-surfaceElevated/50 p-4">
              <p className="text-sm font-medium text-zippy-text">Condiciones especiales</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center justify-between rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2"><span className="text-sm">Equipaje</span><Toggle checked={form.luggage} onClick={() => setForm((p) => ({ ...p, luggage: !p.luggage }))} /></label>
                <label className="flex items-center justify-between rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2"><span className="text-sm">Mascota</span><Toggle checked={form.pet} onClick={() => setForm((p) => ({ ...p, pet: !p.pet }))} /></label>
                <label className="flex items-center justify-between rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2"><span className="text-sm">Accesibilidad</span><Toggle checked={form.accessibility} onClick={() => setForm((p) => ({ ...p, accessibility: !p.accessibility }))} /></label>
              </div>
            </div>

            <label className="flex flex-col gap-2"><span className="text-sm font-medium text-zippy-text">Nota para el conductor (opcional)</span><textarea rows={3} maxLength={200} value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} className="w-full resize-none rounded-xl border border-zippy-border bg-zippy-surface px-3 py-2.5 text-sm text-zippy-text" /></label>

            <Card className="space-y-1 rounded-2xl border-zippy-border bg-zippy-surfaceElevated p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zippy-muted">Estimado del viaje</p>
              {estimate ? <p className="text-2xl font-semibold tracking-tight text-zippy-text">ARS ${estimate.estimatedMin.toLocaleString('es-AR')} - ${estimate.estimatedMax.toLocaleString('es-AR')}</p> : <p className="text-sm text-zippy-muted">Calculá una estimación para ver el rango.</p>}
            </Card>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div className="space-y-3">
              <Button type="button" variant="secondary" onClick={estimateRide} loading={loadingEstimate} className="w-full">Calcular estimación</Button>
              <Button type="submit" leadingIcon={<ArrowRight className="size-4" />} loading={loadingRequest} className="w-full">Solicitar viaje</Button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
