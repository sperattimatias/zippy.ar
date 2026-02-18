import { Button, Card, Chip, Input, tokens } from '../ui';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-3xl items-center px-6 pb-4 pt-6 md:px-8 md:pt-8">
        <span className="text-xl font-semibold tracking-tight text-zippy-text">Zippy</span>
      </header>

      <section className="mx-auto w-full max-w-3xl px-6 pb-10 md:px-8 md:pb-16">
        <Card className="space-y-6 p-6 md:p-8">
          <div className="space-y-2">
            <Chip variant="neutral">Viajes urbanos</Chip>
            <h1 className={tokens.typography.title}>Movete por la ciudad, simple y rápido.</h1>
            <p className={tokens.typography.subtitle}>
              Elegí origen y destino para pedir tu viaje en pocos toques.
            </p>
          </div>

          <form className="space-y-4" aria-label="Formulario para pedir viaje">
            <Input label="¿De dónde salís?" placeholder="Ej: Palermo, CABA" autoComplete="off" />
            <Input label="¿A dónde vas?" placeholder="Ej: Microcentro, CABA" autoComplete="off" />
            <Button type="button">Pedir viaje</Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
