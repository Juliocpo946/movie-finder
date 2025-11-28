/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        black: '#0a0a0a',
        white: '#ededed',
        accent: '#ff2e00',
        gray: {
          800: '#1a1a1a',
          900: '#0f0f0f',
        }
      }
    }
  },
  plugins: []
}