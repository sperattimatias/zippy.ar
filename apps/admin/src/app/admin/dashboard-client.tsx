'use client';

import { useMemo, useState } from 'react';
import { Badge, Card, Table, TableCell, TableHead, TableHeader, TableRow } from '../../ui';

type RideStatus = 'Pendiente' | 'Asignado' | 'En curso' | 'Finalizado' | 'Cancelado';
type RideType = 'Directo' | 'Compartido';
type PaymentType = 'Efectivo' | 'Mercado Pago';

type RideRow = {
  id: string;
  passenger: string;
  driver: string;
  zone: string;
  status: RideStatus;
  type: RideType;
  payment: PaymentType;
  fare: string;
};

const kpis = [
  { label: 'Viajes hoy', value: '182', delta: '+12% vs ayer', variant: 'success' as const },
  { label: 'Conductores activos', value: '64', delta: '8 nuevos en turno', variant: 'neutral' as const },
  { label: 'Ticket promedio', value: '$5.920', delta: '+4.2%', variant: 'warning' as const },
  { label: 'Incidencias', value: '3', delta: '1 crítica', variant: 'danger' as const }
];

const rides: RideRow[] = [
  { id: 'VJ-2031', passenger: 'Lucía Fernández', driver: 'S. Díaz', zone: 'Palermo', status: 'En curso', type: 'Directo', payment: 'Mercado Pago', fare: '$6.100' },
  { id: 'VJ-2030', passenger: 'Martín Sosa', driver: 'M. López', zone: 'Belgrano', status: 'Asignado', type: 'Compartido', payment: 'Efectivo', fare: '$5.400' },
  { id: 'VJ-2029', passenger: 'Paula Díaz', driver: 'J. Pérez', zone: 'Caballito', status: 'Finalizado', type: 'Directo', payment: 'Mercado Pago', fare: '$5.950' },
  { id: 'VJ-2028', passenger: 'Diego Rojas', driver: 'A. Acuña', zone: 'Recoleta', status: 'Pendiente', type: 'Compartido', payment: 'Efectivo', fare: '$5.200' },
  { id: 'VJ-2027', passenger: 'Nadia Gómez', driver: 'C. Peña', zone: 'Almagro', status: 'Cancelado', type: 'Directo', payment: 'Mercado Pago', fare: '$0' }
];

const statusVariant: Record<RideStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Pendiente: 'neutral',
  Asignado: 'warning',
  'En curso': 'warning',
  Finalizado: 'success',
  Cancelado: 'danger'
};

export function DashboardClient() {
  const [statusFilter, setStatusFilter] = useState<'Todos' | RideStatus>('Todos');
  const [typeFilter, setTypeFilter] = useState<'Todos' | RideType>('Todos');
  const [paymentFilter, setPaymentFilter] = useState<'Todos' | PaymentType>('Todos');

  const filteredRides = useMemo(
    () =>
      rides.filter((ride) => {
        if (statusFilter !== 'Todos' && ride.status !== statusFilter) {
          return false;
        }
        if (typeFilter !== 'Todos' && ride.type !== typeFilter) {
          return false;
        }
        if (paymentFilter !== 'Todos' && ride.payment !== paymentFilter) {
          return false;
        }
        return true;
      }),
    [paymentFilter, statusFilter, typeFilter]
  );

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text md:text-3xl">Dashboard</h1>
        <p className="text-sm text-zippy-muted">Monitoreo operativo en tiempo real (datos de ejemplo).</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="space-y-2 rounded-2xl p-4">
            <p className="text-sm text-zippy-muted">{kpi.label}</p>
            <p className="text-2xl font-semibold tracking-tight text-zippy-text">{kpi.value}</p>
            <Badge variant={kpi.variant}>{kpi.delta}</Badge>
          </Card>
        ))}
      </div>

      <Card className="space-y-4 rounded-2xl p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Estado
            <select
              className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'Todos' | RideStatus)}
            >
              <option>Todos</option>
              <option>Pendiente</option>
              <option>Asignado</option>
              <option>En curso</option>
              <option>Finalizado</option>
              <option>Cancelado</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Tipo
            <select
              className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as 'Todos' | RideType)}
            >
              <option>Todos</option>
              <option>Directo</option>
              <option>Compartido</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Pago
            <select
              className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value as 'Todos' | PaymentType)}
            >
              <option>Todos</option>
              <option>Mercado Pago</option>
              <option>Efectivo</option>
            </select>
          </label>
        </div>
      </Card>

      <Table>
        <TableHead>
          <TableRow className="border-b-0">
            <TableHeader>ID</TableHeader>
            <TableHeader>Pasajero</TableHeader>
            <TableHeader>Conductor</TableHeader>
            <TableHeader>Zona</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Tipo</TableHeader>
            <TableHeader>Pago</TableHeader>
            <TableHeader className="text-right">Tarifa</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {filteredRides.map((ride) => (
            <TableRow key={ride.id}>
              <TableCell className="font-medium">{ride.id}</TableCell>
              <TableCell>{ride.passenger}</TableCell>
              <TableCell>{ride.driver}</TableCell>
              <TableCell>{ride.zone}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[ride.status]}>{ride.status}</Badge>
              </TableCell>
              <TableCell>{ride.type}</TableCell>
              <TableCell>{ride.payment}</TableCell>
              <TableCell className="text-right">{ride.fare}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
