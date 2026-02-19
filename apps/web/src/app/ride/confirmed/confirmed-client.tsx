'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, MapPin, MessageSquareQuote, Navigation, Star } from 'lucide-react';
import { Badge, Button, Card, Chip } from '../../../ui';

type ConfirmedData = {
  driverName: string;
  rating: string;
  level: string;
  vehicleType: string;
  eta: string;
  price: string;
  origin: string;
  destination: string;
  tripType: string;
};

const timeline = [
  { label: 'Conductor en camino', detail: 'Llegada estimada en pocos minutos', active: true },
  { label: 'Conductor llegó al punto', detail: 'Te vamos a avisar cuando esté afuera', active: false },
  { label: 'Viaje en curso', detail: 'Seguimiento en tiempo real', active: false }
];

export function ConfirmedClient({ data }: { data: ConfirmedData }) {
  const [paymentMethod, setPaymentMethod] = useState<'Mercado Pago' | 'Efectivo'>('Mercado Pago');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zippy-muted">Viaje confirmado</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text sm:text-3xl">Tu conductor está asignado</h1>
      </div>

      <Card className="space-y-4 rounded-3xl p-5 sm:p-6">
        <div>
          <p className="text-sm text-zippy-muted">Ruta</p>
          <p className="text-lg font-semibold text-zippy-text">
            {data.origin} <span className="text-zippy-muted">→</span> {data.destination}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="success">{data.tripType}</Badge>
          <Badge variant="neutral">{data.vehicleType}</Badge>
          <Badge variant="warning">ETA {data.eta} min</Badge>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="space-y-4 rounded-3xl p-5 sm:p-6">
          <p className="text-sm font-medium text-zippy-muted">Conductor verificado</p>
          <div className="flex items-center gap-3">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-zippy-surfaceElevated text-base font-semibold text-zippy-text">
              {data.driverName
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-semibold text-zippy-text">{data.driverName}</p>
              <p className="inline-flex items-center gap-1 text-sm text-zippy-muted">
                <Star className="size-3.5" /> {data.rating} · Nivel {data.level}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zippy-border bg-zippy-surfaceElevated/60 p-3">
            <p className="text-xs uppercase tracking-wide text-zippy-muted">Vehículo</p>
            <p className="mt-1 text-sm font-medium text-zippy-text">{data.vehicleType} · Patente AC 483 ZP</p>
          </div>

          <div className="rounded-xl border border-zippy-border bg-zippy-surfaceElevated p-3">
            <p className="text-xs uppercase tracking-wide text-zippy-muted">Precio acordado</p>
            <p className="mt-1 text-2xl font-semibold text-zippy-text">{data.price}</p>
          </div>
        </Card>

        <Card className="space-y-4 rounded-3xl p-5 sm:p-6">
          <p className="text-sm font-medium text-zippy-muted">Método de pago</p>
          <div className="flex flex-wrap gap-2">
            <Chip selected={paymentMethod === 'Mercado Pago'} onClick={() => setPaymentMethod('Mercado Pago')}>
              Mercado Pago
            </Chip>
            <Chip selected={paymentMethod === 'Efectivo'} onClick={() => setPaymentMethod('Efectivo')}>
              Efectivo
            </Chip>
          </div>
          <p className="text-sm text-zippy-muted">Seleccionado: {paymentMethod}</p>

          <div className="overflow-hidden rounded-2xl border border-zippy-border bg-zippy-surfaceElevated/40">
            <div className="relative h-40 bg-[radial-gradient(circle_at_18%_25%,rgba(91,140,255,0.18)_0,transparent_45%),radial-gradient(circle_at_80%_70%,rgba(34,197,94,0.14)_0,transparent_45%)]">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute left-5 top-6 inline-flex items-center gap-1 rounded-full border border-zippy-border bg-zippy-surface px-2 py-1 text-xs text-zippy-text">
                <MapPin className="size-3.5 text-emerald-300" /> Salida
              </div>
              <div className="absolute bottom-6 right-6 inline-flex items-center gap-1 rounded-full border border-zippy-border bg-zippy-surface px-2 py-1 text-xs text-zippy-text">
                <Navigation className="size-3.5 text-zippy-primary" /> Destino
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-3 rounded-3xl p-5 sm:p-6">
        <p className="text-sm font-medium text-zippy-muted">Estado del viaje</p>
        <ol className="space-y-3">
          {timeline.map((item) => (
            <li key={item.label} className="flex gap-3">
              <span
                className={`mt-1 inline-flex size-3 rounded-full ${item.active ? 'bg-zippy-primary shadow-[0_0_0_4px_rgba(37,99,235,0.12)]' : 'bg-zippy-border'}`}
              />
              <div>
                <p className={`text-sm font-medium ${item.active ? 'text-zippy-text' : 'text-zippy-muted'}`}>{item.label}</p>
                <p className="text-xs text-zippy-muted">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Button variant="secondary" leadingIcon={<MessageSquareQuote className="size-4" />}>
          Chat
        </Button>
        <Button variant="secondary" leadingIcon={<Navigation className="size-4" />}>
          Compartir viaje
        </Button>
        <Button variant="ghost" leadingIcon={<Bell className="size-4" />} className="border border-rose-500/30 text-rose-600 hover:bg-rose-500/10">
          Emergencia
        </Button>
      </div>

      <Link href="/" className="text-center text-sm font-medium text-zippy-muted hover:text-zippy-text">
        Volver al inicio
      </Link>
    </main>
  );
}
