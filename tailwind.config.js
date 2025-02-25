/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary-light)',
        'secondary-dark': 'var(--secondary-dark)',
        accent: {
          green: 'var(--accent-green-light)',
          'green-dark': 'var(--accent-green-dark)',
          red: 'var(--accent-red-light)',
          'red-dark': 'var(--accent-red-dark)'
        },
        background: {
          light: 'var(--background-light)',
          dark: 'var(--background-dark)'
        },
        surface: {
          light: 'var(--surface-light)',
          dark: 'var(--surface-dark)'
        },
        text: {
          light: {
            primary: 'var(--text-primary-light)',
            secondary: 'var(--text-secondary-light)'
          },
          dark: {
            primary: 'var(--text-primary-dark)',
            secondary: 'var(--text-secondary-dark)'
          }
        }
      }
    }
  },
  plugins: []
};