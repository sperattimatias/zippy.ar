'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../../../lib/api-client';

export default function GoogleMapsSettingsPage() {
  const [form, setForm] = useState({
    googleMapsWebKey: '',
    googleMapsServerKey: '',
    enablePlaces: true,
    enableDistanceMatrix: true,
    enableDirections: true
  });

  useEffect(() => {
    void apiClient.get<{ googleMaps: { hasWebKey: boolean; hasServerKey: boolean; enablePlaces: boolean; enableDistanceMatrix: boolean; enableDirections: boolean } }>('/admin/config').then((cfg) => {
      setForm((prev) => ({ ...prev, enablePlaces: cfg.googleMaps.enablePlaces, enableDistanceMatrix: cfg.googleMaps.enableDistanceMatrix, enableDirections: cfg.googleMaps.enableDirections }));
    });
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    await apiClient.put('/admin/config/google-maps', form);
    alert('Guardado');
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Google Maps</h1>
      <form className="max-w-xl space-y-3" onSubmit={(e)=>{void save(e);}}>
        <input className="w-full rounded border p-2" placeholder="GOOGLE_MAPS_WEB_KEY" value={form.googleMapsWebKey} onChange={(e)=>setForm({...form,googleMapsWebKey:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="GOOGLE_MAPS_SERVER_KEY" value={form.googleMapsServerKey} onChange={(e)=>setForm({...form,googleMapsServerKey:e.target.value})} />
        <label><input type="checkbox" checked={form.enablePlaces} onChange={(e)=>setForm({...form,enablePlaces:e.target.checked})} /> Enable Places</label>
        <label><input type="checkbox" checked={form.enableDistanceMatrix} onChange={(e)=>setForm({...form,enableDistanceMatrix:e.target.checked})} /> Enable Distance Matrix</label>
        <label><input type="checkbox" checked={form.enableDirections} onChange={(e)=>setForm({...form,enableDirections:e.target.checked})} /> Enable Directions</label>
        <button className="rounded bg-black px-4 py-2 text-white">Guardar</button>
      </form>
    </main>
  );
}
