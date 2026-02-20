'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';

export default function RidesPage(){
  const [rides,setRides]=useState<any[]>([]);
  useEffect(()=>{apiClient.get<any[]>('/rides').then(setRides).catch(()=>{});},[]);
  return <main className='p-4'><h1 className='text-2xl font-semibold'>Historial</h1><div className='mt-4 space-y-2'>{rides.map((r)=><Link key={r.id} className='block border p-3' href={`/rides/${r.id}`}>{new Date(r.createdAt).toLocaleString()} - {r.originAddress} → {r.destinationAddress} - {r.status}</Link>)}</div></main>;
}
