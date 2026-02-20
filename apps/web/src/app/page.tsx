'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiClient, getStoredAuth } from '../lib/api-client';

export default function HomePage() {
  const router = useRouter();
  const [origin, setOrigin] = useState({ address: '', placeId: '', lat: -34.6037, lng: -58.3816 });
  const [destination, setDestination] = useState({ address: '', placeId: '', lat: -34.61, lng: -58.38 });
  const [vehicleType, setVehicleType] = useState<'AUTO' | 'MOTO'>('AUTO');
  const [rideType, setRideType] = useState<'DIRECT' | 'SHARED'>('DIRECT');
  const [hasLuggage, setHasLuggage] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [note, setNote] = useState('');
  const [estimate, setEstimate] = useState<{ estimatedMin: number; estimatedMax: number } | null>(null);

  const askEstimate = async () => {
    if (!origin.address || !destination.address) return;
    const result = await apiClient.post<{ estimatedMin: number; estimatedMax: number }>('/rides/estimate', {
      origin,
      destination,
      vehicleType,
      rideType,
      hasLuggage,
      hasPets,
      needsAccessibility
    });
    setEstimate(result);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const auth = getStoredAuth();
    if (!auth) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent('/')}`);
      return;
    }

    const ride = await apiClient.post<{ id: string }>('/rides', {
      origin,
      destination,
      vehicleType,
      rideType,
      hasLuggage,
      hasPets,
      needsAccessibility,
      note
    });
    router.push(`/rides/${ride.id}`);
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold">Passenger Home</h1>
        <div className="flex gap-3 text-sm">
          <Link href="/rides">Historial</Link>
          <Link href="/account">Cuenta</Link>
        </div>
      </header>

      <form className="space-y-3" onSubmit={(e)=>{void submit(e);}}>
        <input className="w-full rounded border p-2" placeholder="Origen" value={origin.address} onChange={(e)=>setOrigin({...origin,address:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="Destino" value={destination.address} onChange={(e)=>setDestination({...destination,address:e.target.value})} />
        <div className="flex gap-2">
          <select className="rounded border p-2" value={vehicleType} onChange={(e)=>setVehicleType(e.target.value as 'AUTO'|'MOTO')}><option value="AUTO">Auto</option><option value="MOTO">Moto</option></select>
          <select className="rounded border p-2" value={rideType} onChange={(e)=>setRideType(e.target.value as 'DIRECT'|'SHARED')}><option value="DIRECT">Directo</option><option value="SHARED">Compartido</option></select>
        </div>
        <div className="flex gap-3 text-sm">
          <label><input type="checkbox" checked={hasLuggage} onChange={(e)=>setHasLuggage(e.target.checked)} /> Equipaje</label>
          <label><input type="checkbox" checked={hasPets} onChange={(e)=>setHasPets(e.target.checked)} /> Mascota</label>
          <label><input type="checkbox" checked={needsAccessibility} onChange={(e)=>setNeedsAccessibility(e.target.checked)} /> Accesibilidad</label>
        </div>
        <textarea className="w-full rounded border p-2" maxLength={200} placeholder="Nota para el conductor" value={note} onChange={(e)=>setNote(e.target.value)} />
        <button type="button" className="rounded border px-3 py-2" onClick={() => void askEstimate()}>Calcular estimación</button>
        {estimate ? <p className="text-sm">Estimado: ARS {estimate.estimatedMin} - {estimate.estimatedMax}</p> : null}
        <button type="submit" className="w-full rounded bg-black p-2 text-white">Solicitar viaje</button>
      </form>
    </main>
  );
}
