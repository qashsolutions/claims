import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary - Amber (warm, professional)
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // Main
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Success - Sage/Green
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Main
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Error - Rose (per design system: #dc2626)
        error: {
          50: '#fef2f2',
          100: '#fee2e2', // Design spec background
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Main - Design spec: Rose 600
          700: '#b91c1c',
          800: '#991b1b', // Design spec text
          900: '#7f1d1d',
        },
        // Warning - Amber (reuse primary lighter)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Neutral - Slate
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        heading: ['Merriweather', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Headings
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        // Code
        'code': ['0.875rem', { lineHeight: '1.5rem' }],
        'code-sm': ['0.75rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
