/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A78BFA', // Lilás claro
          dark: '#7C3AED',    // Lilás escuro
        },
        orange: {
          DEFAULT: '#FFA726', // Laranja
          dark: '#FF9800',
        },
        creme: {
          DEFAULT: '#F8F6F0', // Creme bem claro
        },
      },
      fontFamily: {
        sans: ['Rubik', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}