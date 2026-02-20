'use client';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, setStoredAuth } from '../../../lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const returnUrl = search.get('returnUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>('/auth/login', { email, password });
      setStoredAuth({ accessToken: data.accessToken, role: data.user.role });
      router.push(returnUrl);
    } catch (err) { setError((err as Error).message); }
  };

  return <form onSubmit={submit} className='mx-auto mt-10 max-w-md space-y-3 p-4'><h1 className='text-2xl font-semibold'>Login</h1><input className='w-full border p-2' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} /><input className='w-full border p-2' type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} /><button className='w-full rounded bg-black p-2 text-white'>Ingresar</button>{error && <p className='text-red-600'>{error}</p>}</form>;
}
