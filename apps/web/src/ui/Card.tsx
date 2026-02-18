import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-zippy-border bg-zippy-surface p-6 shadow-soft ${className}`.trim()}
      {...props}
    />
  );
}
