/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        dark: {
          bg: '#090d16',
          card: '#0f172a',
          surface: '#131e33',
          border: '#1e293b',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-lg': '0 0 40px -10px rgba(16, 185, 129, 0.35)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(16, 185, 129, 0.05)'
      }
    },
  },
  plugins: [],
}
