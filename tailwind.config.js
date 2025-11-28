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
        // Aquí definimos las fuentes que usamos en el código
        oswald: ['Oswald', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        // Aquí definimos los colores del tema
        black: '#0a0a0a',
        white: '#ededed',
        accent: '#ff2e00', // Rojo neón
        gray: {
          800: '#1a1a1a',
          900: '#0f0f0f',
        }
      }
    }
  },
  plugins: []
}