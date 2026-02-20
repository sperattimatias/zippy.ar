'use client';
import { FormEvent, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

export default function DriverRegister(){
  const [form,setForm]=useState({firstName:'',lastName:'',email:'',password:'',phone:'',vehicleType:'AUTO',plateNumber:'',avatarUrl:'',acceptTerms:false});
  const [msg,setMsg]=useState('');
  const submit=async(e:FormEvent)=>{e.preventDefault();const r=await apiClient.post('/driver/register',form);setMsg(`Registrado: ${(r as any).status}`)};
  return <form onSubmit={submit} className='mx-auto max-w-md p-4 space-y-2'><h1 className='text-2xl font-semibold'>Registro conductor</h1>{Object.keys(form).filter(k=>k!=='acceptTerms'&&k!=='vehicleType').map((k)=><input key={k} className='w-full border p-2' placeholder={k} value={(form as any)[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})}/>)}<select className='w-full border p-2' value={form.vehicleType} onChange={(e)=>setForm({...form,vehicleType:e.target.value})}><option value='AUTO'>Auto</option><option value='MOTO'>Moto</option></select><label className='flex gap-2'><input type='checkbox' checked={form.acceptTerms} onChange={(e)=>setForm({...form,acceptTerms:e.target.checked})}/>Acepto términos</label><button className='rounded bg-black p-2 text-white'>Enviar</button><p>{msg}</p></form>
}
