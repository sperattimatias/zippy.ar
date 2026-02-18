import type { ButtonHTMLAttributes } from 'react';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function Chip({ selected = false, className = '', children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${
        selected
          ? 'border-zippy-primary bg-zippy-primary/20 text-zippy-primary'
          : 'border-zippy-border bg-zippy-surface text-zippy-muted hover:border-zippy-muted hover:text-zippy-text'
      } ${className}`.trim()}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  );
}
