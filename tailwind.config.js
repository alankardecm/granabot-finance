/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1f7a63',
          secondary: '#f9a826',
          dark: '#125041',
          light: '#e7f5f1',
        },
        surface: {
          base: '#f4f6f8',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
