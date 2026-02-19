import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  leadingIcon?: ReactNode;
  loading?: boolean;
};

const baseClasses =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zippy-ring disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-zippy-primary text-zippy-primaryText hover:bg-zippy-primaryHover',
  secondary: 'border border-zippy-border bg-zippy-surface text-zippy-text hover:bg-zippy-surfaceElevated',
  ghost: 'bg-transparent text-zippy-text hover:bg-zippy-surfaceElevated'
};

export function Button({ variant = 'primary', leadingIcon, loading = false, className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`.trim()} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : leadingIcon}
      {children}
    </button>
  );
}
