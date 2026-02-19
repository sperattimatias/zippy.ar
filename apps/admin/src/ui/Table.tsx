import type { HTMLAttributes, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { Card } from './Card';

export function Table({ className = '', ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className={`min-w-full text-left text-sm ${className}`.trim()} {...props} />
    </Card>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-zippy-border bg-zippy-surfaceElevated text-zippy-muted">{children}</thead>;
}

export function TableRow({ className = '', ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b border-zippy-border last:border-b-0 ${className}`.trim()} {...props} />;
}

export function TableHeader({ className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3 font-medium ${className}`.trim()} {...props} />;
}

export function TableCell({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 text-zippy-text ${className}`.trim()} {...props} />;
}
