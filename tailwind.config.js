/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#4A148C',
          dark: '#311B92',
          light: '#7C43BD'
        },
        neutral: {
          50: '#F5F5F5',
          100: '#EBEBEB',
          200: '#D9D9D9',
          300: '#BFBFBF',
          400: '#A6A6A6',
          500: '#8C8C8C',
          600: '#737373',
          700: '#595959',
          800: '#404040',
          900: '#262626'
        }
      }
    },
  },
  plugins: [],
};