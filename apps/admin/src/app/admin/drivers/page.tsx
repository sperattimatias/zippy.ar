'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';

type DriverRow = {
  userId: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'BANNED';
  plateNumber: string;
  vehicleType: string;
  user: { email: string; firstName: string; lastName: string; avatarUrl?: string };
};

export default function DriversPage() {
  const [rows, setRows] = useState<DriverRow[]>([]);

  const load = async () => {
    const data = await apiClient.get<DriverRow[]>('/admin/drivers');
    setRows(data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Verificación de conductores</h1>
      <div className="space-y-2">
        {rows.map((d) => (
          <div key={d.userId} className="rounded border p-3">
            <p className="font-medium">{d.user.firstName} {d.user.lastName} - {d.user.email}</p>
            <p className="text-sm">{d.vehicleType} · {d.plateNumber} · {d.status}</p>
            <div className="mt-2 flex gap-2">
              <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={() => { void apiClient.patch(`/admin/drivers/${d.userId}/approve`, {}).then(load); }}>Approve</button>
              <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => { void apiClient.patch(`/admin/drivers/${d.userId}/ban`, {}).then(load); }}>Ban</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
