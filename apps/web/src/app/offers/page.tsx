import Link from 'next/link';
import { Card } from '../../ui';

type OffersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const yesNo = (value: string | string[] | undefined): string => (value === 'true' ? 'Sí' : 'No');

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const params = await searchParams;

  if (params.history === 'true') {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zippy-text">Historial de viajes</h1>
        <Card className="space-y-2">
          <p className="text-sm text-zippy-muted">Todavía no hay viajes en este entorno de demo.</p>
          <Link href="/" className="text-sm font-medium text-zippy-primary hover:text-zippy-primaryHover">
            Volver al inicio
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zippy-text">Ofertas disponibles</h1>
      <Card className="space-y-2 text-sm text-zippy-text">
        <p><strong>Origen:</strong> {params.origin ?? 'Tu ubicación'}</p>
        <p><strong>Destino:</strong> {params.destination ?? '-'}</p>
        <p><strong>Vehículo:</strong> {params.mode ?? '-'}</p>
        <p><strong>Tipo:</strong> {params.type ?? '-'}</p>
        <p><strong>Equipaje:</strong> {yesNo(params.hasLuggage)}</p>
        <p><strong>Mascota:</strong> {yesNo(params.hasPets)}</p>
        <p><strong>Accesibilidad:</strong> {yesNo(params.needsAccessibility)}</p>
        <p><strong>Nota:</strong> {params.note || 'Sin nota'}</p>
      </Card>
      <Link href="/" className="text-sm font-medium text-zippy-primary hover:text-zippy-primaryHover">
        Editar solicitud
      </Link>
    </main>
  );
}
