import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-zippy-border bg-zippy-surface p-5 shadow-soft ${className}`.trim()}
      {...props}
    />
  );
}
