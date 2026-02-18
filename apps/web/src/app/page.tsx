import Link from 'next/link';
import { ArrowRight, MapPin, Navigation } from 'lucide-react';
import { Button, Card, Input, tokens } from '../ui';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zippy-bg via-zippy-bg to-zippy-surface">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 md:px-8">
        <span className="text-xl font-semibold tracking-tight text-zippy-text">Zippy</span>
        <Link href="/ui" className="text-sm text-zippy-muted transition hover:text-zippy-text">
          Ver UI kit
        </Link>
      </header>

      <section className="mx-auto w-full max-w-3xl px-6 pb-10 md:px-8 md:pb-16">
        <Card className="space-y-6 p-6 md:p-8">
          <div className="space-y-2">
            <h1 className={tokens.typography.title}>Movete por la ciudad, simple y rápido.</h1>
            <p className={tokens.typography.subtitle}>
              Elegí origen y destino para pedir tu viaje en pocos toques.
            </p>
          </div>

          <form className="space-y-4" aria-label="Formulario para pedir viaje">
            <Input
              label="¿De dónde salís?"
              placeholder="Ej: Palermo, CABA"
              autoComplete="off"
              leftIcon={<MapPin className="size-4" />}
            />
            <Input
              label="¿A dónde vas?"
              placeholder="Ej: Microcentro, CABA"
              autoComplete="off"
              leftIcon={<Navigation className="size-4" />}
            />
            <Button type="button" leadingIcon={<ArrowRight className="size-4" />}>
              Pedir viaje
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
