import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        zippy: {
          bg: '#F7F9FC',
          surface: '#FFFFFF',
          text: '#111827',
          muted: '#667085',
          border: '#E4E7EC',
          primary: '#0D6EFD',
          primaryHover: '#0B5ED7',
          success: '#12B76A',
          warning: '#F79009',
          danger: '#F04438'
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
        soft: '0 2px 12px rgba(16, 24, 40, 0.06)',
        modal: '0 16px 32px rgba(16, 24, 40, 0.14)'
      }
    }
  },
  plugins: []
};

export default config;
