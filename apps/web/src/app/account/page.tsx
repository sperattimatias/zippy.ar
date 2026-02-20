'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';

type Favorite = { id: string; label: string; address: string; placeId: string; lat: number; lng: number };

export default function AccountPage() {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', avatarUrl: '' });
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const load = async () => {
    const me = await apiClient.get<{ firstName: string; lastName: string; phone?: string; avatarUrl?: string }>('/me');
    setProfile({
      firstName: me.firstName,
      lastName: me.lastName,
      phone: me.phone ?? '',
      avatarUrl: me.avatarUrl ?? ''
    });
    const fav = await apiClient.get<Favorite[]>('/me/favorites');
    setFavorites(fav);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    await apiClient.patch('/me', profile);
    await load();
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Mi cuenta</h1>
      <form className="space-y-2" onSubmit={(e)=>{void save(e);}}>
        <input className="w-full rounded border p-2" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} placeholder="Nombre" />
        <input className="w-full rounded border p-2" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} placeholder="Apellido" />
        <input className="w-full rounded border p-2" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Teléfono" />
        <input className="w-full rounded border p-2" value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} placeholder="Avatar URL" />
        <button className="rounded bg-black px-4 py-2 text-white">Guardar</button>
      </form>

      <h2 className="mt-8 mb-2 text-lg font-semibold">Favoritos</h2>
      <ul className="space-y-2 text-sm">
        {favorites.map((f) => (
          <li key={f.id} className="rounded border p-2">{f.label}: {f.address}</li>
        ))}
      </ul>
    </main>
  );
}
