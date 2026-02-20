'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';

export default function DriversPage(){
  const [drivers,setDrivers]=useState<any[]>([]);
  const load=()=>apiClient.get<any[]>('/admin/drivers').then(setDrivers).catch(()=>{});
  useEffect(()=>{load();},[]);
  return <main className='p-4'><h1 className='text-2xl font-semibold'>Verificación conductores</h1>{drivers.map((d)=><div key={d.id} className='border p-3 mt-2'>{d.user.firstName} {d.user.lastName} - {d.status}<button onClick={()=>apiClient.patch(`/admin/drivers/${d.userId}/approve`,{}).then(load)} className='ml-2 border px-2'>Approve</button><button onClick={()=>apiClient.patch(`/admin/drivers/${d.userId}/ban`,{}).then(load)} className='ml-2 border px-2'>Ban</button></div>)}</main>
}
