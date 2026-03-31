/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
          dark: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        dark: {
          bg: '#0f1219',
          card: '#161b26',
          border: '#1e2738',
          text: '#94a3b8',
          heading: '#f1f5f9',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'sidebar-bg': 'var(--sidebar-bg)',
      },
      keyframes: {
        viewFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      },
      animation: {
        viewFadeIn: 'viewFadeIn 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        shimmer: 'shimmer 1.5s infinite linear',
      }
    },
  },
  plugins: [],
}
