'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

const defaults = {
  baseFareAuto: 1800, baseFareMoto: 1200, perKmAuto: 320, perKmMoto: 220, perMinAuto: 45, perMinMoto: 35,
  multiplierDirect: 1.2, multiplierShared: 1, surchargeLuggage: 200, surchargePet: 180, surchargeAccessibility: 220,
  minFare: 1500, maxSearchRadiusKm: 8
};

export default function PricingSettingsPage() {
  const [form, setForm] = useState(defaults);

  useEffect(() => {
    void apiClient.get<{ pricing: typeof defaults }>('/admin/config').then((cfg) => setForm({ ...defaults, ...cfg.pricing }));
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    await apiClient.put('/admin/config/pricing', form);
    alert('Tarifas guardadas');
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Pricing</h1>
      <form className="grid max-w-3xl grid-cols-2 gap-2" onSubmit={(e)=>{void save(e);}}>
        {Object.entries(form).map(([k,v]) => (
          <label key={k} className="text-sm">{k}<input className="mt-1 w-full rounded border p-2" type="number" step="0.01" value={v} onChange={(e)=>setForm({...form,[k]:Number(e.target.value)})} /></label>
        ))}
        <button className="col-span-2 rounded bg-black px-4 py-2 text-white">Guardar</button>
      </form>
    </main>
  );
}
