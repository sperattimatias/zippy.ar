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

export const Menu = (props: IconProps) => <IconBase {...props}><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></IconBase>;
