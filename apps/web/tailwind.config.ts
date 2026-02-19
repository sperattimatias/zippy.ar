import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        zippy: {
          bg: 'var(--zippy-bg)',
          surface: 'var(--zippy-surface)',
          surfaceElevated: 'var(--zippy-surface-elevated)',
          text: 'var(--zippy-text)',
          muted: 'var(--zippy-muted)',
          border: 'var(--zippy-border)',
          primary: 'var(--zippy-primary)',
          primaryHover: 'var(--zippy-primary-hover)',
          primaryText: 'var(--zippy-primary-text)',
          success: 'var(--zippy-success)',
          warning: 'var(--zippy-warning)',
          danger: 'var(--zippy-danger)',
          ring: 'var(--zippy-ring)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        18: '4.5rem'
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 24, 40, 0.05)',
        modal: '0 12px 28px rgba(16, 24, 40, 0.14)'
      }
    }
  },
  plugins: []
};

export default config;
