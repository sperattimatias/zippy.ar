'use client';

import { useState } from 'react';
import { Filter, Search, SlidersHorizontal, UserCircle } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Chip,
  Drawer,
  Input,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toggle
} from '../../ui';

const rows = [
  { id: 'VJ-1201', pasajero: 'Nadia López', zona: 'Palermo', estado: 'Activo' },
  { id: 'VJ-1202', pasajero: 'Carlos Peña', zona: 'Belgrano', estado: 'Pendiente' }
];

export default function AdminUiPage() {
  const [selected, setSelected] = useState('todos');
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState(true);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">UI Foundation · Admin</h1>

      <Card className="space-y-3">
        <p className="text-sm font-medium text-zippy-muted">Buttons states</p>
        <div className="grid gap-3 md:grid-cols-5">
          <Button leadingIcon={<Filter className="size-4" />}>Default</Button>
          <Button variant="secondary" leadingIcon={<SlidersHorizontal className="size-4" />}>Hover</Button>
          <Button className="ring-2 ring-zippy-ring">Focus</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </Card>

      <Card className="grid gap-4 md:grid-cols-2">
        <Input label="Buscar viaje" placeholder="VJ-1201" leftIcon={<Search className="size-4" />} />
        <Input label="Conductor" placeholder="Nombre o ID" leftIcon={<UserCircle className="size-4" />} className="ring-2 ring-zippy-ring" />
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {['todos', 'asignados', 'demorados'].map((item) => (
            <Chip key={item} selected={selected === item} onClick={() => setSelected(item)}>
              {item}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Toggle checked={alerts} onClick={() => setAlerts((prev) => !prev)} />
          <span className="text-sm text-zippy-muted">Alertas {alerts ? 'activadas' : 'desactivadas'}</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">Operativo</Badge>
          <Badge variant="warning">Pendiente</Badge>
          <Badge variant="danger">Bloqueado</Badge>
        </div>
      </Card>

      <Table>
        <TableHead>
          <TableRow className="border-b-0">
            <TableHeader>ID</TableHeader>
            <TableHeader>Pasajero</TableHeader>
            <TableHeader>Zona</TableHeader>
            <TableHeader>Estado</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.pasajero}</TableCell>
              <TableCell>{row.zona}</TableCell>
              <TableCell>
                <Badge variant={row.estado === 'Activo' ? 'success' : 'warning'}>{row.estado}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Card>
        <Button variant="secondary" onClick={() => setOpen(true)}>Abrir sheet</Button>
      </Card>

      <Drawer open={open} onClose={() => setOpen(false)} title="Detalle" description="Drawer/Sheet component">
        <p className="text-sm text-zippy-muted">Contenido de ejemplo para inspección rápida.</p>
      </Drawer>
    </section>
  );
}
