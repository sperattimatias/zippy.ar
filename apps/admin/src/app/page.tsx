import { Badge, Card, tokens } from '../ui';

const metrics = [
  { label: 'Viajes activos', value: '24', delta: '+6% hoy', status: 'success' as const },
  { label: 'Conductores online', value: '18', delta: '+2 en 1h', status: 'neutral' as const },
  { label: 'Tiempo promedio', value: '7 min', delta: '-1 min', status: 'warning' as const },
  { label: 'Cancelaciones', value: '3', delta: 'Sin cambios', status: 'danger' as const }
];

export default function DashboardPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className={tokens.typography.title}>Dashboard</h1>
        <p className={tokens.typography.subtitle}>Resumen operativo en tiempo real (datos de ejemplo).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="space-y-3">
            <p className="text-sm text-zippy-muted">{metric.label}</p>
            <p className="text-3xl font-semibold tracking-tight text-zippy-text">{metric.value}</p>
            <Badge variant={metric.status}>{metric.delta}</Badge>
          </Card>
        ))}
      </div>
    </section>
  );
}
