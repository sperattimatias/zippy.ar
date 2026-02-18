import type { Metadata } from 'next';
import './globals.css';
import { AdminShell } from './_components/AdminShell';

export const metadata: Metadata = {
  title: 'Zippy Admin',
  description: 'Panel de administración de Zippy.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
