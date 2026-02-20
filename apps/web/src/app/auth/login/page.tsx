'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { apiClient, setStoredAuth } from '../../../lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const returnUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    return new URLSearchParams(window.location.search).get('returnUrl') || '/';
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>(
        '/auth/login',
        { email, password }
      );
      setStoredAuth({ accessToken: response.accessToken, role: response.user.role });
      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de login');
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Ingresar</h1>
      <form className="space-y-3" onSubmit={(e)=>{void onSubmit(e);}}>
        <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-black p-2 text-white" type="submit">Entrar</button>
      </form>
    </main>
  );
}
