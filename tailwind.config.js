/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              color: '#111827',
              fontWeight: '800',
            },
            h2: {
              color: '#1f2937',
              fontWeight: '700',
              borderBottomWidth: '1px',
              borderColor: '#e5e7eb',
              paddingBottom: '0.5rem',
              marginTop: '2rem',
            },
            h3: {
              color: '#374151',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: '#6366f1',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            ul: {
              listStyleType: 'disc',
            },
            'ul > li::marker': {
              color: '#6366f1',
            },
            'ol > li::marker': {
              color: '#6366f1',
              fontWeight: '600',
            },
            a: {
              color: '#4f46e5',
              textDecoration: 'none',
              '&:hover': {
                color: '#4338ca',
              },
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};