'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, setStoredAuth } from '../../../lib/api-client';
import { Button, Card, Input } from '../../../ui';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const returnUrl = search.get('returnUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>('/auth/login', { email, password });
      setStoredAuth({ accessToken: data.accessToken, role: data.user.role });
      router.push(returnUrl);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return <main className='min-h-screen bg-zippy-bg p-4'><Card className='mx-auto mt-16 max-w-md space-y-4'><h1 className='text-2xl font-semibold text-zippy-text'>Iniciar sesión</h1><form onSubmit={submit} className='space-y-3'><Input label='Email' value={email} onChange={(e)=>setEmail(e.target.value)} /><Input label='Password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} /><Button className='w-full'>Ingresar</Button>{error && <p className='text-sm text-rose-600'>{error}</p>}</form><p className='text-sm text-zippy-muted'>¿No tenés cuenta? <Link href='/auth/register' className='text-zippy-text underline'>Registrate</Link></p></Card></main>;
}
