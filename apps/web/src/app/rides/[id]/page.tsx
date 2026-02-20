'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

type RideDetail = {
  id: string;
  status: string;
  originAddress: string;
  destinationAddress: string;
  history: Array<{ id: string; status: string; at: string }>;
};

export default function RideDetailPage() {
  const params = useParams<{ id: string }>();
  const [ride, setRide] = useState<RideDetail | null>(null);

  useEffect(() => {
    const load = () => apiClient.get<RideDetail>(`/rides/${params.id}`).then(setRide);
    void load();
    const timer = setInterval(() => { void load(); }, 8000);
    return () => clearInterval(timer);
  }, [params.id]);

  if (!ride) return <main className="p-6">Cargando...</main>;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Detalle de viaje</h1>
      <p className="mt-1">{ride.originAddress} → {ride.destinationAddress}</p>
      <p className="mb-4 mt-1 font-medium">Estado: {ride.status}</p>
      <ul className="space-y-2">
        {ride.history.map((event) => (
          <li key={event.id} className="rounded border p-2 text-sm">{event.status} - {new Date(event.at).toLocaleString()}</li>
        ))}
      </ul>
    </main>
  );
}
