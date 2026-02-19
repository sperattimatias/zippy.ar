'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '../../ui';
import { apiClient, setStoredAuth } from '../../lib/api-client';

type LoginResponse = {
  accessToken: string;
  user: {
    role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  };
};

export default function PassengerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password
      });

      setStoredAuth({
        accessToken: response.accessToken,
        role: response.user.role
      });

      router.push('/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <Card className="w-full space-y-5">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zippy-text">Ingresar a Zippy</h1>
          <p className="text-sm text-zippy-muted">Accedé con tu cuenta de pasajero.</p>
        </header>

        <form className="space-y-4" onSubmit={(event) => { void onSubmit(event); }}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="passenger@zippy.local"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <Button type="submit" className="w-full" loading={loading}>
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </main>
  );
}
