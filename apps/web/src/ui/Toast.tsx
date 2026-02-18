import type { HTMLAttributes } from 'react';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

type ToastProps = HTMLAttributes<HTMLDivElement> & {
  variant?: ToastVariant;
};

const variantClasses: Record<ToastVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800'
};

export function Toast({ variant = 'info', className = '', children, ...props }: ToastProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]} ${className}`.trim()}
      role="status"
      {...props}
    >
      {children}
    </div>
  );
}
