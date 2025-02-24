/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#012c3f',
          light: '#21c3d8',
        },
        secondary: '#1ca5b8',
        accent: {
          green: '#daefb2',
          red: '#ff3f4c',
        }
      },
    },
  },
  plugins: [],
};