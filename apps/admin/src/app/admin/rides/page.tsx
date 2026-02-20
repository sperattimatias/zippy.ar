'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge, Card, Drawer, Table, TableCell, TableHead, TableHeader, TableRow } from '../../../ui';

type RideStatus = 'Pendiente' | 'Asignado' | 'En curso' | 'Finalizado' | 'Cancelado';
type RideType = 'Directo' | 'Compartido';
type PaymentType = 'Efectivo' | 'Mercado Pago';

type Offer = { driver: string; level: string; amount: string; eta: string };
type EventItem = { at: string; label: string; detail: string };

type Ride = {
  id: string;
  passenger: string;
  origin: string;
  destination: string;
  status: RideStatus;
  type: RideType;
  payment: PaymentType;
  fare: string;
  offers: Offer[];
  events: EventItem[];
};

const rides: Ride[] = [
  {
    id: 'VJ-3092',
    passenger: 'Lucía Fernández',
    origin: 'Palermo',
    destination: 'Microcentro',
    status: 'En curso',
    type: 'Directo',
    payment: 'Mercado Pago',
    fare: '$6.100',
    offers: [
      { driver: 'S. Díaz', level: 'Platinum', amount: '$6.100', eta: '4 min' },
      { driver: 'M. López', level: 'Gold', amount: '$6.350', eta: '5 min' }
    ],
    events: [
      { at: '17:02', label: 'ride.created', detail: 'Solicitud generada por pasajero' },
      { at: '17:04', label: 'offer.accepted', detail: 'Oferta aceptada: S. Díaz' },
      { at: '17:08', label: 'ride.statusChanged', detail: 'Estado: EN_CURSO' }
    ]
  },
  {
    id: 'VJ-3091',
    passenger: 'Martín Sosa',
    origin: 'Belgrano',
    destination: 'Recoleta',
    status: 'Asignado',
    type: 'Compartido',
    payment: 'Efectivo',
    fare: '$5.400',
    offers: [{ driver: 'J. Pérez', level: 'Silver', amount: '$5.400', eta: '7 min' }],
    events: [
      { at: '16:48', label: 'ride.created', detail: 'Solicitud creada' },
      { at: '16:50', label: 'offer.accepted', detail: 'Oferta aceptada: J. Pérez' }
    ]
  },
  {
    id: 'VJ-3089',
    passenger: 'Nadia Gómez',
    origin: 'Almagro',
    destination: 'Caballito',
    status: 'Cancelado',
    type: 'Directo',
    payment: 'Mercado Pago',
    fare: '$0',
    offers: [{ driver: 'A. Acuña', level: 'Gold', amount: '$5.900', eta: '6 min' }],
    events: [
      { at: '16:21', label: 'ride.created', detail: 'Solicitud creada' },
      { at: '16:24', label: 'ride.statusChanged', detail: 'Cancelado por pasajero' }
    ]
  }
];

const statusVariant: Record<RideStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Pendiente: 'neutral',
  Asignado: 'warning',
  'En curso': 'warning',
  Finalizado: 'success',
  Cancelado: 'danger'
};

