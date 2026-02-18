'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, UserCircle, X, Menu } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Viajes', href: '/admin/viajes' },
  { label: 'Conductores', href: '#' },
  { label: 'Pagos', href: '#' }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zippy-bg md:grid md:grid-cols-[260px_1fr]">
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex size-10 items-center justify-center rounded-xl border border-zippy-border bg-zippy-surface text-zippy-text md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden" role="presentation" onClick={() => setOpen(false)}>
          <aside
            className="h-full w-[270px] border-r border-zippy-border bg-zippy-surface p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-zippy-text">Zippy Admin</span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-zippy-border text-zippy-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-zippy-primary text-zippy-primaryText' : 'text-zippy-text hover:bg-zippy-surfaceElevated'
                    } ${item.href === '#' ? 'pointer-events-none opacity-50' : ''}`.trim()}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <aside className="hidden border-r border-zippy-border bg-zippy-surface md:block">
        <div className="p-5">
          <span className="text-lg font-semibold tracking-tight text-zippy-text">Zippy Admin</span>
        </div>
        <nav className="space-y-1 px-4 pb-4">
          {navItems.map((item) => {
            const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-zippy-primary text-zippy-primaryText' : 'text-zippy-text hover:bg-zippy-surfaceElevated'
                } ${item.href === '#' ? 'pointer-events-none opacity-50' : ''}`.trim()}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-zippy-border bg-zippy-surface/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-zippy-border bg-zippy-surfaceElevated px-3 md:flex">
              <Search className="size-4 text-zippy-muted" />
              <input
                placeholder="Buscar viaje, conductor o pago"
                className="h-10 w-full bg-transparent text-sm text-zippy-text placeholder:text-zippy-muted outline-none"
              />
            </div>
            <div className="md:hidden" />
            <div className="inline-flex items-center gap-2 rounded-full border border-zippy-border bg-zippy-surfaceElevated px-3 py-1.5 text-sm font-medium text-zippy-text">
              <UserCircle className="size-4" /> Admin Operaciones
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 pt-20 md:p-6 md:pt-6">{children}</main>
      </div>
    </div>
  );
}
