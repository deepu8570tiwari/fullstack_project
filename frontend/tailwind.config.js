/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1ABC9C',
          dark: '#159b84',
          light: '#1fd1b2',
        },
        dark: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          darker: '#243342',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
};