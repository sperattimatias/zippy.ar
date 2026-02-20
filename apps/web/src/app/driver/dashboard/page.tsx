'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

export default function DriverDashboard(){
  const [offers,setOffers]=useState<any[]>([]);
  const refresh=()=>apiClient.get<any[]>('/driver/offers').then(setOffers).catch(()=>{});
  useEffect(()=>{refresh(); const i=setInterval(refresh,5000); return ()=>clearInterval(i);},[]);
  return <main className='p-4'><h1 className='text-2xl font-semibold'>Driver dashboard</h1><button onClick={()=>apiClient.post('/driver/online',{isOnline:true})} className='border p-2'>ONLINE</button><button onClick={()=>apiClient.post('/driver/online',{isOnline:false})} className='border p-2 ml-2'>OFFLINE</button><div className='mt-4 space-y-2'>{offers.map((o)=><div key={o.id} className='border p-3'>{o.ride.originAddress} → {o.ride.destinationAddress}<button onClick={()=>apiClient.post(`/driver/offers/${o.id}/accept`,{})} className='ml-2 border px-2'>Aceptar</button><button onClick={()=>apiClient.post(`/driver/offers/${o.id}/reject`,{})} className='ml-2 border px-2'>Rechazar</button></div>)}</div></main>
}
