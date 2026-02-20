'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';

type Ride = { id: string; createdAt: string; originAddress: string; destinationAddress: string; status: string; finalPrice?: string | null };

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    void apiClient.get<Ride[]>('/rides').then(setRides);
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Historial</h1>
      <ul className="space-y-2">
        {rides.map((ride) => (
          <li key={ride.id} className="rounded border p-3">
            <Link href={`/rides/${ride.id}`} className="font-medium">{ride.originAddress} → {ride.destinationAddress}</Link>
            <p className="text-sm text-gray-600">{ride.status} · {new Date(ride.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
