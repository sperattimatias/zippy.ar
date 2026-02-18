'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Viajes', href: '/viajes' },
  { label: 'UI Kit', href: '/ui' },
  { label: 'Conductores', href: '#' },
  { label: 'Pasajeros', href: '#' },
  { label: 'Zonas', href: '#' },
  { label: 'Tarifas', href: '#' }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zippy-bg md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-zippy-border bg-zippy-surface md:min-h-screen md:border-b-0 md:border-r">
        <div className="px-5 pb-4 pt-5">
          <span className="text-lg font-semibold tracking-tight text-zippy-text">Zippy Admin</span>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:flex-col md:px-4">
          {navItems.map((item) => {
            const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
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
        <header className="flex h-16 items-center justify-between border-b border-zippy-border bg-zippy-surface px-4 md:px-6">
          <span className="text-sm text-zippy-muted">Panel de control</span>
          <div className="rounded-full border border-zippy-border px-3 py-1 text-sm font-medium text-zippy-text">
            Usuario Admin
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
