import type { ButtonHTMLAttributes } from 'react';

type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked: boolean;
};

export function Toggle({ checked, className = '', ...props }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-7 w-12 items-center rounded-full border transition ${
        checked ? 'border-zippy-primary bg-zippy-primary/80' : 'border-zippy-border bg-zippy-surfaceElevated'
      } ${className}`.trim()}
      {...props}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
