import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

export const Loader2 = (props: IconProps) => <IconBase {...props}><path d="M21 12a9 9 0 1 1-6.2-8.56" /></IconBase>;
export const X = (props: IconProps) => <IconBase {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconBase>;
export const ArrowRight = (props: IconProps) => <IconBase {...props}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></IconBase>;
export const MapPin = (props: IconProps) => <IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></IconBase>;
export const Navigation = (props: IconProps) => <IconBase {...props}><path d="m3 11 19-8-8 19-2-8-9-3Z" /></IconBase>;
export const Bell = (props: IconProps) => <IconBase {...props}><path d="M10 5a2 2 0 1 1 4 0c0 7 3 9 3 9H7s3-2 3-9" /><path d="M9 18a3 3 0 0 0 6 0" /></IconBase>;
export const CalendarClock = (props: IconProps) => <IconBase {...props}><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><circle cx="16" cy="16" r="3" /><path d="M16 14.5V16l1 1" /></IconBase>;
export const Search = (props: IconProps) => <IconBase {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></IconBase>;
export const Filter = (props: IconProps) => <IconBase {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></IconBase>;
export const SlidersHorizontal = (props: IconProps) => <IconBase {...props}><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></IconBase>;
export const UserCircle = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 18c1.5-2 3-3 5-3s3.5 1 5 3" /></IconBase>;

export const Car = (props: IconProps) => <IconBase {...props}><path d="M14 16H9" /><path d="m2 11 2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5" /><path d="M2 11h20v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H7v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><circle cx="6.5" cy="13.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="13.5" r=".5" fill="currentColor" /></IconBase>;
export const Clock3 = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v6h4" /></IconBase>;
export const Gauge = (props: IconProps) => <IconBase {...props}><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></IconBase>;
export const MessageSquareQuote = (props: IconProps) => <IconBase {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h.01" /><path d="M12 9h.01" /></IconBase>;
export const Star = (props: IconProps) => <IconBase {...props}><path d="m12 3 2.9 5.88 6.5.95-4.7 4.58 1.1 6.49L12 18l-5.8 3.05 1.1-6.49-4.7-4.58 6.5-.95z" /></IconBase>;
export const Wallet = (props: IconProps) => <IconBase {...props}><path d="M20 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5" /><path d="M16 12h6v4h-6a2 2 0 1 1 0-4Z" /></IconBase>;
