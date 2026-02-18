import { Badge, Table, TableCell, TableHead, TableHeader, TableRow } from '../../ui';

const viajes = [
  { id: 'VJ-1042', pasajero: 'Lucía Fernández', origen: 'Palermo', destino: 'Microcentro', estado: 'En curso' },
  { id: 'VJ-1041', pasajero: 'Martín Sosa', origen: 'Belgrano', destino: 'Recoleta', estado: 'Asignado' },
  { id: 'VJ-1039', pasajero: 'Paula Díaz', origen: 'Caballito', destino: 'Almagro', estado: 'Finalizado' },
  { id: 'VJ-1036', pasajero: 'Diego Rojas', origen: 'Villa Crespo', destino: 'San Telmo', estado: 'Cancelado' }
];

const toVariant = (estado: string): 'neutral' | 'success' | 'warning' | 'danger' => {
  if (estado === 'Finalizado') return 'success';
  if (estado === 'En curso') return 'warning';
  if (estado === 'Cancelado') return 'danger';
  return 'neutral';
};

export default function ViajesPage() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zippy-text">Viajes</h1>
          <p className="text-sm text-zippy-muted">Listado operativo (datos de ejemplo).</p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-zippy-text sm:w-56">
          Estado
          <select className="h-10 rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm text-zippy-text outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring">
            <option>Todos</option>
            <option>Asignado</option>
            <option>En curso</option>
            <option>Finalizado</option>
            <option>Cancelado</option>
          </select>
        </label>
      </div>

      <Table>
        <TableHead>
          <TableRow className="border-b-0">
            <TableHeader>ID</TableHeader>
            <TableHeader>Pasajero</TableHeader>
            <TableHeader>Origen</TableHeader>
            <TableHeader>Destino</TableHeader>
            <TableHeader>Estado</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {viajes.map((viaje) => (
            <TableRow key={viaje.id}>
              <TableCell className="font-medium">{viaje.id}</TableCell>
              <TableCell>{viaje.pasajero}</TableCell>
              <TableCell>{viaje.origen}</TableCell>
              <TableCell>{viaje.destino}</TableCell>
              <TableCell>
                <Badge variant={toVariant(viaje.estado)}>{viaje.estado}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
