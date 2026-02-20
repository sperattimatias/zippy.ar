'use client';
import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';

export default function AccountPage() {
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => { apiClient.get('/me').then(setMe).catch((e)=>setError((e as Error).message)); }, []);

  const update = async (e: FormEvent) => {
    e.preventDefault();
    try { await apiClient.patch('/me', { firstName: me.firstName, lastName: me.lastName, avatarUrl: me.avatarUrl }); alert('Perfil actualizado'); }
    catch (err) { setError((err as Error).message); }
  };

  if (!me) return <main className='p-4'>{error || 'Cargando...'}</main>;
  return <main className='mx-auto max-w-xl p-4'><h1 className='text-2xl font-semibold'>Mi cuenta</h1><form onSubmit={update} className='space-y-2 mt-3'><input className='w-full border p-2' value={me.firstName} onChange={(e)=>setMe({...me,firstName:e.target.value})}/><input className='w-full border p-2' value={me.lastName} onChange={(e)=>setMe({...me,lastName:e.target.value})}/><input className='w-full border p-2' placeholder='avatar URL /uploads/...' value={me.avatarUrl||''} onChange={(e)=>setMe({...me,avatarUrl:e.target.value})}/><button className='rounded bg-black p-2 text-white'>Guardar</button></form></main>;
}