export default function AdminRidesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | RideStatus>('Todos');
  const [typeFilter, setTypeFilter] = useState<'Todos' | RideType>('Todos');
  const [paymentFilter, setPaymentFilter] = useState<'Todos' | PaymentType>('Todos');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rides.filter((ride) => {
      if (statusFilter !== 'Todos' && ride.status !== statusFilter) return false;
      if (typeFilter !== 'Todos' && ride.type !== typeFilter) return false;
      if (paymentFilter !== 'Todos' && ride.payment !== paymentFilter) return false;
      if (!q) return true;
      return [ride.id, ride.passenger, ride.origin, ride.destination].join(' ').toLowerCase().includes(q);
    });
  }, [paymentFilter, search, statusFilter, typeFilter]);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text md:text-3xl">Rides</h1>
        <p className="text-sm text-zippy-muted">Listado operativo con detalle de negociación y auditoría.</p>
      </div>

      <Card className="space-y-4 rounded-2xl p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Buscar
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zippy-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ID, pasajero, origen o destino"
                className="h-10 w-full rounded-xl border border-zippy-border bg-zippy-surface pl-10 pr-3 text-sm text-zippy-text outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Estado
            <select className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'Todos' | RideStatus)}>
              <option>Todos</option>
              <option>Pendiente</option><option>Asignado</option><option>En curso</option><option>Finalizado</option><option>Cancelado</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Tipo
            <select className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'Todos' | RideType)}>
              <option>Todos</option><option>Directo</option><option>Compartido</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Pago
            <select className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as 'Todos' | PaymentType)}>
              <option>Todos</option><option>Mercado Pago</option><option>Efectivo</option>
            </select>
          </label>
        </div>
      </Card>

      <Table>
        <TableHead>
          <TableRow className="border-b-0">
            <TableHeader>ID</TableHeader><TableHeader>Pasajero</TableHeader><TableHeader>Origen</TableHeader><TableHeader>Destino</TableHeader><TableHeader>Estado</TableHeader><TableHeader>Tipo</TableHeader><TableHeader>Pago</TableHeader><TableHeader className="text-right">Tarifa</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {filtered.map((ride) => (
            <TableRow key={ride.id} className="cursor-pointer hover:bg-zippy-surfaceElevated/60" onClick={() => setSelectedRide(ride)}>
              <TableCell className="font-medium">{ride.id}</TableCell>
              <TableCell>{ride.passenger}</TableCell>
              <TableCell>{ride.origin}</TableCell>
              <TableCell>{ride.destination}</TableCell>
              <TableCell><Badge variant={statusVariant[ride.status]}>{ride.status}</Badge></TableCell>
              <TableCell>{ride.type}</TableCell>
              <TableCell>{ride.payment}</TableCell>
              <TableCell className="text-right">{ride.fare}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Drawer
        open={Boolean(selectedRide)}
        onClose={() => setSelectedRide(null)}
        title={selectedRide ? `Detalle ${selectedRide.id}` : 'Detalle de ride'}
        description={selectedRide ? `${selectedRide.origin} → ${selectedRide.destination}` : undefined}
      >
        {selectedRide ? (
          <div className="space-y-4">
            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Ride summary</p>
              <p className="text-sm text-zippy-text"><strong>Pasajero:</strong> {selectedRide.passenger}</p>
              <p className="text-sm text-zippy-text"><strong>Estado:</strong> {selectedRide.status}</p>
              <p className="text-sm text-zippy-text"><strong>Tipo:</strong> {selectedRide.type}</p>
              <p className="text-sm text-zippy-text"><strong>Pago:</strong> {selectedRide.payment}</p>
            </Card>

            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Offers</p>
              {selectedRide.offers.map((offer) => (
                <div key={`${selectedRide.id}-${offer.driver}`} className="rounded-lg border border-zippy-border bg-zippy-surfaceElevated/50 p-3 text-sm text-zippy-text">
                  <p><strong>{offer.driver}</strong> · {offer.level}</p>
                  <p>{offer.amount} · ETA {offer.eta}</p>
                </div>
              ))}
            </Card>

            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Events / Audit timeline</p>
              <ol className="space-y-2">
                {selectedRide.events.map((event) => (
                  <li key={`${selectedRide.id}-${event.at}-${event.label}`} className="rounded-lg border border-zippy-border bg-zippy-surfaceElevated/60 p-3">
                    <p className="text-xs text-zippy-muted">{event.at} · {event.label}</p>
                    <p className="text-sm text-zippy-text">{event.detail}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Payment</p>
              <p className="text-sm text-zippy-text"><strong>Método:</strong> {selectedRide.payment}</p>
              <p className="text-sm text-zippy-text"><strong>Total:</strong> {selectedRide.fare}</p>
              <p className="text-xs text-zippy-muted">Sección mock para conciliación y comprobantes.</p>
            </Card>
          </div>
        ) : null}
      </Drawer>
    </section>
  );
}
