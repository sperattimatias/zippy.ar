'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setStoredAuth } from '../../../lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', acceptTerms: false });
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiClient.post<{ accessToken: string; user: { role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } }>('/auth/register', form);
      setStoredAuth({ accessToken: data.accessToken, role: data.user.role });
      router.push('/account');
    } catch (err) { setError((err as Error).message); }
  };

  return <form onSubmit={submit} className='mx-auto mt-10 max-w-md space-y-3 p-4'><h1 className='text-2xl font-semibold'>Registro pasajero</h1>{['firstName','lastName','email','password'].map((k)=><input key={k} className='w-full border p-2' type={k==='password'?'password':'text'} placeholder={k} value={(form as any)[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} />)}<label className='flex gap-2'><input type='checkbox' checked={form.acceptTerms} onChange={(e)=>setForm({...form,acceptTerms:e.target.checked})}/>Acepto términos</label><button className='w-full rounded bg-black p-2 text-white'>Crear cuenta</button>{error && <p className='text-red-600'>{error}</p>}</form>;
}
