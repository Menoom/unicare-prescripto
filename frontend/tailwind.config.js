/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors: {
        'primary': '#1D4ED8',
        'primary-hover': '#1E40AF',
        'navy': '#0F172A',
        'navy-light': '#1E293B',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'medium': '0 4px 12px rgba(0,0,0,0.07)',
        'elevated': '0 10px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}