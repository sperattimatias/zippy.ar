'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { CalendarClock, UserCircle } from 'lucide-react';
import { apiClient, getStoredAuth } from '../lib/api-client';

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    originAddress: 'Tu ubicación', originPlaceId: 'gps', originLat: -34.6037, originLng: -58.3816,
    destinationAddress: '', destinationPlaceId: '', destinationLat: 0, destinationLng: 0,
    vehicleType: 'AUTO', rideType: 'DIRECT', luggage: false, pet: false, accessibility: false, note: ''
  });
  const [estimate, setEstimate] = useState<{estimatedMin:number;estimatedMax:number}|null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const payload = { ...form, originLat: pos.coords.latitude, originLng: pos.coords.longitude };
      setForm(payload);
    });
  }, []);

  const estimateRide = async () => {
    if (!form.destinationAddress) return;
    const data = await apiClient.post<any>('/rides/estimate', form);
    setEstimate(data);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!getStoredAuth()) return router.push(`/auth/login?returnUrl=${encodeURIComponent('/')}`);
    const ride = await apiClient.post<any>('/rides', form);
    router.push(`/rides/${ride.id}`);
  };

  return (
    <main className="mx-auto max-w-3xl p-4">
      <header className="flex items-center justify-between pb-4"><h1 className='text-2xl font-semibold'>Passenger Home</h1><div className='flex gap-2'><Link href='/rides' className='border p-2'><CalendarClock className='inline size-4'/> Historial</Link><Link href='/account' className='border p-2'><UserCircle className='inline size-4'/></Link></div></header>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <input className='w-full border p-2' placeholder='Origen' value={form.originAddress} onChange={(e)=>setForm({...form,originAddress:e.target.value})}/>
        <input className='w-full border p-2' placeholder='Destino' value={form.destinationAddress} onChange={(e)=>setForm({...form,destinationAddress:e.target.value, destinationPlaceId:e.target.value, destinationLat:-34.6, destinationLng:-58.4})}/>
        <div className='flex gap-2'><select className='border p-2' value={form.vehicleType} onChange={(e)=>setForm({...form,vehicleType:e.target.value})}><option value='AUTO'>Auto</option><option value='MOTO'>Moto</option></select><select className='border p-2' value={form.rideType} onChange={(e)=>setForm({...form,rideType:e.target.value})}><option value='DIRECT'>Directo</option><option value='SHARED'>Compartido</option></select></div>
        <label><input type='checkbox' checked={form.luggage} onChange={(e)=>setForm({...form,luggage:e.target.checked})}/> Equipaje</label>
        <label><input type='checkbox' checked={form.pet} onChange={(e)=>setForm({...form,pet:e.target.checked})}/> Mascota</label>
        <label><input type='checkbox' checked={form.accessibility} onChange={(e)=>setForm({...form,accessibility:e.target.checked})}/> Accesibilidad</label>
        <textarea className='w-full border p-2' maxLength={200} placeholder='Nota al conductor' value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} />
        <button type='button' onClick={estimateRide} className='border p-2'>Calcular estimación</button>
        {estimate && <p>Estimado: ARS {estimate.estimatedMin} - {estimate.estimatedMax}</p>}
        <button className='w-full rounded bg-black p-2 text-white'>Solicitar viaje</button>
      </form>
    </main>
  );
}
