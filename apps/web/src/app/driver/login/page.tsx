'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiClient, setStoredAuth } from '../../../lib/api-client';

export default function DriverLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>('/auth/login', { email, password });
    setStoredAuth({ accessToken: response.accessToken, role: response.user.role });
    router.push('/driver/dashboard');
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Login conductor</h1>
      <form className="space-y-3" onSubmit={(e)=>{void onSubmit(e);}}>
        <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded bg-black p-2 text-white" type="submit">Entrar</button>
      </form>
    </main>
  );
}
