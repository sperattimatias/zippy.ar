'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

export default function RideDetail(){
  const params = useParams<{id:string}>();
  const [ride,setRide]=useState<any>(null);
  useEffect(()=>{if(params?.id) apiClient.get(`/rides/${params.id}`).then(setRide).catch(()=>{});},[params]);
  if(!ride) return <main className='p-4'>Cargando...</main>;
  return <main className='p-4'><h1 className='text-2xl font-semibold'>Ride {ride.id}</h1><p>{ride.originAddress} → {ride.destinationAddress}</p><ul>{ride.history?.map((h:any)=><li key={h.id}>{h.status} - {new Date(h.at).toLocaleString()}</li>)}</ul></main>;
}
