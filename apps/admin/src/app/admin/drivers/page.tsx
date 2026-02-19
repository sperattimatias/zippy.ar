'use client';

import { useMemo, useState } from 'react';
import { Search, UserCircle } from 'lucide-react';
import { Badge, Button, Card, Drawer, Table, TableCell, TableHead, TableHeader, TableRow } from '../../../ui';

type VerificationStatus = 'Verificado' | 'Pendiente' | 'Suspendido';
type DriverLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: VerificationStatus;
  level: DriverLevel;
  vehicle: {
    type: 'Auto' | 'Moto';
    model: string;
    plate: string;
    color: string;
  };
  metrics: {
    rating: number;
    punctuality: string;
    cancellations: string;
  };
};

const driversMock: Driver[] = [
  {
    id: 'DRV-102',
    name: 'Santiago Díaz',
    email: 'santiago.diaz@zippy.ar',
    phone: '+54 11 5555 0102',
    status: 'Verificado',
    level: 'Platinum',
    vehicle: { type: 'Auto', model: 'Toyota Corolla 2022', plate: 'AC 483 ZP', color: 'Negro' },
    metrics: { rating: 4.9, punctuality: '97%', cancellations: '1.2%' }
  },
  {
    id: 'DRV-087',
    name: 'Martina López',
    email: 'martina.lopez@zippy.ar',
    phone: '+54 11 5555 0087',
    status: 'Pendiente',
    level: 'Gold',
    vehicle: { type: 'Moto', model: 'Honda Wave 110', plate: 'A302KTY', color: 'Rojo' },
    metrics: { rating: 4.8, punctuality: '94%', cancellations: '2.0%' }
  },
  {
    id: 'DRV-041',
    name: 'Juan Pérez',
    email: 'juan.perez@zippy.ar',
    phone: '+54 11 5555 0041',
    status: 'Suspendido',
    level: 'Silver',
    vehicle: { type: 'Auto', model: 'Chevrolet Prisma 2019', plate: 'AB 902 LM', color: 'Gris' },
    metrics: { rating: 4.3, punctuality: '88%', cancellations: '5.3%' }
  }
];

const statusVariant: Record<VerificationStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Verificado: 'success',
  Pendiente: 'warning',
  Suspendido: 'danger'
};

const levelVariant: Record<DriverLevel, 'neutral' | 'success' | 'warning' | 'danger'> = {
  Bronze: 'neutral',
  Silver: 'success',
  Gold: 'warning',
  Platinum: 'danger'
};

export default function AdminDriversPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | VerificationStatus>('Todos');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus | null>(null);

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return driversMock.filter((driver) => {
      if (statusFilter !== 'Todos' && driver.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [driver.id, driver.name, driver.email, driver.phone, driver.vehicle.plate]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [search, statusFilter]);

  const openDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setCurrentStatus(driver.status);
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text md:text-3xl">Conductores</h1>
        <p className="text-sm text-zippy-muted">Gestión de verificación y desempeño profesional.</p>
      </div>

      <Card className="space-y-4 rounded-2xl p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Buscar
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zippy-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ID, nombre, email, teléfono o patente"
                className="h-10 w-full rounded-xl border border-zippy-border bg-zippy-surface pl-10 pr-3 text-sm text-zippy-text outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-zippy-text">
            Estado de verificación
            <select
              className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'Todos' | VerificationStatus)}
            >
              <option>Todos</option>
              <option>Verificado</option>
              <option>Pendiente</option>
              <option>Suspendido</option>
            </select>
          </label>
        </div>
      </Card>

      <Table>
        <TableHead>
          <TableRow className="border-b-0">
            <TableHeader>ID</TableHeader>
            <TableHeader>Conductor</TableHeader>
            <TableHeader>Vehículo</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Nivel</TableHeader>
            <TableHeader className="text-right">Rating</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {filteredDrivers.map((driver) => (
            <TableRow
              key={driver.id}
              className="cursor-pointer hover:bg-zippy-surfaceElevated/60"
              onClick={() => openDriver(driver)}
            >
              <TableCell className="font-medium">{driver.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-zippy-text">{driver.name}</p>
                  <p className="text-xs text-zippy-muted">{driver.email}</p>
                </div>
              </TableCell>
              <TableCell>{driver.vehicle.type} · {driver.vehicle.plate}</TableCell>
              <TableCell><Badge variant={statusVariant[driver.status]}>{driver.status}</Badge></TableCell>
              <TableCell><Badge variant={levelVariant[driver.level]}>{driver.level}</Badge></TableCell>
              <TableCell className="text-right">{driver.metrics.rating.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Drawer
        open={Boolean(selectedDriver)}
        onClose={() => setSelectedDriver(null)}
        title={selectedDriver ? `Perfil ${selectedDriver.id}` : 'Perfil de conductor'}
        description={selectedDriver?.name}
      >
        {selectedDriver ? (
          <div className="space-y-4">
            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Driver profile</p>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-zippy-surfaceElevated text-zippy-text">
                  <UserCircle className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-zippy-text">{selectedDriver.name}</p>
                  <p className="text-xs text-zippy-muted">{selectedDriver.email}</p>
                  <p className="text-xs text-zippy-muted">{selectedDriver.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={statusVariant[currentStatus ?? selectedDriver.status]}>{currentStatus ?? selectedDriver.status}</Badge>
                <Badge variant={levelVariant[selectedDriver.level]}>{selectedDriver.level}</Badge>
              </div>
            </Card>

            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Vehicle info</p>
              <p className="text-sm text-zippy-text"><strong>Tipo:</strong> {selectedDriver.vehicle.type}</p>
              <p className="text-sm text-zippy-text"><strong>Modelo:</strong> {selectedDriver.vehicle.model}</p>
              <p className="text-sm text-zippy-text"><strong>Patente:</strong> {selectedDriver.vehicle.plate}</p>
              <p className="text-sm text-zippy-text"><strong>Color:</strong> {selectedDriver.vehicle.color}</p>
            </Card>

            <Card className="space-y-2 rounded-xl p-4">
              <p className="text-sm text-zippy-muted">Metrics (mock)</p>
              <p className="text-sm text-zippy-text"><strong>Rating:</strong> {selectedDriver.metrics.rating.toFixed(1)}</p>
              <p className="text-sm text-zippy-text"><strong>Puntualidad:</strong> {selectedDriver.metrics.punctuality}</p>
              <p className="text-sm text-zippy-text"><strong>Cancelaciones:</strong> {selectedDriver.metrics.cancellations}</p>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => setCurrentStatus('Verificado')}>Verificar</Button>
              <Button variant="ghost" className="border border-rose-500/30 text-rose-600 hover:bg-rose-500/10" onClick={() => setCurrentStatus('Suspendido')}>
                Suspender
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </section>
  );
}
