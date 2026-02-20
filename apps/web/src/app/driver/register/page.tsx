'use client';

import { FormEvent, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

export default function DriverRegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', vehicleType: 'AUTO', plateNumber: '', avatarUrl: '', acceptTerms: false
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await apiClient.post('/driver/register', form);
    alert('Registro enviado. Esperá verificación del admin.');
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Registro conductor</h1>
      <form onSubmit={(e)=>{void onSubmit(e);}} className="space-y-2">
        <input className="w-full rounded border p-2" placeholder="firstName" value={form.firstName} onChange={(e)=>setForm({...form,firstName:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="lastName" value={form.lastName} onChange={(e)=>setForm({...form,lastName:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="plateNumber" value={form.plateNumber} onChange={(e)=>setForm({...form,plateNumber:e.target.value})} />
        <input className="w-full rounded border p-2" placeholder="avatarUrl" value={form.avatarUrl} onChange={(e)=>setForm({...form,avatarUrl:e.target.value})} />
        <input className="w-full rounded border p-2" type="password" placeholder="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <select className="w-full rounded border p-2" value={form.vehicleType} onChange={(e)=>setForm({...form,vehicleType:e.target.value})}>
          <option value="AUTO">Auto</option><option value="MOTO">Moto</option>
        </select>
        <label className="text-sm"><input type="checkbox" checked={form.acceptTerms} onChange={(e)=>setForm({...form,acceptTerms:e.target.checked})} /> Acepto términos</label>
        <button className="w-full rounded bg-black p-2 text-white">Enviar</button>
      </form>
    </main>
  );
}
