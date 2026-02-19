'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Drawer({ open, title, description, onClose, children }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20" role="presentation" onClick={onClose}>
      <aside
        className="absolute bottom-0 right-0 h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-zippy-border bg-zippy-surface p-5 shadow-modal sm:h-full sm:max-w-xl sm:rounded-none sm:border-l"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zippy-text">{title}</h2>
            {description ? <p className="text-sm text-zippy-muted">{description}</p> : null}
          </div>
          <button type="button" className="inline-flex size-9 items-center justify-center rounded-lg border border-zippy-border text-zippy-muted transition hover:text-zippy-text" aria-label="Cerrar detalle" onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
