/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FFF9F2',
          beige: '#F8ECD9',
          brown: '#2F2A3D',
          green: '#5FA63B',
          greenDark: '#4A852B',
          greenLight: '#8BC36D',
          creamDeep: '#FFF3E5',
          beigeSoft: '#FBEFDF',
        },
        surface: '#FFFFFF',
        text: '#2F2A3D',
        muted: '#6F6A80',
        subtle: '#8D88A0',
        line: '#E8E2D8',
        lineSoft: '#F2EEE8',
        success: '#12B886',
        warning: '#FFB347',
        error: '#E84A68',
      },
      fontFamily: {
        heading: ['Rubik', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 48px rgba(47, 42, 61, 0.1)',
        glow: '0 0 40px rgba(95, 166, 59, 0.2)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};