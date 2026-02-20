'use client';
import { FormEvent, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

export default function PricingPage(){
  const [raw,setRaw]=useState('{"baseFareAuto":1500}');
  const save=async(e:FormEvent)=>{e.preventDefault(); await apiClient.put('/admin/config/pricing',JSON.parse(raw)); alert('Pricing guardado');};
  return <form onSubmit={save} className='p-4 space-y-2'><h1 className='text-2xl font-semibold'>Pricing</h1><textarea className='w-full border p-2 min-h-56' value={raw} onChange={(e)=>setRaw(e.target.value)} /><button className='border p-2'>Guardar</button></form>
}
