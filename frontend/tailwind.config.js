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
          navy: '#0F172A',
          blue: '#2563EB',
          cyan: '#06B6D4',
          darkBg: '#0B0F19',
          cardDark: '#1E293B',
          cardLight: '#FFFFFF',
          slate: '#64748B',
          lightBg: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}
