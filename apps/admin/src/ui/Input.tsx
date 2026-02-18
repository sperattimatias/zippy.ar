import type { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  leftIcon?: ReactNode;
};

export function Input({ label, id, leftIcon, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(' ', '-');

  return (
    <label htmlFor={inputId} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zippy-text">{label}</span>
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zippy-muted">
            {leftIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={`h-10 w-full rounded-xl border border-zippy-border bg-zippy-surface px-3 text-sm text-zippy-text placeholder:text-zippy-muted outline-none transition focus:border-zippy-primary focus:ring-2 focus:ring-zippy-ring ${leftIcon ? 'pl-10' : ''} ${className}`.trim()}
          {...props}
        />
      </div>
    </label>
  );
}
