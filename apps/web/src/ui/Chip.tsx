import type { HTMLAttributes } from 'react';

type ChipVariant = 'neutral' | 'success' | 'warning' | 'danger';

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

const variantClasses: Record<ChipVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700'
};

export function Chip({ variant = 'neutral', className = '', children, ...props }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
