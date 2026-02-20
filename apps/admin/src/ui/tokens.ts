export const tokens = {
  colors: {
    bg: 'bg-zippy-bg',
    surface: 'bg-zippy-surface',
    text: 'text-zippy-text',
    muted: 'text-zippy-muted',
    border: 'border-zippy-border',
    primary: 'bg-zippy-primary',
    primaryHover: 'hover:bg-zippy-primaryHover',
    success: 'bg-zippy-success',
    warning: 'bg-zippy-warning',
    danger: 'bg-zippy-danger'
  },
  typography: {
    title: 'text-3xl md:text-4xl font-semibold tracking-tight',
    subtitle: 'text-base text-zippy-muted',
    body: 'text-sm text-zippy-text',
    label: 'text-sm font-medium text-zippy-text'
  },
  spacing: {
    section: 'p-6 md:p-10',
    stack: 'space-y-4',
    compact: 'space-y-2'
  },
  radius: {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  },
  shadows: {
    soft: 'shadow-soft',
    modal: 'shadow-modal'
  }
} as const;
