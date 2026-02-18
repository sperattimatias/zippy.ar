import { Card } from '../../ui';

const viajes = [
  { id: 'VJ-1042', pasajero: 'Lucía Fernández', origen: 'Palermo', destino: 'Microcentro', estado: 'En curso' },
  { id: 'VJ-1041', pasajero: 'Martín Sosa', origen: 'Belgrano', destino: 'Recoleta', estado: 'Asignado' },
  { id: 'VJ-1039', pasajero: 'Paula Díaz', origen: 'Caballito', destino: 'Almagro', estado: 'Finalizado' },
  { id: 'VJ-1036', pasajero: 'Diego Rojas', origen: 'Villa Crespo', destino: 'San Telmo', estado: 'Cancelado' }
];

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
          <select className="h-10 rounded-lg border border-zippy-border bg-white px-3 text-sm text-zippy-text outline-none focus:border-zippy-primary focus:ring-2 focus:ring-zippy-primary/20">
            <option>Todos</option>
            <option>Asignado</option>
            <option>En curso</option>
            <option>Finalizado</option>
            <option>Cancelado</option>
          </select>
        </label>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zippy-border bg-slate-50 text-zippy-muted">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Pasajero</th>
              <th className="px-4 py-3 font-medium">Origen</th>
              <th className="px-4 py-3 font-medium">Destino</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((viaje) => (
              <tr key={viaje.id} className="border-b border-zippy-border last:border-b-0">
                <td className="px-4 py-3 font-medium text-zippy-text">{viaje.id}</td>
                <td className="px-4 py-3 text-zippy-text">{viaje.pasajero}</td>
                <td className="px-4 py-3 text-zippy-text">{viaje.origen}</td>
                <td className="px-4 py-3 text-zippy-text">{viaje.destino}</td>
                <td className="px-4 py-3 text-zippy-muted">{viaje.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
