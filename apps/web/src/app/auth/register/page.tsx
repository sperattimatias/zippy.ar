'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setStoredAuth } from '../../../lib/api-client';
import { Button, Card, Input } from '../../../ui';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', acceptTerms: false });
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>('/auth/register', form);
      setStoredAuth({ accessToken: data.accessToken, role: data.user.role });
      router.push('/account');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return <main className='min-h-screen bg-zippy-bg p-4'><Card className='mx-auto mt-10 max-w-md space-y-4'><h1 className='text-2xl font-semibold text-zippy-text'>Registro pasajero</h1><form onSubmit={submit} className='space-y-3'><Input label='Nombre' value={form.firstName} onChange={(e)=>setForm({...form,firstName:e.target.value})}/><Input label='Apellido' value={form.lastName} onChange={(e)=>setForm({...form,lastName:e.target.value})}/><Input label='Email' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/><Input label='Password' type='password' value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/><label className='text-sm text-zippy-text flex gap-2'><input type='checkbox' checked={form.acceptTerms} onChange={(e)=>setForm({...form,acceptTerms:e.target.checked})}/> Acepto términos</label><Button className='w-full'>Crear cuenta</Button>{error && <p className='text-sm text-rose-600'>{error}</p>}</form><p className='text-sm text-zippy-muted'>¿Ya tenés cuenta? <Link href='/auth/login' className='underline text-zippy-text'>Ingresá</Link></p></Card></main>;
}
