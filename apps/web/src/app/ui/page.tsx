'use client';

import { useState } from 'react';
import { Bell, CalendarClock, MapPin, Search } from 'lucide-react';
import { Badge, Button, Card, Chip, Input, Modal, Toggle } from '../../ui';

export default function WebUiPage() {
  const [chip, setChip] = useState('premium');
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">UI Foundation · Web</h1>

      <Card className="space-y-3">
        <p className="text-sm font-medium text-zippy-muted">Buttons states</p>
        <div className="grid gap-3 sm:grid-cols-5">
          <Button leadingIcon={<Bell className="size-4" />}>Default</Button>
          <Button variant="secondary" className="hover:bg-zippy-surfaceElevated">Hover</Button>
          <Button className="ring-2 ring-zippy-ring">Focus</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </Card>

      <Card className="grid gap-4 md:grid-cols-2">
        <Input label="Buscar dirección" placeholder="Palermo, CABA" leftIcon={<Search className="size-4" />} />
        <Input label="Salida" placeholder="Hoy 18:40" leftIcon={<CalendarClock className="size-4" />} className="ring-2 ring-zippy-ring" />
      </Card>

      <Card className="space-y-4">
        <p className="text-sm font-medium text-zippy-muted">Segmented / Chip + Badge</p>
        <div className="flex flex-wrap gap-2">
          {['económico', 'premium', 'mascotas'].map((item) => (
            <Chip key={item} selected={chip === item} onClick={() => setChip(item)}>
              {item}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Toggle checked={enabled} onClick={() => setEnabled((prev) => !prev)} />
          <span className="text-sm text-zippy-muted">Accesibilidad {enabled ? 'activada' : 'desactivada'}</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">Conductor online</Badge>
          <Badge variant="warning">Demora alta</Badge>
          <Badge variant="danger">Zona restringida</Badge>
        </div>
      </Card>

      <Card className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" leadingIcon={<MapPin className="size-4" />} onClick={() => setOpen(true)}>
          Abrir sheet
        </Button>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmar viaje"
        description="Revisá los detalles antes de continuar."
      >
        <p className="text-sm text-zippy-muted">Origen: Palermo · Destino: Puerto Madero</p>
      </Modal>
    </main>
  );
}
