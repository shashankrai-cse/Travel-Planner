/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dusk-950': '#150C2E',
        'dusk-800': '#2C1B54',
        'horizon-600': '#6D4FD1',
        'sunset-500': '#FF6B5B',
        'gold-400': '#FFB86B',
        'glass-white': '#F7F5FF',
        'mist-300': '#C7C2DA',
        'ink-900': '#120A22',
      },
      fontFamily: {
        'display': ['Fraunces', 'serif'],
        'body': ['General Sans', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': '4.5rem',
        'display-lg': '3rem',
        'display-md': '2.25rem',
        'body-lg': '1.125rem',
        'body': '1rem',
        'caption': '0.8125rem',
      }
    },
  },
  plugins: [],
}
