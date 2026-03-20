/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
