'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zippy-border bg-zippy-surface p-6 shadow-modal">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zippy-text">{title}</h2>
            {description ? <p className="text-sm text-zippy-muted">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="text-zippy-muted hover:text-zippy-text" aria-label="Cerrar">
            <X className="size-4" />
          </button>
        </div>
        {children ? <div>{children}</div> : null}
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" className="w-auto" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
