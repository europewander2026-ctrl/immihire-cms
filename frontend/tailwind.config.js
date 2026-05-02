/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Montserrat"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        serif: ['"Merriweather"', 'serif'],
      },
      colors: {
        primary: '#0d5fb7',
        darkBlue: '#002366',
        accent: '#090927',
        lightGray: '#f0f0f0',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(13, 95, 183, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'cloud': '0 20px 60px -10px rgba(100, 116, 139, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 10s infinite',
        'stamp': 'stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'flyAway': 'flyAway 1.5s ease-in-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        stamp: {
          '0%': { opacity: 0, transform: 'scale(3) rotate(-15deg)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(-15deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px rgba(13, 95, 183, 0.5)' },
          '50%': { opacity: 0.5, boxShadow: '0 0 25px rgba(13, 95, 183, 0.9)' },
        },
        flyAway: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          '20%': { transform: 'translate(-10px, 10px) scale(0.9)', opacity: 1 },
          '100%': { transform: 'translate(300px, -300px) scale(0.5)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
