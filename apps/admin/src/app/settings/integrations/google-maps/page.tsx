'use client';
import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../../../../lib/api-client';

export default function GoogleMapsSettings(){
  const [cfg,setCfg]=useState<any>({enablePlaces:true,enableDistanceMatrix:true,enableDirections:false,googleMapsWebKey:'',googleMapsServerKey:''});
  useEffect(()=>{apiClient.get('/admin/config').then(setCfg).catch(()=>{});},[]);
  const save=async(e:FormEvent)=>{e.preventDefault(); await apiClient.put('/admin/config/google-maps',cfg); alert('Guardado');};
  return <form onSubmit={save} className='p-4 space-y-2'><h1 className='text-2xl font-semibold'>Google Maps</h1><input className='w-full border p-2' placeholder='GOOGLE_MAPS_WEB_KEY' value={cfg.googleMapsWebKey||''} onChange={(e)=>setCfg({...cfg,googleMapsWebKey:e.target.value})}/><input className='w-full border p-2' placeholder='GOOGLE_MAPS_SERVER_KEY' value={cfg.googleMapsServerKey||''} onChange={(e)=>setCfg({...cfg,googleMapsServerKey:e.target.value})}/><label><input type='checkbox' checked={cfg.enablePlaces} onChange={(e)=>setCfg({...cfg,enablePlaces:e.target.checked})}/> enablePlaces</label><label><input type='checkbox' checked={cfg.enableDistanceMatrix} onChange={(e)=>setCfg({...cfg,enableDistanceMatrix:e.target.checked})}/> enableDistanceMatrix</label><label><input type='checkbox' checked={cfg.enableDirections} onChange={(e)=>setCfg({...cfg,enableDirections:e.target.checked})}/> enableDirections</label><button className='block border p-2'>Guardar</button></form>
}
