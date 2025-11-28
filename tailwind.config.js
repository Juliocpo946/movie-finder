/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0d1117',
        secondary: '#161b22',
        accent: '#1f6feb',
        surface: '#21262d',
        border: '#30363d',
        text: {
          primary: '#e6edf3',
          secondary: '#8b949e'
        }
      }
    }
  },
  plugins: []
}