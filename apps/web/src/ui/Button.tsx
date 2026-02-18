import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  leadingIcon?: ReactNode;
};

const baseClasses =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zippy-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-zippy-primary text-white hover:bg-zippy-primaryHover',
  secondary: 'bg-zippy-surface text-zippy-text border border-zippy-border hover:bg-slate-50',
  ghost: 'bg-transparent text-zippy-text hover:bg-slate-100'
};

export function Button({ variant = 'primary', leadingIcon, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`.trim()} {...props}>
      {leadingIcon}
      {children}
    </button>
  );
}
