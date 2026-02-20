'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiClient, setStoredAuth } from '../../../lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>(
        '/auth/register',
        form
      );
      setStoredAuth({ accessToken: response.accessToken, role: response.user.role });
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de registro');
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Registro pasajero</h1>
      <form className="space-y-2" onSubmit={(e)=>{void onSubmit(e);}}>
        <input className="w-full rounded border p-2" placeholder="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.acceptTerms} onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })} />Aceptar términos</label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-black p-2 text-white" type="submit">Crear cuenta</button>
      </form>
    </main>
  );
}
