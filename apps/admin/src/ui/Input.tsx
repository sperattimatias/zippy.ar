import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(' ', '-');

  return (
    <label htmlFor={inputId} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zippy-text">{label}</span>
      <input
        id={inputId}
        className={`h-10 rounded-lg border border-zippy-border bg-white px-3 text-sm text-zippy-text placeholder:text-zippy-muted outline-none transition focus:border-zippy-primary focus:ring-2 focus:ring-zippy-primary/20 ${className}`.trim()}
        {...props}
      />
    </label>
  );
}
