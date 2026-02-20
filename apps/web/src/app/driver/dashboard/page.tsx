'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

type Offer = { id: string; ride: { id: string; originAddress: string; destinationAddress: string } };

export default function DriverDashboardPage() {
  const [online, setOnline] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  const loadOffers = async () => {
    const data = await apiClient.get<Offer[]>('/driver/offers');
    setOffers(data);
  };

  useEffect(() => {
    const t = setInterval(() => void loadOffers(), 8000);
    void loadOffers();
    return () => clearInterval(t);
  }, []);

  const toggleOnline = async () => {
    const next = !online;
    setOnline(next);
    await apiClient.post('/driver/online', { isOnline: next });
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Driver dashboard</h1>
      <button className="rounded bg-black px-4 py-2 text-white" onClick={()=>{void toggleOnline();}}>{online ? 'OFFLINE' : 'ONLINE'}</button>
      <h2 className="mt-6 mb-2 text-lg font-semibold">Ofertas</h2>
      <ul className="space-y-2">
        {offers.map((offer) => (
          <li key={offer.id} className="rounded border p-3">
            {offer.ride.originAddress} → {offer.ride.destinationAddress}
            <div className="mt-2 flex gap-2">
              <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={() => { void apiClient.post(`/driver/offers/${offer.id}/accept`, {}); }}>Aceptar</button>
              <button className="rounded bg-gray-300 px-3 py-1" onClick={() => { void apiClient.post(`/driver/offers/${offer.id}/reject`, {}); }}>Rechazar</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
